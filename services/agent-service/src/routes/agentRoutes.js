import express from 'express';
import axios from 'axios';
import {
  runAgentTask,
  exportPptx,
  exportPdf,
  getAgentList,
  testProviderConnection,
  listProviderModels,
} from '../controllers/agentController.js';
import { getConfiguredProviders } from '../config/llm.js';
import { runPluginAction, testPluginConnection } from '../controllers/pluginController.js';

const router = express.Router();

router.get('/spec', getAgentList);
router.get('/providers', async (_req, res) => {
  const providers = getConfiguredProviders();
  const ollama = providers.find((provider) => provider.id === 'ollama');
  if (ollama?.configured) {
    let baseURL = (process.env.OLLAMA_URL || 'http://127.0.0.1:11434').trim().replace(/\/$/, '');
    if (!baseURL.endsWith('/v1')) baseURL += '/v1';
    try {
      const response = await axios.get(`${baseURL}/models`, { timeout: 1200 });
      const models = response.data?.data || response.data?.models || [];
      const modelAvailable = models.some((item) => (typeof item === 'string' ? item : item?.id || item?.name) === ollama.model);
      if (!modelAvailable) {
        ollama.configured = false;
        ollama.status = models.length ? 'model_unavailable' : 'no_models_installed';
      }
    } catch {
      ollama.configured = false;
      ollama.status = 'server_unreachable';
    }
  }
  return res.json({ providers });
});
router.post('/providers/test', testProviderConnection);
router.post('/providers/models', listProviderModels);
router.post('/plugins/action', runPluginAction);
router.post('/plugins/test', testPluginConnection);
router.post('/execute', runAgentTask);
router.post('/export-pptx', exportPptx);
router.post('/export-pdf', exportPdf);

export default router;
