import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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
  testProviderConnection,
  listProviderModels,
  exportPptx,
  exportPdf,
} from '../services/agent-service/src/controllers/agentController.js';
import { getConfiguredProviders } from '../services/agent-service/src/config/llm.js';
import { runPluginAction, testPluginConnection } from '../services/agent-service/src/controllers/pluginController.js';

import { executeAgentGraph } from '../services/agent-service/src/graph/orchestrator.js';
import { User, memoryUserStore } from '../services/auth-service/src/models/User.js';
import redisClient from '../services/auth-service/src/config/redis.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const demoAuthAllowed = process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEMO_AUTH === 'true';

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('Set JWT_SECRET to at least 32 characters before serving the Vercel API.');
}

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Auth Token Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'null' || token === 'undefined' || token === 'demo_active_token') {
    if (demoAuthAllowed) {
      req.user = { uid: 'demo-user-123', email: 'demo@cortexai.dev', name: 'Demo Architect', demo: true };
      return next();
    }
    return res.status(401).json({ success: false, code: 'AUTH_REQUIRED', message: 'Sign in before using this service.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (demoAuthAllowed) {
        req.user = { uid: 'demo-user-123', email: 'demo@cortexai.dev', name: 'Demo Architect', demo: true };
        return next();
      }
      return res.status(401).json({ success: false, code: 'AUTH_INVALID', message: 'Your session is invalid or expired. Sign in again.' });
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
app.get('/api/agents/providers', authenticateToken, (_req, res) => res.json({ providers: getConfiguredProviders() }));
app.post('/api/agents/providers/test', authenticateToken, testProviderConnection);
app.post('/api/agents/providers/models', authenticateToken, listProviderModels);
app.post('/api/agents/plugins/test', authenticateToken, testPluginConnection);
app.post('/api/agents/plugins/action', authenticateToken, runPluginAction);
app.post('/api/agents/export-pptx', authenticateToken, exportPptx);
app.post('/api/agents/export-pdf', authenticateToken, exportPdf);

// Special Execution Endpoint: Executes LangGraph & Deducts 1 Credit Atomically
app.post('/api/agents/execute', authenticateToken, async (req, res) => {
  try {
    const uid = req.user?.uid;
    const { prompt, agentMode = 'chat', messages = [], model = 'auto', providerConfig, imageProviderConfig, connectedPlugins = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    // 1. Credit Balance Verification
    const user = mongoose.connection.readyState === 1
      ? await User.findOne({ uid }).lean()
      : memoryUserStore.get(uid);
    if (!user) return res.status(401).json({ success: false, code: 'AUTH_USER_NOT_FOUND', message: 'Your account session is not available. Sign in again.' });
    if (user.credits < 1) {
      return res.status(402).json({ success: false, code: 'INSUFFICIENT_CREDITS', message: 'Your credit balance is 0. Please recharge your credits to execute agent tasks.', credits: 0 });
    }

    // 2. Execute LangGraph StateGraph across the 6 specialized agents
    const result = await executeAgentGraph({
      userPrompt: prompt,
      agentMode,
      model,
      messages,
      providerConfig,
      imageProviderConfig,
      connectedPlugins,
    });

    // 3. Deduct 1 Credit Atomically
    let remainingCredits;
    if (mongoose.connection.readyState === 1) {
      const updated = await User.findOneAndUpdate({ uid, credits: { $gte: 1 } }, { $inc: { credits: -1 } }, { new: true }).lean();
      if (!updated) return res.status(402).json({ success: false, code: 'INSUFFICIENT_CREDITS', message: 'Credit balance changed before task completion. Please check your balance.' });
      remainingCredits = updated.credits;
    } else {
      const memoryUser = memoryUserStore.get(uid);
      if (!memoryUser || memoryUser.credits < 1) return res.status(402).json({ success: false, code: 'INSUFFICIENT_CREDITS', message: 'Credit balance changed before task completion. Please check your balance.' });
      memoryUser.credits -= 1;
      memoryUserStore.set(uid, memoryUser);
      remainingCredits = memoryUser.credits;
    }

    return res.status(200).json({
      success: true,
      agentMode: result.agent || agentMode,
      data: result,
      remainingCredits,
      creditDeducted: 1,
    });
  } catch (error) {
    console.error('[Vercel API] Task execution error:', { code: error.code, message: error.message });
    const status = error.status === 429 ? 429 : error.status === 401 || error.status === 403 ? 502 : 500;
    return res.status(status).json({ success: false, code: error.code || 'AGENT_EXECUTION_FAILED', provider: error.provider, message: error.message || 'Agent execution failed.' });
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
