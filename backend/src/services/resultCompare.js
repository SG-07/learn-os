// Row order is part of the result only when the official solution uses ORDER BY.
// Otherwise the rows are compared as a multiset, because PostgreSQL does not
// promise an order for a query that has no ORDER BY.
export function resultsMatch(actualRows, expectedRows, { ordered = false } = {}) {
  if (!Array.isArray(actualRows) || !Array.isArray(expectedRows)) {
    return false
  }

  if (actualRows.length !== expectedRows.length) {
    return false
  }

  if (ordered) {
    return actualRows.every((row, index) => rowMatch(row, expectedRows[index]))
  }

  const remaining = [...expectedRows]
  return actualRows.every((row) => {
    const index = remaining.findIndex((candidate) => rowMatch(row, candidate))
    if (index === -1) return false
    remaining.splice(index, 1)
    return true
  })
}

export function requiresOrderedResult(sql) {
  if (typeof sql !== 'string') return false

  let index = 0
  while (index < sql.length) {
    const char = sql[index]
    if (char === '-' && sql[index + 1] === '-') {
      while (index < sql.length && sql[index] !== '\n') index += 1
      continue
    }
    if (char === '/' && sql[index + 1] === '*') {
      const end = sql.indexOf('*/', index + 2)
      index = end === -1 ? sql.length : end + 2
      continue
    }
    if (char === "'" || char === '"') {
      const quote = char
      index += 1
      while (index < sql.length) {
        if (sql[index] === quote && sql[index + 1] === quote) {
          index += 2
          continue
        }
        if (sql[index] === quote) {
          index += 1
          break
        }
        index += 1
      }
      continue
    }
    if (/[A-Za-z_]/.test(char)) {
      let end = index + 1
      while (end < sql.length && /[A-Za-z0-9_]/.test(sql[end])) end += 1
      const word = sql.slice(index, end).toLowerCase()
      const next = sql.slice(end).match(/^\s+([A-Za-z_]+)/)
      if (word === 'order' && next?.[1]?.toLowerCase() === 'by') {
        return true
      }
      index = end
      continue
    }
    index += 1
  }

  return false
}

function rowMatch(actual, expected) {
  if (!actual || !expected || typeof actual !== 'object' || typeof expected !== 'object') {
    return false
  }

  const actualKeys = Object.keys(actual)
  const expectedMap = new Map(Object.keys(expected).map((key) => [key.toLowerCase(), expected[key]]))

  if (actualKeys.length !== expectedMap.size) {
    return false
  }

  return actualKeys.every((key) => {
    const expectedValue = expectedMap.get(key.toLowerCase())
    if (expectedValue === undefined && !expectedMap.has(key.toLowerCase())) {
      return false
    }
    return normalizeValue(actual[key]) === normalizeValue(expectedValue)
  })
}

function normalizeValue(value) {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'bigint') {
    return value.toString()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (value instanceof Date) {
    return value.toISOString()
  }

  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value.trim())) {
    return String(Number(value))
  }

  return String(value)
}
