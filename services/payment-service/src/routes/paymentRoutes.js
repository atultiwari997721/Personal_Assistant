import express from 'express';
import {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPackages,
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/packages', getPackages);
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
