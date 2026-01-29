const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Report identification
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['monthly_insights', 'custom_enterprise', 'regional_deep_dive', 'crop_trends', 'risk_analysis'],
    required: true
  },
  format: {
    type: String,
    enum: ['pdf', 'csv', 'excel'],
    required: true
  },
  
  // Report parameters (for generating)
  parameters: {
    region: String,
    cropTypes: [String],
    dateRange: {
      start: Date,
      end: Date
    },
    includeCharts: Boolean,
    includeRawData: Boolean,
    customFilters: mongoose.Schema.Types.Mixed
  },
  
  // Generation status
  status: {
    type: String,
    enum: ['pending', 'generating', 'ready', 'failed', 'expired'],
    default: 'pending'
  },
  
  // File information
  file: {
    filename: String,
    path: String,
    size: Number, // bytes
    downloadCount: { type: Number, default: 0 }
  },
  
  // Content summary
  summary: {
    totalRecords: Number,
    regionsCovered: [String],
    cropsCovered: [String],
    dateRange: {
      start: Date,
      end: Date
    },
    keyInsights: [String],
    dataQuality: {
      completeness: Number, // 0-1
      accuracy: Number, // 0-1
      timeliness: Number // 0-1
    }
  },
  
  // Metadata
  generationTime: Number, // milliseconds
  generatedAt: Date,
  expiresAt: Date, // For Insights users (30 days)
  customRequestId: String, // For Enterprise custom requests
  
}, { timestamps: true });

// Indexes
reportSchema.index({ user: 1, status: 1 });
reportSchema.index({ type: 1, createdAt: -1 });
reportSchema.index({ expiresAt: 1 });

// Methods
reportSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

reportSchema.methods.canDownload = function() {
  return this.status === 'ready' && !this.isExpired();
};

module.exports = mongoose.model('Report', reportSchema);