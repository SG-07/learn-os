import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './src/routes/auth.js'
import aiRoutes from './src/routes/ai.js'
import topicsRouter from './src/routes/topics.js'
import questionsRouter from './src/routes/questions.js'
import progressRouter from './src/routes/progress.js'
import placementRouter from './src/routes/placement.js'
// import queryRoutes from './src/routes/query.js'
// import curriculumRoutes from './src/routes/curriculum.js'
// import progressRoutes from './src/routes/progress.js'
// import placementRoutes from './src/routes/placement.js'
import errorHandler from './src/middleware/errorHandler.js'
import { getLandingPageHtml } from './view/landingPage.js'
import { isDebug, debugLog } from './src/utils/debugLog.js'

const SENSITIVE_BODY_PATHS = new Set([
  '/api/auth/signup',
  '/api/auth/login',
  '/api/auth/change-password',
  '/api/auth/admin/change-password',
])

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

if (isDebug) {
  app.use((req, res, next) => {
    const headers = { ...req.headers }
    if (headers.authorization) {
      headers.authorization = 'Bearer [redacted]'
    }
    if (headers.cookie) {
      headers.cookie = '[redacted]'
    }

    const path = req.originalUrl.split('?')[0]
    debugLog(`--> ${req.method} ${req.originalUrl}`, {
      headers,
      body: SENSITIVE_BODY_PATHS.has(path) ? '[redacted]' : req.body,
      hasBearerToken: Boolean(req.headers.authorization?.startsWith('Bearer ')),
    })

    const originalJson = res.json.bind(res)
    res.json = (body) => {
      debugLog(`<-- ${req.method} ${req.originalUrl} [${res.statusCode}]`, body)
      return originalJson(body)
    }

    next()
  })
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Landing page — redirects to frontend
app.get('/', (req, res) => {
  res.send(getLandingPageHtml(process.env.FRONTEND_URL))
})


app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/topics', topicsRouter)
app.use('/api/questions', questionsRouter)
app.use('/api/progress', progressRouter)
app.use('/api/placement', placementRouter)
// app.use('/api/query', queryRoutes)
// app.use('/api/curriculum', curriculumRoutes)
// app.use('/api/progress', progressRoutes)
// app.use('/api/placement', placementRoutes)



app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`SQL Coach backend running on http://localhost:${PORT}`)
})