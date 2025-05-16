// server.js
const app = require('./app');
const { getDB, closeDB, connectDB } = require('./config/db');
const PORT = process.env.PORT || 5000;

// Initialize database connection first
connectDB().catch(err => {
  console.error('FATAL: Failed to connect to database:', err);
  process.exit(1); // Exit if DB connection fails
});

// Enhanced DB attachment middleware
app.use((req, res, next) => {
  try {
    req.db = getDB();
    
    // Debugging log (remove in production)
    console.log('Database connection attached to request');
    
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(503).json({ 
      error: 'Service unavailable - Database connection failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Start server with error handling
let server;
try {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on:
    - Local: http://localhost:${PORT}
    - Network: http://${require('os').networkInterfaces().eth0?.[0]?.address || 'localhost'}:${PORT}
    - PID: ${process.pid}`);
  });
} catch (err) {
  console.error('Server startup failed:', err);
  process.exit(1);
}

// Enhanced graceful shutdown
const shutdown = async () => {
  console.log('\nShutting down gracefully...');
  
  try {
    await closeDB();
    console.log('Database connection closed');
    
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
    
    // Force shutdown if hanging
    setTimeout(() => {
      console.error('Forcing shutdown after timeout');
      process.exit(1);
    }, 5000);
  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
};

// Handle various shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown();
});

// Debugging events (optional)
if (process.env.NODE_ENV === 'development') {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });
}