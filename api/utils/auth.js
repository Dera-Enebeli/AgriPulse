/**
 * Authentication utilities for serverless functions
 * JWT token validation and user helper functions
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token from request headers
 * @param {Object} req - Request object
 * @returns {Object|null} - Decoded user data or null
 */
async function verifyToken(req) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Authentication middleware for serverless functions
 * @param {Function} handler - The function to protect
 * @returns {Function} - Protected function
 */
function withAuth(handler) {
  return async (req, res) => {
    try {
      const user = await verifyToken(req);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Access denied. No valid token provided.' 
        });
      }

      // Add user to request object
      req.user = user;
      
      // Call the original handler
      return await handler(req, res);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return res.status(401).json({ 
        error: 'Authentication failed' 
      });
    }
  };
}

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { 
      id: user._id.toString(),
      email: user.email 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d' 
    }
  );
}

/**
 * Validate request body fields
 * @param {Object} body - Request body
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result
 */
function validateBody(body, requiredFields = []) {
  const errors = [];
  const missing = [];
  
  requiredFields.forEach(field => {
    if (!body[field] || body[field].trim() === '') {
      missing.push(field);
    }
  });
  
  if (missing.length > 0) {
    errors.push(`Missing required fields: ${missing.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    missing
  };
}

/**
 * Format API response
 * @param {boolean} success - Success status
 * @param {Object} data - Response data
 * @param {string} message - Response message
 * @returns {Object} - Formatted response
 */
function formatResponse(success = true, data = null, message = '') {
  const response = { success };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (message) {
    response.message = message;
  }
  
  return response;
}

/**
 * Error response helper
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @returns {Function} - Error handler function
 */
function createErrorHandler(message = 'Internal server error', status = 500) {
  return (res, error = null) => {
    console.error('API Error:', error || message);
    
    if (process.env.NODE_ENV === 'development' && error) {
      return res.status(status).json({ 
        error: message,
        details: error.message,
        stack: error.stack 
      });
    }
    
    return res.status(status).json({ 
      error: message 
    });
  };
}

module.exports = {
  verifyToken,
  withAuth,
  generateToken,
  validateBody,
  formatResponse,
  createErrorHandler
};