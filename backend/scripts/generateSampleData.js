const mongoose = require('mongoose');
const AgriculturalData = require('../models/AgriculturalData');

// Sample data generator
const generateSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse');
    
    // Clear existing data
    await AgriculturalData.deleteMany({});
    console.log('Cleared existing agricultural data');

    const regions = ['north-central', 'north-east', 'north-west', 'south-east', 'south-south', 'south-west'];
    const states = {
      'north-central': ['Niger', 'Kogi', 'Benue', 'Nassarawa', 'Kwara', 'FCT'],
      'north-east': ['Borno', 'Yobe', 'Adamawa', 'Bauchi', 'Gombe', 'Taraba'],
      'north-west': ['Kano', 'Kaduna', 'Katsina', 'Jigawa', 'Sokoto', 'Zamfara', 'Kebbi'],
      'south-east': ['Ebonyi', 'Enugu', 'Anambra', 'Abia', 'Imo'],
      'south-south': ['Rivers', 'Bayelsa', 'Edo', 'Delta', 'Cross River', 'Akwa Ibom'],
      'south-west': ['Lagos', 'Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti', 'Kwara']
    };
    
    const cropTypes = ['rice', 'maize', 'cassava', 'yam', 'beans', 'millet', 'sorghum', 'cocoa', 'cotton', 'groundnut'];
    const markets = ['Main Market', 'Central Market', 'Regional Hub', 'Local Market', 'Export Hub'];
    
    const riskTypes = ['drought', 'flood', 'pests', 'disease', 'market-price', 'conflict', 'other'];
    const severities = ['low', 'medium', 'high', 'severe'];
    
    const sampleData = [];

    // Generate 500 sample records
    for (let i = 0; i < 500; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const stateList = states[region];
      const state = stateList[Math.floor(Math.random() * stateList.length)];
      const cropType = cropTypes[Math.floor(Math.random() * cropTypes.length)];
      
      // Generate realistic dates (within last year)
      const currentYear = new Date().getFullYear();
      const monthsBack = Math.floor(Math.random() * 12); // 0-11 months ago
      const plantingDate = new Date(currentYear, new Date().getMonth() - monthsBack, Math.floor(Math.random() * 28) + 1);
      const harvestMonths = Math.floor(Math.random() * 4) + 3; // 3-6 months growth cycle
      const harvestDate = new Date(plantingDate.getFullYear(), plantingDate.getMonth() + harvestMonths, plantingDate.getDate());
      
      // Generate yield ranges based on crop type
      let minYield, maxYield;
      switch (cropType) {
        case 'rice':
          minYield = 2 + Math.random() * 2;
          maxYield = minYield + Math.random() * 2 + 1;
          break;
        case 'maize':
          minYield = 1.5 + Math.random() * 1.5;
          maxYield = minYield + Math.random() * 1.5 + 1;
          break;
        case 'cassava':
          minYield = 10 + Math.random() * 10;
          maxYield = minYield + Math.random() * 10 + 5;
          break;
        case 'yam':
          minYield = 8 + Math.random() * 8;
          maxYield = minYield + Math.random() * 8 + 4;
          break;
        default:
          minYield = 1 + Math.random() * 2;
          maxYield = minYield + Math.random() * 2 + 1;
      }

      // Generate market price
      const basePrice = {
        'rice': 150,
        'maize': 120,
        'cassava': 80,
        'yam': 200,
        'beans': 180,
        'millet': 100,
        'sorghum': 90,
        'cocoa': 800,
        'cotton': 250,
        'groundnut': 160
      };
      
      const priceVariation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const marketPrice = basePrice[cropType] * (1 + priceVariation);

      // Generate risk factors (60% chance of having risks)
      const riskFactors = [];
      if (Math.random() < 0.6) {
        const numRisks = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numRisks; j++) {
          riskFactors.push({
            type: riskTypes[Math.floor(Math.random() * riskTypes.length)],
            severity: severities[Math.floor(Math.random() * severities.length)],
            description: `Risk factor ${j + 1} description`
          });
        }
      }

      // Generate quality scores
      const completeness = 0.7 + Math.random() * 0.3;
      const accuracy = 0.75 + Math.random() * 0.25;
      const timeliness = 0.8 + Math.random() * 0.2;
      const overall = (completeness + accuracy + timeliness) / 3;

      const record = {
        sourceId: `SRC${String(i + 1).padStart(6, '0')}`,
        cooperativeId: `COOP${Math.floor(Math.random() * 100) + 1}`,
        region,
        state,
        lga: `${state} LGA ${Math.floor(Math.random() * 20) + 1}`,
        cropType,
        plantingDate,
        expectedHarvestDate: harvestDate,
        actualHarvestDate: Math.random() < 0.7 ? new Date(harvestDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
        yieldRange: {
          min: Math.round(minYield * 100) / 100,
          max: Math.round(maxYield * 100) / 100,
          unit: 'tons/hectare'
        },
        inputs: {
          fertilizer: {
            type: ['npk', 'urea', 'organic', 'none'][Math.floor(Math.random() * 4)],
            quantity: Math.round(Math.random() * 200 + 50),
            unit: 'kg/hectare'
          },
          seeds: {
            variety: `Variety ${Math.floor(Math.random() * 10) + 1}`,
            quantity: Math.round(Math.random() * 50 + 10),
            unit: 'kg/hectare'
          },
          pesticides: {
            type: ['herbicide', 'insecticide', 'fungicide', 'none'][Math.floor(Math.random() * 4)],
            quantity: Math.round(Math.random() * 5 + 1),
            unit: 'liters/hectare'
          }
        },
        riskFactors,
        marketPrice: {
          price: Math.round(marketPrice),
          currency: 'NGN',
          unit: 'kg',
          market: markets[Math.floor(Math.random() * markets.length)],
          date: new Date(plantingDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000)
        },
        quality: {
          completeness: Math.round(completeness * 100) / 100,
          accuracy: Math.round(accuracy * 100) / 100,
          timeliness: Math.round(timeliness * 100) / 100,
          overall: Math.round(overall * 100) / 100
        },
        isAnonymized: true,
        processingDate: new Date(),
        validationStatus: ['pending', 'validated', 'rejected'][Math.floor(Math.random() * 3)]
      };

      sampleData.push(record);
    }

    // Insert sample data
    await AgriculturalData.insertMany(sampleData);
    console.log(`Generated ${sampleData.length} sample agricultural records`);
    
    // Update some records to have different validation dates
    await AgriculturalData.updateMany(
      { validationStatus: 'validated' },
      { $set: { lastValidated: new Date() } }
    );

    console.log('Sample data generation completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('Error generating sample data:', error);
    process.exit(1);
  }
};

generateSampleData();