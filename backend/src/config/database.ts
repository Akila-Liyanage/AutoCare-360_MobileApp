import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  if (!ENV.MONGO_URI) {
    throw new Error('MONGO_URI is not configured');
  }

  await mongoose.connect(ENV.MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
};

