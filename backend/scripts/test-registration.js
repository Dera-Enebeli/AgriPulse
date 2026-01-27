const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function testRegistration() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Clear existing test users first
    await User.deleteMany({ email: /@test\.com$/ });
    await Subscription.deleteMany({});

    console.log('🗑️ Cleared existing test users');

    // Simulate what registration creates
    const testUser = new User({
      name: 'Test Registration',
      email: 'test-registration@test.com',
      password: 'password123',
      organization: 'Test Org',
      useCase: 'agribusiness'
    });

    await testUser.save();

    // Create free subscription
    const subscription = new Subscription({
      user: testUser._id,
      plan: 'free',
      status: 'active',
      pricing: { amount: 0, currency: 'NGN', interval: 'month' },
      limits: {
        apiRequests: 0,
        dataExports: 0,
        dashboardAccess: 'read-only',
        customReports: false,
        supportLevel: 'basic'
      },
      period: {
        start: new Date(),
        end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    await subscription.save();

    console.log('✅ Created test user with FREE subscription');
    console.log('📧 Email: test-registration@test.com');
    console.log('🔑 Password: password123');
    console.log('🆓 Plan: FREE (locked access)');

    // Test what the API would return
    const expectedResponse = {
      success: true,
      user: {
        id: testUser._id,
        name: testUser.name,
        email: testUser.email,
        organization: testUser.organization,
        role: testUser.role,
        subscription: subscription.plan, // This should be 'free'
        isVerified: testUser.isVerified
      }
    };

    console.log('\n🔍 Expected API response:');
    console.log(JSON.stringify(expectedResponse, null, 2));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

testRegistration();