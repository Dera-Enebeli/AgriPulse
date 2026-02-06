/**
 * Subscription model for serverless functions
 * MongoDB subscription document operations
 */

const { getCollection } = require('../utils/database');

class SubscriptionModel {
  /**
   * Create subscription for user
   * @param {Object} subscriptionData - Subscription data
   * @returns {Object} - Created subscription document
   */
  static async create(subscriptionData) {
    try {
      const collection = await getCollection('subscriptions');
      
      const subscriptionDocument = {
        user: subscriptionData.userId,
        plan: subscriptionData.plan || 'free',
        status: 'active',
        pricing: {
          amount: 0,
          currency: 'NGN',
          interval: 'month',
          ...subscriptionData.pricing
        },
        limits: {
          apiRequests: 0,
          dataExports: 0,
          dashboardAccess: 'read-only',
          customReports: false,
          supportLevel: 'basic',
          ...subscriptionData.limits
        },
        period: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          ...subscriptionData.period
        },
        usage: {
          apiRequests: 0,
          dataExports: 0,
          lastReset: new Date()
        },
        autoRenew: true,
        cancelAtPeriodEnd: false,
        payment: {
          intent: 'subscription',
          ...subscriptionData.payment
        },
        metadata: {
          signupSource: 'registration',
          ...subscriptionData.metadata
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await collection.insertOne(subscriptionDocument);
      
      return {
        ...subscriptionDocument,
        _id: result.insertedId
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Find subscription by user ID
   * @param {string} userId - User ID
   * @returns {Object|null} - Subscription document or null
   */
  static async findByUserId(userId) {
    try {
      const collection = await getCollection('subscriptions');
      const subscription = await collection.findOne(
        { user: require('mongodb').ObjectId(userId) },
        { sort: { createdAt: -1 } }
      );
      return subscription;
    } catch (error) {
      console.error('Error finding subscription by user ID:', error);
      throw error;
    }
  }

  /**
   * Update subscription
   * @param {string} subscriptionId - Subscription ID
   * @param {Object} updateData - Data to update
   * @returns {Object|null} - Updated subscription document
   */
  static async update(subscriptionId, updateData) {
    try {
      const collection = await getCollection('subscriptions');
      
      const updateDoc = {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      };
      
      const result = await collection.findOneAndUpdate(
        { _id: require('mongodb').ObjectId(subscriptionId) },
        updateDoc,
        { returnDocument: 'after' }
      );
      
      return result.value;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Get available subscription plans
   * @returns {Array} - Array of plan configurations
   */
  static getAvailablePlans() {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        currency: 'NGN',
        interval: 'month',
        features: [
          '1,000 API requests/month',
          '10 data exports/month',
          'Basic dashboard access',
          'Email support'
        ],
        limits: {
          apiRequests: 1000,
          dataExports: 10,
          dashboardAccess: 'read-only',
          customReports: false,
          supportLevel: 'basic'
        }
      },
      {
        id: 'explorer',
        name: 'Explorer',
        price: 99,
        currency: 'NGN',
        interval: 'month',
        features: [
          '10,000 API requests/month',
          '100 data exports/month',
          'Advanced dashboard access',
          'Custom reports',
          'Priority support'
        ],
        limits: {
          apiRequests: 10000,
          dataExports: 100,
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: 'priority'
        }
      },
      {
        id: 'insights',
        name: 'Insights',
        price: 299,
        currency: 'NGN',
        interval: 'month',
        features: [
          '50,000 API requests/month',
          '500 data exports/month',
          'Full dashboard access',
          'Custom analytics',
          'Priority support'
        ],
        limits: {
          apiRequests: 50000,
          dataExports: 500,
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: 'priority'
        }
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 999,
        currency: 'NGN',
        interval: 'month',
        features: [
          'Unlimited API requests',
          'Unlimited data exports',
          'Full dashboard access',
          'Custom analytics',
          'Dedicated support'
        ],
        limits: {
          apiRequests: -1, // Unlimited
          dataExports: -1, // Unlimited
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: 'dedicated'
        }
      }
    ];
  }
}

module.exports = SubscriptionModel;