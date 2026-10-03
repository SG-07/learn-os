import { Router } from 'express'
import authMiddleware from '../middleware/auth.js'
import { getLatestPlacement } from '../services/placementService.js'

const router = Router()

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const placement = await getLatestPlacement(req.user.id)
    res.status(200).json({
      placement: placement
        ? {
            id: placement.id,
            score: placement.score,
            assignedTier: placement.assigned_tier,
            takenAt: placement.taken_at,
          }
        : null,
    })
  } catch (err) {
    next(err)
  }
})

export default router
