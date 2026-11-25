import './config/loadEnv.js';

import app, { setDbReadyPromise } from './app.js';
import connectDatabase, { disconnectDatabase } from './config/db.js';
import ensureDefaultCategories from './utils/ensureDefaultCategories.js';

function validateEnvironment() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET is required and must contain at least 32 characters.');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required.');
  }
}

const PORT = Number(process.env.PORT || 4000);

async function startServer() {
  try {
    validateEnvironment();

    // Start server immediately so local proxy connections (e.g. Vite :5173) do not fail with ECONNREFUSED
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.info(`AL NISA API listening on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use by another process. Run 'fuser -k ${PORT}/tcp' or change PORT in backend/.env.`);
      } else {
        console.error('Server error:', error.message);
      }
      process.exit(1);
    });

    const shutdown = async (signal) => {
      console.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // Connect to database asynchronously while holding incoming API requests safely via middleware
    const connectionTask = (async () => {
      await connectDatabase();
      await ensureDefaultCategories();
    })();
    setDbReadyPromise(connectionTask);

    await connectionTask;
    console.info('Database connected and ready for requests.');
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
