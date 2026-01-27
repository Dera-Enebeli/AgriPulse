const mongoose = require('mongoose');
const AgriculturalData = require('../models/AgriculturalData');

// Test database connection and data
const testDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    const count = await AgriculturalData.countDocuments();
    console.log(`Total agricultural records: ${count}`);
    
    if (count > 0) {
      const sample = await AgriculturalData.findOne();
      console.log('Sample record:', {
        sourceId: sample.sourceId,
        region: sample.region,
        cropType: sample.cropType,
        plantingDate: sample.plantingDate,
        yieldRange: sample.yieldRange,
        marketPrice: sample.marketPrice,
        quality: sample.quality
      });
      
      // Test aggregation
      const cropDist = await AgriculturalData.aggregate([
        { $match: {} },
        {
          $group: {
            _id: '$cropType',
            count: { $sum: 1 },
          }
        },
        { $sort: { count: -1 } }
      ]);
      
      console.log('Crop distribution:', cropDist);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database test error:', error);
    process.exit(1);
  }
};

testDatabase();