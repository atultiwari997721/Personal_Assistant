import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}
import agentRoutes from './routes/agentRoutes.js';
import { buildOrchestratorGraph } from './graph/orchestrator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8003;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'agent-service', status: 'healthy', timestamp: new Date() });
});

// Routes
app.use('/api/agents', agentRoutes);

// Pre-compile LangGraph state machine on boot
try {
  buildOrchestratorGraph();
} catch (e) {
  console.warn('[Agent Service] Graph warm-up warning:', e.message);
}

app.listen(PORT, () => {
  console.log(`🤖 [Agent Orchestrator Service] Running on port ${PORT}`);
});
