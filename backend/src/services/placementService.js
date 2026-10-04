import supabase from '../config/supabase.js'

export async function getLatestPlacement(userId) {
  const { data, error } = await supabase
    .from('placement_results')
    .select('id, score, assigned_tier, taken_at')
    .eq('user_id', userId)
    .order('taken_at', { ascending: false })
    .limit(1)

  if (error) throw error
  return data?.[0] || null
}
