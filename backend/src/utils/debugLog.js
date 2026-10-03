// backend/src/utils/debugLog.js

export const isDebug = process.env.NODE_ENV !== 'production'

const REDACTED = '[redacted]'

const SENSITIVE_KEYS = new Set([
  'password',
  'currentpassword',
  'newpassword',
  'access_token',
  'refresh_token',
  'session',
  'token',
  'authorization',
  'apikey',
  'api_key',
  'service_role',
  'servicerole',
  'supabase_service_role_key',
])

export function redactForLog(value, seen = new WeakSet()) {
  if (Array.isArray(value)) {
    return value.map((item) => redactForLog(item, seen))
  }
  if (!value || typeof value !== 'object') {
    return value
  }
  if (seen.has(value)) {
    return '[circular]'
  }
  seen.add(value)

  const out = {}
  for (const [key, child] of Object.entries(value)) {
    out[key] = SENSITIVE_KEYS.has(key.toLowerCase())
      ? REDACTED
      : redactForLog(child, seen)
  }
  return out
}

export function debugLog(label, data) {
  if (!isDebug) return
  console.log(`\n[DEBUG] ${label}`)
  console.dir(redactForLog(data), { depth: null, colors: true })
}
