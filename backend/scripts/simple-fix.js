const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function fixDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agripulse');
    console.log('Connected to database');

    // Fix all subscriptions to be free
    const result = await Subscription.updateMany(
      {},
      { 
        $set: { 
          plan: 'free',
          status: 'active',
          autoRenew: true,
          cancelAtPeriodEnd: false,
          'limits.apiRequests': 0,
          'limits.dataExports': 0,
          'limits.dashboardAccess': 'read-only',
          'limits.customReports': false,
          'limits.supportLevel': 'basic',
          'payment.intent': 'subscription'
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} subscriptions`);

    // Fix user subscriptions too
    const userResult = await User.updateMany(
      {},
      { 
        $set: { 
          'subscription.plan': 'free',
          'subscription.status': 'active'
        }
      }
    );

    console.log(`Updated ${userResult.modifiedCount} user subscriptions`);

    // Create test free user
    const existingTestUser = await User.findOne({ email: 'test-free-user@test.com' });
    if (!existingTestUser) {
      const testUser = new User({
        name: 'Test Free User',
        email: 'test-free-user@test.com',
        password: 'testpassword123',
        organization: 'Test Org',
        useCase: 'agribusiness',
        subscription: { plan: 'free', status: 'active' }
      });
      
      await testUser.save();
      
      const testSub = new Subscription({
        user: testUser._id,
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
        }
      });
      
      await testSub.save();
      console.log('Created test free user: test-free-user@test.com / testpassword123');
    }

    await mongoose.connection.close();
    console.log('Database fixes complete!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDatabase();