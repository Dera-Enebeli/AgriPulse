const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function checkUserData() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Check user
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User found:');
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   User subscription field:', user.subscription);

    // Check separate subscription
    const subscription = await Subscription.findOne({ user: user._id });
    console.log('\n💳 Separate subscription:');
    if (subscription) {
      console.log('   Plan:', subscription.plan);
      console.log('   Status:', subscription.status);
      console.log('   User ID:', subscription.user);
    } else {
      console.log('   No separate subscription found');
    }

    // Test JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'test-secret', {
      expiresIn: '30d'
    });
    
    console.log('\n🔑 Test JWT Token:');
    console.log('   Token:', token.substring(0, 50) + '...');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkUserData();