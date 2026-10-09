import supabase from '../config/supabase.js'

const PUBLIC_COLUMNS = 'id, topic_id, prompt, title, hints, dataset_schema, topics(id, title, tier)'
const PRACTICE_COLUMNS = 'id, topic_id, prompt, title, hints, dataset_schema, expected_result, correct_sql, topics(id, title, tier)'

export async function getQuestionById(questionId) {
  return fetchProblem(questionId, PUBLIC_COLUMNS)
}

export async function getPracticeProblem(questionId) {
  return fetchProblem(questionId, PRACTICE_COLUMNS)
}

async function fetchProblem(questionId, columns) {
  const { data, error } = await supabase
    .from('problems')
    .select(columns)
    .eq('id', questionId)
    .maybeSingle()

  if (error) throw error
  return data
}
