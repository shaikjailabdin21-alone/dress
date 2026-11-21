import './loadEnv.js';

// Keep the two standard local Vite origins available even when a deployment
// adds extra origins through the environment.
const configuredOrigins = process.env.FRONTEND_ORIGINS || process.env.CLIENT_URL || process.env.FRONTEND_ORIGIN || '';
const frontendOrigins = [...new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredOrigins.split(',').map(origin => origin.trim()).filter(Boolean),
])];

export const corsOptions = {
  origin(origin, callback) {
    if (!origin || frontendOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS.');
    error.statusCode = 403;
    return callback(error);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export { frontendOrigins };
