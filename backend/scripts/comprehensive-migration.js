const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function comprehensiveMigration() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // 1. Update User embedded subscriptions to match new schema
    console.log('\n🔄 Step 1: Updating User embedded subscriptions...');
    
    const userUpdateResult = await User.updateMany(
      {
        $or: [
          { 'subscription.plan': { $exists: false } },
          { 'subscription.plan': 'basic' },
          { 'subscription.plan': 'explorer' },
          { 'subscription.status': { $exists: false } }
        ]
      },
      {
        $set: {
          'subscription.plan': 'free',
          'subscription.status': 'active',
          'subscription.startDate': new Date(),
          'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }
    );
    
    console.log(`   ✅ Updated ${userUpdateResult.modifiedCount} user subscription fields`);

    // 2. Update separate Subscription documents
    console.log('\n🔄 Step 2: Updating separate Subscription documents...');
    
    const subscriptionUpdateResult = await Subscription.updateMany(
      {
        $or: [
          { plan: { $exists: false } },
          { plan: 'basic' },
          { plan: 'explorer' },
          { status: { $exists: false } }
        ]
      },
      {
        $set: {
          plan: 'free',
          status: 'active',
          autoRenew: true,
          cancelAtPeriodEnd: false,
          'payment.intent': 'subscription',
          metadata: {
            signupSource: 'migration',
            migratedAt: new Date().toISOString()
          }
        }
      }
    );
    
    console.log(`   ✅ Updated ${subscriptionUpdateResult.modifiedCount} subscription documents`);

    // 3. Ensure all free plans have correct limits
    console.log('\n🔄 Step 3: Ensuring free plan limits...');
    
    const freeLimitsUpdate = await Subscription.updateMany(
      { plan: 'free' },
      {
        $set: {
          'limits.apiRequests': 0,
          'limits.dataExports': 0,
          'limits.dashboardAccess': 'read-only',
          'limits.customReports': false,
          'limits.supportLevel': 'basic',
          'pricing.amount': 0,
          'pricing.currency': 'NGN',
          'pricing.interval': 'month'
        }
      }
    );
    
    console.log(`   ✅ Updated ${freeLimitsUpdate.modifiedCount} free plan limits`);

    // 4. Clean up any orphaned records or inconsistent data
    console.log('\n🔄 Step 4: Cleaning up data consistency...');
    
    // Find subscriptions with mismatched user data
    const orphanedSubscriptions = await Subscription.find({
      user: { $exists: true }
    }).populate({
      path: 'user',
      select: 'email name'
    });

    let orphanedCount = 0;
    for (const sub of orphanedSubscriptions) {
      if (!sub.user) {
        await Subscription.findByIdAndDelete(sub._id);
        orphanedCount++;
        console.log(`   🗑️ Removed orphaned subscription: ${sub._id}`);
      }
    }
    
    if (orphanedCount === 0) {
      console.log('   ✅ No orphaned subscriptions found');
    } else {
      console.log(`   ✅ Removed ${orphanedCount} orphaned subscriptions`);
    }

    // 5. Final verification
    console.log('\n📊 Step 5: Final verification...');
    
    const finalCounts = await Subscription.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } }
    ]);
    
    console.log('   Final subscription distribution:');
    finalCounts.forEach(item => {
      console.log(`     ${item._id}: ${item.count} users`);
    });

    // Get a sample of each plan type for verification
    const samples = await Subscription.aggregate([
      { $group: { _id: '$plan', sample: { $first: '$$ROOT' } }
    ]);
    
    console.log('\n🔍 Sample subscription structures:');
    samples.forEach(item => {
      console.log(`\n   Plan: ${item._id}`);
      console.log(`   Status: ${item.sample.status}`);
      console.log(`   Dashboard Access: ${item.sample.limits?.dashboardAccess}`);
      console.log(`   API Requests: ${item.sample.limits?.apiRequests}`);
      console.log(`   Custom Reports: ${item.sample.limits?.customReports}`);
    });

    console.log('\n🎉 Comprehensive migration complete!');

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

comprehensiveMigration();