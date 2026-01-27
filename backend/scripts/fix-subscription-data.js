const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function fixSubscriptionData() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // 1. Fix User embedded subscriptions
    console.log('\n🔄 Step 1: Fixing User embedded subscriptions...');
    
    const usersWithBadSubs = await User.find({
      $or: [
        { 'subscription.plan': { $exists: false } },
        { 'subscription.plan': 'basic' },
        { 'subscription.plan': 'explorer' },
        { 'subscription.status': { $exists: false } }
      ]
    });

    let userFixCount = 0;
    for (const user of usersWithBadSubs) {
      user.subscription.plan = 'free';
      user.subscription.status = 'active';
      user.subscription.startDate = new Date();
      user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await user.save();
      userFixCount++;
      console.log(`   ✅ Fixed user: ${user.email} -> FREE plan`);
    }
    console.log(`   ✅ Fixed ${userFixCount} user subscriptions`);

    // 2. Fix separate Subscription documents
    console.log('\n🔄 Step 2: Fixing separate Subscription documents...');
    
    const subscriptionsWithBadPlans = await Subscription.find({
      $or: [
        { plan: { $exists: false } },
        { plan: 'basic' },
        { plan: 'explorer' },
        { status: { $exists: false } }
      ]
    });

    let subFixCount = 0;
    for (const sub of subscriptionsWithBadPlans) {
      sub.plan = 'free';
      sub.status = 'active';
      sub.autoRenew = true;
      sub.cancelAtPeriodEnd = false;
      
      if (!sub.payment) sub.payment = {};
      if (!sub.metadata) sub.metadata = {};
      
      sub.payment.intent = 'subscription';
      sub.metadata.signupSource = 'migration';
      
      if (!sub.limits) sub.limits = {};
      
      sub.limits.apiRequests = 0;
      sub.limits.dataExports = 0;
      sub.limits.dashboardAccess = 'read-only';
      sub.limits.customReports = false;
      sub.limits.supportLevel = 'basic';
      
      await sub.save();
      subFixCount++;
      console.log(`   ✅ Fixed subscription: ${sub._id} -> FREE plan`);
    }
    console.log(`   ✅ Fixed ${subFixCount} subscription documents`);

    // 3. Verification
    console.log('\n📊 Step 3: Final verification...');
    
    const plans = await Subscription.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } }
    ]);
    
    console.log('   Current subscription distribution:');
    plans.forEach(item => {
      console.log(`     ${item._id}: ${item.count} users`);
    });

    // 4. Test new registration user
    console.log('\n🧪 Step 4: Creating test user with proper FREE plan...');
    
    // Clear existing test user
    await User.deleteOne({ email: 'test-free-user@test.com' });
    await Subscription.deleteOne({ user: null });
    
    const testUser = new User({
      name: 'Test Free User',
      email: 'test-free-user@test.com',
      password: 'testpassword123',
      organization: 'Test Organization',
      useCase: 'agribusiness'
    });
    
    await testUser.save();
    
    const testSubscription = new Subscription({
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
      },
      autoRenew: true,
      cancelAtPeriodEnd: false,
      payment: {
        intent: 'subscription'
      },
      metadata: {
        signupSource: 'test-migration'
      }
    });
    
    await testSubscription.save();
    
    console.log('   ✅ Created test FREE user:');
    console.log('      Email: test-free-user@test.com');
    console.log('      Password: testpassword123');
    console.log('      Plan: FREE (locked access)');

    console.log('\n🎉 Migration and fixes complete!');
    console.log('\n📋 Test credentials:');
    console.log('   Free user: test-free-user@test.com / testpassword123');
    console.log('   Paid user: test@example.com / password123 (if exists)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

fixSubscriptionData();