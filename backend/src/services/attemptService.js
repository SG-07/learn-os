import supabase from '../config/supabase.js'

export async function recordAttempt({ userId, problemId, sql, isCorrect, hintsUsed = 0 }) {
  const { data, error } = await supabase
    .from('attempts')
    .insert({
      user_id: userId,
      problem_id: problemId,
      sql_written: sql,
      is_correct: isCorrect,
      hints_used: hintsUsed,
    })
    .select('id, is_correct, attempted_at')
    .single()

  if (error) throw error
  return data
}

export async function hasSolved(userId, problemId) {
  const { count, error } = await supabase
    .from('attempts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('problem_id', problemId)
    .eq('is_correct', true)

  if (error) throw error
  return count > 0
}

const hintChains = new Map()
const MAX_HINT_CLAIMS = 8

function enqueueHint(userId, problemId, task) {
  const key = `${userId}\0${problemId}`
  const previous = hintChains.get(key) ?? Promise.resolve()
  const run = previous.then(() => task(), () => task())
  hintChains.set(key, run)
  return run.finally(() => {
    if (hintChains.get(key) === run) hintChains.delete(key)
  })
}

export async function takeNextHint(userId, problemId, hints) {
  return enqueueHint(userId, problemId, () => claimNextHint(userId, problemId, hints))
}

async function claimNextHint(userId, problemId, hints) {
  for (let attempt = 0; attempt < MAX_HINT_CLAIMS; attempt += 1) {
    const session = await latestSession(userId, problemId)
    const history = session?.conversation_history
    const hintsUsed = readHintsUsed(history)

    if (hintsUsed >= hints.length) {
      return {
        hint: null,
        hintsUsed,
        remaining: 0,
      }
    }

    const hint = hints[hintsUsed]
    const nextUsed = hintsUsed + 1
    const nextHistory = {
      ...(history && typeof history === 'object' && !Array.isArray(history) ? history : {}),
      hintsUsed: nextUsed,
    }
    const saved = session?.id
      ? await advanceSession(session.id, hintsUsed, nextHistory)
      : await createFirstSession(userId, problemId, nextHistory)

    if (!saved) continue

    return {
      hint: { level: hint.level, text: hint.text },
      hintsUsed: nextUsed,
      remaining: hints.length - nextUsed,
    }
  }

  const error = new Error('Could not record the hint')
  error.status = 409
  throw error
}

async function advanceSession(sessionId, expectedHintsUsed, nextHistory) {
  let query = supabase
    .from('sessions')
    .update({
      conversation_history: nextHistory,
      last_active: new Date().toISOString(),
    })
    .eq('id', sessionId)

  if (expectedHintsUsed === 0) {
    query = query.or('conversation_history->>hintsUsed.eq.0,conversation_history->>hintsUsed.is.null')
  } else {
    query = query.filter('conversation_history->>hintsUsed', 'eq', String(expectedHintsUsed))
  }

  const { data, error } = await query.select('id')
  if (error) throw error
  return Array.isArray(data) && data.length > 0
}

async function createFirstSession(userId, problemId, nextHistory) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      problem_id: problemId,
      conversation_history: nextHistory,
      last_active: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (error) throw error

  const { data: rows, error: listError } = await supabase
    .from('sessions')
    .select('id, last_active')
    .eq('user_id', userId)
    .eq('problem_id', problemId)

  if (listError) throw listError

  const winner = earliestSession(rows || [])
  if (!winner || winner.id === data.id || !(rows || []).some((row) => row.id === data.id)) {
    return true
  }

  const { error: deleteError } = await supabase
    .from('sessions')
    .delete()
    .eq('id', data.id)

  if (deleteError) throw deleteError
  return false
}

function earliestSession(rows) {
  return [...rows].sort((left, right) => {
    const byTime = String(left.last_active || '').localeCompare(String(right.last_active || ''))
    if (byTime !== 0) return byTime
    return String(left.id).localeCompare(String(right.id))
  })[0] || null
}

export async function getPracticeState(userId, problemId) {
  const [hintsUsed, attempt] = await Promise.all([
    hintsUsedFor(userId, problemId),
    latestAttempt(userId, problemId),
  ])

  return {
    hintsUsed,
    attempt: attempt
      ? {
          id: attempt.id,
          sql: attempt.sql_written,
          isCorrect: Boolean(attempt.is_correct),
          attemptedAt: attempt.attempted_at,
        }
      : null,
  }
}

async function latestAttempt(userId, problemId) {
  const { data, error } = await supabase
    .from('attempts')
    .select('id, sql_written, is_correct, attempted_at')
    .eq('user_id', userId)
    .eq('problem_id', problemId)
    .order('attempted_at', { ascending: false })
    .limit(1)

  if (error) throw error
  return data?.[0] || null
}

export async function hintsUsedFor(userId, problemId) {
  const session = await latestSession(userId, problemId)
  return readHintsUsed(session?.conversation_history)
}

async function latestSession(userId, problemId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, conversation_history')
    .eq('user_id', userId)
    .eq('problem_id', problemId)
    .order('last_active', { ascending: false })
    .limit(1)

  if (error) throw error
  return data?.[0] || null
}

function readHintsUsed(history) {
  if (!history || typeof history !== 'object' || Array.isArray(history)) {
    return 0
  }
  const used = Number(history.hintsUsed)
  return Number.isInteger(used) && used > 0 ? used : 0
}
