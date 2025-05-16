// Import any required dependencies (none needed for this simple example)
const { getDB } = require('../config/db'); // Import the DB connection helper

// Health check controller
exports.checkHealth = async (req, res) => {
  try {
    // Use the attached DB from middleware (or getDB() directly)
    await req.db.command({ ping: 1 }); // Replaced direct MongoDB call
    
    // Successful response
    res.json({ 
      status: 'healthy',
      db: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    // Error response
    console.error('Health check failed:', err);
    res.status(500).json({ 
      status: 'unhealthy',
      db: 'disconnected',
      error: err.message 
    });
  }
};