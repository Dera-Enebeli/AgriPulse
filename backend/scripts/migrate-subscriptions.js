const mongoose = require('mongoose');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function migrateSubscriptionSchema() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Get all existing subscriptions
    const subscriptions = await Subscription.find({});
    
    if (subscriptions.length === 0) {
      console.log('ℹ️ No existing subscriptions found');
      return;
    }

    console.log(`🔄 Found ${subscriptions.length} subscriptions to migrate...`);

    let migratedCount = 0;
    
    for (const subscription of subscriptions) {
      let needsUpdate = false;
      const updates = {};

      // Check and fix dashboardAccess field (was boolean, now string)
      if (typeof subscription.limits?.dashboardAccess === 'boolean') {
        updates['limits.dashboardAccess'] = subscription.limits.dashboardAccess ? 'full' : 'none';
        needsUpdate = true;
        console.log(`   🔄 Migrating dashboardAccess: ${subscription.limits.dashboardAccess} -> ${updates['limits.dashboardAccess']}`);
      }

      // Ensure all required fields exist
      if (!subscription.status) {
        updates.status = subscription.status || 'active';
        needsUpdate = true;
        console.log(`   🔄 Adding missing status: ${updates.status}`);
      }

      // Fix plan enum values
      if (subscription.plan === 'basic' || !subscription.plan) {
        updates.plan = 'free';
        needsUpdate = true;
        console.log(`   🔄 Fixing plan: ${subscription.plan} -> free`);
      }

      // Ensure payment intent field
      if (!subscription.payment?.intent) {
        updates['payment.intent'] = 'subscription';
        needsUpdate = true;
        console.log(`   🔄 Adding payment intent: subscription`);
      }

      // Ensure autoRenew and cancelAtPeriodEnd
      if (subscription.autoRenew === undefined) {
        updates.autoRenew = true;
        needsUpdate = true;
        console.log(`   🔄 Adding autoRenew: true`);
      }

      if (subscription.cancelAtPeriodEnd === undefined) {
        updates.cancelAtPeriodEnd = false;
        needsUpdate = true;
        console.log(`   🔄 Adding cancelAtPeriodEnd: false`);
      }

      // Add metadata if missing
      if (!subscription.metadata) {
        updates.metadata = {
          signupSource: 'migration',
          notes: 'Migrated from old schema'
        };
        needsUpdate = true;
        console.log(`   🔄 Adding metadata field`);
      }

      // Apply updates if needed
      if (needsUpdate) {
        await Subscription.findByIdAndUpdate(subscription._id, { $set: updates });
        migratedCount++;
        console.log(`   ✅ Updated subscription for user: ${subscription.user}`);
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${migratedCount} subscriptions`);

    // Show final subscription counts
    const counts = await Subscription.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Current subscription counts:');
    counts.forEach(item => {
      console.log(`   ${item._id || 'undefined'}: ${item.count} users`);
    });

    // Show sample migrated document
    const sampleMigrated = await Subscription.findOne({}).lean();
    if (sampleMigrated) {
      console.log('\n🔍 Sample migrated subscription structure:');
      console.log(JSON.stringify(sampleMigrated, null, 2));
    }

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

migrateSubscriptionSchema();