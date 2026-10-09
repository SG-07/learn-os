import supabase from '../config/supabase.js'

export async function listTopics() {
  const { data, error } = await supabase
    .from('topics')
    .select('id, title, tier, order_index')
    .order('order_index', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw error

  return data ?? []
}

export async function getTopicById(topicId) {
  const { data, error } = await supabase
    .from('topics')
    .select('id, title, tier')
    .eq('id', topicId)
    .maybeSingle()

  if (error) throw error

  return data
}

export async function countQuestionsByTopic() {
  const { data, error } = await supabase
    .from('problems')
    .select('topic_id')

  if (error) throw error

  const counts = {}
  for (const row of data ?? []) {
    counts[row.topic_id] = (counts[row.topic_id] || 0) + 1
  }
  return counts
}

export async function listQuestionsByTopic(topicId) {
  const { data, error } = await supabase
    .from('problems')
    .select('id, topic_id, title, prompt')
    .eq('topic_id', topicId)

  if (error) throw error

  return data ?? []
}
