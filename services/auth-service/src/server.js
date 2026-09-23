import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

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
  app.listen(PORT, () => {
    console.log(`🚀 [Auth Service] Running on port ${PORT}`);
  });
});
