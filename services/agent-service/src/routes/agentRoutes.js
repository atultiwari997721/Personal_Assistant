import express from 'express';
import {
  runAgentTask,
  exportPptx,
  exportPdf,
  getAgentList,
  testProviderConnection,
} from '../controllers/agentController.js';
import { getConfiguredProviders } from '../config/llm.js';
import { runPluginAction } from '../controllers/pluginController.js';

const router = express.Router();

router.get('/spec', getAgentList);
router.get('/providers', (_req, res) => res.json({ providers: getConfiguredProviders() }));
router.post('/providers/test', testProviderConnection);
router.post('/plugins/action', runPluginAction);
router.post('/execute', runAgentTask);
router.post('/export-pptx', exportPptx);
router.post('/export-pdf', exportPdf);

export default router;
