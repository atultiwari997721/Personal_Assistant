import express from 'express';
import jwt from 'jsonwebtoken';
import {
  googleLogin,
  mockLogin,
  getMe,
  logout,
  deductCredit,
  addCredit,
} from '../controllers/authController.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_cortex_ai_2026_dev';

// Middleware to extract user from Authorization header
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

router.post('/google-login', googleLogin);
router.post('/mock-login', mockLogin);
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);

// Internal microservice endpoints
router.post('/deduct-credit', deductCredit);
router.post('/add-credit', addCredit);

export default router;
