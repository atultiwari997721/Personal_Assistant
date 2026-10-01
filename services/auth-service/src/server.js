import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, '../../../.env'), override: false });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;
const HOST = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1');

// Middlewares
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ service: 'auth-service', status: 'healthy', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);

// Start server
connectDB().then(() => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('Set JWT_SECRET to at least 32 characters before starting auth-service. start-dev.js generates a temporary local secret.');
  }
  app.listen(PORT, HOST, () => {
    console.log(`🚀 [Auth Service] Running on ${HOST}:${PORT}`);
  });
});
