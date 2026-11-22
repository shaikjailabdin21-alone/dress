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
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '256kb' }));
app.use(mongoSanitize());

app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  limit: 180,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'AL NISA API is running successfully' });
});

app.get('/api/health', (_req, res) => {
  const ready = isDatabaseReady();
  res.status(ready ? 200 : 503).json({
    success: ready,
    status: ready ? 'ok' : 'unavailable',
    message: ready ? 'Server is healthy' : 'Database is unavailable',
  });
});

app.use('/api', (_req, res, next) => {
  if (!isDatabaseReady()) {
    return res.status(503).json({ message: 'The database is temporarily unavailable. Please retry shortly.' });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
