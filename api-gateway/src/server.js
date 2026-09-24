import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { globalRateLimiter, agentTaskLimiter } from './middleware/rateLimiter.js';
import { verifyAuthAndSession } from './middleware/authMiddleware.js';
import { checkCreditBalance, deductCreditPostExecution } from './middleware/creditMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:8002';
const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:8003';

// 1. Global Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(globalRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    service: 'api-gateway',
    status: 'healthy',
    timestamp: new Date(),
    backends: {
      auth: AUTH_SERVICE_URL,
      payment: PAYMENT_SERVICE_URL,
      agent: AGENT_SERVICE_URL,
    },
  });
});

// 2. Auth Service Proxy (Public login & protected /me, etc.)
app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

// 3. Payment Service Proxy (Orders, webhooks, packages)
app.use(
  '/api/payments',
  createProxyMiddleware({
    target: PAYMENT_SERVICE_URL,
    changeOrigin: true,
  })
);

// 4. Special Agent Task Interceptor Route with Credit Balance Enforcement & Deduction
// Need body parser for intercepted execution
app.post(
  '/api/agents/execute',
  express.json({ limit: '10mb' }),
  agentTaskLimiter,
  verifyAuthAndSession,
  checkCreditBalance,
  async (req, res) => {
    try {
      const uid = req.user?.uid;
      const { prompt, agentMode, messages, model = 'auto' } = req.body;

      // Forward task execution to Agent Service
      const agentRes = await axios.post(`${AGENT_SERVICE_URL}/api/agents/execute`, {
        prompt,
        agentMode,
        messages,
        model,
      });

      // Task succeeded! Deduct 1 credit atomically
      let remainingCredits = null;
      if (uid) {
        remainingCredits = await deductCreditPostExecution(uid, 1);
      }

      return res.status(200).json({
        ...agentRes.data,
        remainingCredits,
        creditDeducted: 1,
      });
    } catch (err) {
      console.error('[API Gateway] Agent execute error:', err.response?.data || err.message);
      const status = err.response?.status || 500;
      return res.status(status).json(err.response?.data || { success: false, message: err.message });
    }
  }
);

// 5. Agent Service Binary & Spec Proxies (Export PPTX, PDF, Specs)
app.use(
  '/api/agents',
  verifyAuthAndSession,
  createProxyMiddleware({
    target: AGENT_SERVICE_URL,
    changeOrigin: true,
  })
);

// Fallback 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Resource route not found on API Gateway.' });
});

app.listen(PORT, () => {
  console.log(`🌐 [API Gateway] Central Proxy listening on port ${PORT}`);
  console.log(`   - Auth Service:    ${AUTH_SERVICE_URL}`);
  console.log(`   - Payment Service: ${PAYMENT_SERVICE_URL}`);
  console.log(`   - Agent Service:   ${AGENT_SERVICE_URL}`);
});
