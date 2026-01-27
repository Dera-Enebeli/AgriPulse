# Quick Start Guide

## Prerequisites
1. **Node.js** (v16+) - https://nodejs.org/
2. **MongoDB** (v4.4+) - https://www.mongodb.com/try/download/community
3. **Git** - https://git-scm.com/

## Step 1: Install Dependencies

```bash
# Install frontend dependencies (run from root folder)
npm install

# Install backend dependencies
npm run install-backend
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cd backend
cp .env.example .env
```

2. Edit `backend/.env` with your settings:
- Get **MongoDB URI** (usually: `mongodb://localhost:27017/agripulse`)
- Get **Stripe Keys** from https://dashboard.stripe.com/apikeys
- Create **JWT Secret** (any random string)

## Step 3: Start MongoDB

```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

## Step 4: Start the Application

```bash
# Run both frontend and backend together
npm run dev

# Or start separately:
# Terminal 1: Backend
npm run backend

# Terminal 2: Frontend  
npm start
```

## Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## What to Test

1. **Register** a new account
2. **Login** with your credentials
3. **Explore Dashboard** (Overview, Market Intelligence, Risk Monitoring)
4. **Upgrade Subscription** (test with Stripe test mode)
5. **Test Data Filters** on dashboard pages

## Default Test Accounts (optional)

The system starts with no users. Register your first account to get started!

## Troubleshooting

### Port Already in Use?
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000
npx kill-port 5000
```

### MongoDB Connection Issues?
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Start MongoDB service
sudo service mongod start
```

### Dependencies Issues?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Development Features Enabled

- ✅ Hot reload for frontend
- ✅ Auto-restart for backend
- ✅ Console logging
- ✅ Error messages
- ✅ Sample data for testing

## Next Steps

1. Add real agricultural data
2. Configure Stripe for production
3. Set up monitoring
4. Deploy to production

---

**Need Help?** Check the full README.md or contact support at agripulse720@gmail.com