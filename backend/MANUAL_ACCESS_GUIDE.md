# Manual Guide: Granting Insights Access to Users

## Quick Method (Using Scripts)

### 1. Grant Access to Specific User
```bash
cd backend
node scripts/grant-insights-leslieene.js
```

### 2. List All Users
```bash
cd backend
node scripts/list-users.js
```

### 3. Create Test User with Insights
```bash
cd backend
node scripts/create-paid-user.js
```

## Manual Method (Step-by-Step)

### Method 1: Using MongoDB Shell

1. **Connect to MongoDB:**
```bash
mongosh "mongodb://localhost:27017/agripulse"
```

2. **Find or Create User:**
```javascript
// Check if user exists
db.users.findOne({ email: "Leslieene60@gmail.com" })

// If user doesn't exist, create them
db.users.insertOne({
  name: "Leslieene",
  email: "Leslieene60@gmail.com", 
  organization: "Premium User",
  role: "buyer",
  useCase: "agribusiness",
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

3. **Grant Insights Subscription:**
```javascript
// Get user ID first
const user = db.users.findOne({ email: "Leslieene60@gmail.com" });

// Create/update subscription
db.subscriptions.updateOne(
  { user: user._id },
  {
    $set: {
      plan: "insights",
      status: "active",
      pricing: { 
        amount: 150000, 
        currency: "NGN", 
        interval: "month" 
      },
      limits: {
        apiRequests: 5000,
        dataExports: 50,
        dashboardAccess: "full",
        customReports: true,
        supportLevel: "email"
      },
      period: {
        start: new Date(),
        end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      payment: {
        method: "admin_grant",
        intent: "subscription",
        reference: "ADMIN-GRANT-" + Date.now(),
        status: "confirmed",
        confirmedAt: new Date()
      },
      autoRenew: false,
      metadata: {
        grantedBy: "admin",
        grantedAt: new Date().toISOString(),
        notes: "Insights access granted by administrator"
      }
    }
  },
  { upsert: true }
)
```

### Method 2: Using Node.js Script

Create a new file `backend/scripts/grant-access.js`:

```javascript
const mongoose = require('mongoose');
const User = require('../models/User');
const Subscription = require('../models/Subscription');

async function grantAccess(email, plan = 'insights', duration = 365) {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return;
    }
    
    // Grant subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan,
        status: 'active',
        period: {
          start: new Date(),
          end: new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
        },
        payment: {
          method: 'admin_grant',
          status: 'confirmed',
          confirmedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    console.log(`✅ ${plan.toUpperCase()} access granted to ${email}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

// Usage: node scripts/grant-access.js
grantAccess('Leslieene60@gmail.com');
```

Run it:
```bash
cd backend
node scripts/grant-access.js
```

## Available Plans

- **free**: Basic access, limited features
- **explorer**: Standard access, some premium features
- **insights**: Full access, all premium features
- **enterprise**: Unlimited access, priority support

## Verification

### Check User Access
```javascript
// In MongoDB shell
const user = db.users.findOne({ email: "Leslieene60@gmail.com" });
const subscription = db.subscriptions.findOne({ user: user._id });

console.log({
  user: user.name,
  email: user.email,
  plan: subscription.plan,
  status: subscription.status,
  expires: subscription.period.end
});
```

### Test Access via API
```bash
# Start server first
npm start

# Test user login (you'll need their password)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "Leslieene60@gmail.com", "password": "their_password"}'
```

## Managing Existing Users

### Upgrade User Plan
```javascript
// Find existing subscription and upgrade
db.subscriptions.updateOne(
  { user: ObjectId("USER_ID_HERE") },
  { $set: { plan: "insights", status: "active" } }
)
```

### Extend Access Period
```javascript
// Add 30 days to existing subscription
db.subscriptions.updateOne(
  { user: ObjectId("USER_ID_HERE") },
  { $set: { 
    "period.end": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    status: "active"
  }}
)
```

### Revoke Access
```javascript
// Set subscription to inactive
db.subscriptions.updateOne(
  { user: ObjectId("USER_ID_HERE") },
  { $set: { status: "inactive" } }
)
```

## Important Notes

1. **Email Verification**: Users should have `isVerified: true` for seamless access
2. **Password**: New users will need to set their password via the forgot password flow
3. **Duration**: Default is 1 year (365 days), adjust as needed
4. **Plan Features**: Each plan has different feature limits defined in the `limits` object
5. **Audit Trail**: All admin grants are recorded in the `metadata` field

## Troubleshooting

- **User not found**: Create the user first, then grant subscription
- **Duplicate subscription**: Use `upsert: true` to handle duplicates
- **Access not working**: Check both user exists and subscription is active
- **Database connection**: Ensure MongoDB is running and accessible