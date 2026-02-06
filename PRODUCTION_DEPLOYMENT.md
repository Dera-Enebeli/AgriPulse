# Production Environment Setup for Vercel Deployment

## 🔐 Required Environment Variables

Add these to your Vercel project settings → Environment Variables:

### Core Configuration
```
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

### Database (REQUIRED)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agripulse_prod
```
*Get this from MongoDB Atlas dashboard*

### JWT Security (REQUIRED)
```
JWT_SECRET=your_super_secure_jwt_secret_key_for_production_minimum_32_characters
JWT_EXPIRE=7d
```
*Generate a strong secret - use openssl rand -base64 32*

### Payment Integration (Optional)
```
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key
```
*Get from Paystack dashboard*

### Email Configuration (Optional)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-app-password
```

### Data Processing
```
DATA_ANONYMIZATION_SALT=your_data_anonymization_salt_for_production
DATA_QUALITY_THRESHOLD=0.8
```

## 🚀 Deployment Steps

### 1. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create new cluster (M0 free tier for testing)
3. Create database user with strong password
4. Network Access → Add IP: 0.0.0.0/0 (allows Vercel)
5. Get connection string from Connect → Drivers

### 2. Vercel Deployment
1. Push code to GitHub
2. Import repository to Vercel
3. Configure all environment variables above
4. Deploy

### 3. Post-Deployment Testing
- Health check: `https://your-app-name.vercel.app/api/health`
- Registration: `https://your-app-name.vercel.app/api/auth/register`
- Login: `https://your-app-name.vercel.app/api/auth/login`

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB Atlas requires authentication
- [ ] Network access properly configured
- [ ] Test environment variables in development first
- [ ] Remove any sensitive code before deployment

## 📊 Monitoring

After deployment, monitor:
- Function execution times (Vercel Analytics)
- Database connection pool usage
- Error rates in Vercel logs
- API response times

## 🛠️ Troubleshooting

### Common Issues:
1. **Database Connection Error**
   - Verify MONGODB_URI format
   - Check Atlas network access
   - Ensure database user exists

2. **CORS Issues**
   - Verify FRONTEND_URL matches deployed URL
   - Check vercel.json headers configuration

3. **Function Timeouts**
   - Increase maxDuration in vercel.json
   - Optimize database queries
   - Check for infinite loops

4. **Environment Variables Not Working**
   - Redeploy after adding variables
   - Check variable names exactly match
   - Verify no trailing spaces in values

## 📱 Testing Your Deployment

```bash
# Test health endpoint
curl https://your-app-name.vercel.app/api/health

# Test registration
curl -X POST https://your-app-name.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","organization":"Test Org","useCase":"agribusiness"}'

# Test login
curl -X POST https://your-app-name.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```