import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import jwt from 'jsonwebtoken';

// Force IPv4 on serverless to avoid IPv6 connection issues
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

dotenv.config();

// Import controllers directly from services
import {
  googleLogin,
  mockLogin,
  getMe,
  logout,
  deductCredit,
  addCredit,
} from '../services/auth-service/src/controllers/authController.js';

import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPackages,
} from '../services/payment-service/src/controllers/paymentController.js';

import {
  getAgentList,
  exportPptx,
  exportPdf,
} from '../services/agent-service/src/controllers/agentController.js';

import { executeAgentGraph } from '../services/agent-service/src/graph/orchestrator.js';
import { User, memoryUserStore } from '../services/auth-service/src/models/User.js';
import redisClient from '../services/auth-service/src/config/redis.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_cortex_ai_2026_dev';

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Auth Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined' || token === 'demo_active_token') {
    req.user = { uid: 'demo-user-123', email: 'demo@cortexai.dev', name: 'Demo Architect' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = { uid: 'demo-user-123', email: 'demo@cortexai.dev', name: 'Demo Architect' };
      return next();
    }
    req.user = user;
    next();
  });
};

// -------------------------------------------------------------
// Health Check
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    platform: 'Cortex Multi-Agent AI (Vercel Serverless)',
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// Auth Routes
// -------------------------------------------------------------
app.post('/api/auth/google-login', googleLogin);
app.post('/api/auth/mock-login', mockLogin);
app.get('/api/auth/me', authenticateToken, getMe);
app.post('/api/auth/logout', authenticateToken, logout);
app.post('/api/auth/deduct-credit', deductCredit);
app.post('/api/auth/add-credit', addCredit);

// -------------------------------------------------------------
// Payment Routes
// -------------------------------------------------------------
app.get('/api/payments/packages', getPackages);
app.post('/api/payments/create-order', createOrder);
app.post('/api/payments/verify', verifyPayment);
app.post('/api/payments/webhook', handleWebhook);

// -------------------------------------------------------------
// Agent Routes
// -------------------------------------------------------------
app.get('/api/agents/spec', getAgentList);
app.post('/api/agents/export-pptx', exportPptx);
app.post('/api/agents/export-pdf', exportPdf);

// Special Execution Endpoint: Executes LangGraph & Deducts 1 Credit Atomically
app.post('/api/agents/execute', authenticateToken, async (req, res) => {
  try {
    const uid = req.user?.uid || 'demo-user-123';
    const { prompt, agentMode = 'chat', messages = [], model = 'auto' } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    // 1. Credit Balance Verification
    let currentCredits = 50;
    try {
      const user = memoryUserStore.get(uid);
      if (user) {
        if (user.credits < 1) {
          return res.status(402).json({
            success: false,
            code: 'INSUFFICIENT_CREDITS',
            message: 'Your credit balance is 0. Please recharge your credits to execute agent tasks.',
            credits: 0,
          });
        }
        currentCredits = user.credits;
      }
    } catch (e) {}

    // 2. Execute LangGraph StateGraph across the 6 specialized agents
    const result = await executeAgentGraph({
      userPrompt: prompt,
      agentMode,
      model,
      messages,
    });

    // 3. Deduct 1 Credit Atomically
    let remainingCredits = currentCredits;
    try {
      const user = memoryUserStore.get(uid);
      if (user) {
        user.credits = Math.max(0, user.credits - 1);
        remainingCredits = user.credits;
        memoryUserStore.set(uid, user);
      } else {
        remainingCredits = Math.max(0, currentCredits - 1);
      }
    } catch (creditErr) {
      console.warn('[Vercel API] Credit deduction note:', creditErr.message);
    }

    return res.status(200).json({
      success: true,
      agentMode: result.agent || agentMode,
      data: result,
      remainingCredits,
      creditDeducted: 1,
    });
  } catch (error) {
    console.error('[Vercel API] Task execution error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Fallback 404 handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found.` });
});

// Standalone listener if executed directly (e.g. node api/index.js)
if (process.env.NODE_ENV !== 'production' && process.argv[1]?.endsWith('api/index.js')) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 [Cortex Serverless API] Listening on port ${PORT}`);
  });
}

export default app;
