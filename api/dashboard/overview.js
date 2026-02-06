/**
 * Serverless function for dashboard overview
 * GET /api/dashboard/overview
 */

const AgriculturalDataModel = require('../models/AgriculturalData');
const { withAuth, formatResponse, createErrorHandler } = require('../utils/auth');

const handler = async (req, res) => {
  try {
    const { region, cropType, timeRange = '6m' } = req.query;
    
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
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Build filters
    let filters = {
      plantingDate: { $gte: startDate, $lte: endDate }
    };
    
    // Only add region filter if it's valid
    if (region && region !== 'all' && region !== 'undefined' && region !== null && region !== '') {
      filters.region = region;
    }
    
    // Only add cropType filter if it's valid
    if (cropType && cropType !== 'all' && cropType !== 'undefined' && cropType !== null && cropType !== '') {
      filters.cropType = cropType;
    }

    // Get overview data
    const overviewData = await AgriculturalDataModel.getOverviewStats(filters);

    return res.status(200).json(
      formatResponse(true, overviewData, 'Dashboard overview retrieved successfully')
    );

  } catch (error) {
    const errorHandler = createErrorHandler('Failed to fetch dashboard overview');
    return errorHandler(res, error);
  }
};

// Export with authentication middleware
module.exports = withAuth(handler);