// backend/app.js
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Import route files
const healthRoutes = require('./routes/healthRoutes');
const constructionRoutes = require('./routes/constructionRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Database connection
connectDB();

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/construction-data', constructionRoutes);

// Root route (optional - can be kept for basic server status)
app.get('/', (req, res) => {
  res.send('Backend server is running 🚀');
});

// Error handling middleware (basic example - can be expanded)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;