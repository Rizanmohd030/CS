// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const { connectDB, getDB, closeDB } = require('./config/db');
const routes = require('./routes');
const { initializeRFIDService } = require('./services/rfid.service');
const { initializeSocketService } = require('./services/socket.service');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 5000;

// 1. Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// 2. Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    req.db = getDB();
    logger.debug('Database connection attached to request');
    next();
  } catch (err) {
    logger.error('Database connection error', { error: err.message });
    next(new Error('Database connection unavailable'));
  }
});

// 3. Route Setup
app.use('/api', routes);
app.use('/api/auth', authRoutes);

// 4. Error Handling
app.use(errorHandler);

// 5. Server Initialization
const startServer = async () => {
  try {
    // Database Connection
    await connectDB();
    logger.info('Database connected successfully');

    // Start HTTP Server
    const server = app.listen(PORT, () => {
      const address = server.address();
      logger.info(`Server running on port ${PORT}`, {
        pid: process.pid,
        environment: process.env.NODE_ENV
      });

      // Initialize Additional Services
      if (process.env.ENABLE_RFID === 'true') {
        initializeRFIDService();
        logger.info('RFID service initialized');
      }

      if (process.env.ENABLE_SOCKETS === 'true') {
        initializeSocketService(server);
        logger.info('Socket service initialized');
      }
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      
      try {
        await closeDB();
        server.close(() => {
          logger.info('Server closed');
          process.exit(0);
        });

        setTimeout(() => {
          logger.error('Forcing shutdown after timeout');
          process.exit(1);
        }, 10000).unref();
      } catch (err) {
        logger.error('Shutdown error', { error: err.message });
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception', { error: err.message });
      shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection', { 
        promise: promise.toString(), 
        reason: reason.message 
      });
    });

  } catch (err) {
    logger.error('Server startup failed', { error: err.message });
    process.exit(1);
  }
};

startServer();