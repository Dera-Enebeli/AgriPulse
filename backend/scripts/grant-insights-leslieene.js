const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const bcrypt = require('bcryptjs');

async function grantInsightsToLeslieene() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    console.log('✅ Connected to database');

    // Check if Leslieene already exists
    let user = await User.findOne({ email: 'Leslieene60@gmail.com' });
    
    if (!user) {
      // Create the user if they don't exist
      const hashedPassword = await bcrypt.hash('tempPassword123', 10);
      
      user = new User({
        name: 'Leslieene',
        email: 'Leslieene60@gmail.com',
        organization: 'Premium User',
        role: 'buyer',
        useCase: 'agribusiness',
        password: hashedPassword,
        isVerified: true
      });
      
      await user.save();
      console.log('👤 Created new user: Leslieene60@gmail.com');
    } else {
      console.log(`👤 Found existing user: ${user.name} (${user.email})`);
    }

    // Grant INSIGHTS subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan: 'insights',
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
          end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year access
        },
        payment: {
          method: 'admin_grant',
          intent: 'subscription',
          reference: 'ADMIN-GRANT-' + Date.now(),
          status: 'confirmed',
          confirmedAt: new Date()
        },
        autoRenew: false,
        metadata: {
          grantedBy: 'admin',
          grantedAt: new Date().toISOString(),
          notes: 'Insights access granted by administrator'
        }
      },
      { upsert: true }
    );

    console.log('✅ INSIGHTS subscription granted successfully!');
    console.log('');
    console.log('🎯 USER DETAILS:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: Leslieene60@gmail.com`);
    console.log(`   Plan: INSIGHTS (full access)`);
    console.log(`   Status: Active for 1 year`);
    console.log('');
    console.log('🚀 Features now available:');
    console.log('   - All dashboard filters');
    console.log('   - Market Intelligence tab');
    console.log('   - Risk Monitoring tab');
    console.log('   - Exact data counts');
    console.log('   - Downloadable reports');
    console.log('   - Custom reports');
    console.log('   - Premium visualizations');
    
    if (!user.isVerified) {
      console.log('');
      console.log('⚠️  Note: User will need to verify email if not already verified');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

grantInsightsToLeslieene();