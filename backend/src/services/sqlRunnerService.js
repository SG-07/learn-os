import fs from 'node:fs'
import pg from 'pg'
import 'dotenv/config'

const { Client } = pg

export const STATEMENT_TIMEOUT_MS = 2000
export const MAX_RESULT_ROWS = 100

const ALLOWED_COLUMN_TYPES = new Set(['INT', 'INTEGER', 'VARCHAR', 'TEXT', 'BOOLEAN', 'DATE', 'NUMERIC'])

const FORBIDDEN_WORDS = new Set([
  'insert', 'update', 'delete', 'drop', 'alter', 'create', 'truncate',
  'grant', 'revoke', 'copy', 'merge', 'call', 'do', 'execute', 'prepare',
  'deallocate', 'comment', 'vacuum', 'analyze', 'reindex', 'cluster',
  'lock', 'listen', 'notify', 'unlisten', 'load', 'discard', 'reset',
  'set', 'show', 'begin', 'commit', 'rollback', 'savepoint', 'release',
  'into', 'security', 'reassign', 'refresh', 'import', 'export',
  'set_config', 'pg_read_file', 'pg_read_binary_file', 'pg_ls_dir',
  'pg_stat_file', 'lo_import', 'lo_export', 'dblink', 'pg_authid', 'pg_shadow',
])

const DENIED_SCHEMAS = new Set([
  'public', 'information_schema', 'auth', 'storage', 'realtime', 'vault',
  'pgsodium', 'extensions', 'graphql', 'graphql_public', 'supabase_functions',
  'supabase_migrations', 'net', 'cron', 'pgbouncer',
])

export const practiceFixtures = {
  employees: {
    name: 'employees',
    tables: [
      {
        name: 'employees',
        columns: [
          { name: 'id', type: 'INT', primaryKey: true },
          { name: 'name', type: 'VARCHAR' },
          { name: 'department', type: 'VARCHAR' },
          { name: 'salary', type: 'INT' },
        ],
        rows: [
          [1, 'Alice', 'Sales', 60000],
          [2, 'Bob', 'Engineering', 90000],
          [3, 'Charlie', 'Sales', 65000],
          [4, 'Diana', 'HR', 70000],
          [5, 'Eve', 'Sales', 62000],
        ],
      },
    ],
  },
  company: {
    name: 'company',
    tables: [
      {
        name: 'departments',
        columns: [
          { name: 'id', type: 'INT', primaryKey: true },
          { name: 'name', type: 'VARCHAR' },
        ],
        rows: [
          [1, 'Sales'],
          [2, 'Engineering'],
          [3, 'HR'],
        ],
      },
      {
        name: 'employees',
        columns: [
          { name: 'id', type: 'INT', primaryKey: true },
          { name: 'name', type: 'VARCHAR' },
          { name: 'department_id', type: 'INT' },
          { name: 'salary', type: 'INT' },
        ],
        rows: [
          [1, 'Alice', 1, 60000],
          [2, 'Bob', 2, 90000],
          [3, 'Charlie', 1, 65000],
          [4, 'Diana', 3, 70000],
          [5, 'Eve', 1, 62000],
        ],
      },
      {
        name: 'projects',
        columns: [
          { name: 'id', type: 'INT', primaryKey: true },
          { name: 'name', type: 'VARCHAR' },
          { name: 'department_id', type: 'INT' },
        ],
        rows: [
          [1, 'Atlas', 2],
          [2, 'Beacon', 1],
          [3, 'Cedar', 1],
        ],
      },
    ],
  },
}

const KNOWN_MESSAGES = new Set([
  'SQL not provided',
  'Multiple statements are not allowed',
  'Forbidden statement type',
  'Query cannot access production tables',
  'Execution timeout',
  'Unknown table',
  'SQL syntax failure',
  'Result too large',
  'SQL_RUNNER_DATABASE_URL is not configured',
  'SQL_RUNNER_SSL_CA is not configured',
  'SQL_RUNNER_SSL_CA_FILE could not be read',
  'A practice fixture is required',
  'SQL runner connection failed',
  'SQL runner failed to load the practice fixture',
])

export function getFixture(name) {
  const fixture = practiceFixtures[name]
  if (!fixture) {
    throw runnerError(`Unknown fixture: ${name}`)
  }
  return fixture
}

export function selectFixtureName(topic) {
  const title = String(topic?.title || topic?.name || '').toLowerCase()
  if (title.includes('join') || title.includes('subquer') || title.includes('cte')) {
    return 'company'
  }
  return 'employees'
}

export function describeFixture(fixtureOrName) {
  const fixture = typeof fixtureOrName === 'string' ? getFixture(fixtureOrName) : fixtureOrName
  return tableList(fixture).map((table) => {
    const columns = table.columns.map((column) => `${column.name} ${column.type}`).join(', ')
    const rows = table.rows.map((row) => row.map((value) => value ?? 'null').join(' | ')).join('\n')
    return `TABLE ${table.name} (${columns})\n${rows}`
  }).join('\n\n')
}

export function serializeFixture(name) {
  const fixture = getFixture(name)
  return {
    fixture: fixture.name,
    tables: tableList(fixture).map((table) => ({
      name: table.name,
      columns: table.columns.map((column) => ({
        name: column.name,
        type: column.type,
        primaryKey: Boolean(column.primaryKey),
      })),
    })),
  }
}

export function fixtureMermaid(fixtureOrName) {
  const fixture = typeof fixtureOrName === 'string' ? getFixture(fixtureOrName) : fixtureOrName
  const lines = ['erDiagram']
  for (const table of tableList(fixture)) {
    lines.push(`  ${table.name.toUpperCase()} {`)
    for (const column of table.columns) {
      lines.push(`    ${column.type} ${column.name}${column.primaryKey ? ' PK' : ''}`)
    }
    lines.push('  }')
  }
  return lines.join('\n')
}

export function schemaFromDataset(datasetSchema) {
  const parsed = parseDatasetSchema(datasetSchema)
  if (!parsed) {
    return { tables: [] }
  }

  if (parsed.fixture && practiceFixtures[parsed.fixture]) {
    return serializeFixture(parsed.fixture)
  }
  if (Array.isArray(parsed.tables)) {
    return { tables: parsed.tables, ...(parsed.fixture ? { fixture: parsed.fixture } : {}) }
  }

  return { tables: [] }
}

function parseDatasetSchema(datasetSchema) {
  if (!datasetSchema) return null
  if (typeof datasetSchema === 'object') return datasetSchema
  if (typeof datasetSchema !== 'string' || datasetSchema.trim() === '') return null

  try {
    const parsed = JSON.parse(datasetSchema)
    if (typeof parsed === 'string') {
      return JSON.parse(parsed)
    }
    if (parsed && typeof parsed === 'object') return parsed
  } catch {
    return null
  }

  return null
}

export function validatePracticeSql(sql) {
  if (typeof sql !== 'string' || sql.trim() === '') {
    throw runnerError('SQL not provided')
  }

  if ([...sql].some((char) => !isAllowedCharacter(char))) {
    throw runnerError('Forbidden statement type')
  }

  const statements = parseStatements(sql).filter((tokens) => !isBlank(tokens))

  if (statements.length === 0) {
    throw runnerError('SQL not provided')
  }

  if (statements.length > 1) {
    throw runnerError('Multiple statements are not allowed')
  }

  const tokens = statements[0]
  const words = tokens.filter((token) => token.type === 'word' || token.type === 'ident')
  const first = words[0]

  if (!first || first.type !== 'word' || !['select', 'with'].includes(first.text.toLowerCase())) {
    throw runnerError('Forbidden statement type')
  }

  if (first.text.toLowerCase() === 'with' && !words.some((token) => token.type === 'word' && token.text.toLowerCase() === 'select')) {
    throw runnerError('Forbidden statement type')
  }

  for (const token of words) {
    if (token.type === 'word' && FORBIDDEN_WORDS.has(token.text.toLowerCase())) {
      throw runnerError('Forbidden statement type')
    }
  }

  assertNoProductionSchema(tokens)

  return tokens.map((token) => token.text).join('')
}

