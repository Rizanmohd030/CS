const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// CORS Configuration (Production-ready)
app.use(cors({
  origin: 'http://localhost:3000', // Whitelist only your React frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Optional: restrict headers
  credentials: true // Optional: enable cookies/auth headers
}));

// Test route
app.get('/', (req, res) => {
  res.send('Backend server is running 🚀');
});

// Start server (listens on all network interfaces)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on:
  - Local: http://localhost:${PORT}
  - Network: http://${getLocalIpAddress()}:${PORT}`);
});

// Helper function to get local IP (for network access)
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