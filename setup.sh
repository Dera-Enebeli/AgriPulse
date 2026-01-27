#!/bin/bash

# AgriPulse Quick Setup Script
echo "🌱 Setting up AgriPulse Agricultural Data Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB 4.4+ from https://www.mongodb.com/try/download/community"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies  
echo "📦 Installing backend dependencies..."
npm run install-backend

# Setup environment file
echo "⚙️ Setting up environment configuration..."
cd backend
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file. Please edit backend/.env with your configuration:"
    echo "   - MongoDB URI"
    echo "   - JWT Secret" 
    echo "   - Stripe Keys (from https://dashboard.stripe.com/apikeys)"
    echo "   - Email settings (optional)"
else
    echo "⚠️ .env file already exists. Skipping environment setup."
fi

cd ..

echo "🎉 Setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit backend/.env with your configuration"
echo "2. Start MongoDB service"
echo "3. Run: npm run dev"
echo ""
echo "🚀 Your AgriPulse platform will be available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo ""
echo "📚 For detailed instructions, see QUICK_START.md"