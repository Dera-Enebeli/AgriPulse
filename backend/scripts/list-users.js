const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function listUsers() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Find all users
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }

    console.log(`👥 Found ${users.length} user(s):`);
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ID: ${user._id}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

listUsers();