export function mapDatabaseError(err) {
  if (err?.name === 'RunnerError' && KNOWN_MESSAGES.has(err.message)) {
    return err
  }

  if (err?.code === '57014' || /timeout/i.test(err?.message || '')) {
    return runnerError('Execution timeout')
  }

  if (err?.code === '42P01') {
    return runnerError('Unknown table')
  }

  if (err?.code === '42501') {
    return runnerError('Query cannot access production tables')
  }

  return runnerError('SQL syntax failure')
}

export async function executePracticeQuery(sql, fixture) {
  const statement = validatePracticeSql(sql)
  const resolved = resolveFixture(fixture)
  const connectionString = process.env.SQL_RUNNER_DATABASE_URL

  if (!connectionString) {
    throw runnerError('SQL_RUNNER_DATABASE_URL is not configured')
  }

  const client = new Client(runnerConfig(connectionString))
  client.on('error', () => {})

  let opened = false
  let started = false

  try {
    await client.connect()
    opened = true
    await run(client, 'BEGIN')
    started = true
    await run(client, `SET LOCAL statement_timeout = '${STATEMENT_TIMEOUT_MS}ms'`)
    await run(client, 'SET LOCAL search_path TO pg_temp, pg_catalog')
    await loadFixture(client, resolved)

    const wrapped = `SELECT * FROM (\n${statement}\n) AS practice_result LIMIT ${MAX_RESULT_ROWS + 1}`
    const result = await run(client, wrapped)

    if (result.rows.length > MAX_RESULT_ROWS) {
      throw runnerError('Result too large')
    }

    return {
      rows: result.rows,
      columns: result.fields.map((field) => field.name),
    }
  } catch (err) {
    if (err?.name === 'RunnerError') {
      throw err
    }

    if (!opened) {
      throw runnerError('SQL runner connection failed')
    }

    throw mapDatabaseError(err)
  } finally {
    if (started) {
      try {
        await client.query('ROLLBACK')
      } catch {
        // The session is closing. PostgreSQL aborts an open transaction with it.
      }
    }

    if (opened) {
      try {
        await client.end()
      } catch {
        // The connection is already closed.
      }
    }
  }
}

const SSL_QUERY_KEYS = new Set([
  'ssl',
  'sslmode',
  'sslrootcert',
  'sslcert',
  'sslkey',
  'sslnegotiation',
  'uselibpqcompat',
])

export function runnerConfig(connectionString, env = process.env) {
  return {
    connectionString: stripSslParams(connectionString),
    application_name: 'learn-os-sql-runner',
    ssl: {
      rejectUnauthorized: true,
      ca: readRunnerCa(env),
    },
  }
}

function stripSslParams(connectionString) {
  let parsed
  try {
    parsed = new URL(connectionString)
  } catch {
    throw runnerError('SQL_RUNNER_DATABASE_URL is not configured')
  }

  for (const key of [...parsed.searchParams.keys()]) {
    if (SSL_QUERY_KEYS.has(key.toLowerCase())) {
      parsed.searchParams.delete(key)
    }
  }

  return parsed.toString()
}

function readRunnerCa(env) {
  const inline = typeof env.SQL_RUNNER_SSL_CA === 'string' ? env.SQL_RUNNER_SSL_CA.trim() : ''
  if (inline) {
    return inline.replace(/\\n/g, '\n')
  }

  const filePath = typeof env.SQL_RUNNER_SSL_CA_FILE === 'string' ? env.SQL_RUNNER_SSL_CA_FILE.trim() : ''
  if (!filePath) {
    throw runnerError('SQL_RUNNER_SSL_CA is not configured')
  }

  try {
    const ca = fs.readFileSync(filePath, 'utf8').trim()
    if (!ca.includes('BEGIN CERTIFICATE')) {
      throw runnerError('SQL_RUNNER_SSL_CA is not configured')
    }
    return ca
  } catch (err) {
    if (err?.name === 'RunnerError') throw err
    throw runnerError('SQL_RUNNER_SSL_CA_FILE could not be read')
  }
}

