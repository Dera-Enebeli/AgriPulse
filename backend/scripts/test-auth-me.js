const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function testAuthMe() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    const user = await User.findOne({ email: 'leslieene60@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    const subscription = await Subscription.findOne({ user: user._id });
    
    console.log('📋 USER INFO:');
    console.log('   ID:', user._id);
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    
    console.log('\n📋 SUBSCRIPTION INFO:');
    console.log('   Plan:', subscription?.plan || 'NO SUBSCRIPTION');
    console.log('   Status:', subscription?.status || 'NO STATUS');
    console.log('   Ends:', subscription?.period?.end?.toLocaleDateString() || 'NO END DATE');
    
    // Simulate what /api/auth/me returns
    const authMeResponse = {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        subscription: subscription?.plan || 'basic', // This is the problematic line
        isVerified: user.isVerified,
        apiUsage: user.apiUsage
      }
    };
    
    console.log('\n📋 WHAT /api/auth/me RETURNS:');
    console.log('   Subscription:', authMeResponse.user.subscription);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testAuthMe();