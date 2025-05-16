const express = require('express');
const router = express.Router();
const { checkHealth } = require('../controllers/healthController'); // Import the controller

// Define route → controller mapping
router.get('/', checkHealth); // GET /api/health triggers checkHealth()

module.exports = router;