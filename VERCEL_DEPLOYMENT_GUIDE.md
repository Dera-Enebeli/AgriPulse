# Vercel Deployment Guide for AgriPulse

## 🚀 Pre-Deployment Checklist

### 1. MongoDB Atlas Setup (REQUIRED)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (M0 free tier works for testing)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for Vercel)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/agripulse_prod`

### 2. Paystack Configuration (REQUIRED)
1. Create account at [Paystack](https://paystack.com/)
2. Get API keys from dashboard
3. Test keys: `sk_test_*` and `pk_test_*`
4. Live keys: `sk_live_*` and `pk_live_*`

### 3. Vercel Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:

```
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agripulse_prod
JWT_SECRET=your_super_secure_jwt_secret_key_for_production
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key (or sk_live_*)
```

### 4. Deploy Steps
1. Push changes to GitHub
2. Import repository to Vercel
3. Configure environment variables
4. Deploy

### 5. Post-Deployment Testing
- Health check: `https://your-app-name.vercel.app/api/health`
- Frontend: `https://your-app-name.vercel.app`
- Test login/registration
- Test payment flow (if Paystack configured)

## 🔧 Architecture Changes Made

### Fixed Issues:
✅ API base URLs now use environment variables
✅ Removed development proxy configuration  
✅ Standardized to PayStack payment provider
✅ Created Vercel serverless function structure
✅ Production environment variables configured

### Remaining Major Tasks:
⚠️ Convert Express server to proper serverless functions (complex)
⚠️ Set up MongoDB Atlas cloud database

## 📊 Deployment Status

**Current State**: Ready for Vercel deployment with working frontend and basic API routing

**Known Limitations**: 
- Backend uses serverless wrapper (not true serverless functions)
- Requires MongoDB Atlas setup
- Some advanced features may need adjustments for serverless environment

**Next Steps**: 
1. Set up MongoDB Atlas
2. Configure Vercel environment variables
3. Deploy to Vercel
4. Test all functionality
5. Convert to proper serverless functions if needed