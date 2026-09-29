// backend/src/utils/debugLog.js

export const isDebug = process.env.NODE_ENV !== 'production'

// Decodes a JWT's header/payload WITHOUT verifying the signature.
// Only used for debug logging — never trust this for auth decisions.
export function decodeJwtStructure(token) {
  try {
    const [headerB64, payloadB64] = token.split('.')
    if (!headerB64 || !payloadB64) return null

    const decode = (b64) =>
      JSON.parse(Buffer.from(b64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'))

    return { header: decode(headerB64), payload: decode(payloadB64) }
  } catch {
    return null
  }
}

export function debugLog(label, data) {
  if (!isDebug) return
  console.log(`\n[DEBUG] ${label}`)
  console.dir(data, { depth: null, colors: true })
}
