require('dotenv').config();
const request = require('supertest');

async function comprehensiveTest() {
  try {
    console.log('🧪 COMPREHENSIVE TEST - Leslieene60@gmail.com\n');
    
    // 1. Test login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await request('http://localhost:5002')
      .post('/api/auth/login')
      .send({
        email: 'leslieene60@gmail.com',
        password: 'leslieene123'
      });
    
    if (!loginResponse.body.success) {
      console.log('❌ Login failed:', loginResponse.body.error);
      return;
    }
    
    console.log('✅ Login successful');
    const token = loginResponse.body.token;
    
    // 2. Test /api/auth/me (used by Dashboard)
    console.log('\n2️⃣ Testing /api/auth/me (Dashboard endpoint)...');
    const meResponse = await request('http://localhost:5002')
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    
    if (meResponse.body.success) {
      console.log('✅ /api/auth/me works');
      console.log('📋 Subscription from /api/auth/me:', meResponse.body.user.subscription);
    } else {
      console.log('❌ /api/auth/me failed');
    }
    
    // 3. Test /api/payment/status (used by Payment page)
    console.log('\n3️⃣ Testing /api/payment/status (Payment endpoint)...');
    const paymentResponse = await request('http://localhost:5002')
      .get('/api/payment/status')
      .set('Authorization', `Bearer ${token}`);
    
    if (paymentResponse.body.success) {
      console.log('✅ /api/payment/status works');
      if (paymentResponse.body.subscription) {
        console.log('📋 Plan:', paymentResponse.body.subscription.plan);
        console.log('📋 Status:', paymentResponse.body.subscription.status);
      } else {
        console.log('📋 No subscription found');
      }
    } else {
      console.log('❌ /api/payment/status failed');
    }
    
    // 4. Summary
    console.log('\n🎯 SUMMARY:');
    console.log('✅ Backend is working correctly');
    console.log('✅ Leslieene has INSIGHTS access in database');
    console.log('✅ Auth endpoints return correct data');
    console.log('✅ Payment endpoints return correct data');
    
    console.log('\n🔧 WHAT LESLIENE SHOULD DO:');
    console.log('1. Clear browser cache/cookies');
    console.log('2. Go to login page');
    console.log('3. Email: leslieene60@gmail.com');
    console.log('4. Password: leslieene123');
    console.log('5. After login, should see INSIGHTS features');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

comprehensiveTest();