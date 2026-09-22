import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import queryRoutes from './routes/query.js'
import aiRoutes from './routes/ai.js'
import curriculumRoutes from './routes/curriculum.js'
import progressRoutes from './routes/progress.js'
import placementRoutes from './routes/placement.js'
import errorHandler from './src/middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/query', queryRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/curriculum', curriculumRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/placement', placementRoutes)

// Error handler — must be last
app.use(errorHandler)

app.listen(PORT, () => {
  console.log("SQL Coach backend no working");
})