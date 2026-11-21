
import './config/loadEnv.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { corsOptions } from './config/cors.js';


import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';

import connectDatabase from './config/db.js';
import ensureDefaultCategories from './utils/ensureDefaultCategories.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

import {
  errorHandler,
  notFound
} from './middleware/errorMiddleware.js';

// Validate environment variables
for (const key of ['JWT_SECRET', 'MONGODB_URI']) {
  if (!process.env[key]) {
    throw new Error(`${key} is required`);
  }
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must contain at least 32 characters');
}

// Initialize Express
const app = express();

app.disable('x-powered-by');

// Security middleware
app.use(helmet());

app.use(cors(corsOptions));

app.use(express.json({ limit: '256kb' }));
app.use(mongoSanitize());

// API rate limiter
app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  limit: 180,
  standardHeaders: true,
  legacyHeaders: false
}));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AL NISA API is running successfully'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    message: 'Server is healthy'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = Number(process.env.PORT || 4000);

async function startServer() {
  try {
    await connectDatabase();
    await ensureDefaultCategories();

    app.listen(PORT, () => {
      console.info(`AL NISA API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
