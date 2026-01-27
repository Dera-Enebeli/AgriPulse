const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function fixAllSubscriptions() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Fix all existing subscriptions to be 'free' unless they have a real paid plan
    const result = await Subscription.updateMany(
      { 
        plan: { $nin: ['insights', 'enterprise'] },
        status: 'active'
      },
      { 
        $set: { 
          plan: 'free',
          status: 'active',
          'limits.dashboardAccess': 'read-only',
          'limits.customReports': false,
          'limits.apiRequests': 0,
          'limits.dataExports': 0
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} subscriptions to FREE plan`);

    // Also update user embedded subscription fields
    const userResult = await User.updateMany(
      { 
        'subscription.plan': { $nin: ['insights', 'enterprise'] },
        'subscription.status': { $ne: 'cancelled' }
      },
      { 
        $set: { 
          'subscription.plan': 'free',
          'subscription.status': 'active'
        }
      }
    );

    console.log(`✅ Updated ${userResult.modifiedCount} user subscription fields to FREE`);

    // List current subscription counts
    const subscriptionCounts = await Subscription.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Current subscription counts:');
    subscriptionCounts.forEach(item => {
      console.log(`   ${item._id}: ${item.count} users`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

fixAllSubscriptions();