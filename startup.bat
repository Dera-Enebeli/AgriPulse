@echo off
echo Starting AgriPulse Farmer Data Marketplace...
echo.

echo [1/4] Checking dependencies...
cd /d "%~dp0"

echo [2/4] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo [3/4] Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo [4/4] Starting Frontend Server...
start "Frontend Server" cmd /k "npm start"

echo.
echo ========================================
echo AgriPulse is starting up...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5002
echo.
echo Please wait 10-15 seconds for servers to fully load.
echo ========================================
echo.
pause