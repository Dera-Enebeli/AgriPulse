/**
 * Serverless function for health check
 * GET /api/health
 */

const { checkDatabaseHealth } = require(../utils/database');
const { formatResponse } = require('../utils/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check database health
    const dbHealth = await checkDatabaseHealth();
    
    const responseData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth
    };

    const statusCode = dbHealth.status === 'healthy' ? 200 : 503;

    return res.status(statusCode).json(
      formatResponse(true, responseData, 'Health check completed')
    );

  } catch (error) {
    console.error('Health check error:', error);
    
    const errorResponse = {
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message,
      database: { status: 'unhealthy', error: error.message }
    };

    return res.status(503).json(
      formatResponse(false, errorResponse, 'Health check failed')
    );
  }
};