import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../../.env'), override: false });

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_cortex_ai_2026_dev';

export const verifyAuthAndSession = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  const demoAuthAllowed = process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_AUTH === 'true';
  // Demo identity is available only in explicitly enabled local development.
  if (!token || token === 'null' || token === 'undefined' || token === 'demo_active_token') {
    if (demoAuthAllowed) {
      req.user = { uid: 'demo-user-123', email: 'demo@cortexai.dev', name: 'Demo Architect', demo: true };
      return next();
    }
    return res.status(401).json({ success: false, code: 'AUTH_REQUIRED', message: 'Sign in before using this service.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Refresh Redis session asynchronously
    redisClient.set(
      `session:${decoded.uid}`,
      JSON.stringify({ uid: decoded.uid, email: decoded.email, lastActive: Date.now() }),
      'EX',
      7 * 24 * 60 * 60
    ).catch(() => {});

    return next();
  } catch (err) {
    if (demoAuthAllowed) {
      console.warn(`[Gateway Auth] Replacing invalid local development token (${err.name}).`);
      req.user = { uid: 'demo-user-123', email: 'demo@cortexai.dev', name: 'Demo Architect', demo: true };
      return next();
    }
    return res.status(401).json({ success: false, code: 'AUTH_INVALID', message: 'Your session is invalid or expired. Sign in again.' });
  }
};
