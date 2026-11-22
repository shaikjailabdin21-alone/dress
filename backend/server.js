import './config/loadEnv.js';

import app from './app.js';
import connectDatabase from './config/db.js';
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
    await connectDatabase();
    await ensureDefaultCategories();

    app.listen(PORT, '0.0.0.0', () => {
      console.info(`AL NISA API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
