const express = require('express');
const AgriculturalData = require('../models/AgriculturalData');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment');

const router = express.Router();

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
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

// Get aggregated crop data by region
router.get('/crops/regions', verifyToken, async (req, res) => {
  try {
    const { region, cropType, startDate, endDate } = req.query;
    
    let matchQuery = {};
    if (region) matchQuery.region = region;
    if (cropType) matchQuery.cropType = cropType;
    if (startDate || endDate) {
      matchQuery.plantingDate = {};
      if (startDate) matchQuery.plantingDate.$gte = new Date(startDate);
      if (endDate) matchQuery.plantingDate.$lte = new Date(endDate);
    }

    const data = await AgriculturalData.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            region: '$region',
            cropType: '$cropType',
            year: { $year: '$plantingDate' }
          },
          totalFarms: { $sum: 1 },
          avgYieldMin: { $avg: '$yieldRange.min' },
          avgYieldMax: { $avg: '$yieldRange.max' },
          avgQuality: { $avg: '$quality.overall' }
        }
      },
      { $sort: { '_id.year': -1, '_id.region': 1 } }
    ]);

    res.json({
      success: true,
      data,
      totalRecords: data.length
    });
  } catch (error) {
    console.error('Get regional crops error:', error);
    res.status(500).json({ error: 'Failed to fetch regional crop data' });
  }
});

// Get market price trends
router.get('/market/prices', verifyToken, async (req, res) => {
  try {
    const { cropType, region, timeRange = '6m' } = req.query;
    
    let matchQuery = { marketPrice: { $exists: true } };
    if (cropType) matchQuery.cropType = cropType;
    if (region) matchQuery.region = region;

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
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }
    matchQuery['marketPrice.date'] = { $gte: startDate, $lte: endDate };

    const data = await AgriculturalData.aggregate([
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
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data,
      timeRange,
      totalRecords: data.length
    });
  } catch (error) {
    console.error('Get market prices error:', error);
    res.status(500).json({ error: 'Failed to fetch market price data' });
  }
});

// Get risk analysis data
router.get('/risk/analysis', verifyToken, async (req, res) => {
  try {
    const { region, riskType, severity } = req.query;
    
    let matchQuery = { riskFactors: { $exists: true, $ne: [] } };
    if (region) matchQuery.region = region;
    if (riskType) matchQuery['riskFactors.type'] = riskType;
    if (severity) matchQuery['riskFactors.severity'] = severity;

    const data = await AgriculturalData.aggregate([
      { $match: matchQuery },
      { $unwind: '$riskFactors' },
      {
        $group: {
          _id: {
            region: '$region',
            riskType: '$riskFactors.type',
            severity: '$riskFactors.severity'
          },
          count: { $sum: 1 },
          affectedCrops: { $addToSet: '$cropType' }
        }
      },
      {
        $project: {
          region: '$_id.region',
          riskType: '$_id.riskType',
          severity: '$_id.severity',
          count: 1,
          affectedCropsCount: { $size: '$affectedCrops' },
          affectedCrops: '$affectedCrops'
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data,
      totalRecords: data.length
    });
  } catch (error) {
    console.error('Get risk analysis error:', error);
    res.status(500).json({ error: 'Failed to fetch risk analysis data' });
  }
});

// Get harvest timeline predictions
router.get('/harvest/timeline', verifyToken, async (req, res) => {
  try {
    const { cropType, region } = req.query;
    
    let matchQuery = {};
    if (cropType) matchQuery.cropType = cropType;
    if (region) matchQuery.region = region;

    const data = await AgriculturalData.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            cropType: '$cropType',
            region: '$region',
            month: { $month: '$expectedHarvestDate' }
          },
          expectedHarvests: { $sum: 1 },
          avgYieldMin: { $avg: '$yieldRange.min' },
          avgYieldMax: { $avg: '$yieldRange.max' }
        }
      },
      {
        $project: {
          cropType: '$_id.cropType',
          region: '$_id.region',
          harvestMonth: '$_id.month',
          expectedHarvests: 1,
          avgYieldRange: {
            min: { $round: ['$avgYieldMin', 2] },
            max: { $round: ['$avgYieldMax', 2] }
          }
        }
      },
      { $sort: { harvestMonth: 1 } }
    ]);

    res.json({
      success: true,
      data,
      totalRecords: data.length
    });
  } catch (error) {
    console.error('Get harvest timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch harvest timeline data' });
  }
});

// Get data quality metrics
router.get('/quality/metrics', verifyToken, async (req, res) => {
  try {
    const { region, cropType } = req.query;
    
    let matchQuery = {};
    if (region) matchQuery.region = region;
    if (cropType) matchQuery.cropType = cropType;

    const data = await AgriculturalData.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            region: '$region',
            cropType: '$cropType'
          },
          totalRecords: { $sum: 1 },
          avgCompleteness: { $avg: '$quality.completeness' },
          avgAccuracy: { $avg: '$quality.accuracy' },
          avgTimeliness: { $avg: '$quality.timeliness' },
          avgOverall: { $avg: '$quality.overall' }
        }
      },
      {
        $project: {
          region: '$_id.region',
          cropType: '$_id.cropType',
          totalRecords: 1,
          quality: {
            completeness: { $round: ['$avgCompleteness', 3] },
            accuracy: { $round: ['$avgAccuracy', 3] },
            timeliness: { $round: ['$avgTimeliness', 3] },
            overall: { $round: ['$avgOverall', 3] }
          }
        }
      },
      { $sort: { 'quality.overall': -1 } }
    ]);

    // Overall quality metrics
    const overall = await AgriculturalData.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          avgCompleteness: { $avg: '$quality.completeness' },
          avgAccuracy: { $avg: '$quality.accuracy' },
          avgTimeliness: { $avg: '$quality.timeliness' },
          avgOverall: { $avg: '$quality.overall' }
        }
      }
    ]);

    res.json({
      success: true,
      data,
      overall: overall[0] || {},
      totalRecords: data.length
    });
  } catch (error) {
    console.error('Get quality metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch quality metrics' });
  }
});

// Submit new agricultural data (for farmers/cooperatives)
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const newData = new AgriculturalData(req.body);
    
    // Validate data
    const validation = newData.validateData();
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Data validation failed', 
        details: validation.errors 
      });
    }
    
    // Anonymize data
    newData.anonymize();
    
    // Set quality score
    newData.quality.overall = validation.qualityScore;
    newData.validationStatus = 'validated';
    newData.lastValidated = new Date();
    
    await newData.save();
    
    res.status(201).json({
      success: true,
      message: 'Data submitted successfully',
      dataId: newData._id,
      qualityScore: validation.qualityScore
    });
  } catch (error) {
    console.error('Data submission error:', error);
    res.status(500).json({ error: 'Failed to submit data' });
  }
});

module.exports = router;