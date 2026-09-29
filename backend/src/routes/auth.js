// backend/routes/auth.js

import { Router } from 'express'
import {
  signup,
  login,
  logout,
  getMe,
  googleOAuth,
  updateProfile,
  changePassword,
  adminChangePassword,
  listUsers,
  getUserDetails,
} from '../controllers/authController.js'
import authMiddleware from '../middleware/auth.js'
import requireAdmin from '../middleware/requireAdmin.js'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.get('/google', googleOAuth)
router.get('/me', authMiddleware, getMe)
router.patch('/profile', authMiddleware, updateProfile)
router.post('/change-password', authMiddleware, changePassword)
router.post('/admin/change-password', authMiddleware, requireAdmin, adminChangePassword)
router.get('/users', authMiddleware, requireAdmin, listUsers)
router.get('/users/:id', authMiddleware, requireAdmin, getUserDetails)

export default router