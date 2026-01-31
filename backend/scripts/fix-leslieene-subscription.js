require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function fixSubscription() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    const user = await User.findOne({ email: 'leslieene60@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    // Update subscription to insights and active
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan: 'insights',
        status: 'active',
        period: {
          start: new Date(),
          end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        },
        payment: {
          method: 'admin_grant',
          status: 'confirmed',
          confirmedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log('✅ Subscription fixed to INSIGHTS - ACTIVE');
    
    const updated = await Subscription.findOne({ user: user._id });
    console.log('✅ Current plan:', updated.plan);
    console.log('✅ Current status:', updated.status);
    console.log('✅ Expires:', updated.period.end.toLocaleDateString());
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

fixSubscription();