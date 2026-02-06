/**
 * Serverless function for user registration
 * POST /api/auth/register
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
    const { name, email, password, organization, useCase } = req.body;

    // Validate required fields
    const validation = validateBody(req.body, ['name', 'email', 'password', 'organization', 'useCase']);
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

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters' 
      });
    }

    // Validate use case
    const validUseCases = ['agribusiness', 'research', 'ngo', 'input-supplier', 'policy', 'investment', 'other'];
    if (!validUseCases.includes(useCase)) {
      return res.status(400).json({ 
        error: 'Valid use case is required' 
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists with this email' 
      });
    }

    // Create user
    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      organization: organization.trim(),
      useCase
    });

    // Create free subscription
    const subscription = await SubscriptionModel.create({
      userId: user._id.toString(),
      plan: 'free'
    });

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
        subscription: subscription.plan
      }
    };

    return res.status(201).json(
      formatResponse(true, responseData, 'User registered successfully')
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    return res.status(500).json({ 
      error: 'Registration failed', 
      message: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};