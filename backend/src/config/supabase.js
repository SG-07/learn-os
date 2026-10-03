// backend/src/config/supabase.js

import { createClient } from '@supabase/supabase-js'
import ws from 'ws'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    realtime: {
      transport: ws,
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

function isolatedMemoryStorage() {
  const items = new Map()
  return {
    getItem(key) {
      return items.has(key) ? items.get(key) : null
    },
    setItem(key, value) {
      items.set(key, value)
    },
    removeItem(key) {
      items.delete(key)
    },
  }
}

let passwordAuthClient

export function getPasswordAuthClient() {
  if (!process.env.SUPABASE_ANON_KEY) {
    const error = new Error('SUPABASE_ANON_KEY is not configured')
    error.status = 500
    throw error
  }

  if (!passwordAuthClient) {
    passwordAuthClient = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
          storage: isolatedMemoryStorage(),
          storageKey: 'learn-os-password-auth',
        },
      }
    )
  }

  return passwordAuthClient
}

export default supabase