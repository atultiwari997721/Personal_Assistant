import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8002;

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'payment-service', status: 'healthy', timestamp: new Date() });
});

// Routes
app.use('/api/payments', paymentRoutes);

app.listen(PORT, () => {
  console.log(`💳 [Payment Service] Running on port ${PORT}`);
});
