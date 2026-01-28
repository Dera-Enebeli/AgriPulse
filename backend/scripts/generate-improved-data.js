const mongoose = require('mongoose');
const AgriculturalData = require('../models/AgriculturalData');

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agripulse';

async function generateImprovedAgriculturalData() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to database');

    // Clear existing data
    await AgriculturalData.deleteMany({});
    console.log('🗑️ Cleared existing agricultural data');

    // Nigeria agricultural regions and their characteristics
    const regions = ['north-central', 'north-east', 'north-west', 'south-east', 'south-south', 'south-west'];
    const states = {
      'north-central': ['Benue', 'Kogi', 'Kwara', 'Nasarawa', 'Niger', 'Plateau', 'FCT'],
      'north-east': ['Adamawa', 'Bauchi', 'Borno', 'Gombe', 'Taraba', 'Yobe'],
      'north-west': ['Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Jigawa', 'Sokoto', 'Zamfara'],
      'south-east': ['Abia', 'Anambra', 'Ebonyi', 'Enugu', 'Imo'],
      'south-south': ['Akwa Ibom', 'Bayelsa', 'Cross River', 'Delta', 'Edo', 'Rivers'],
      'south-west': ['Ekiti', 'Lagos', 'Ogun', 'Ondo', 'Osun', 'Oyo']
    };

    // Nigerian crops with realistic yield patterns
    const cropTypes = ['rice', 'maize', 'cassava', 'yam', 'beans', 'millet', 'sorghum', 'cocoa', 'cotton', 'groundnut'];
    
    // Yield ranges (tons/hectare) based on Nigerian agricultural reality
    const yieldRanges = {
      'rice': { min: 2.5, max: 6.0 },
      'maize': { min: 1.5, max: 5.0 },
      'cassava': { min: 10.0, max: 25.0 },
      'yam': { min: 8.0, max: 20.0 },
      'beans': { min: 0.8, max: 2.5 },
      'millet': { min: 1.0, max: 3.0 },
      'sorghum': { min: 1.2, max: 3.5 },
      'cocoa': { min: 0.5, max: 2.0 },
      'cotton': { min: 0.8, max: 2.5 },
      'groundnut': { min: 0.8, max: 2.0 }
    };

    // Generate 150 realistic farm records
    const samples = [];
    const now = new Date();
    
    for (let i = 0; i < 150; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const stateArray = states[region];
      const state = stateArray[Math.floor(Math.random() * stateArray.length)];
      
      const cropType = cropTypes[Math.floor(Math.random() * cropTypes.length)];
      const yieldRange = yieldRanges[cropType];
      
      // Generate realistic planting dates (within last 18 months)
      const plantingDate = new Date(now.getTime() - Math.random() * 150 * 24 * 60 * 60 * 1000);
      const expectedHarvestDate = new Date(plantingDate.getTime() + (90 + Math.random() * 60) * 24 * 60 * 60 * 1000);
      
      // Market data
      const marketDate = new Date(plantingDate.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000);
      const marketPrice = generateMarketPrice(cropType);
      
      // Quality metrics
      const completeness = 0.75 + Math.random() * 0.2;
      const accuracy = 0.65 + Math.random() * 0.25;
      const timeliness = 0.70 + Math.random() * 0.25;
      const overall = (completeness + accuracy + timeliness) / 3;

      // Risk factors (70% chance of having some risk)
      const riskFactors = [];
      const hasRisk = Math.random() > 0.3;
      
      if (hasRisk) {
        const riskTypes = ['drought', 'flood', 'pests', 'disease', 'market-price'];
        const riskType = riskTypes[Math.floor(Math.random() * riskTypes.length)];
        const severityOptions = ['low', 'medium', 'high', 'severe'];
        const severity = severityOptions[Math.floor(Math.random() * severityOptions.length)];
        
        riskFactors.push({
          type: riskType,
          severity: severity,
          description: `Sample ${riskType} occurrence in ${region}`
        });
      }

      // Generate LGA
      const lgaPrefixes = ['Urban', 'Rural', 'Central', 'Northern', 'Southern', 'Eastern', 'Western'];
      const lgaPrefix = lgaPrefixes[Math.floor(Math.random() * lgaPrefixes.length)];
      const lgaNumber = Math.floor(Math.random() * 999) + 1;
      const lga = `${lgaPrefix} LGA ${lgaNumber}`;

      // Input data (seeds and pesticides only - no fertilizer)
      const seedVarieties = ['Improved', 'Local', 'Hybrid', 'Certified'];
      const pesticideTypes = ['herbicide', 'insecticide', 'fungicide', 'none'];
      
      samples.push({
        sourceId: `SRC-${String(i + 1).padStart(6, '0')}`,
        cooperativeId: `COOP-${Math.floor(Math.random() * 50) + 1}`,
        region,
        state,
        lga,
        cropType,
        plantingDate,
        expectedHarvestDate,
        yieldRange,
        inputs: {
          seeds: {
            variety: `${cropType}-${seedVarieties[Math.floor(Math.random() * seedVarieties.length)]}`,
            quantity: Math.floor(Math.random() * (90 - 10)) + 10,
            unit: 'kg/ha'
          },
          pesticides: {
            type: pesticideTypes[Math.floor(Math.random() * pesticideTypes.length)],
            quantity: pesticideTypes[Math.floor(Math.random() * pesticideTypes.length)] === 'none' ? 0 : Math.floor(Math.random() * 5) + 1,
            unit: 'L/ha'
          }
        },
        riskFactors,
        marketPrice: {
          price: marketPrice,
          currency: 'NGN',
          unit: 'ton',
          market: `${state} Main Market`,
          date: marketDate
        },
        quality: {
          completeness: parseFloat(completeness.toFixed(2)),
          accuracy: parseFloat(accuracy.toFixed(2)),
          timeliness: parseFloat(timeliness.toFixed(2)),
          overall: parseFloat(overall.toFixed(2))
        },
        processingDate: new Date(),
        lastValidated: new Date(),
        validationStatus: 'validated',
        isAnonymized: true
      });
    }

    console.log(`🌱 Generated ${samples.length} realistic agricultural samples`);
    
    // Insert samples into database
    await AgriculturalData.insertMany(samples);
    console.log('💾 Successfully inserted samples into database');

    // Statistics about generated data
    const cropDistribution = {};
    samples.forEach(sample => {
      cropDistribution[sample.cropType] = (cropDistribution[sample.cropType] || 0) + 1;
    });

    const regionDistribution = {};
    samples.forEach(sample => {
      regionDistribution[sample.region] = (regionDistribution[sample.region] || 0) + 1;
    });

    const riskFactorStats = {};
    samples.forEach(sample => {
      sample.riskFactors.forEach(risk => {
        riskFactorStats[risk.type] = (riskFactorStats[risk.type] || 0) + 1;
        riskFactorStats['totalRisks'] = (riskFactorStats['totalRisks'] || 0) + 1;
      });
    });

    const qualityStats = {
      avgCompleteness: samples.reduce((sum, sample) => sum + sample.quality.completeness, 0) / samples.length,
      avgAccuracy: samples.reduce((sum, sample) => sum + sample.quality.accuracy, 0) / samples.length,
      avgTimeliness: samples.reduce((sum, sample) => sum + sample.quality.timeliness, 0) / samples.length,
      avgOverall: samples.reduce((sum, sample) => sum + sample.quality.overall, 0) / samples.length
    };

    console.log('\n📊 Data Statistics:');
    console.log(`📈 Crop Distribution: ${JSON.stringify(cropDistribution, null, 2)}`);
    console.log(`🗺️ Region Distribution: ${JSON.stringify(regionDistribution, null, 2)}`);
    console.log(`⚠️ Risk Factor Analysis: ${JSON.stringify(riskFactorStats, null, 2)}`);
    console.log(`✅ Quality Metrics: ${JSON.stringify(qualityStats, null, 2)}`);

    await mongoose.connection.close();
    console.log('\n🎉 Improved agricultural data generation complete!');
    
    return {
      success: true,
      stats: {
        totalRecords: samples.length,
        cropDistribution,
        regionDistribution,
        riskFactorStats,
        qualityStats
      }
    };
    
  } catch (error) {
    console.error('❌ Data generation error:', error);
    throw error;
  }
}

// Helper function to generate realistic market prices
function generateMarketPrice(cropType) {
  const basePrices = {
    'rice': 180000,
    'maize': 120000,
    'cassava': 80000,
    'yam': 250000,
    'beans': 180000,
    'millet': 150000,
    'sorghum': 140000,
    'cocoa': 400000,
    'cotton': 160000,
    'groundnut': 180000
  };
  
  const basePrice = basePrices[cropType] || 150000;
  const variance = 0.3; // 30% price variance
  const price = basePrice * (0.7 + (Math.random() * 0.6)); // 70-130% of base price
  
  return parseFloat(price.toFixed(0));
}

module.exports = generateImprovedAgriculturalData;