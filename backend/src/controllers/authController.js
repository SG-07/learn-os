// backend/controllers/authController.js

import supabase, { getPasswordAuthClient } from '../config/supabase.js'

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

    const { data, error } = await getPasswordAuthClient().auth.signInWithPassword({ email, password })

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

// POST /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'currentPassword and newPassword are required' })
    }

    const { error: verifyError } = await getPasswordAuthClient().auth.signInWithPassword({
      email: req.user.email,
      password: currentPassword,
    })

    if (verifyError) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const { error } = await supabase.auth.admin.updateUserById(req.user.id, {
      password: newPassword,
    })

    if (error) return res.status(400).json({ error: error.message })

    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/admin/change-password
export const adminChangePassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'email and newPassword are required' })
    }

    const { data, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 })

    if (listError) return res.status(400).json({ error: listError.message })

    const targetUser = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { error } = await supabase.auth.admin.updateUserById(targetUser.id, {
      password: newPassword,
    })

    if (error) return res.status(400).json({ error: error.message })

    res.json({ message: 'User password updated successfully' })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/users
export const listUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 15
    const search = (req.query.search || '').toLowerCase()

    const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })

    if (error) return res.status(400).json({ error: error.message })

    const filtered = search
      ? data.users.filter((u) => u.email?.toLowerCase().includes(search))
      : data.users

    const total = filtered.length
    const start = (page - 1) * limit
    const users = filtered.slice(start, start + limit)

    res.json({ users, total })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/users/:id
export const getUserDetails = async (req, res, next) => {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(req.params.id)

    if (error || !data?.user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(data.user)
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