const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Register user
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('organization').notEmpty().withMessage('Organization is required'),
  body('useCase').isIn(['agribusiness', 'research', 'ngo', 'input-supplier', 'policy', 'investment', 'other']).withMessage('Valid use case is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, organization, useCase } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      organization,
      useCase
    });

    await user.save();

    // Create free subscription
    const subscription = new Subscription({
      user: user._id,
      plan: 'free',
      status: 'active',
      pricing: { amount: 0, currency: 'NGN', interval: 'month' },
      limits: {
        apiRequests: 0,
        dataExports: 0,
        dashboardAccess: 'read-only',
        customReports: false,
        supportLevel: 'basic'
      },
      period: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      usage: {
        apiRequests: 0,
        dataExports: 0,
        lastReset: new Date()
      },
      autoRenew: true,
      cancelAtPeriodEnd: false,
      payment: {
        intent: 'subscription'
      },
      metadata: {
        signupSource: 'registration'
      }
    });
    await subscription.save();

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        subscription: subscription.plan
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get subscription
    const subscription = await Subscription.findOne({ user: user._id });

    // Generate token
    const token = user.getSignedJwtToken();

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        subscription: subscription?.plan || 'basic',
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    const subscription = await Subscription.findOne({ user: user._id });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        subscription: subscription?.plan || 'basic',
        isVerified: user.isVerified,
        apiUsage: user.apiUsage
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const { name, organization, useCase } = req.body;
    
    if (name) user.name = name;
    if (organization) user.organization = organization;
    if (useCase) user.useCase = useCase;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        useCase: user.useCase
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

module.exports = router;