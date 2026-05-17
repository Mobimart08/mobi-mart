import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import bootstrapAdmin from './config/bootstrapAdmin.js'
import { validateEnv } from './config/env.js'
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })
validateEnv()

const app = express()

// 🔥 Middleware (ONLY ONCE)
app.use(express.json())
app.use(cors())

// 🔥 Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// 🔥 Static uploads

// 🔥 Routes
app.get('/', (req, res) => {
  res.send('API Running')
})

app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', authRoutes)

// 🔥 404 fallback
app.use('*', (req, res) => res.send('Route not found'))

const PORT = process.env.PORT || 5000

// 🔥 Start server ONLY HERE
const startServer = async () => {
  try {
    await connectDB()
    console.log("MongoDB Connected")
    await bootstrapAdmin()

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  } catch (error) {
    console.error(error)
  }
}

startServer()
