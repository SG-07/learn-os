import { Router } from 'express'
import { getQuestionsByTopic, getTopics } from '../controllers/topicsController.js'
import authMiddleware from '../middleware/auth.js'

const router = Router()

router.get('/', authMiddleware, getTopics)
router.get('/:topicId/questions', authMiddleware, getQuestionsByTopic)

export default router
