import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { expandedQuestions } from '../src/data/expandedQuestionBank.js'
import { hintRevealsAnswer, validateGeneratedProblem } from '../src/services/problemGenerationService.js'
import { requiresOrderedResult, resultsMatch } from '../src/services/resultCompare.js'
import { executePracticeQuery } from '../src/services/sqlRunnerService.js'

const TOPICS = [
  'SELECT basics',
  'WHERE conditions',
  'ORDER BY',
  'LIMIT & OFFSET',
  'Basic JOINs',
  'GROUP BY',
  'HAVING',
  'Complex JOINs',
  'Subqueries',
  'CTEs',
]

const existingQuestions = [
  { topicTitle: 'SELECT basics', difficulty: 'easy', prompt: 'Retrieve the names of all employees who work in the Sales department.' },
  { topicTitle: 'WHERE conditions', difficulty: 'medium', prompt: 'List the names of employees who work in the Sales department and earn more than 62000.' },
  { topicTitle: 'ORDER BY', difficulty: 'easy', prompt: 'List each employee’s name and salary, sorted from highest to lowest salary.' },
  { topicTitle: 'LIMIT & OFFSET', difficulty: 'hard', prompt: 'Return the names and salaries of the employees with the second and third highest salaries, ordered by salary descending.' },
  { topicTitle: 'Basic JOINs', difficulty: 'easy', prompt: "Return each employee's name along with the name of the department they belong to." },
  { topicTitle: 'GROUP BY', difficulty: 'easy', prompt: 'Count how many employees work in each department.' },
  { topicTitle: 'HAVING', difficulty: 'medium', prompt: 'Which departments have an average salary above 65000? List each department and its average salary.' },
  { topicTitle: 'Complex JOINs', difficulty: 'hard', prompt: "Write a query that lists each employee's name along with the name of every project in the same department, but only for departments that have more than one employee." },
  { topicTitle: 'Subqueries', difficulty: 'hard', prompt: 'Return the names of employees whose salary is greater than the average salary of their department.' },
  { topicTitle: 'CTEs', difficulty: 'hard', prompt: 'Using a CTE, calculate the total salary per department and return the department name and total salary for departments whose total salary is greater than 150,000.' },
]

const migration = readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../supabase/migrations/003_expand_question_bank.sql'),
  'utf8',
)

test('expanded question bank adds four original problems to each topic', () => {
  assert.equal(expandedQuestions.length, 40)
  assert.equal(migration.includes('DELETE '), false)
  assert.equal(migration.includes('UPDATE '), false)
  assert.equal(migration.match(/INSERT INTO public\.problems/g).length, 40)

  const prompts = new Set()
  for (const question of expandedQuestions) {
    assert.equal(prompts.has(question.prompt), false)
    prompts.add(question.prompt)
    assert.equal(existingQuestions.some((existing) => existing.prompt === question.prompt), false)
    assert.equal(question.hints.length, 3)
    assert.deepEqual(question.hints.map((hint) => hint.level), [1, 2, 3])
    assert.equal(question.hints.some((hint) => hintRevealsAnswer(hint.text, question.correct_sql)), false)
    assert.equal(migration.includes(question.prompt), true)
    assert.equal(migration.includes(question.correct_sql), true)
    validateGeneratedProblem(question, question.fixture)
  }

  for (const topic of TOPICS) {
    const added = expandedQuestions.filter((question) => question.topicTitle === topic)
    const all = [...existingQuestions, ...added].filter((question) => question.topicTitle === topic)
    assert.equal(added.length, 4)
    assert.equal(all.length, 5)
    assert.equal(all.filter((question) => question.difficulty === 'easy').length, 2)
    assert.equal(all.filter((question) => question.difficulty === 'medium').length, 2)
    assert.equal(all.filter((question) => question.difficulty === 'hard').length, 1)
  }
})

test('expanded question results match the SQL runner', async () => {
  for (const question of expandedQuestions) {
    const executed = await executePracticeQuery(question.correct_sql, question.fixture)
    const matched = resultsMatch(executed.rows, question.expected_result, {
      ordered: requiresOrderedResult(question.correct_sql),
    })
    assert.equal(matched, true, question.prompt)
  }
})
