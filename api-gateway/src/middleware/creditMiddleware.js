import axios from 'axios';
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_cortex_ai_2026_dev';

export const checkCreditBalance = async (req, res, next) => {
  const uid = req.user?.uid || 'demo-user-123';

  try {
    // 1. Fast cache check in Redis
    const cachedCredits = await redisClient.get(`credits:${uid}`);
    if (cachedCredits !== null) {
      const creditNum = parseInt(cachedCredits, 10);
      if (creditNum <= 0) {
        return res.status(402).json({
          success: false,
          code: 'INSUFFICIENT_CREDITS',
          message: 'Your credit balance is 0. Please recharge your credits to execute agent tasks.',
          credits: 0,
        });
      }
      req.cachedCredits = creditNum;
      return next();
    }

    // 2. Query Auth Service
    let authHeader = req.headers['authorization'];
    if (!authHeader || authHeader.includes('undefined') || authHeader.includes('null')) {
      const internalToken = jwt.sign({ uid, email: req.user?.email || 'demo@cortexai.dev', name: 'Demo' }, JWT_SECRET);
      authHeader = `Bearer ${internalToken}`;
    }

    const authRes = await axios.get(`${AUTH_SERVICE_URL}/api/auth/me`, {
      headers: { Authorization: authHeader },
      timeout: 5000,
    });

    const user = authRes.data.user;
    if (user && user.credits < 1) {
      return res.status(402).json({
        success: false,
        code: 'INSUFFICIENT_CREDITS',
        message: 'Your credit balance is 0. Please recharge your credits to execute agent tasks.',
        credits: 0,
      });
    }

    if (user && user.credits) {
      await redisClient.set(`credits:${uid}`, user.credits.toString(), 'EX', 3600);
    }
    next();
  } catch (err) {
    console.warn('[Credit Middleware] Soft credit check bypassed:', err.message);
    next();
  }
};

export const deductCreditPostExecution = async (uid, amount = 1) => {
  try {
    const res = await axios.post(`${AUTH_SERVICE_URL}/api/auth/deduct-credit`, {
      uid,
      amount,
    });
    return res.data.remainingCredits;
  } catch (err) {
    console.error('[Credit Middleware] Failed to deduct credit:', err.message);
    return null;
  }
};
