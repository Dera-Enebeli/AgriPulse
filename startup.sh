#!/bin/bash

echo "Starting AgriPulse Farmer Data Marketplace..."
echo

echo "[1/4] Checking dependencies..."
cd "$(dirname "$0")"

echo "[2/4] Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

echo "[3/4] Waiting for backend to initialize..."
sleep 5

echo "[4/4] Starting Frontend Server..."
npm start &
FRONTEND_PID=$!

echo
echo "========================================"
echo "AgriPulse is starting up..."
echo
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5002"
echo
echo "Please wait 10-15 seconds for servers to fully load."
echo "========================================"
echo
echo "Press Ctrl+C to stop all servers"
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait