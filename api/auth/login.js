/**
 * Serverless function for user login
 * POST /api/auth/login
 */

const UserModel = require('../models/User');
const SubscriptionModel = require('../models/Subscription');
const { validateBody, formatResponse, generateToken } = require('../utils/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate required fields
    const validation = validateBody(req.body, ['email', 'password']);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Valid email is required' 
      });
    }

    // Validate user credentials
    const user = await UserModel.validatePassword(email.toLowerCase().trim(), password);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Get user subscription
    const subscription = await SubscriptionModel.findByUserId(user._id.toString());

    // Generate JWT token
    const token = generateToken(user);

    // Format response
    const responseData = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        subscription: subscription?.plan || 'free',
        isVerified: user.isVerified
      }
    };

    return res.status(200).json(
      formatResponse(true, responseData, 'Login successful')
    );

  } catch (error) {
    console.error('Login error:', error);
    
    return res.status(500).json({ 
      error: 'Login failed', 
      message: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};