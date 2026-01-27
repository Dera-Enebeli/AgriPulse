const express = require('express');
const AgriculturalData = require('../models/AgriculturalData');
const router = express.Router();

// Public test endpoint - no auth required
router.get('/test-overview', async (req, res) => {
  try {
    console.log('Test endpoint called');
    
    // Get overview statistics without date filtering
    const [
      totalFarms,
      cropDistribution,
      regionalData,
      qualityMetrics,
      recentData
    ] = await Promise.all([
      AgriculturalData.countDocuments(),
      
      AgriculturalData.aggregate([
        {
          $group: {
            _id: '$cropType',
            count: { $sum: 1 },
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      AgriculturalData.aggregate([
        {
          $group: {
            _id: '$region',
            farms: { $sum: 1 },
            avgYield: { $avg: '$yieldRange.min' },
          }
        },
        { $sort: { farms: -1 } }
      ]),
      
      AgriculturalData.aggregate([
        {
          $group: {
            _id: null,
            avgQuality: { $avg: '$quality.overall' },
            avgCompleteness: { $avg: '$quality.completeness' },
            avgAccuracy: { $avg: '$quality.accuracy' },
          }
        }
      ]),
      
      AgriculturalData.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('cropType region plantingDate expectedHarvestDate quality.overall')
    ]);

    console.log('Data found:', {
      totalFarms,
      cropCount: cropDistribution.length,
      regionCount: regionalData.length
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalFarms,
          avgQuality: qualityMetrics[0]?.avgQuality || 0,
          dataFreshness: 30
        },
        cropDistribution,
        regionalData,
        qualityMetrics: qualityMetrics[0] || {},
        recentSubmissions: recentData
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Failed to fetch test data' });
  }
});

module.exports = router;