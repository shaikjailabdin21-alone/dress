import './loadEnv.js';

const frontendOrigins = [...new Set(
  (process.env.FRONTEND_ORIGINS || process.env.FRONTEND_URL || '').split(',').map(origin => origin.trim()).filter(Boolean)
)];

if (frontendOrigins.length === 0) {
  throw new Error('Set FRONTEND_ORIGINS or FRONTEND_URL to at least one allowed browser origin');
}

for (const origin of frontendOrigins) {
  let parsedOrigin;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    throw new Error(`Invalid frontend origin in FRONTEND_ORIGINS: ${origin}`);
  }

  if (!['http:', 'https:'].includes(parsedOrigin.protocol) || parsedOrigin.origin !== origin) {
    throw new Error(`Invalid frontend origin in FRONTEND_ORIGINS: ${origin}`);
  }
}

export const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header are server-to-server or command-line
    // calls; browsers always send Origin for cross-origin requests.
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
