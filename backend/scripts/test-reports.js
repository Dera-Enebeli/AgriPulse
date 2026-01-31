require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Report = require('../models/Report');
const jwt = require('jsonwebtoken');
const request = require('supertest');

async function testReportGeneration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    console.log('🧪 Testing Report Generation\n');
    
    // Get Leslieene's user info
    const user = await User.findOne({ email: 'leslieene60@gmail.com' });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Test monthly insights report generation
    console.log('1️⃣ Testing Monthly Insights Report Generation...');
    const generateResponse = await request('http://localhost:5002')
      .post('/api/reports/generate/monthly-insights')
      .set('Authorization', `Bearer ${token}`)
      .send({
        region: 'north-central',
        cropTypes: ['rice', 'maize'],
        includeCharts: true
      });
    
    console.log('Status:', generateResponse.status);
    console.log('Response:', JSON.stringify(generateResponse.body, null, 2));
    
    // Wait a bit then check status
    if (generateResponse.body.success) {
      const reportId = generateResponse.body.report.id;
      
      console.log('\n⏳ Waiting 6 seconds for report generation...');
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      console.log('2️⃣ Checking Report Status...');
      const statusResponse = await request('http://localhost:5002')
        .get(`/api/reports/${reportId}`)
        .set('Authorization', `Bearer ${token}`);
      
      console.log('Status:', statusResponse.status);
      console.log('Report Status:', statusResponse.body.report?.status);
      
      if (statusResponse.body.report?.status === 'ready') {
        console.log('✅ Monthly Insights Report Generated Successfully!');
        console.log('Title:', statusResponse.body.report.title);
        console.log('Summary:', JSON.stringify(statusResponse.body.report.summary, null, 2));
      }
    }
    
    // Test listing reports
    console.log('\n3️⃣ Testing Reports Listing...');
    const listResponse = await request('http://localhost:5002')
      .get('/api/reports')
      .set('Authorization', `Bearer ${token}`);
    
    console.log('Status:', listResponse.status);
    console.log('Reports Count:', listResponse.body.data?.reports?.length || 0);
    
    if (listResponse.body.success) {
      listResponse.body.data.reports.forEach((report, i) => {
        console.log(`   ${i + 1}. ${report.title} (${report.status})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testReportGeneration();