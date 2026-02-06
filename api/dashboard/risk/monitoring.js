/**
 * Serverless function for risk monitoring
 * GET /api/dashboard/risk/monitoring
 */

const AgriculturalDataModel = require('../models/AgriculturalData');
const { withAuth, formatResponse, createErrorHandler } = require('../utils/auth');

const handler = async (req, res) => {
  try {
    const { region, riskType, severity } = req.query;
    
    // Build filters
    let filters = { riskFactors: { $exists: true, $ne: [] } };
    
    // Only add region filter if it's valid
    if (region && region !== 'all' && region !== 'undefined' && region !== null && region !== '') {
      filters.region = region;
    }
    
    if (riskType && riskType !== 'all' && riskType !== 'undefined') {
      filters['riskFactors.type'] = riskType;
    }
    
    if (severity && severity !== 'all' && severity !== 'undefined') {
      filters['riskFactors.severity'] = severity;
    }

    // Get risk monitoring data
    const riskData = await AgriculturalDataModel.getRiskMonitoring(filters);

    return res.status(200).json(
      formatResponse(true, riskData, 'Risk monitoring data retrieved successfully')
    );

  } catch (error) {
    const errorHandler = createErrorHandler('Failed to fetch risk monitoring data');
    return errorHandler(res, error);
  }
};

// Export with authentication middleware
module.exports = withAuth(handler);