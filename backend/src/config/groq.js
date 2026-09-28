// backend/src/config/groq.js

import 'dotenv/config'

const GROQ_BASE_URL = process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'
// Note: the .env comment says the Groq key is stored under ANTHROPIC_API_KEY for now.
const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY

export async function chatCompletion(messages, { json = false, temperature = 0.3 } = {}) {
  if (!GROQ_API_KEY) {
    const err = new Error('Groq API key is not configured (set GROQ_API_KEY in backend/.env)')
    err.status = 500
    throw err
  }

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
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
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    const err = new Error(`Groq API request failed (${response.status})`)
    err.status = 502
    err.detail = detail
    throw err
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content

  if (!content) {
    const err = new Error('Groq API returned an empty response')
    err.status = 502
    throw err
  }

  return json ? JSON.parse(content) : content
}
