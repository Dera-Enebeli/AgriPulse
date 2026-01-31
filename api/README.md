# Vercel Deployment Configuration

This directory contains Vercel serverless function configurations for deploying the AgriPulse backend.

## Structure
- `index.js` - Main serverless function entry point
- Routes are handled by the Express app from `../backend/server.js`

## How it works
1. Vercel receives requests to `/api/*`
2. Serverless function forwards to Express app
3. Express routes handle the API logic
4. Backend functionality remains unchanged

## Environment Variables
Configure these in Vercel dashboard:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - JWT signing secret
- `PAYSTACK_SECRET_KEY` - Paystack secret key
- `FRONTEND_URL` - Production frontend URL
- `NODE_ENV` - Set to `production`

## Notes
- Backend code in `../backend/` remains unchanged
- Database connections and middleware work the same
- All existing API endpoints are preserved