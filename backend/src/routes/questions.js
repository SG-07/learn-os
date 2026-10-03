import { Router } from 'express'
import { executeQuestion, getQuestionById, getQuestionHint, getQuestionSession } from '../controllers/questionsController.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()

router.get('/:questionId', authMiddleware, getQuestionById)
router.get('/:questionId/session', authMiddleware, getQuestionSession)
router.post('/:questionId/execute', authMiddleware, executeQuestion)
router.post('/:questionId/hint', authMiddleware, getQuestionHint)

export default router
