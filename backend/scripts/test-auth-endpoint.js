require('dotenv').config();
const request = require('supertest');

async function testAuthEndpoint() {
  try {
    console.log('🧪 Testing /api/auth/me endpoint...\n');
    
    // First, let's create a test token for Leslieene
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const mongoose = require('mongoose');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    const user = await User.findOne({ email: 'leslieene60@gmail.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    await mongoose.connection.close();
    
    // Test the endpoint
    const response = await request('http://localhost:5000')
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    console.log('📋 RESPONSE STATUS:', response.status);
    console.log('📋 RESPONSE BODY:', JSON.stringify(response.body, null, 2));
    
    if (response.body.success && response.body.user) {
      console.log('\n✅ USER SUBSCRIPTION PLAN:', response.body.user.subscription);
      
      if (response.body.user.subscription === 'insights') {
        console.log('🎉 SUCCESS: User has INSIGHTS access!');
      } else {
        console.log('⚠️  User plan:', response.body.user.subscription);
      }
    } else {
      console.log('❌ ERROR: Invalid response');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuthEndpoint();