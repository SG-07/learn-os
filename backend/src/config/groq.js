// backend/src/config/groq.js

import 'dotenv/config'

const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'
// Note: the .env comment says the Groq key is stored under ANTHROPIC_API_KEY for now.
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY

const GROQ_TIMEOUT_MS = 20000

export async function chatCompletion(messages, { json = false, temperature = 0.3 } = {}) {
  if (!GROQ_API_KEY) {
    const err = new Error('Groq API key is not configured (set GROQ_API_KEY in backend/.env)')
    err.status = 500
    throw err
  }

  let response
  try {
    response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature,
        ...(json && { response_format: { type: 'json_object' } }),
      }),
      signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
    })
  } catch (err) {
    const timeout = err?.name === 'TimeoutError' || err?.name === 'AbortError'
    const failure = new Error(timeout ? 'Groq request timed out' : 'Groq API request failed')
    failure.status = timeout ? 504 : 502
    throw failure
  }

  if (!response.ok) {
    await response.text().catch(() => '')
    const err = new Error(response.status === 429
      ? 'Groq rate limit reached'
      : `Groq API request failed (${response.status})`)
    err.status = response.status === 429 ? 429 : 502
    throw err
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content

  if (!content) {
    const err = new Error('Groq API returned an empty response')
    err.status = 502
    throw err
  }

  if (!json) return content

  try {
    return JSON.parse(content)
  } catch {
    const err = new Error('Groq API returned malformed JSON')
    err.status = 502
    throw err
  }
}
