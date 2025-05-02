const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = 5000;

// MongoDB Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/construction_db';
const client = new MongoClient(MONGODB_URI);

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Database Connection Middleware
app.use(async (req, res, next) => {
  try {
    if (!client.topology || !client.topology.isConnected()) {
      await client.connect();
      console.log('MongoDB connected successfully');
    }
    req.db = client.db(); // Attach database to request
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(503).json({ error: 'Service unavailable - Database connection failed' });
  }
});

// Routes
app.get('/', (req, res) => {
  res.send('Backend server is running 🚀');
});

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    await req.db.command({ ping: 1 });
    res.json({ 
      status: 'healthy',
      db: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy',
      db: 'disconnected',
      error: err.message 
    });
  }
});

// Construction Data Endpoint
app.get('/api/construction-data', async (req, res) => {
  try {
    const [employees, tasks] = await Promise.all([
      req.db.collection('employees').find().toArray(),
      req.db.collection('tasks').find().toArray()
    ]);
    
    res.json({ 
      success: true,
      employees,
      tasks,
      count: {
        employees: employees.length,
        tasks: tasks.length
      }
    });
  } catch (err) {
    console.error('Data fetch error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch construction data'
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on:
  - Local: http://localhost:${PORT}
  - Network: http://${getLocalIpAddress()}:${PORT}
  - MongoDB: ${MONGODB_URI}`);
});

// Helper function to get local IP
function getLocalIpAddress() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}