import { getPracticeProblem, getQuestionById as fetchQuestionById } from '../services/questionService.js'
import { getPracticeState, hintsUsedFor, hasSolved, recordAttempt, takeNextHint } from '../services/attemptService.js'
import { recordTopicProgress } from '../services/progressService.js'
import { requiresOrderedResult, resultsMatch } from '../services/resultCompare.js'
import { executePracticeQuery, schemaFromDataset } from '../services/sqlRunnerService.js'
import { hintRevealsAnswer } from '../services/problemGenerationService.js'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const getQuestionById = async (req, res, next) => {
  try {
    const { questionId } = req.params

    if (!UUID_RE.test(questionId)) {
      return res.status(400).json({ error: 'Invalid question id' })
    }

    const problem = await fetchQuestionById(questionId)

    if (!problem) {
      return res.status(404).json({ error: 'Question not found' })
    }

    const topic = problem.topics
    if (!topic) {
      const err = new Error('Question topic not found')
      err.status = 500
      throw err
    }

    const hints = normalizeHints(problem.hints)
    const solved = await hasSolved(req.user.id, problem.id)

    res.status(200).json(toLearnerQuestion(problem, topic, hints, solved))
  } catch (err) {
    next(err)
  }
}

export const executeQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params
    const sql = req.body?.sql

    if (!UUID_RE.test(questionId)) {
      return res.status(400).json({ error: 'Invalid question id' })
    }

    if (typeof sql !== 'string' || sql.trim() === '') {
      return res.status(400).json({ error: 'SQL not provided' })
    }

    const problem = await getPracticeProblem(questionId)
    if (!problem) {
      return res.status(404).json({ error: 'Question not found' })
    }

    const fixtureName = schemaFromDataset(problem.dataset_schema).fixture
    if (!fixtureName) {
      return res.status(500).json({ error: 'Question fixture is not configured' })
    }

    const hintsUsed = await hintsUsedFor(req.user.id, problem.id)

    try {
      const executed = await executePracticeQuery(sql, fixtureName)
      const correct = resultsMatch(executed.rows, problem.expected_result || [], {
        ordered: requiresOrderedResult(problem.correct_sql),
      })
      const body = await saveGradedAttempt({
        userId: req.user.id,
        problem,
        sql,
        correct,
        hintsUsed,
        executed,
      })

      return res.status(200).json(body)
    } catch (err) {
      if (err?.name !== 'RunnerError') {
        throw err
      }

      const status = runnerStatus(err.message)
      if (status < 500) {
        await recordAttempt({
          userId: req.user.id,
          problemId: problem.id,
          sql,
          isCorrect: false,
          hintsUsed,
        })
      }

      return res.status(status).json({
        correct: false,
        columns: [],
        rows: [],
        rowCount: 0,
        error: err.message,
        message: err.message,
        solved: false,
      })
    }
  } catch (err) {
    console.error('[execute debug]', {
      name: err?.name,
      message: err?.message,
      code: err?.code,
      details: err?.details,
      hint: err?.hint,
    })
    next(err)
  }
}

export async function saveGradedAttempt({
  userId,
  problem,
  sql,
  correct,
  hintsUsed,
  executed,
  saveAttempt = recordAttempt,
  saveProgress = recordTopicProgress,
}) {
  const attempt = await saveAttempt({
    userId,
    problemId: problem.id,
    sql,
    isCorrect: correct,
    hintsUsed,
  })

  let progress = null
  if (correct) {
    progress = await saveProgress(userId, problem.topic_id)
  }

  return {
    correct,
    columns: executed.columns,
    rows: executed.rows,
    rowCount: executed.rows.length,
    error: null,
    message: correct ? 'Correct' : 'Result does not match the expected result',
    attemptId: attempt.id,
    progress,
    solved: Boolean(correct),
  }
}

export const getQuestionHint = async (req, res, next) => {
  try {
    const { questionId } = req.params

    if (!UUID_RE.test(questionId)) {
      return res.status(400).json({ error: 'Invalid question id' })
    }

    const problem = await getPracticeProblem(questionId)
    if (!problem) {
      return res.status(404).json({ error: 'Question not found' })
    }

    const hints = normalizeHints(problem.hints).map((hint) => (
      hintRevealsAnswer(hint.text, problem.correct_sql)
        ? { ...hint, text: 'Use the previous hint to assemble the query yourself.' }
        : hint
    ))
    const result = await takeNextHint(req.user.id, problem.id, hints)

    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

export const getQuestionSession = async (req, res, next) => {
  try {
    const { questionId } = req.params

    if (!UUID_RE.test(questionId)) {
      return res.status(400).json({ error: 'Invalid question id' })
    }

    const problem = await fetchQuestionById(questionId)
    if (!problem) {
      return res.status(404).json({ error: 'Question not found' })
    }

    const state = await getPracticeState(req.user.id, problem.id)
    res.status(200).json(state)
  } catch (err) {
    next(err)
  }
}

export function toLearnerQuestion(problem, topic, hints, solved) {
  return {
    id: problem.id,
    topicId: problem.topic_id,
    topicName: topic.title,
    difficulty: topic.tier,
    title: problem.prompt,
    prompt: problem.prompt,
    type: 'write_query',
    schema: schemaFromDataset(problem.dataset_schema),
    hintCount: hints.length,
    solved: Boolean(solved),
  }
}

function normalizeHints(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .filter((hint) => hint && typeof hint.text === 'string' && hint.text.trim() !== '')
    .map((hint, index) => ({
      level: typeof hint.level === 'number' ? hint.level : index + 1,
      text: hint.text.trim(),
    }))
}

function runnerStatus(message) {
  if (message === 'SQL_RUNNER_DATABASE_URL is not configured' || message === 'SQL runner connection failed') {
    return 503
  }
  return 422
}
