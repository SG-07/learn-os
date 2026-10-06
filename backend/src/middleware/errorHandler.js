const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const safeMessage = String(err.message || 'Internal server error')
    .replace(/postgres(?:ql)?:\/\/\S+/gi, '[redacted]')
    .replace(/\b(gsk_|sk-|eyJ)[A-Za-z0-9._-]+/g, '[redacted]')
    .replace(/Bearer\s+\S+/gi, 'Bearer [redacted]')
  console.error(`[Error] ${req.method} ${req.path}:`, safeMessage)

  const message = status >= 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : safeMessage

  res.status(status).json({ error: message })
}

export default errorHandler