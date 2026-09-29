// backend/src/middleware/requireAdmin.js

const requireAdmin = (req, res, next) => {
  const role = req.user?.app_metadata?.role

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' })
  }

  next()
}

export default requireAdmin
