const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function upgradeSubscription() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Find your user (update email to match yours)
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('❌ User not found. Update the email in this script.');
      return;
    }

    console.log(`👤 Found user: ${user.name} (${user.email})`);

    // Update or create subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan: 'insights', // Change to 'enterprise' for full access
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
        payment: {
          method: 'paystack',
          intent: 'subscription',
          reference: 'TEST-' + Date.now(),
          status: 'confirmed',
          confirmedAt: new Date()
        }
      },
      { upsert: true }
    );

    console.log('✅ Subscription upgraded to INSIGHTS plan!');
    console.log('🎯 You now have access to:');
    console.log('   - All filters (Region, Crop Type, Time Range)');
    console.log('   - Market Intelligence tab');
    console.log('   - Risk Monitoring tab');
    console.log('   - Exact data counts');
    console.log('   - Downloadable reports');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

upgradeSubscription();