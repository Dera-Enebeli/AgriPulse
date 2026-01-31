require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const request = require('supertest');
const jwt = require('jsonwebtoken');

async function testApiUsageTracking() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    console.log('🧪 Testing API Usage Tracking\n');
    
    // Get Leslieene's subscription
    const user = await User.findOne({ email: 'leslieene60@gmail.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    const subscription = await Subscription.findOne({ user: user._id });
    
    console.log('📋 INITIAL USAGE:');
    console.log('   Plan:', subscription.plan);
    console.log('   API Limit:', subscription.limits.apiRequests);
    console.log('   API Used:', subscription.usage.apiRequests);
    console.log('   Can Use API:', subscription.canUse('api'));
    
    // Make several API calls
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    console.log('\n🌐 Making 5 API calls...');
    for (let i = 0; i < 5; i++) {
      try {
        await request('http://localhost:5002')
          .get('/api/data/crops/regions')
          .set('Authorization', `Bearer ${token}`);
        console.log(`   Call ${i + 1}: ✅ Success`);
      } catch (error) {
        console.log(`   Call ${i + 1}: ❌ Failed`);
      }
    }
    
    // Check usage after calls
    const updatedSubscription = await Subscription.findOne({ user: user._id });
    
    console.log('\n📋 USAGE AFTER CALLS:');
    console.log('   API Used:', updatedSubscription.usage.apiRequests);
    console.log('   Calls Tracked:', updatedSubscription.usage.apiRequests - subscription.usage.apiRequests);
    
    if (updatedSubscription.usage.apiRequests === subscription.usage.apiRequests) {
      console.log('\n❌ CONCLUSION: API usage is NOT being tracked!');
      console.log('💰 The 5,000/10,000 API limits are NOT enforced');
      console.log('🎯 This means users can make unlimited API calls');
    } else {
      console.log('\n✅ CONCLUSION: API usage IS being tracked!');
      console.log(`📊 Current usage: ${updatedSubscription.usage.apiRequests}/${updatedSubscription.limits.apiRequests}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testApiUsageTracking();