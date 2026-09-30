import express from 'express';
import {
  runAgentTask,
  exportPptx,
  exportPdf,
  getAgentList,
} from '../controllers/agentController.js';
import { getConfiguredProviders } from '../config/llm.js';

const router = express.Router();

router.get('/spec', getAgentList);
router.get('/providers', (_req, res) => res.json({ providers: getConfiguredProviders() }));
router.post('/execute', runAgentTask);
router.post('/export-pptx', exportPptx);
router.post('/export-pdf', exportPdf);

export default router;
