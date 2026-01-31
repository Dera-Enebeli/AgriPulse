require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function checkUserPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    const user = await User.findOne({ email: 'leslieene60@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('✅ Has password:', user.password ? 'Yes' : 'No');
    
    // Test various passwords
    const testPasswords = ['tempPassword123', 'password123', 'password'];
    
    for (const testPwd of testPasswords) {
      try {
        const isMatch = await bcrypt.compare(testPwd, user.password);
        console.log(`✅ Password "${testPwd}": ${isMatch ? 'MATCH ✅' : 'NO MATCH ❌'}`);
      } catch (error) {
        console.log(`❌ Error testing "${testPwd}":`, error.message);
      }
    }
    
    // Set a known password
    const newPassword = await bcrypt.hash('leslieene123', 12);
    await User.findByIdAndUpdate(user._id, { password: newPassword });
    
    console.log('\n🔑 NEW PASSWORD SET: leslieene123');
    console.log('📧 EMAIL: leslieene60@gmail.com');
    console.log('🎯 Try logging in with these credentials');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkUserPassword();