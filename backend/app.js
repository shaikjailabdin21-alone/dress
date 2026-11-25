import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';
import { corsOptions } from './config/cors.js';
import { isDatabaseReady } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '256kb' }));
app.use(mongoSanitize());

// Rate limiter for API routes
app.use(['/api', '/products', '/categories', '/collections', '/uploads', '/dashboard'], rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Root welcoming endpoint
app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'AL NISA API is running successfully' });
});

// Health check endpoints (available at both /health and /api/health)
const healthHandler = (_req, res) => {
  const ready = isDatabaseReady();
  res.status(ready ? 200 : 503).json({
    success: ready,
    status: ready ? 'ok' : 'unavailable',
    message: ready ? 'Server is healthy' : 'Database is unavailable',
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Database readiness promise tracker for startup synchronization
let dbReadyPromise = null;
export function setDbReadyPromise(promise) {
  dbReadyPromise = promise;
}

// Database readiness guard: waits for initial connection instead of immediate 503
app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  if (req.path === '/' || req.path === '/health' || req.path === '/api/health') return next();

  if (!isDatabaseReady() && dbReadyPromise) {
    try {
      await Promise.race([
        dbReadyPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Connection wait timeout')), 10000)),
      ]);
    } catch {
      // Continue to isDatabaseReady check below
    }
  }

  if (!isDatabaseReady()) {
    return res.status(503).json({ message: 'The database is temporarily unavailable. Please retry shortly.' });
  }
  next();
});

// Primary API routes mounted under /api
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Compatibility routes mounted without /api prefix
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/collections', collectionRoutes);
app.use('/uploads', uploadRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
