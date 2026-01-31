const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function checkUserAccess() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    // Check both email variations
    const emails = ['Leslieene60@gmail.com', 'leslieene60@gmail.com'];
    
    for (const email of emails) {
      console.log(`\n🔍 Checking: ${email}`);
      
      const user = await User.findOne({ email });
      if (user) {
        console.log(`✅ Found user: ${user.name} (ID: ${user._id})`);
        
        const subscription = await Subscription.findOne({ user: user._id });
        if (subscription) {
          console.log(`📋 Plan: ${subscription.plan.toUpperCase()}`);
          console.log(`📋 Status: ${subscription.status}`);
          console.log(`📋 Expires: ${subscription.period?.end?.toLocaleDateString()}`);
          
          // Check if subscription is valid
          const now = new Date();
          const endDate = subscription.period?.end;
          const isActive = subscription.status === 'active' && endDate && endDate > now;
          
          console.log(`📋 Currently Active: ${isActive ? 'YES ✅' : 'NO ❌'}`);
        } else {
          console.log('❌ No subscription found');
        }
      } else {
        console.log('❌ User not found');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkUserAccess();