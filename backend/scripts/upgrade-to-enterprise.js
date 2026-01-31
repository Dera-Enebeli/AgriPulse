const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function upgradeToEnterprise() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agripulse');
    console.log('✅ Connected to database');

    // Find your test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }

    // Upgrade to ENTERPRISE plan
    await Subscription.findOneAndUpdate(
      { user: testUser._id },
      {
        plan: 'enterprise',
        status: 'active',
        pricing: { 
          amount: 520000, 
          currency: 'NGN', 
          interval: 'month' 
        },
        limits: {
          apiRequests: 10000,
          dataExports: 100,
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: 'priority'
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
          reference: 'UPGRADE-ENTERPRISE-' + Date.now(),
          status: 'confirmed',
          confirmedAt: new Date()
        },
        metadata: {
          signupSource: 'enterprise-upgrade',
          upgradedTo: 'enterprise',
          upgradedAt: new Date().toISOString()
        }
      }
    );

    console.log('✅ Successfully upgraded test@example.com to ENTERPRISE plan!');
    console.log('🎯 Enterprise Features now available:');
    console.log('   - Maximum API requests (10,000/month)');
    console.log('   - Maximum data exports (100/month)');
    console.log('   - Priority support access');
    console.log('   - All dashboard features unlocked');
    console.log('   - Custom reports and analytics');
    
    await mongoose.connection.close();
    console.log('\n🚀 Test user is now ENTERPRISE level!');

  } catch (error) {
    console.error('❌ Upgrade error:', error);
  }
}

upgradeToEnterprise();