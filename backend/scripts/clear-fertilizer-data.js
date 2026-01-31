const mongoose = require('mongoose');
const AgriculturalData = require('../models/AgriculturalData');

async function clearFertilizerData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/agripulse');
    console.log('✅ Connected to database');

    console.log('\n🗑️ STEP 1: Clearing existing fertilizer data...');
    
    // Remove all existing agricultural data (includes fertilizer fields)
    const result = await AgriculturalData.deleteMany({});
    console.log(`   ✅ Removed ${result.deletedCount} existing records`);
    
    console.log('\n📋 STEP 2: Ready for your actual data...');
    console.log('   Fertilizer fields removed');
    console.log('   Database is clean for real farming data');
    
    await mongoose.connection.close();
    console.log('\n🎉 Database cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearFertilizerData();