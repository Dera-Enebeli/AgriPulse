const express = require('express');
const AgriculturalData = require('../models/AgriculturalData');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Temporary bypass for testing - remove in production
    if (!token && process.env.NODE_ENV === 'development') {
      req.user = { id: 'test-user-id' };
      return next();
    }
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Dashboard overview data
router.get('/overview', verifyToken, async (req, res) => {
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

    let matchQuery = {
      plantingDate: { $gte: startDate, $lte: endDate }
    };
    
    // Only add region filter if it's a valid, non-empty string (not 'all', 'undefined', null, or empty)
    if (region && region !== 'all' && region !== 'undefined' && region !== null && region !== '') {
      matchQuery.region = region;
    }
    
    // Only add cropType filter if it's a valid, non-empty string
    if (cropType && cropType !== 'all' && cropType !== 'undefined' && cropType !== null && cropType !== '') {
      matchQuery.cropType = cropType;
    }

    // Get overview statistics
    const [
      totalFarms,
      cropDistribution,
      regionalData,
      qualityMetrics,
      recentData
    ] = await Promise.all([
      // Total farms count
      AgriculturalData.countDocuments(matchQuery),
      
      // Crop distribution
      AgriculturalData.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$cropType',
            count: { $sum: 1 },
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      // Regional data
      AgriculturalData.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$region',
            farms: { $sum: 1 },
            avgYield: { $avg: '$yieldRange.min' },
          }
        },
        { $sort: { farms: -1 } }
      ]),
      
      // Quality metrics
      AgriculturalData.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            avgQuality: { $avg: '$quality.overall' },
            avgCompleteness: { $avg: '$quality.completeness' },
            avgAccuracy: { $avg: '$quality.accuracy' },
          }
        }
      ]),
      
      // Recent data submissions
      AgriculturalData.find(matchQuery)
        .sort({ createdAt: -1 })
        .limit(10)
        .select('cropType region plantingDate expectedHarvestDate quality.overall')
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalFarms,
          avgQuality: qualityMetrics[0]?.avgQuality || 0,
          dataFreshness: moment().diff(moment(startDate), 'days')
        },
        cropDistribution,
        regionalData,
        qualityMetrics: qualityMetrics[0] || {},
        recentSubmissions: recentData
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Interactive crop trends data
router.get('/crops/trends', verifyToken, async (req, res) => {
  try {
    const { region, cropType, granularity = 'monthly' } = req.query;
    
    let matchQuery = {};
    
    // Only add region filter if it's a valid, non-empty string (not 'all', 'undefined', null, or empty)
    if (region && region !== 'all' && region !== 'undefined' && region !== null && region !== '') {
      matchQuery.region = region;
    }
    
    // Only add cropType filter if it's a valid, non-empty string
    if (cropType && cropType !== 'all' && cropType !== 'undefined' && cropType !== null && cropType !== '') {
      matchQuery.cropType = cropType;
    }

    let groupBy;
    switch (granularity) {
      case 'daily':
        groupBy = {
          year: { $year: '$plantingDate' },
          month: { $month: '$plantingDate' },
          day: { $dayOfMonth: '$plantingDate' }
        };
        break;
      case 'weekly':
        groupBy = {
          year: { $year: '$plantingDate' },
          week: { $week: '$plantingDate' }
        };
        break;
      case 'monthly':
      default:
        groupBy = {
          year: { $year: '$plantingDate' },
          month: { $month: '$plantingDate' }
        };
        break;
    }

    const trends = await AgriculturalData.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            ...groupBy,
            cropType: '$cropType',
            region: '$region'
          },
          plantings: { $sum: 1 },
          avgYieldMin: { $avg: '$yieldRange.min' },
          avgYieldMax: { $avg: '$yieldRange.max' },
        }
      },
      {
        $project: {
          period: '$_id',
          cropType: '$_id.cropType',
          region: '$_id.region',
          plantings: 1,
          avgYield: {
            min: { $round: ['$avgYieldMin', 2] },
            max: { $round: ['$avgYieldMax', 2] }
          }
        }
      },
      { $sort: { 'period.year': 1, 'period.month': 1 } }
    ]);

    res.json({
      success: true,
      data: trends,
      granularity
    });
  } catch (error) {
    console.error('Crop trends error:', error);
    res.status(500).json({ error: 'Failed to fetch crop trends' });
  }
});

