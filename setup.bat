@echo off
echo 🌱 Setting up AgriPulse Agricultural Data Platform...

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ MongoDB is not installed. Please install MongoDB 4.4+ from https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
npm run install-backend

REM Setup environment file
echo ⚙️ Setting up environment configuration...
cd backend
if not exist .env (
    copy .env.example .env
    echo 📝 Created .env file. Please edit backend\.env with your configuration:
    echo    - MongoDB URI
    echo    - JWT Secret
    echo    - Stripe Keys ^(from https://dashboard.stripe.com/apikeys^)
    echo    - Email settings ^(optional^)
) else (
    echo ⚠️ .env file already exists. Skipping environment setup.
)

cd ..

echo 🎉 Setup complete!
echo.
echo 📋 Next Steps:
echo 1. Edit backend\.env with your configuration
echo 2. Start MongoDB service
echo 3. Run: npm run dev
echo.
echo 🚀 Your AgriPulse platform will be available at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo.
echo 📚 For detailed instructions, see QUICK_START.md
pause