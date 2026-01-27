const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function updateUserSubscription() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Update user's subscription field to match separate subscription
    const result = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      { 
        subscription: {
          plan: 'insights',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    );

    if (result) {
      console.log('✅ Updated user subscription field!');
      console.log('   Old plan:', result.subscription.plan);
      console.log('   New plan: insights');
    } else {
      console.log('❌ User not found');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

updateUserSubscription();