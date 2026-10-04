import supabase from '../config/supabase.js'
import { chatCompletion } from '../config/groq.js'
import { listTopics } from './topicService.js'
import {
  describeFixture,
  executePracticeQuery,
  getFixture,
  selectFixtureName,
  serializeFixture,
  validatePracticeSql,
} from './sqlRunnerService.js'

const MAX_PROBLEMS_PER_TOPIC = 1
const MAX_HINTS = 3
const MAX_GENERATION_ATTEMPTS = 2

const SYSTEM_PROMPT = `You write original practice problems for an educational SQL platform used by university and college students.
The student should learn the named topic by writing one PostgreSQL SELECT.
Use only the tables and columns in the fixture. Do not invent tables or columns.
Do not copy textbook or tutorial wording.

Respond with one JSON object only. No markdown.
The object must have exactly these fields:
{
  "prompt": "a short original exercise the student can solve",
  "correct_sql": "one PostgreSQL SELECT or WITH ... SELECT that answers the prompt",
  "hints": [ { "level": 1, "text": "a teaching hint that does not reveal the final query" } ]
}

Rules:
- prompt and correct_sql are non-empty strings.
- correct_sql is one statement. It must be SELECT or WITH ... SELECT.
- Do not use INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE, GRANT, REVOKE, COPY, or SELECT INTO.
- Do not reference any schema other than the fixture tables.
- hints must be exactly 3 objects, levels 1, 2, and 3.
- Hint 1 gives only the concept, with no SQL.
- Hint 2 names the relevant table and column.
- Hint 3 describes the clause shape, such as SELECT, WHERE, or JOIN, without writing the full query.
- Every selected column must have a unique output name.
- If two selected columns would share a name, such as employees.name and projects.name, give each a different alias with AS. Example: e.name AS employee_name, p.name AS project_name.
- Do not use SELECT * when the joined tables share any column name.
- Do not include expected_result, a topic id, or a dataset.
- Test only the named topic. Beginner topics stay on one simple idea.
- The prompt must be unambiguous and answerable from the fixture rows.
- Match difficulty to the given topic tier.`

export function validateGeneratedProblem(raw, fixtureName) {
  const errors = []

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error('Model output is not a JSON object')
  }

  const prompt = requireText(raw.prompt, 'prompt', errors)
  const correctSql = requireText(raw.correct_sql, 'correct_sql', errors)
  const hints = requireHints(raw.hints, errors)

  if (errors.length > 0) {
    throw new Error(`Invalid generated problem: ${errors.join('; ')}`)
  }

  let checkedSql = ''
  try {
    checkedSql = validatePracticeSql(correctSql)
  } catch (err) {
    throw new Error(`Invalid generated problem: ${err.message}`)
  }

  if (hints.some((hint) => revealsQuery(hint.text, checkedSql))) {
    throw new Error('Invalid generated problem: a hint includes the correct query')
  }

  if (fixtureName) {
    assertUsesFixture(checkedSql, fixtureName)
  }

  assertDistinctOutputColumns(checkedSql, fixtureName)

  return {
    prompt,
    correct_sql: checkedSql,
    hints,
  }
}

export async function generateProblemForTopic(topic) {
  if (!topic?.id || !topic?.title) {
    throw new Error('Topic id and title are required')
  }

  const fixtureName = selectFixtureName(topic)
  let lastError = null

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    try {
      const raw = await chatCompletion(
        [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: [
              `Topic title: ${topic.title}`,
              `Topic tier: ${topic.tier || 'unspecified'}`,
              'SQL dialect: PostgreSQL',
              'Fixture:',
              describeFixture(fixtureName),
              'Write one original exercise for this topic only. The correct_sql must run against this fixture.',
              attempt > 1 ? `The previous attempt failed: ${lastError?.message || 'invalid SQL'}. Write a different executable query.` : '',
            ].filter(Boolean).join('\n'),
          },
        ],
        { json: true, temperature: 0.4 },
      )

      const generated = validateGeneratedProblem(raw, fixtureName)
      const executed = await executePracticeQuery(generated.correct_sql, fixtureName)

      return {
        prompt: generated.prompt,
        correct_sql: generated.correct_sql,
        hints: generated.hints,
        expected_result: executed.rows,
        dataset_schema: JSON.stringify(serializeFixture(fixtureName)),
        fixture: fixtureName,
        expected_result_source: 'sql_runner',
      }
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('Problem generation failed')
}

export async function insertProblem(topicId, problem) {
  if (!problem?.fixture) {
    throw new Error('A practice fixture is required')
  }

  const validated = validateGeneratedProblem(problem, problem.fixture)
  const executed = await executePracticeQuery(validated.correct_sql, problem.fixture)

  const { data, error } = await supabase
    .from('problems')
    .insert({
      topic_id: topicId,
      prompt: validated.prompt,
      correct_sql: validated.correct_sql,
      expected_result: executed.rows,
      hints: validated.hints,
      dataset_schema: JSON.stringify(serializeFixture(problem.fixture)),
    })
    .select('id, topic_id')
    .single()

  if (error) throw error
  return data
}

export async function listTopicsForGeneration(limit) {
  const topics = await listTopics()
  return topics.slice(0, limit)
}

export { MAX_PROBLEMS_PER_TOPIC }

function requireText(value, field, errors) {
  if (typeof value !== 'string' || value.trim() === '') {
    errors.push(`${field} must be a non-empty string`)
    return ''
  }
  return value.trim()
}

function requireHints(value, errors) {
  if (!Array.isArray(value)) {
    errors.push('hints must be an array')
    return []
  }

  if (value.length !== MAX_HINTS) {
    errors.push(`hints must contain ${MAX_HINTS} items`)
  }

  return value.map((hint, index) => {
    if (!hint || typeof hint !== 'object' || Array.isArray(hint)) {
      errors.push(`hints[${index}] must be an object`)
      return hint
    }

    if (typeof hint.level !== 'number' || !Number.isFinite(hint.level)) {
      errors.push(`hints[${index}].level must be a number`)
    }

    if (typeof hint.text !== 'string' || hint.text.trim() === '') {
      errors.push(`hints[${index}].text must be a non-empty string`)
    }

    return {
      level: hint.level,
      text: typeof hint.text === 'string' ? hint.text.trim() : hint.text,
    }
  })
}

export function hintRevealsAnswer(hintText, sql) {
  return revealsQuery(hintText, sql)
}

function assertDistinctOutputColumns(sql, fixtureName) {
  for (const selectList of outermostSelectLists(sql)) {
    const fromTables = fromClauseTables(selectList.fromClause)
    const aliases = tableAliases(selectList.fromClause)
    const names = []

    for (const item of selectList.items) {
      const label = outputLabel(item)
      if (label.kind === 'star') {
        names.push(...expandedStarNames(label.qualifier, fromTables, aliases, fixtureName))
      } else {
        names.push(label.name)
      }
    }

    const seen = new Set()
    for (const name of names) {
      if (seen.has(name)) {
        throw new Error(`Invalid generated problem: duplicate output column "${name}" needs a distinct alias`)
      }
      seen.add(name)
    }
  }
}

function outermostSelectLists(sql) {
  const tokens = sqlTokens(sql)
  const lists = []
  let index = 0

  while (index < tokens.length) {
    const token = tokens[index]
    if (token.depth !== 0 || token.text.toLowerCase() !== 'select') {
      index += 1
      continue
    }

    index += 1
    if (tokens[index]?.depth === 0 && tokens[index].text.toLowerCase() === 'distinct') {
      index += 1
    }

    const items = []
    let current = []
    while (index < tokens.length && !(tokens[index].depth === 0 && tokens[index].text.toLowerCase() === 'from')) {
      if (tokens[index].depth === 0 && tokens[index].text === ',') {
        if (current.length > 0) items.push(current)
        current = []
      } else {
        current.push(tokens[index])
      }
      index += 1
    }

    if (current.length > 0) items.push(current)

    const fromStart = index
    while (index < tokens.length && !(tokens[index].depth === 0 && /^(where|group|order|limit|union|except|intersect)$/i.test(tokens[index].text))) {
      index += 1
    }

    lists.push({
      items,
      fromClause: tokens.slice(fromStart, index).map((part) => part.text).join(''),
    })
  }

  return lists
}

function outputLabel(item) {
  const parts = item.filter((token) => token.text.trim() !== '')
  if (parts.length === 1 && parts[0].text === '*') {
    return { kind: 'star', qualifier: null }
  }
  if (parts.length === 3 && parts[1].text === '.' && parts[2].text === '*') {
    return { kind: 'star', qualifier: identName(parts[0]) }
  }

  const aliasAt = parts.length - 1
  const beforeAlias = parts[aliasAt - 1]
  if (beforeAlias && isIdentifier(parts[aliasAt]) && beforeAlias.text.toLowerCase() === 'as') {
    return { kind: 'name', name: identName(parts[aliasAt]) }
  }
  if (
    beforeAlias
    && isIdentifier(parts[aliasAt])
    && isIdentifier(beforeAlias)
    && beforeAlias.text !== '.'
  ) {
    return { kind: 'name', name: identName(parts[aliasAt]) }
  }
  if (parts.length === 3 && parts[1].text === '.' && isIdentifier(parts[2])) {
    return { kind: 'name', name: identName(parts[2]) }
  }
  if (parts.length === 1 && isIdentifier(parts[0])) {
    return { kind: 'name', name: identName(parts[0]) }
  }

  const call = parts.find((token) => isIdentifier(token))
  return { kind: 'name', name: call ? identName(call) : 'expr' }
}

function expandedStarNames(qualifier, fromTables, aliases, fixtureName) {
  if (!fixtureName) {
    throw new Error('Invalid generated problem: duplicate output column "*" needs a distinct alias')
  }

  const fixture = getFixture(fixtureName)
  const tables = qualifier
    ? [aliases[qualifier] || qualifier]
    : fromTables
  const names = []

  for (const tableName of tables) {
    const table = fixture.tables.find((entry) => entry.name.toLowerCase() === tableName)
    if (!table) {
      throw new Error('Invalid generated problem: duplicate output column "*" needs a distinct alias')
    }
    names.push(...table.columns.map((column) => column.name.toLowerCase()))
  }

  return names
}

function fromClauseTables(fromClause) {
  return referencedTables(fromClause)
}

function tableAliases(fromClause) {
  const aliases = {}
  const pattern = /\b(?:from|join)\s+([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+(?:as\s+)?([a-zA-Z_][a-zA-Z0-9_]*))?/gi
  const reserved = new Set(['on', 'where', 'join', 'left', 'right', 'inner', 'outer', 'full', 'cross', 'group', 'order', 'limit', 'union'])
  let match = pattern.exec(fromClause)
  while (match) {
    const table = match[1].toLowerCase()
    aliases[table] = table
    const alias = match[2]?.toLowerCase()
    if (alias && !reserved.has(alias)) {
      aliases[alias] = table
    }
    match = pattern.exec(fromClause)
  }
  return aliases
}

function sqlTokens(sql) {
  const tokens = []
  let index = 0
  let depth = 0

  while (index < sql.length) {
    const char = sql[index]
    if (char === "'") {
      let end = index + 1
      while (end < sql.length) {
        if (sql[end] === "'" && sql[end + 1] === "'") {
          end += 2
          continue
        }
        if (sql[end] === "'") {
          end += 1
          break
        }
        end += 1
      }
      tokens.push({ text: sql.slice(index, end), depth })
      index = end
      continue
    }
    if (char === '"') {
      let end = index + 1
      while (end < sql.length) {
        if (sql[end] === '"' && sql[end + 1] === '"') {
          end += 2
          continue
        }
        if (sql[end] === '"') {
          end += 1
          break
        }
        end += 1
      }
      tokens.push({ text: sql.slice(index, end), depth })
      index = end
      continue
    }
    if (char === '(') {
      tokens.push({ text: char, depth })
      depth += 1
      index += 1
      continue
    }
    if (char === ')') {
      depth = Math.max(0, depth - 1)
      tokens.push({ text: char, depth })
      index += 1
      continue
    }
    if (/[A-Za-z_]/.test(char)) {
      let end = index + 1
      while (end < sql.length && /[A-Za-z0-9_]/.test(sql[end])) end += 1
      tokens.push({ text: sql.slice(index, end), depth })
      index = end
      continue
    }
    if (char === ',' || char === '.' || char === '*') {
      tokens.push({ text: char, depth })
      index += 1
      continue
    }
    if (/\s/.test(char)) {
      index += 1
      continue
    }
    tokens.push({ text: char, depth })
    index += 1
  }

  return tokens
}

function isIdentifier(token) {
  return Boolean(token) && /^[A-Za-z_][A-Za-z0-9_]*$/.test(token.text)
}

function identName(token) {
  if (token.text.startsWith('"')) {
    return token.text.slice(1, -1).replaceAll('""', '"')
  }
  return token.text.toLowerCase()
}

function assertUsesFixture(sql, fixtureName) {
  const fixtureTables = new Set(
    getFixture(fixtureName).tables.map((table) => table.name.toLowerCase()),
  )
  const allowed = new Set([...fixtureTables, ...cteNames(sql)])
  const used = referencedTables(sql)
  const unknown = used.filter((table) => !allowed.has(table))

  if (unknown.length > 0) {
    throw new Error(`Invalid generated problem: SQL references unknown table ${unknown[0]}`)
  }

  if (!used.some((table) => fixtureTables.has(table))) {
    throw new Error('Invalid generated problem: SQL does not use the fixture')
  }
}

function cteNames(sql) {
  const names = []
  const pattern = /(?:\bwith\b|,)\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+as\b/gi
  let match = pattern.exec(sql)
  while (match) {
    names.push(match[1].toLowerCase())
    match = pattern.exec(sql)
  }
  return names
}

function referencedTables(sql) {
  const tables = []
  const pattern = /\b(?:from|join)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi
  let match = pattern.exec(sql)
  while (match) {
    tables.push(match[1].toLowerCase())
    match = pattern.exec(sql)
  }
  return tables
}

function revealsQuery(hintText, sql) {
  const hint = hintText.replace(/\s+/g, '').toLowerCase()
  const query = sql.replace(/\s+/g, '').toLowerCase()
  return query.length > 0 && hint.includes(query)
}
