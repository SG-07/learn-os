import supabase from '../config/supabase.js'

export async function listProgress(userId) {
  const { data, error } = await supabase
    .from('user_topic_progress')
    .select('id, topic_id, completed, problems_solved, topics(id, title, tier)')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

export async function recordTopicSolve(userId, topicId) {
  const { count: topicProblems, error: topicError } = await supabase
    .from('problems')
    .select('id', { count: 'exact', head: true })
    .eq('topic_id', topicId)

  if (topicError) throw topicError

  const problemsSolved = await countDistinctSolved(userId, topicId)
  const completed = topicProblems > 0 && problemsSolved >= topicProblems
  const existing = await findProgress(userId, topicId)

  if (existing) {
    const { error } = await supabase
      .from('user_topic_progress')
      .update({
        problems_solved: problemsSolved,
        completed,
      })
      .eq('id', existing.id)

    if (error) throw error
    return { problemsSolved, completed }
  }

  const { error } = await supabase
    .from('user_topic_progress')
    .insert({
      user_id: userId,
      topic_id: topicId,
      problems_solved: problemsSolved,
      completed,
    })

  if (error) throw error
  return { problemsSolved, completed }
}

async function countDistinctSolved(userId, topicId) {
  const { data: problems, error: problemError } = await supabase
    .from('problems')
    .select('id')
    .eq('topic_id', topicId)

  if (problemError) throw problemError

  const problemIds = (problems || []).map((problem) => problem.id)
  if (problemIds.length === 0) {
    return 0
  }

  const { data, error } = await supabase
    .from('attempts')
    .select('problem_id')
    .eq('user_id', userId)
    .eq('is_correct', true)
    .in('problem_id', problemIds)

  if (error) throw error
  return new Set((data || []).map((row) => row.problem_id)).size
}

async function findProgress(userId, topicId) {
  const { data, error } = await supabase
    .from('user_topic_progress')
    .select('id, problems_solved, completed')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .limit(1)

  if (error) throw error
  return data?.[0] || null
}
