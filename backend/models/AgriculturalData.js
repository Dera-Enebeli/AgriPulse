const mongoose = require('mongoose');

const agriculturalDataSchema = new mongoose.Schema({
  // Source information
  sourceId: {
    type: String,
    required: true,
    index: true
  },
  cooperativeId: {
    type: String,
    required: true
  },
  
  // Anonymized location data (region, not exact coordinates)
  region: {
    type: String,
    required: true,
    enum: ['north-central', 'north-east', 'north-west', 'south-east', 'south-south', 'south-west']
  },
  state: {
    type: String,
    required: true
  },
  lga: {
    type: String,
    required: true
  },
  
  // Crop data
  cropType: {
    type: String,
    required: true,
    enum: ['rice', 'maize', 'cassava', 'yam', 'beans', 'millet', 'sorghum', 'cocoa', 'cotton', 'groundnut', 'other']
  },
  plantingDate: {
    type: Date,
    required: true
  },
  expectedHarvestDate: {
    type: Date,
    required: true
  },
  actualHarvestDate: Date,
  
  // Yield data (anonymized ranges)
  yieldRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    unit: { type: String, default: 'tons/hectare' }
  },
  
  // Input usage
  inputs: {
    fertilizer: {
      type: { type: String, enum: ['npk', 'urea', 'organic', 'none'] },
      quantity: Number,
      unit: String
    },
    seeds: {
      variety: String,
      quantity: Number,
      unit: String
    },
    pesticides: {
      type: { type: String, enum: ['herbicide', 'insecticide', 'fungicide', 'none'] },
      quantity: Number,
      unit: String
    }
  },
  
  // Risk factors
  riskFactors: [{
    type: {
      type: String,
      enum: ['drought', 'flood', 'pests', 'disease', 'market-price', 'conflict', 'other']
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'severe']
    },
    description: String
  }],
  
  // Market data
  marketPrice: {
    price: Number,
    currency: { type: String, default: 'NGN' },
    unit: { type: String, default: 'kg' },
    market: String,
    date: Date
  },
  
  // Data quality metrics
  quality: {
    completeness: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    timeliness: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    },
    overall: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.8
    }
  },
  
  // Processing metadata
  isAnonymized: {
    type: Boolean,
    default: true
  },
  processingDate: {
    type: Date,
    default: Date.now
  },
  lastValidated: Date,
  validationStatus: {
    type: String,
    enum: ['pending', 'validated', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes for performance
agriculturalDataSchema.index({ region: 1, cropType: 1 });
agriculturalDataSchema.index({ plantingDate: 1 });
agriculturalDataSchema.index({ expectedHarvestDate: 1 });
agriculturalDataSchema.index({ 'quality.overall': 1 });

// Data validation methods
agriculturalDataSchema.methods.validateData = function() {
  const errors = [];
  
  // Validate dates
  if (this.expectedHarvestDate <= this.plantingDate) {
    errors.push('Expected harvest date must be after planting date');
  }
  
  // Validate yield range
  if (this.yieldRange.min >= this.yieldRange.max) {
    errors.push('Minimum yield must be less than maximum yield');
  }
  
  // Calculate quality score
  this.quality.overall = (this.quality.completeness + this.quality.accuracy + this.quality.timeliness) / 3;
  
  return {
    isValid: errors.length === 0,
    errors,
    qualityScore: this.quality.overall
  };
};

// Anonymization method
agriculturalDataSchema.methods.anonymize = function() {
  // Add random noise to yield ranges (±5%)
  const noise = 0.05;
  this.yieldRange.min = this.yieldRange.min * (1 + (Math.random() - 0.5) * noise);
  this.yieldRange.max = this.yieldRange.max * (1 + (Math.random() - 0.5) * noise);
  
  // Round to reasonable precision
  this.yieldRange.min = Math.round(this.yieldRange.min * 100) / 100;
  this.yieldRange.max = Math.round(this.yieldRange.max * 100) / 100;
  
  this.isAnonymized = true;
  this.processingDate = new Date();
  
  return this;
};

module.exports = mongoose.model('AgriculturalData', agriculturalDataSchema);