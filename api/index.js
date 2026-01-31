// Vercel serverless function wrapper for AgriPulse backend
// This file serves as the entry point for all API routes

const app = require('../backend/server.js');

// Export the Express app as a serverless function
module.exports = (req, res) => {
  // Remove /api prefix if present since routes already include it
  if (req.url.startsWith('/api')) {
    req.url = req.url.substring(4);
  }
  
  app(req, res);
};