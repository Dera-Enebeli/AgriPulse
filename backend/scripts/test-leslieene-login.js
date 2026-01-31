require('dotenv').config();
const request = require('supertest');

async function testLeslieeneLogin() {
  try {
    console.log('🧪 Testing Leslieene60@gmail.com login...\n');
    
    // Test login with the exact email/credentials
    const response = await request('http://localhost:5002')
      .post('/api/auth/login')
      .send({
        email: 'leslieene60@gmail.com',
        password: 'leslieene123'  // This is the password I set
      });
    
    console.log('📋 LOGIN RESPONSE STATUS:', response.status);
    console.log('📋 LOGIN RESPONSE BODY:', JSON.stringify(response.body, null, 2));
    
    if (response.body.success && response.body.token) {
      console.log('\n✅ Login successful! Testing /api/auth/me with token...\n');
      
      // Test /api/auth/me with the returned token
      const meResponse = await request('http://localhost:5002')
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${response.body.token}`);
      
      console.log('📋 /api/auth/me STATUS:', meResponse.status);
      console.log('📋 /api/auth/me BODY:', JSON.stringify(meResponse.body, null, 2));
      
      if (meResponse.body.success && meResponse.body.user) {
        console.log('\n🎯 FINAL RESULT:');
        console.log('User Name:', meResponse.body.user.name);
        console.log('User Email:', meResponse.body.user.email);
        console.log('Subscription Plan:', meResponse.body.user.subscription);
        
        if (meResponse.body.user.subscription === 'insights') {
          console.log('🎉 SUCCESS: Should have INSIGHTS access!');
        } else {
          console.log('❌ ISSUE: Plan is', meResponse.body.user.subscription);
        }
      }
    } else {
      console.log('❌ Login failed:', response.body.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLeslieeneLogin();