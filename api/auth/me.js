/**
 * Serverless function for getting current user profile
 * GET /api/auth/me
 */

const UserModel = require('../models/User');
const SubscriptionModel = require('../models/Subscription');
const { withAuth, formatResponse, createErrorHandler } = require('../utils/auth');

const handler = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user details
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    // Get user subscription
    const subscription = await SubscriptionModel.findByUserId(userId);

    // Format response
    const responseData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        subscription: subscription?.plan || 'free',
        isVerified: user.isVerified,
        apiUsage: user.apiUsage || { requests: 0, lastReset: new Date() }
      }
    };

    return res.status(200).json(
      formatResponse(true, responseData, 'User profile retrieved')
    );

  } catch (error) {
    const errorHandler = createErrorHandler('Failed to retrieve user profile');
    return errorHandler(res, error);
  }
};

// Export with authentication middleware
module.exports = withAuth(handler);