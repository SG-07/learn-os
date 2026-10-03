import supabase from '../config/supabase.js'
import { debugLog } from '../utils/debugLog.js'

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    debugLog('authMiddleware: rejected', { reason: 'missing or malformed Authorization header' })
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.split(' ')[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data?.user) {
    debugLog('authMiddleware: supabase.auth.getUser failed', { error: error?.message })
    return res.status(401).json({ error: 'Invalid or expired token' })
  }

  debugLog('authMiddleware: authenticated user', {
    id: data.user.id,
  })

  req.user = data.user
  next()
}

export default authMiddleware