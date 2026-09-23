import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, memoryUserStore } from '../models/User.js';
import redisClient from '../config/redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_cortex_ai_2026_dev';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Helper to find or create user across MongoDB / Memory
const findOrCreateUser = async ({ uid, name, email, avatarUrl }) => {
  if (isMongoConnected()) {
    let user = await User.findOne({ $or: [{ uid }, { email }] });
    if (!user) {
      user = await User.create({
        uid,
        name: name || 'AI Innovator',
        email,
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
        credits: 20,
      });
    }
    return user.toObject();
  }

  // Memory fallback
  let user = memoryUserStore.get(uid);
  if (!user) {
    user = {
      uid,
      name: name || 'AI Innovator',
      email: email || `${uid}@demo.local`,
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
      credits: 20,
      createdAt: new Date(),
    };
    memoryUserStore.set(uid, user);
  }
  return user;
};

// POST /api/auth/google-login
export const googleLogin = async (req, res) => {
  try {
    const { idToken, user: clientUser } = req.body;
    let uid, email, name, avatarUrl;

    if (clientUser && clientUser.uid) {
      uid = clientUser.uid;
      email = clientUser.email || `${uid}@cortex.ai`;
      name = clientUser.displayName || clientUser.name || 'AI User';
      avatarUrl = clientUser.photoURL || clientUser.avatarUrl;
    } else if (idToken) {
      // In production with Firebase Admin SDK, verifyIdToken(idToken)
      uid = 'usr_' + Buffer.from(idToken).toString('hex').slice(0, 12);
      email = `${uid}@cortex.ai`;
      name = 'Cloud Developer';
    } else {
      return res.status(400).json({ success: false, message: 'Missing user authentication payload.' });
    }

    const user = await findOrCreateUser({ uid, name, email, avatarUrl });

    // Issue JWT
    const token = jwt.sign(
      { uid: user.uid, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Save session in Redis
    const sessionData = JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.name,
      lastLogin: new Date().toISOString(),
    });
    await redisClient.set(`session:${user.uid}`, sessionData, 'EX', 7 * 24 * 60 * 60);

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error('[Auth Service] Google login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/mock-login (Quick 1-click test login for development/demo)
export const mockLogin = async (req, res) => {
  try {
    const { uid = 'demo-user-123', name = 'Demo Architect', email = 'demo@cortexai.dev' } = req.body || {};
    const user = await findOrCreateUser({
      uid,
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
    });

    const token = jwt.sign(
      { uid: user.uid, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    await redisClient.set(
      `session:${user.uid}`,
      JSON.stringify({ uid: user.uid, email: user.email, name: user.name, loggedInAt: Date.now() }),
      'EX',
      7 * 24 * 60 * 60
    );

    return res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ uid }).lean();
    } else {
      user = memoryUserStore.get(uid);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/deduct-credit (Internal endpoint called by API Gateway)
export const deductCredit = async (req, res) => {
  try {
    const { uid, amount = 1 } = req.body;
    if (!uid) {
      return res.status(400).json({ success: false, message: 'User UID required' });
    }

    let updatedCredits = 0;
    if (isMongoConnected()) {
      const user = await User.findOneAndUpdate(
        { uid, credits: { $gte: amount } },
        { $inc: { credits: -amount } },
        { new: true }
      );
      if (!user) {
        return res.status(402).json({
          success: false,
          code: 'INSUFFICIENT_CREDITS',
          message: 'Insufficient credit balance. Please recharge.',
        });
      }
      updatedCredits = user.credits;
    } else {
      const user = memoryUserStore.get(uid);
      if (!user || user.credits < amount) {
        return res.status(402).json({
          success: false,
          code: 'INSUFFICIENT_CREDITS',
          message: 'Insufficient credit balance. Please recharge.',
        });
      }
      user.credits -= amount;
      memoryUserStore.set(uid, user);
      updatedCredits = user.credits;
    }

    // Invalidate or update cached user in Redis
    await redisClient.set(`credits:${uid}`, updatedCredits.toString(), 'EX', 3600);

    return res.status(200).json({
      success: true,
      remainingCredits: updatedCredits,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/add-credit (Internal endpoint called by Payment Service)
export const addCredit = async (req, res) => {
  try {
    const { uid, amount } = req.body;
    if (!uid || !amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid UID and amount required' });
    }

    let updatedCredits = 0;
    if (isMongoConnected()) {
      const user = await User.findOneAndUpdate(
        { uid },
        { $inc: { credits: amount } },
        { new: true, upsert: true }
      );
      updatedCredits = user.credits;
    } else {
      let user = memoryUserStore.get(uid);
      if (!user) {
        user = { uid, name: 'User', email: `${uid}@cortex.ai`, credits: 0 };
      }
      user.credits += amount;
      memoryUserStore.set(uid, user);
      updatedCredits = user.credits;
    }

    await redisClient.set(`credits:${uid}`, updatedCredits.toString(), 'EX', 3600);

    return res.status(200).json({
      success: true,
      credits: updatedCredits,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (uid) {
      await redisClient.del(`session:${uid}`);
    }
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
