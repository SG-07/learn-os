// backend/src/routes/ai.js

import { Router } from 'express'
import { getAnswer, getGuidance, getSimilarQuestion } from '../controllers/aiController.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()

router.post('/answer', authMiddleware, getAnswer)
router.post('/teach', authMiddleware, getGuidance)
router.post('/similar', authMiddleware, getSimilarQuestion)

export default router
