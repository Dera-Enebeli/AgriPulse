// Sample agricultural data for development and testing
export const sampleAgriculturalData = [
  {
    id: 1,
    region: 'north-central',
    state: 'Niger',
    lga: 'Bida',
    cropType: 'rice',
    plantingDate: '2024-03-15',
    expectedHarvestDate: '2024-07-15',
    yieldRange: { min: 3.5, max: 4.8, unit: 'tons/hectare' },
    inputs: {
      fertilizer: { type: 'npk', quantity: 200, unit: 'kg/hectare' },
      seeds: { variety: 'Nerica 8', quantity: 50, unit: 'kg/hectare' },
      pesticides: { type: 'herbicide', quantity: 2, unit: 'liters/hectare' }
    },
    riskFactors: [
      { type: 'flood', severity: 'medium', description: 'Possible flooding during rainy season' }
    ],
    marketPrice: { price: 250, currency: 'NGN', unit: 'kg', market: 'Bida Market', date: '2024-07-01' },
    quality: { completeness: 0.95, accuracy: 0.88, timeliness: 0.92, overall: 0.92 }
  },
  {
    id: 2,
    region: 'north-west',
    state: 'Kano',
    lga: 'Kura',
    cropType: 'maize',
    plantingDate: '2024-04-01',
    expectedHarvestDate: '2024-08-01',
    yieldRange: { min: 2.8, max: 3.9, unit: 'tons/hectare' },
    inputs: {
      fertilizer: { type: 'urea', quantity: 150, unit: 'kg/hectare' },
      seeds: { variety: 'SAMMAZ 16', quantity: 25, unit: 'kg/hectare' },
      pesticides: { type: 'insecticide', quantity: 1.5, unit: 'liters/hectare' }
    },
    riskFactors: [
      { type: 'drought', severity: 'low', description: 'Mild drought conditions possible' },
      { type: 'pests', severity: 'medium', description: 'Fall armyworm risk' }
    ],
    marketPrice: { price: 180, currency: 'NGN', unit: 'kg', market: 'Kano Market', date: '2024-08-01' },
    quality: { completeness: 0.88, accuracy: 0.91, timeliness: 0.95, overall: 0.91 }
  },
  {
    id: 3,
    region: 'south-west',
    state: 'Oyo',
    lga: 'Ibadan',
    cropType: 'cassava',
    plantingDate: '2024-02-15',
    expectedHarvestDate: '2024-10-15',
    yieldRange: { min: 15, max: 25, unit: 'tons/hectare' },
    inputs: {
      fertilizer: { type: 'organic', quantity: 3000, unit: 'kg/hectare' },
      seeds: { variety: 'TME 419', quantity: 5000, unit: 'cuttings/hectare' },
      pesticides: { type: 'none', quantity: 0, unit: 'liters/hectare' }
    },
    riskFactors: [
      { type: 'disease', severity: 'low', description: 'Possible cassava mosaic disease' }
    ],
    marketPrice: { price: 120, currency: 'NGN', unit: 'kg', market: 'Ibadan Market', date: '2024-10-01' },
    quality: { completeness: 0.92, accuracy: 0.87, timeliness: 0.89, overall: 0.89 }
  },
  {
    id: 4,
    region: 'south-east',
    state: 'Anambra',
    lga: 'Anocha',
    cropType: 'yam',
    plantingDate: '2024-03-01',
    expectedHarvestDate: '2024-09-01',
    yieldRange: { min: 8, max: 12, unit: 'tons/hectare' },
    inputs: {
      fertilizer: { type: 'npk', quantity: 250, unit: 'kg/hectare' },
      seeds: { variety: 'Dioscorea rotundata', quantity: 2000, unit: 'tubers/hectare' },
      pesticides: { type: 'fungicide', quantity: 3, unit: 'liters/hectare' }
    },
    riskFactors: [
      { type: 'pests', severity: 'medium', description: 'Yam beetle risk' }
    ],
    marketPrice: { price: 350, currency: 'NGN', unit: 'kg', market: 'Onitsha Market', date: '2024-09-01' },
    quality: { completeness: 0.90, accuracy: 0.93, timeliness: 0.88, overall: 0.90 }
  },
  {
    id: 5,
    region: 'north-east',
    state: 'Adamawa',
    lga: 'Yola',
    cropType: 'beans',
    plantingDate: '2024-05-01',
    expectedHarvestDate: '2024-08-01',
    yieldRange: { min: 1.2, max: 2.1, unit: 'tons/hectare' },
    inputs: {
      fertilizer: { type: 'npk', quantity: 100, unit: 'kg/hectare' },
      seeds: { variety: 'Brown beans', quantity: 60, unit: 'kg/hectare' },
      pesticides: { type: 'insecticide', quantity: 1, unit: 'liters/hectare' }
    },
    riskFactors: [
      { type: 'conflict', severity: 'low', description: 'Possible security concerns' }
    ],
    marketPrice: { price: 400, currency: 'NGN', unit: 'kg', market: 'Yola Market', date: '2024-08-01' },
    quality: { completeness: 0.85, accuracy: 0.89, timeliness: 0.91, overall: 0.88 }
  }
];

