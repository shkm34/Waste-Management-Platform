import express from 'express'
import { register, login, getMe } from '../controllers/authController'
import { protect } from '../middleware/authMiddleware'

const router = express.Router()

// public routes
router.post('/register', register)
router.post('/login', login)

// protected/private route, need authentication
router.get('/me', protect, getMe )

export default router