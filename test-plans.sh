#!/bin/bash

echo "🌾 AgriPulse Payment Plans Test"
echo "=================================="

# Test Backend
echo "📡 Testing Backend API..."
backend_response=$(curl -s http://localhost:5002/api/payment/plans)
if echo "$backend_response" | grep -q "Explorer"; then
    echo "✅ Backend: Explorer plan found"
else
    echo "❌ Backend: Explorer plan not found"
fi

if echo "$backend_response" | grep -q "Insights Plan"; then
    echo "✅ Backend: Insights Plan found"
else
    echo "❌ Backend: Insights Plan not found"
fi

if echo "$backend_response" | grep -q "349"; then
    echo "✅ Backend: Enterprise pricing correct ($349)"
else
    echo "❌ Backend: Enterprise pricing incorrect"
fi

# Test Frontend
echo ""
echo "🌐 Testing Frontend..."
frontend_response=$(curl -s -I http://localhost:3001/payment)
if echo "$frontend_response" | grep -q "200"; then
    echo "✅ Frontend: Payment page accessible"
else
    echo "❌ Frontend: Payment page not accessible"
fi

# Test Quick Login
echo ""
echo "🔑 Testing Quick Login..."
quick_login_response=$(curl -s -I http://localhost:3001/quick-login.html/)
if echo "$quick_login_response" | grep -q "200"; then
    echo "✅ Quick Login: Page accessible"
else
    echo "❌ Quick Login: Page not accessible"
fi

echo ""
echo "🎯 Test URLs:"
echo "Frontend: http://localhost:3001"
echo "Payment:  http://localhost:3001/payment"
echo "Quick Login: http://localhost:3001/quick-login.html"
echo "Backend API: http://localhost:5002/api/payment/plans"

echo ""
echo "🎊 Test Complete!"