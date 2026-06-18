import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import db from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('🚀 Starting Job Tracker Backend...');
  console.log('📋 MVC Architecture with Utils');

  // Test Neon database connection
  const connected = await db.testConnection();
  if (!connected) {
    console.error('❌ Cannot start server without database connection');
    process.exit(1);
  }

  // Start Express server
  app.listen(PORT, () => {
    console.log('\n✅ Server started successfully!');
    console.log(`🌐 Server running on http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api/applications`);
    console.log(`💚 Health: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Database: Neon PostgreSQL (Cloud)\n`);

  });
};

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await db.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

startServer();