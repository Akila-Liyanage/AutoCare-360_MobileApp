import app from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = app.listen(ENV.PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(` AutoCare 360 Backend Server Running`);
    console.log(` Environment : ${ENV.NODE_ENV}`);
    console.log(` Port        : ${ENV.PORT}`);
    console.log(` Health check: http://localhost:${ENV.PORT}/health`);
    console.log(`===============================================`);
  });

  const handleShutdown = (signal: string) => {
    console.log(`\nReceived ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('Server closed successfully.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

startServer().catch((error: unknown) => {
  console.error('[Startup Error]', error instanceof Error ? error.message : error);
  process.exit(1);
});
