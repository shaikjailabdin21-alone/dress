import './loadEnv.js';

const rawOrigins = (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

// Default development and production origins
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://alnisa-collections.netlify.app',
];

const frontendOrigins = rawOrigins.length > 0
  ? [...new Set([...rawOrigins, 'https://alnisa-collections.netlify.app'])]
  : defaultOrigins;

// Validate configured origins (skip validation for wildcard '*')
for (const origin of frontendOrigins) {
  if (origin === '*') continue;
  let parsedOrigin;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    console.warn(`[CORS Warning] Invalid frontend origin in FRONTEND_ORIGINS: ${origin}`);
    continue;
  }

  if (!['http:', 'https:'].includes(parsedOrigin.protocol)) {
    console.warn(`[CORS Warning] Origin protocol must be http or https: ${origin}`);
  }
}

export const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header are server-to-server or command-line calls
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');

    // Check if origin matches allowed list or wildcard
    if (frontendOrigins.includes('*') || frontendOrigins.includes(normalizedOrigin)) {
      return callback(null, origin);
    }

    // In development mode, allow localhost and LAN IP origins automatically
    if (process.env.NODE_ENV !== 'production') {
      if (/^https?:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(normalizedOrigin)) {
        return callback(null, origin);
      }
    }

    // If origin is not allowed, reject cleanly without throwing unhandled error
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours preflight cache
};

export { frontendOrigins };