function run(client, text, values) {
  return client.query({
    text,
    values,
    query_timeout: STATEMENT_TIMEOUT_MS + 1000,
  })
}

async function loadFixture(client, fixture) {
  try {
    for (const table of tableList(fixture)) {
      await createTempTable(client, table)
    }
  } catch (err) {
    if (err?.name === 'RunnerError') {
      throw err
    }

    throw runnerError('SQL runner failed to load the practice fixture')
  }
}

async function createTempTable(client, table) {
  const tableName = quoteIdent(table.name)
  const columns = table.columns.map((column) => `${quoteIdent(column.name)} ${column.type}`).join(', ')
  await run(client, `CREATE TEMP TABLE ${tableName} (${columns}) ON COMMIT DROP`)

  if (table.rows.length === 0) {
    return
  }

  const values = []
  const tuples = table.rows.map((row) => {
    if (row.length !== table.columns.length) {
      throw runnerError('SQL runner failed to load the practice fixture')
    }

    const placeholders = row.map((value) => {
      values.push(value)
      return `$${values.length}`
    })

    return `(${placeholders.join(', ')})`
  })

  const names = table.columns.map((column) => quoteIdent(column.name)).join(', ')
  await run(
    client,
    `INSERT INTO ${tableName} (${names}) VALUES ${tuples.join(', ')}`,
    values,
  )
}

function resolveFixture(fixture) {
  if (typeof fixture === 'string') {
    return validateFixtureShape(getFixture(fixture))
  }

  if (!fixture || typeof fixture !== 'object' || Array.isArray(fixture)) {
    throw runnerError('A practice fixture is required')
  }

  return validateFixtureShape(fixture)
}

function validateFixtureShape(fixture) {
  const tables = tableList(fixture)

  for (const table of tables) {
    quoteIdent(table?.name)
    if (!Array.isArray(table.columns) || !Array.isArray(table.rows)) {
      throw runnerError('A practice fixture is required')
    }

    for (const column of table.columns) {
      quoteIdent(column?.name)
      if (!ALLOWED_COLUMN_TYPES.has(column?.type)) {
        throw runnerError('A practice fixture is required')
      }
    }
  }

  return fixture
}

function tableList(fixture) {
  if (Array.isArray(fixture?.tables) && fixture.tables.length > 0) {
    return fixture.tables
  }

  if (fixture?.table && Array.isArray(fixture.columns) && Array.isArray(fixture.rows)) {
    return [{ name: fixture.table, columns: fixture.columns, rows: fixture.rows }]
  }

  throw runnerError('A practice fixture is required')
}

function quoteIdent(name) {
  if (typeof name !== 'string' || !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw runnerError('A practice fixture is required')
  }

  return `"${name}"`
}

function runnerError(message) {
  const error = new Error(message)
  error.name = 'RunnerError'
  return error
}

function isAllowedCharacter(char) {
  return char === '\t' || char === '\n' || char === '\r' || (char >= ' ' && char <= '~')
}

function parseStatements(sql) {
  const statements = [[]]
  let index = 0

  const current = () => statements[statements.length - 1]

  while (index < sql.length) {
    const char = sql[index]

    if (char === '-' && sql[index + 1] === '-') {
      while (index < sql.length && sql[index] !== '\n') {
        index += 1
      }
      current().push({ type: 'space', text: ' ' })
      continue
    }

    if (char === '/' && sql[index + 1] === '*') {
      const end = sql.indexOf('*/', index + 2)
      if (end === -1) {
        throw runnerError('SQL syntax failure')
      }
      index = end + 2
      current().push({ type: 'space', text: ' ' })
      continue
    }

    if (char === "'") {
      const quoted = readQuoted(sql, index, false)
      current().push({ type: 'string', text: quoted.text })
      index = quoted.next
      continue
    }

    if (char === '"') {
      const ident = readIdent(sql, index)
      current().push({ type: 'ident', text: ident.text, value: ident.value })
      index = ident.next
      continue
    }

    if (char === '$') {
      const tag = matchDollarTag(sql, index)
      if (tag) {
        const close = sql.indexOf(tag, index + tag.length)
        if (close === -1) {
          throw runnerError('SQL syntax failure')
        }
        const next = close + tag.length
        current().push({ type: 'string', text: sql.slice(index, next) })
        index = next
        continue
      }
    }

    if (char === ';') {
      statements.push([])
      index += 1
      continue
    }

    if (/[A-Za-z_]/.test(char)) {
      let end = index + 1
      while (end < sql.length && /[A-Za-z0-9_]/.test(sql[end])) {
        end += 1
      }

      const word = sql.slice(index, end)

      if ((word === 'E' || word === 'e' || word === 'N' || word === 'n') && sql[end] === "'") {
        const quoted = readQuoted(sql, end, word === 'E' || word === 'e')
        current().push({ type: 'string', text: word + quoted.text })
        index = quoted.next
        continue
      }

      if ((word === 'U' || word === 'u') && sql.startsWith("&'", end)) {
        const quoted = readQuoted(sql, end + 1, false)
        current().push({ type: 'string', text: `${word}&${quoted.text}` })
        index = quoted.next
        continue
      }

      current().push({ type: 'word', text: word, value: word })
      index = end
      continue
    }

    current().push(isWhitespace(char)
      ? { type: 'space', text: char }
      : { type: 'other', text: char })
    index += 1
  }

  return statements
}

function readQuoted(sql, index, escape) {
  let end = index + 1
  let text = "'"

  while (end < sql.length) {
    if (escape && sql[end] === '\\') {
      text += sql[end] + (sql[end + 1] ?? '')
      end += sql[end + 1] === undefined ? 1 : 2
      continue
    }

    if (sql[end] === "'") {
      if (sql[end + 1] === "'") {
        text += "''"
        end += 2
        continue
      }

      return { text: `${text}'`, next: end + 1 }
    }

    text += sql[end]
    end += 1
  }

  throw runnerError('SQL syntax failure')
}

function readIdent(sql, index) {
  let end = index + 1
  let value = ''

  while (end < sql.length) {
    if (sql[end] === '"') {
      if (sql[end + 1] === '"') {
        value += '"'
        end += 2
        continue
      }

      return {
        text: `"${value.replaceAll('"', '""')}"`,
        value,
        next: end + 1,
      }
    }

    value += sql[end]
    end += 1
  }

  throw runnerError('SQL syntax failure')
}

function matchDollarTag(sql, index) {
  if (sql[index] !== '$') {
    return null
  }

  if (sql[index + 1] === '$') {
    return '$$'
  }

  let end = index + 1
  if (!/[A-Za-z_]/.test(sql[end] || '')) {
    return null
  }

  end += 1
  while (end < sql.length && /[A-Za-z0-9_]/.test(sql[end])) {
    end += 1
  }

  if (sql[end] !== '$') {
    return null
  }

  return sql.slice(index, end + 1)
}

function assertNoProductionSchema(tokens) {
  const meaningful = tokens.filter((token) => token.type !== 'space')

  for (let index = 0; index < meaningful.length - 2; index += 1) {
    const left = meaningful[index]
    const dot = meaningful[index + 1]
    const right = meaningful[index + 2]

    if (dot.type !== 'other' || dot.text !== '.') {
      continue
    }

    if ((left.type !== 'word' && left.type !== 'ident') || (right.type !== 'word' && right.type !== 'ident')) {
      continue
    }

    const schema = String(left.value).toLowerCase()

    if (DENIED_SCHEMAS.has(schema)) {
      throw runnerError('Query cannot access production tables')
    }

    if (schema === 'pg_catalog' && FORBIDDEN_WORDS.has(String(right.value).toLowerCase())) {
      throw runnerError('Forbidden statement type')
    }
  }
}

function isBlank(tokens) {
  return tokens.every((token) => token.type === 'space')
}

function isWhitespace(char) {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}
