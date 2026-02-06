/**
 * Serverless function for market intelligence
 * GET /api/dashboard/market/intelligence
 */

const AgriculturalDataModel = require('../models/AgriculturalData');
const { withAuth, formatResponse, createErrorHandler } = require('../utils/auth');

const handler = async (req, res) => {
  try {
    const { cropType, region, timeRange = '3m' } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (timeRange) {
      case '1m':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
    }

    // Build filters
    let filters = {
      'marketPrice.date': { $gte: startDate, $lte: endDate }
    };
    
    if (cropType && cropType !== 'all' && cropType !== 'undefined' && cropType !== null && cropType !== '') {
      filters.cropType = cropType;
    }
    
    if (region && region !== 'all' && region !== 'undefined' && region !== null && region !== '') {
      filters.region = region;
    }

    // Get market intelligence data
    const marketData = await AgriculturalDataModel.getMarketIntelligence(filters);

    return res.status(200).json(
      formatResponse(true, marketData, 'Market intelligence retrieved successfully')
    );

  } catch (error) {
    const errorHandler = createErrorHandler('Failed to fetch market intelligence');
    return errorHandler(res, error);
  }
};

// Export with authentication middleware
module.exports = withAuth(handler);