// Generate time-series data for trends
export const generateTrendData = (months = 12) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    data.push({
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      timestamp: date.getTime(),
      // Simulate seasonal variations
      value: Math.floor(Math.random() * 50) + 100 + (Math.sin(i / 2) * 20)
    });
  }
  
  return data;
};

// Regional distribution data
export const regionalDistribution = [
  { region: 'north-central', farms: 1250, avgYield: 3.8 },
  { region: 'north-west', farms: 2100, avgYield: 3.2 },
  { region: 'north-east', farms: 890, avgYield: 2.9 },
  { region: 'south-west', farms: 1850, avgYield: 4.1 },
  { region: 'south-south', farms: 1100, avgYield: 3.6 },
  { region: 'south-east', farms: 1500, avgYield: 3.9 }
];

// Market volatility data
export const marketVolatility = [
  { cropType: 'rice', volatility: 15.2, riskLevel: 'medium' },
  { cropType: 'maize', volatility: 8.7, riskLevel: 'low' },
  { cropType: 'cassava', volatility: 12.3, riskLevel: 'medium' },
  { cropType: 'yam', volatility: 22.8, riskLevel: 'high' },
  { cropType: 'beans', volatility: 18.5, riskLevel: 'medium' }
];

// Risk factors distribution
export const riskFactors = [
  { type: 'drought', count: 145, severity: 'medium', regions: ['north-west', 'north-east'] },
  { type: 'flood', count: 89, severity: 'high', regions: ['north-central', 'south-south'] },
  { type: 'pests', count: 234, severity: 'medium', regions: ['south-west', 'south-east'] },
  { type: 'disease', count: 167, severity: 'low', regions: ['south-east', 'south-south'] },
  { type: 'market-price', count: 298, severity: 'medium', regions: ['all'] },
  { type: 'conflict', count: 56, severity: 'high', regions: ['north-east'] }
];

// Quality metrics across regions
export const qualityMetrics = [
  { region: 'north-central', completeness: 0.91, accuracy: 0.88, timeliness: 0.93 },
  { region: 'north-west', completeness: 0.87, accuracy: 0.90, timeliness: 0.89 },
  { region: 'north-east', completeness: 0.83, accuracy: 0.85, timeliness: 0.82 },
  { region: 'south-west', completeness: 0.94, accuracy: 0.92, timeliness: 0.96 },
  { region: 'south-south', completeness: 0.89, accuracy: 0.87, timeliness: 0.90 },
  { region: 'south-east', completeness: 0.92, accuracy: 0.91, timeliness: 0.88 }
];

// Crop planting calendar
export const cropCalendar = [
  { crop: 'rice', plantingMonths: ['Mar', 'Apr'], harvestMonths: ['Jul', 'Aug'], regions: ['north-central', 'north-west'] },
  { crop: 'maize', plantingMonths: ['Apr', 'May'], harvestMonths: ['Aug', 'Sep'], regions: ['north-west', 'south-west'] },
  { crop: 'cassava', plantingMonths: ['Feb', 'Mar'], harvestMonths: ['Sep', 'Oct'], regions: ['south-west', 'south-south'] },
  { crop: 'yam', plantingMonths: ['Mar', 'Apr'], harvestMonths: ['Aug', 'Sep'], regions: ['south-east', 'north-central'] },
  { crop: 'beans', plantingMonths: ['May', 'Jun'], harvestMonths: ['Aug', 'Sep'], regions: ['north-east', 'north-central'] }
];