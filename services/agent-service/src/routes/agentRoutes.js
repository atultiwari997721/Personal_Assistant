import express from 'express';
import {
  runAgentTask,
  exportPptx,
  exportPdf,
  getAgentList,
} from '../controllers/agentController.js';

const router = express.Router();

router.get('/spec', getAgentList);
router.post('/execute', runAgentTask);
router.post('/export-pptx', exportPptx);
router.post('/export-pdf', exportPdf);

export default router;
