// backend/src/controllers/aiController.js

import { chatCompletion } from '../config/groq.js'

const ANSWER_SYSTEM_PROMPT = `You are a senior SQL instructor. Given a user's SQL question and an optional schema,
respond with strict JSON only, no markdown fences, matching this shape:
{
  "query": "the correct SQL query that answers the question",
  "explanation": "a short explanation of how the query works",
  "mermaid": "an erDiagram mermaid string for the schema if one was provided, else empty string"
}`

const TEACH_SYSTEM_PROMPT = `You are a patient SQL teaching assistant. You NEVER reveal the final correct SQL query outright.
Given the user's question, an optional schema, the conversation history so far, and optionally the user's latest query attempt,
respond with strict JSON only, no markdown fences, matching this shape:
{
  "message": "your next teaching message: restate/clarify the question, suggest an approach, give the next incremental hint, or give feedback on the user's attempt without fixing it for them",
  "stage": "understanding" | "approach" | "hint" | "attempt_feedback",
  "solved": true or false — true only if the user's attempt is fully correct,
  "mermaid": "an erDiagram mermaid string for the schema if one was provided and this is the first message, else empty string"
}
Give exactly one small, incremental step per response. If the user's attempt is correct, set solved to true and congratulate them briefly.`

const SIMILAR_SYSTEM_PROMPT = `You are a SQL curriculum designer. Given an original question, its schema, and the concept it tests,
generate one new question of the same concept and difficulty so the learner can practice again.
Respond with strict JSON only, no markdown fences, matching this shape:
{
  "question": "the new question text",
  "schema": "a schema description or DDL for the new question, consistent with the original schema's style",
  "mermaid": "an erDiagram mermaid string for the new schema"
}`

function buildUserContent({ question, schema, history, userAttempt }) {
  const parts = [`Question: ${question}`]
  if (schema) parts.push(`Schema:\n${schema}`)
  if (Array.isArray(history) && history.length > 0) {
    parts.push(`Conversation so far:\n${history.map((h) => `${h.role}: ${h.content}`).join('\n')}`)
  }
  if (userAttempt) parts.push(`User's latest query attempt:\n${userAttempt}`)
  return parts.join('\n\n')
}

// POST /api/ai/answer
export const getAnswer = async (req, res, next) => {
  try {
    const { question, schema } = req.body

    if (!question) {
      return res.status(400).json({ error: 'question is required' })
    }

    const result = await chatCompletion(
      [
        { role: 'system', content: ANSWER_SYSTEM_PROMPT },
        { role: 'user', content: buildUserContent({ question, schema }) },
      ],
      { json: true }
    )

    res.json(result)
  } catch (err) {
    next(err)
  }
}

// POST /api/ai/teach
export const getGuidance = async (req, res, next) => {
  try {
    const { question, schema, history, userAttempt } = req.body

    if (!question) {
      return res.status(400).json({ error: 'question is required' })
    }

    const result = await chatCompletion(
      [
        { role: 'system', content: TEACH_SYSTEM_PROMPT },
        { role: 'user', content: buildUserContent({ question, schema, history, userAttempt }) },
      ],
      { json: true }
    )

    res.json(result)
  } catch (err) {
    next(err)
  }
}

// POST /api/ai/similar
export const getSimilarQuestion = async (req, res, next) => {
  try {
    const { originalQuestion, schema, concept } = req.body

    if (!originalQuestion) {
      return res.status(400).json({ error: 'originalQuestion is required' })
    }

    const result = await chatCompletion(
      [
        { role: 'system', content: SIMILAR_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Original question: ${originalQuestion}\n\nSchema:\n${schema || 'N/A'}\n\nConcept: ${concept || 'unspecified'}`,
        },
      ],
      { json: true }
    )

    res.json(result)
  } catch (err) {
    next(err)
  }
}
