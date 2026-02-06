/**
 * Serverless function for reports endpoints
 * GET /api/reports
 */

const { withAuth, formatResponse, createErrorHandler } = require('../utils/auth');

const handler = async (req, res) => {
  try {
    // Mock reports data - in a real implementation, this would come from the database
    const mockReports = [
      {
        id: 'report_1',
        title: 'Monthly Agricultural Insights - January 2024',
        type: 'monthly-insights',
        generatedAt: new Date('2024-01-31T23:59:59Z').toISOString(),
        status: 'completed',
        downloadUrl: '/api/reports/report_1/download',
        fileSize: '2.4 MB',
        format: 'PDF'
      },
      {
        id: 'report_2',
        title: 'Custom Market Analysis - Northern Region',
        type: 'custom-analysis',
        generatedAt: new Date('2024-01-28T14:30:00Z').toISOString(),
        status: 'completed',
        downloadUrl: '/api/reports/report_2/download',
        fileSize: '1.8 MB',
        format: 'PDF'
      }
    ];

    const responseData = {
      reports: mockReports,
      total: mockReports.length
    };

    return res.status(200).json(
      formatResponse(true, responseData, 'Reports retrieved successfully')
    );

  } catch (error) {
    const errorHandler = createErrorHandler('Failed to retrieve reports');
    return errorHandler(res, error);
  }
};

// Export with authentication middleware
module.exports = withAuth(handler);