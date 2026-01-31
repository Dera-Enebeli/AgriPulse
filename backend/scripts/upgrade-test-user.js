const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function upgradeToInsights() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agripulse');
    console.log('✅ Connected to database');

    // Find your existing test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }

    // Upgrade to INSIGHTS plan with premium features
    await Subscription.findOneAndUpdate(
      { user: testUser._id },
      {
        plan: 'insights',
        status: 'active',
        pricing: { 
          amount: 150000, 
          currency: 'NGN', 
          interval: 'month' 
        },
        limits: {
          apiRequests: 5000,
          dataExports: 50,
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: 'email'
        },
        period: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        autoRenew: true,
        cancelAtPeriodEnd: false,
        payment: {
          method: 'paystack',
          intent: 'subscription',
          reference: 'UPGRADE-TEST-' + Date.now(),
          status: 'confirmed',
          confirmedAt: new Date()
        },
        metadata: {
          signupSource: 'upgrade-test',
          upgradedTo: 'insights',
          upgradedAt: new Date().toISOString()
        }
      }
    );

    console.log('✅ Successfully upgraded test@example.com to INSIGHTS plan!');
    console.log('🔑 Features now available:');
    console.log('   - All dashboard filters unlocked');
    console.log('   - Market Intelligence tab access');
    console.log('   - Risk Monitoring tab access');
    console.log('   - Premium data visualizations');
    console.log('   - Custom reports enabled');
    
    await mongoose.connection.close();
    console.log('\n🎉 Test user upgrade complete!');

  } catch (error) {
    console.error('❌ Upgrade error:', error);
  }
}

upgradeToInsights();