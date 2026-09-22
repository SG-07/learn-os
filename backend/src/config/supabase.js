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

export default supabase