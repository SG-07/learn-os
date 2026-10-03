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

export async function takeNextHint(userId, problemId, hints) {
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

  if (session?.id) {
    const { error } = await supabase
      .from('sessions')
      .update({
        conversation_history: nextHistory,
        last_active: new Date().toISOString(),
      })
      .eq('id', session.id)

    if (error) throw error
  } else {
    const { error } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        problem_id: problemId,
        conversation_history: nextHistory,
        last_active: new Date().toISOString(),
      })

    if (error) throw error
  }

  return {
    hint: { level: hint.level, text: hint.text },
    hintsUsed: nextUsed,
    remaining: hints.length - nextUsed,
  }
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
