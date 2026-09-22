// backend/controllers/authController.js

import supabase from '../config/supabase.js'

// POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) return res.status(400).json({ error: error.message })

    res.status(201).json({
      message: 'Signup successful. Check your email to confirm your account.',
      user: data.user,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) return res.status(401).json({ error: error.message })

    res.json({
      user: data.user,
      session: data.session,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) return res.status(400).json({ error: error.message })
    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}


// GET /api/auth/google — Google OAuth
export const googleOAuth = async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.CLIENT_URL}/auth/callback`,
      },
    })

    if (error) return res.status(400).json({ error: error.message })

    res.redirect(data.url)
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, theme, tier, downgrade_used, created_at')
      .eq('id', req.user.id)
      .single()

    if (error || !data) {
      return res.status(404).json({ error: 'User profile not found' })
    }

    res.json({ user: data })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, theme } = req.body

    if (!name && !theme) {
      return res.status(400).json({ error: 'Provide name or theme to update' })
    }

    if (theme && !['DARK', 'LIGHT'].includes(theme)) {
      return res.status(400).json({ error: 'theme must be DARK or LIGHT' })
    }

    const updates = {}
    if (name) updates.name = name
    if (theme) updates.theme = theme

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, email, name, theme, tier, downgrade_used, created_at')
      .single()

    if (error) throw error

    res.json({ user: data })
  } catch (err) {
    next(err)
  }
}