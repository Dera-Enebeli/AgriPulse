/**
 * Serverless function for crop trends
 * GET /api/dashboard/crops/trends
 */

const AgriculturalDataModel = require('../models/AgriculturalData');
const { withAuth, formatResponse, createErrorHandler } = require('../utils/auth');

const handler = async (req, res) => {
  try {
    const { region, cropType, granularity = 'monthly' } = req.query;
    
    // Build filters
    let filters = {};
    
    // Only add region filter if it's valid
    if (region && region !== 'all' && region !== 'undefined' && region !== null && region !== '') {
      filters.region = region;
    }
    
    // Only add cropType filter if it's valid
    if (cropType && cropType !== 'all' && cropType !== 'undefined' && cropType !== null && cropType !== '') {
      filters.cropType = cropType;
    }

    // Get crop trends data
    const trendsData = await AgriculturalDataModel.getCropTrends(filters, granularity);

    const responseData = {
      data: trendsData,
      granularity
    };

    return res.status(200).json(
      formatResponse(true, responseData, 'Crop trends retrieved successfully')
    );

  } catch (error) {
    const errorHandler = createErrorHandler('Failed to fetch crop trends');
    return errorHandler(res, error);
  }
};

// Export with authentication middleware
module.exports = withAuth(handler);