import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './src/routes/auth.js'
// import queryRoutes from './src/routes/query.js'
// import aiRoutes from './src/routes/ai.js'
// import curriculumRoutes from './src/routes/curriculum.js'
// import progressRoutes from './src/routes/progress.js'
// import placementRoutes from './src/routes/placement.js'
import errorHandler from './src/middleware/errorHandler.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
// app.use('/api/query', queryRoutes)
// app.use('/api/ai', aiRoutes)
// app.use('/api/curriculum', curriculumRoutes)
// app.use('/api/progress', progressRoutes)
// app.use('/api/placement', placementRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`SQL Coach backend running on http://localhost:${PORT}`)
})