// Market intelligence dashboard
router.get('/market/intelligence', verifyToken, async (req, res) => {
  try {
    const { cropType, region, timeRange = '3m' } = req.query;
    
    // Calculate date rangeR
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

    let matchQuery = {
      'marketPrice.date': { $gte: startDate, $lte: endDate }
    };
    if (cropType) matchQuery.cropType = cropType;
    if (region) matchQuery.region = region;

    const [
      priceTrends,
      marketVolatility,
      supplyDemand,
      topMarkets
    ] = await Promise.all([
      // Price trends over time
      AgriculturalData.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              cropType: '$cropType',
              month: { $month: '$marketPrice.date' },
              year: { $year: '$marketPrice.date' }
            },
            avgPrice: { $avg: '$marketPrice.price' },
            minPrice: { $min: '$marketPrice.price' },
            maxPrice: { $max: '$marketPrice.price' },
            volume: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),
      
      // Market volatility
      AgriculturalData.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$cropType',
            avgPrice: { $avg: '$marketPrice.price' },
            priceStdDev: { $stdDevPop: '$marketPrice.price' },
            volatility: { $stdDevPop: '$marketPrice.price' }
          }
        },
        {
          $project: {
            cropType: '$_id',
            avgPrice: { $round: ['$avgPrice', 2] },
            volatility: { $round: ['$volatility', 2] },
            riskLevel: {
              $switch: {
                branches: [
                  { case: { $lt: ['$volatility', 10] }, then: 'low' },
                  { case: { $lt: ['$volatility', 25] }, then: 'medium' },
                  { case: { $gte: ['$volatility', 25] }, then: 'high' }
                ],
                default: 'medium'
              }
            }
          }
        }
      ]),
      
      // Supply/demand indicators
      AgriculturalData.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              cropType: '$cropType',
              region: '$region'
            },
            supply: { $sum: 1 },
            avgPrice: { $avg: '$marketPrice.price' }
          }
        },
        {
          $project: {
            cropType: '$_id.cropType',
            region: '$_id.region',
            supply: 1,
            avgPrice: { $round: ['$avgPrice', 2] },
            demandIndicator: {
              $switch: {
                branches: [
                  { case: { $lt: ['$avgPrice', 100] }, then: 'low' },
                  { case: { $lt: ['$avgPrice', 300] }, then: 'medium' },
                  { case: { $gte: ['$avgPrice', 300] }, then: 'high' }
                ],
                default: 'medium'
              }
            }
          }
        }
      ]),
      
      // Top markets by volume
      AgriculturalData.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$marketPrice.market',
            volume: { $sum: 1 },
            avgPrice: { $avg: '$marketPrice.price' },
            cropTypes: { $addToSet: '$cropType' }
          }
        },
        { $sort: { volume: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      success: true,
      data: {
        priceTrends,
        marketVolatility,
        supplyDemand,
        topMarkets
      }
    });
  } catch (error) {
    console.error('Market intelligence error:', error);
    res.status(500).json({ error: 'Failed to fetch market intelligence' });
  }
});

