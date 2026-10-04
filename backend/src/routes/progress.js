import { Router } from 'express'
import authMiddleware from '../middleware/auth.js'
import { listProgress } from '../services/progressService.js'

const router = Router()

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const rows = await listProgress(req.user.id)
    res.status(200).json({
      progress: rows.map((row) => ({
        id: row.id,
        topicId: row.topic_id,
        topicName: row.topics?.title || null,
        difficulty: row.topics?.tier || null,
        completed: Boolean(row.completed),
        problemsSolved: row.problems_solved || 0,
      })),
    })
  } catch (err) {
    next(err)
  }
})

export default router
