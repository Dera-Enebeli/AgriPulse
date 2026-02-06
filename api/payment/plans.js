/**
 * Serverless function for payment plans
 * GET /api/payment/plans
 */

const SubscriptionModel = require('../models/Subscription');
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
    // Get available subscription plans
    const plans = SubscriptionModel.getAvailablePlans();

    const responseData = {
      plans,
      defaultPlan: 'free'
    };

    return res.status(200).json(
      formatResponse(true, responseData, 'Payment plans retrieved successfully')
    );

  } catch (error) {
    console.error('Payment plans error:', error);
    
    return res.status(500).json({ 
      error: 'Failed to retrieve payment plans', 
      message: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};