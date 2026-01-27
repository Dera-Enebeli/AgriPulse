const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function createPaidUser() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Create or find test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await User.findOneAndUpdate(
      { email: 'test@example.com' },
      {
        name: 'Test User',
        email: 'test@example.com',
        organization: 'Test Organization',
        useCase: 'Testing Dashboard',
        password: hashedPassword
      },
      { upsert: true, new: true }
    );

    console.log(`👤 Created/Updated user: ${user.name} (${user.email})`);

    // Create paid subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan: 'insights', // Change to 'enterprise' for full access
        status: 'active',
        pricing: { 
          amount: 150000, 
          currency: 'NGN', 
          interval: 'month' 
        },
        limits: {
          apiRequests: 5000,
          dataExports: 50,
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: 'email'
        },
        period: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        payment: {
          method: 'paystack',
          intent: 'subscription',
          reference: 'TEST-' + Date.now(),
          status: 'confirmed',
          confirmedAt: new Date()
        },
        autoRenew: true
      },
      { upsert: true }
    );

    console.log('✅ Created INSIGHTS subscription!');
    console.log('');
    console.log('🎯 LOGIN CREDENTIALS:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('   Plan: INSIGHTS (full access)');
    console.log('');
    console.log('🚀 You can now test:');
    console.log('   - All dashboard filters');
    console.log('   - Market Intelligence tab');
    console.log('   - Risk Monitoring tab');
    console.log('   - Exact data counts');
    console.log('   - Downloadable reports');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

createPaidUser();