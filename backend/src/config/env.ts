import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*',
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Keycloak Configuration
  KEYCLOAK_URL: process.env.BACKEND_KEYCLOAK_URL || 'https://idp.sltdigitallab.lk',
  KEYCLOAK_REALM: process.env.BACKEND_KEYCLOAK_REALM || 'ai-data-pipeline',
  KEYCLOAK_SERVICE_ACCOUNT_CLIENT: process.env.KEYCLOAK_SERVICE_ACCOUNT_CLIENT || 'backend-client',
  KEYCLOAK_SERVICE_ACCOUNT_SECRET: process.env.KEYCLOAK_SERVICE_ACCOUNT_SECRET || 'tmcqtZzgu8Yca0LwEQH0A6qxOjdIc6Ij',
};
