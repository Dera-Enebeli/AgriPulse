/**
 * Local development script for testing serverless functions
 * This simulates Vercel's serverless environment locally
 */

const { spawn } = require('child_process');
const path = require('path');

// Serverless functions to test
const functions = [
  { path: 'api/health.js', port: 3001 },
  { path: 'api/auth/login.js', port: 3002 },
  { path: 'api/auth/register.js', port: 3003 },
  { path: 'api/auth/me.js', port: 3004 },
  { path: 'api/auth/profile.js', port: 3005 },
  { path: 'api/payment/plans.js', port: 3006 },
  { path: 'api/dashboard/overview.js', port: 3007 },
  { path: 'api/dashboard/crops/trends.js', port: 3008 },
  { path: 'api/dashboard/market/intelligence.js', port: 3009 },
  { path: 'api/dashboard/risk/monitoring.js', port: 3010 },
  { path: 'api/contact/submit.js', port: 3011 },
  { path: 'api/reports/index.js', port: 3012 }
];

function startFunction(func) {
  const serverPath = path.join(__dirname, '..', func.path);
  
  const child = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      // Mock Vercel environment
      VERCEL: '1',
      VERCEL_URL: `localhost:${func.port}`
    }
  });

  child.on('error', (error) => {
    console.error(`Error starting ${func.path}:`, error);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${func.path} exited with code ${code}`);
    }
  });

  return child;
}

console.log('🚀 Starting serverless functions locally...');

const processes = functions.map(startFunction);

console.log('\n📋 Functions started:');
functions.forEach((func, index) => {
  console.log(`  ${index + 1}. ${func.path} → http://localhost:${func.port}`);
});

console.log('\n🧪 Test commands:');
console.log('curl http://localhost:3001');
console.log('curl -X POST http://localhost:3002 -H "Content-Type: application/json" -d \'{"email":"test@test.com","password":"password"}\'');

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping all functions...');
  processes.forEach(child => child.kill('SIGINT'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping all functions...');
  processes.forEach(child => child.kill('SIGTERM'));
  process.exit(0);
});