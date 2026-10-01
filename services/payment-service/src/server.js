import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'payment-service', status: 'healthy', timestamp: new Date() });
});

// Routes
app.use('/api/payments', paymentRoutes);

app.listen(PORT, HOST, () => {
  console.log(`💳 [Payment Service] Running on ${HOST}:${PORT}`);
});
