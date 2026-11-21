import mongoose from 'mongoose';

export default async function connectDatabase() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');
  if (!/^mongodb(?:\+srv)?:\/\//.test(process.env.MONGODB_URI) || /<[^>]+>/.test(process.env.MONGODB_URI)) {
    throw new Error('MONGODB_URI is not configured. Replace the example placeholders with your MongoDB connection string.');
  }
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'al_nisa_collections', autoIndex: process.env.NODE_ENV !== 'production' });
  console.info('Connected to MongoDB database al_nisa_collections');
}
