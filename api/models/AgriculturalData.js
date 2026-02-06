/**
 * Agricultural Data model for serverless functions
 * MongoDB agricultural data document operations
 */

const { getCollection } = require('../utils/database');

class AgriculturalDataModel {
  /**
   * Get overview statistics
   * @param {Object} filters - Query filters
   * @returns {Object} - Overview statistics
   */
  static async getOverviewStats(filters = {}) {
    try {
      const collection = await getCollection('agriculturaldata');
      
      const [
        totalFarms,
        cropDistribution,
        regionalData,
        qualityMetrics,
        recentData
      ] = await Promise.all([
        // Total farms count
        collection.countDocuments(filters),
        
        // Crop distribution
        collection.aggregate([
          { $match: filters },
          {
            $group: {
              _id: '$cropType',
              count: { $sum: 1 },
            }
          },
          { $sort: { count: -1 } }
        ]).toArray(),
        
        // Regional data
        collection.aggregate([
          { $match: filters },
          {
            $group: {
              _id: '$region',
              farms: { $sum: 1 },
              avgYield: { $avg: '$yieldRange.min' },
            }
          },
          { $sort: { farms: -1 } }
        ]).toArray(),
        
        // Quality metrics
        collection.aggregate([
          { $match: filters },
          {
            $group: {
              _id: null,
              avgQuality: { $avg: '$quality.overall' },
              avgCompleteness: { $avg: '$quality.completeness' },
              avgAccuracy: { $avg: '$quality.accuracy' },
            }
          }
        ]).toArray(),
        
        // Recent data submissions
        collection.find(filters)
          .sort({ createdAt: -1 })
          .limit(10)
          .project('cropType region plantingDate expectedHarvestDate quality.overall')
          .toArray()
      ]);

      return {
        summary: {
          totalFarms,
          avgQuality: qualityMetrics[0]?.avgQuality || 0,
          dataFreshness: Math.floor((Date.now() - new Date(filters.startDate || Date.now())) / (1000 * 60 * 60 * 24))
        },
        cropDistribution,
        regionalData,
        qualityMetrics: qualityMetrics[0] || {},
        recentSubmissions: recentData
      };
    } catch (error) {
      console.error('Error getting overview stats:', error);
      throw error;
    }
  }

  /**
   * Get crop trends data
   * @param {Object} filters - Query filters
   * @param {string} granularity - Time granularity (daily, weekly, monthly)
   * @returns {Array} - Crop trends data
   */
  static async getCropTrends(filters = {}, granularity = 'monthly') {
    try {
      const collection = await getCollection('agriculturaldata');
      
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

      const trends = await collection.aggregate([
        { $match: filters },
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
      ]).toArray();

      return trends;
    } catch (error) {
      console.error('Error getting crop trends:', error);
      throw error;
    }
  }

  /**
   * Get market intelligence data
   * @param {Object} filters - Query filters
   * @returns {Object} - Market intelligence data
   */
  static async getMarketIntelligence(filters = {}) {
    try {
      const collection = await getCollection('agriculturaldata');
      
      const [
        priceTrends,
        marketVolatility,
        supplyDemand,
        topMarkets
      ] = await Promise.all([
        // Price trends over time
        collection.aggregate([
          { $match: filters },
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
        ]).toArray(),
        
        // Market volatility
        collection.aggregate([
          { $match: filters },
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
        ]).toArray(),
        
        // Supply/demand indicators
        collection.aggregate([
          { $match: filters },
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
        ]).toArray(),
        
        // Top markets by volume
        collection.aggregate([
          { $match: filters },
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
        ]).toArray()
      ]);

      return {
        priceTrends,
        marketVolatility,
        supplyDemand,
        topMarkets
      };
    } catch (error) {
      console.error('Error getting market intelligence:', error);
      throw error;
    }
  }

  /**
   * Get risk monitoring data
   * @param {Object} filters - Query filters
   * @returns {Object} - Risk monitoring data
   */
  static async getRiskMonitoring(filters = {}) {
    try {
      const collection = await getCollection('agriculturaldata');
      
      const [
        riskOverview,
        riskHotspots,
        riskTrends,
        affectedCrops
      ] = await Promise.all([
        // Overall risk overview
        collection.aggregate([
          { $match: { ...filters, riskFactors: { $exists: true, $ne: [] } } },
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
        ]).toArray(),
        
        // Risk hotspots by region
        collection.aggregate([
          { $match: { ...filters, riskFactors: { $exists: true, $ne: [] } } },
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
        ]).toArray(),
        
        // Risk trends over time
        collection.aggregate([
          { $match: { ...filters, riskFactors: { $exists: true, $ne: [] } } },
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
        ]).toArray(),
        
        // Most affected crops
        collection.aggregate([
          { $match: { ...filters, riskFactors: { $exists: true, $ne: [] } } },
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
        ]).toArray()
      ]);

      return {
        riskOverview,
        riskHotspots,
        riskTrends,
        affectedCrops
      };
    } catch (error) {
      console.error('Error getting risk monitoring:', error);
      throw error;
    }
  }
}

module.exports = AgriculturalDataModel;