// Risk monitoring dashboard
router.get('/risk/monitoring', verifyToken, async (req, res) => {
  try {
    const { region, riskType, severity } = req.query;
    
    let matchQuery = { riskFactors: { $exists: true, $ne: [] } };
    
    // Only add region filter if it's a valid, non-empty string (not 'all', 'undefined', null, or empty)
    if (region && region !== 'all' && region !== 'undefined' && region !== null && region !== '') {
      matchQuery.region = region;
    }
    
    if (riskType && riskType !== 'all' && riskType !== 'undefined') {
      matchQuery['riskFactors.type'] = riskType;
    }
    if (severity && severity !== 'all' && severity !== 'undefined') {
      matchQuery['riskFactors.severity'] = severity;
    }

    const [
      riskOverview,
      riskHotspots,
      riskTrends,
      affectedCrops
    ] = await Promise.all([
      // Overall risk overview
      AgriculturalData.aggregate([
        { $match: matchQuery },
        { $unwind: '$riskFactors' },
        {
          $group: {
            _id: {
              type: '$riskFactors.type',
              severity: '$riskFactors.severity'
            },
            count: { $sum: 1 },
            regions: { $addToSet: '$region' }
          }
        },
        {
          $project: {
            riskType: '$_id.type',
            severity: '$_id.severity',
            count: 1,
            affectedRegions: { $size: '$regions' },
            riskScore: {
              $switch: {
                branches: [
                  { case: { $eq: ['$_id.severity', 'low'] }, then: 1 },
                  { case: { $eq: ['$_id.severity', 'medium'] }, then: 2 },
                  { case: { $eq: ['$_id.severity', 'high'] }, then: 3 },
                  { case: { $eq: ['$_id.severity', 'severe'] }, then: 4 }
                ],
                default: 2
              }
            }
          }
        },
        { $sort: { riskScore: -1, count: -1 } }
      ]),
      
      // Risk hotspots by region
      AgriculturalData.aggregate([
        { $match: matchQuery },
        { $unwind: '$riskFactors' },
        {
          $group: {
            _id: '$region',
            totalRisks: { $sum: 1 },
            highSeverityRisks: {
              $sum: {
                $cond: [
                  { $in: ['$riskFactors.severity', ['high', 'severe']] },
                  1,
                  0
                ]
              }
            },
            riskTypes: { $addToSet: '$riskFactors.type' }
          }
        },
        {
          $project: {
            region: '$_id',
            totalRisks: 1,
            highSeverityRisks: 1,
            riskLevel: {
              $switch: {
                branches: [
                  { case: { $lt: ['$highSeverityRisks', 5] }, then: 'low' },
                  { case: { $lt: ['$highSeverityRisks', 15] }, then: 'medium' },
                  { case: { $gte: ['$highSeverityRisks', 15] }, then: 'high' }
                ],
                default: 'medium'
              }
            },
            uniqueRiskTypes: { $size: '$riskTypes' }
          }
        },
        { $sort: { totalRisks: -1 } }
      ]),
      
      // Risk trends over time
      AgriculturalData.aggregate([
        { $match: matchQuery },
        { $unwind: '$riskFactors' },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
              riskType: '$riskFactors.type'
            },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            period: '$_id',
            riskType: '$_id.riskType',
            count: 1
          }
        },
        { $sort: { 'period.year': 1, 'period.month': 1 } }
      ]),
      
      // Most affected crops
      AgriculturalData.aggregate([
        { $match: matchQuery },
        { $unwind: '$riskFactors' },
        {
          $group: {
            _id: '$cropType',
            riskCount: { $sum: 1 },
            riskTypes: { $addToSet: '$riskFactors.type' },
            regions: { $addToSet: '$region' }
          }
        },
        {
          $project: {
            cropType: '$_id',
            riskCount: 1,
            uniqueRiskTypes: { $size: '$riskTypes' },
            affectedRegions: { $size: '$regions' },
            vulnerabilityScore: {
              $multiply: [
                { $size: '$riskTypes' },
                { $size: '$regions' }
              ]
            }
          }
        },
        { $sort: { vulnerabilityScore: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        riskOverview,
        riskHotspots,
        riskTrends,
        affectedCrops
      }
    });
  } catch (error) {
    console.error('Risk monitoring error:', error);
    res.status(500).json({ error: 'Failed to fetch risk monitoring data' });
  }
});

module.exports = router;