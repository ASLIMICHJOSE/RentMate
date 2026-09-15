import { createServer } from 'node:http';
import { env } from './config/env.js';
import { disconnectPrisma } from './config/prisma.js';
import { app } from './app.js';

const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`RentMate API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
  console.log(`Health check: http://localhost:${env.PORT}/api/health`);
});

/** Closes the HTTP server and exits, so deployments can restart cleanly. */
function shutdown(signal: string): void {
  console.log(`\n${signal} received - shutting down...`);

  server.close((error) => {
    if (error) {
      console.error('Error while closing the HTTP server:', error);
      process.exit(1);
    }

    // Release database connections; Milestone 14 also closes Socket.IO here.
    void disconnectPrisma().finally(() => {
      console.log('Shutdown complete.');
      process.exit(0);
    });
  });

  // Don't hang forever on stuck connections.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  shutdown('uncaughtException');
});
