// frontend/src/api/debugLog.js

export const isDebug = import.meta.env.DEV;

// Decodes a JWT's header/payload WITHOUT verifying the signature.
// Only used for debug logging — never trust this for auth decisions.
export function decodeJwtStructure(token) {
  try {
    const [headerB64, payloadB64] = token.split(".");
    if (!headerB64 || !payloadB64) return null;

    const decode = (b64) =>
      JSON.parse(decodeURIComponent(escape(atob(b64.replace(/-/g, "+").replace(/_/g, "/")))));

    return { header: decode(headerB64), payload: decode(payloadB64) };
  } catch {
    return null;
  }
}

export function debugLog(label, data) {
  if (!isDebug) return;
  console.log(`%c[DEBUG] ${label}`, "color:#8b5cf6;font-weight:bold", data);
}
