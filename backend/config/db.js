import mongoose from 'mongoose';

const MAX_INITIAL_ATTEMPTS = 5;
const SERVER_SELECTION_TIMEOUT_MS = 5000;
const RETRY_BASE_DELAY_MS = 1000;
const RETRY_MAX_DELAY_MS = 10000;

let hasConnected = false;

function safeErrorCode(error) {
  return error?.code || error?.cause?.code || error?.name || 'unknown error';
}

function getMongoConfiguration() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required');
  if (/<[^>]+>/.test(uri)) {
    throw new Error('MONGODB_URI contains an example placeholder; configure a valid MongoDB URI.');
  }

  let parsedUri;
  try {
    parsedUri = new URL(uri);
  } catch {
    throw new Error('MONGODB_URI is invalid; check its scheme and hostname.');
  }

  if (!['mongodb:', 'mongodb+srv:'].includes(parsedUri.protocol) || !parsedUri.hostname) {
    throw new Error('MONGODB_URI must use mongodb:// or mongodb+srv:// and include a hostname.');
  }

  return { uri, hostname: parsedUri.hostname };
}

mongoose.connection.on('connected', () => {
  if (hasConnected) console.info('MongoDB connection restored.');
  else console.info('Connected to MongoDB.');
  hasConnected = true;
});

mongoose.connection.on('disconnected', () => {
  if (hasConnected) console.warn('MongoDB connection lost; Mongoose will attempt to reconnect. API requests are temporarily unavailable.');
});

mongoose.connection.on('error', error => {
  console.error(`MongoDB connection error (${safeErrorCode(error)}).`);
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function connectDatabase() {
  const { uri, hostname } = getMongoConfiguration();
  console.info(`Connecting to MongoDB host ${hostname}.`);

  for (let attempt = 1; attempt <= MAX_INITIAL_ATTEMPTS; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        dbName: 'al_nisa_collections',
        autoIndex: process.env.NODE_ENV !== 'production',
        serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      return;
    } catch (error) {
      const code = safeErrorCode(error);
      if (attempt === MAX_INITIAL_ATTEMPTS) {
        throw new Error(`MongoDB connection failed after ${MAX_INITIAL_ATTEMPTS} attempts (${code}). Check DNS, network access, Atlas IP access rules, and cluster availability.`);
      }

      const exponentialDelay = Math.min(RETRY_BASE_DELAY_MS * (2 ** (attempt - 1)), RETRY_MAX_DELAY_MS);
      const jitter = Math.floor(Math.random() * Math.min(exponentialDelay * 0.2, 1000));
      console.warn(`MongoDB connection attempt ${attempt}/${MAX_INITIAL_ATTEMPTS} failed (${code}); retrying in approximately ${Math.ceil((exponentialDelay + jitter) / 1000)}s.`);
      await wait(exponentialDelay + jitter);
    }
  }
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

export function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}
