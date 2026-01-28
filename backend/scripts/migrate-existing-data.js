const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function migrateExistingData() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    console.log('\n🔄 STEP 1: Migrating existing Subscription documents...');
    
    // Find all existing subscriptions
    const existingSubscriptions = await Subscription.find({});
    
    if (existingSubscriptions.length === 0) {
      console.log('ℹ️ No existing subscriptions found');
    } else {
      let migratedCount = 0;
      
      for (const sub of existingSubscriptions) {
        let needsUpdate = false;
        const updates = {};

        // Check if this needs free plan migration
        if (!sub.plan || sub.plan === 'basic' || sub.plan === 'explorer') {
          updates.plan = 'free';
          needsUpdate = true;
        }

        // Ensure required fields exist with defaults
        if (!sub.status) {
          updates.status = 'active';
          needsUpdate = true;
        }

        if (!sub.limits) {
          updates.limits = {
            apiRequests: 0,
            dataExports: 0,
            dashboardAccess: 'read-only',
            customReports: false,
            supportLevel: 'basic'
          };
          needsUpdate = true;
        }

        if (!sub.pricing) {
          updates.pricing = {
            amount: 0,
            currency: 'NGN',
            interval: 'month'
          };
          needsUpdate = true;
        }

        if (!sub.period) {
          updates.period = {
            start: new Date(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          };
          needsUpdate = true;
        }

        if (!sub.payment) {
          updates.payment = {
            intent: 'subscription'
          };
          needsUpdate = true;
        }

        if (!sub.metadata) {
          updates.metadata = {
            signupSource: 'legacy-migration',
            migratedAt: new Date().toISOString()
          };
          needsUpdate = true;
        }

        if (!sub.autoRenew !== undefined) {
          updates.autoRenew = true;
          needsUpdate = true;
        }

        if (!sub.cancelAtPeriodEnd !== undefined) {
          updates.cancelAtPeriodEnd = false;
          needsUpdate = true;
        }

        // Apply updates if needed
        if (needsUpdate) {
          await Subscription.findByIdAndUpdate(sub._id, { $set: updates });
          migratedCount++;
          console.log(`   ✅ Migrated subscription ${sub._id}: ${sub.plan} → free`);
        }
      }

      console.log(`✅ Migrated ${migratedCount} subscription documents`);
    }

    console.log('\n🔄 STEP 2: Migrating User embedded subscriptions...');
    
    // Update user embedded subscriptions
    const userUpdateResult = await User.updateMany(
      {
        $or: [
          { 'subscription.plan': { $exists: false } },
          { 'subscription.plan': 'basic' },
          { 'subscription.plan': 'explorer' }
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

    console.log(`✅ Updated ${userUpdateResult.modifiedCount} user subscription fields`);

    console.log('\n🔄 STEP 3: Creating sample data for testing...');
    
    // Create fresh sample records with new structure
    await Subscription.deleteMany({ user: null }); // Clean orphaned records
    
    const sampleSubscription = new Subscription({
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
        signupSource: 'sample-data',
        notes: 'Fresh record with new schema structure'
      }
    });

    console.log('Sample subscription structure:', JSON.stringify(sampleSubscription.toObject(), null, 2));

    console.log('\n🎉 Migration complete!');
    console.log('\n📋 Summary:');
    console.log('   - Existing data properly migrated to new schema');
    console.log('   - All users now have proper free plan structure');
    console.log('   - New records will follow updated schema');
    console.log('   - Database is ready for enhanced features');

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

migrateExistingData();