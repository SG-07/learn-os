// backend/routes/auth.js

import { Router } from 'express'
import { signup, login, logout, getMe, googleOAuth, updateProfile } from '../controllers/authController.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/google', googleOAuth)
router.get('/me', authMiddleware, getMe)
router.patch('/profile', authMiddleware, updateProfile)

export default router