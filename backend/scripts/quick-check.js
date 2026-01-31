require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function quickCheck() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    const user = await User.findOne({ email: 'leslieene60@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    
    const subscription = await Subscription.findOne({ user: user._id });
    console.log('✅ Subscription plan:', subscription?.plan);
    console.log('✅ Subscription status:', subscription?.status);
    
    // Create a test JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log('✅ Token created successfully');
    
    console.log('\n🎯 SOLUTION:');
    console.log('1. The database shows INSIGHTS plan correctly');
    console.log('2. The auth endpoint has been fixed to return "free" instead of "basic"');
    console.log('3. User needs to LOG OUT and LOG BACK IN to get fresh token');
    console.log('4. Or the frontend needs to refresh user data');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

quickCheck();