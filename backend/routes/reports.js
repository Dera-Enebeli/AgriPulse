const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const AgriculturalData = require('../models/AgriculturalData');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;

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

// Get user's reports
router.get('/', verifyToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { user: req.user.id };
    if (type) filter.type = type;
    if (status) filter.status = status;

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Report.countDocuments(filter);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: total
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Generate standard Insights monthly report
router.post('/generate/monthly-insights', verifyToken, async (req, res) => {
  try {
    // Check user subscription
    const subscription = await Subscription.findOne({ user: req.user.id });
    if (!subscription || subscription.plan === 'free') {
      return res.status(403).json({ error: 'Insights plan required' });
    }

    const { region, cropTypes, includeCharts = true } = req.body;

    // Check if monthly report already exists this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const existingReport = await Report.findOne({
      user: req.user.id,
      type: 'monthly_insights',
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    if (existingReport) {
      return res.status(400).json({ 
        error: 'Monthly report already generated',
        report: existingReport 
      });
    }

    // Create report generation job
    const report = new Report({
      user: req.user.id,
      title: `Monthly Agricultural Insights - ${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      type: 'monthly_insights',
      format: 'pdf',
      parameters: { region, cropTypes, includeCharts },
      status: 'generating',
      generatedAt: new Date(),
      expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days for Insights
    });

    await report.save();

    // Start async generation
    generateMonthlyInsightsReport(report._id);

    res.json({
      success: true,
      message: 'Monthly report generation started',
      report: {
        id: report._id,
        title: report.title,
        status: 'generating'
      }
    });

  } catch (error) {
    console.error('Generate monthly insights error:', error);
    res.status(500).json({ error: 'Failed to start report generation' });
  }
});

// Generate custom Enterprise report
router.post('/generate/custom', verifyToken, async (req, res) => {
  try {
    // Check user subscription
    const subscription = await Subscription.findOne({ user: req.user.id });
    if (!subscription || subscription.plan !== 'enterprise') {
      return res.status(403).json({ error: 'Enterprise plan required for custom reports' });
    }

    const { 
      title, 
      parameters,
      format = 'pdf',
      customRequestId 
    } = req.body;

    if (!title || !parameters) {
      return res.status(400).json({ error: 'Title and parameters required' });
    }

    // Create custom report
    const report = new Report({
      user: req.user.id,
      title: title,
      type: 'custom_enterprise',
      format,
      parameters,
      customRequestId,
      status: 'generating',
      generatedAt: new Date()
      // Enterprise reports don't expire
    });

    await report.save();

    // Start async generation
    generateCustomEnterpriseReport(report._id);

    res.json({
      success: true,
      message: 'Custom report generation started',
      report: {
        id: report._id,
        title: report.title,
        status: 'generating'
      }
    });

  } catch (error) {
    console.error('Generate custom report error:', error);
    res.status(500).json({ error: 'Failed to start custom report generation' });
  }
});

// Download report
router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const report = await Report.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (!report.canDownload()) {
      return res.status(403).json({ 
        error: report.isExpired() ? 'Report expired' : 'Report not ready for download' 
      });
    }

    // Check file exists
    if (!report.file.path) {
      return res.status(404).json({ error: 'Report file not found' });
    }

    try {
      await fs.access(report.file.path);
    } catch (error) {
      return res.status(404).json({ error: 'Report file missing' });
    }

    // Increment download count
    await Report.findByIdAndUpdate(report._id, {
      $inc: { 'file.downloadCount': 1 }
    });

    // Send file
    res.download(report.file.path, report.file.filename);

  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({ error: 'Failed to download report' });
  }
});

// Get report details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const report = await Report.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      success: true,
      report
    });

  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Delete expired reports (maintenance endpoint)
router.delete('/cleanup-expired', async (req, res) => {
  try {
    const expiredReports = await Report.find({ 
      expiresAt: { $lt: new Date() },
      status: 'ready'
    });

    let deletedFiles = 0;
    
    for (const report of expiredReports) {
      if (report.file.path) {
        try {
          await fs.unlink(report.file.path);
          deletedFiles++;
        } catch (error) {
          console.error('Failed to delete file:', report.file.path);
        }
      }
    }

    await Report.deleteMany({ 
      expiresAt: { $lt: new Date() },
      status: 'ready'
    });

    res.json({
      success: true,
      message: `Cleaned up ${expiredReports.length} expired reports, deleted ${deletedFiles} files`
    });

  } catch (error) {
    console.error('Cleanup expired reports error:', error);
    res.status(500).json({ error: 'Failed to cleanup expired reports' });
  }
});

module.exports = router;

// Async report generation functions (would typically be in a separate service)
async function generateMonthlyInsightsReport(reportId) {
  try {
    // This would contain the actual PDF generation logic
    // For now, we'll simulate it with a timeout
    
    const report = await Report.findById(reportId);
    if (!report) return;

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds

    // Generate actual report file (simplified for demo)
    const reportPath = path.join(__dirname, '../reports', `monthly-insights-${reportId}.pdf`);
    
    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    await fs.mkdir(reportsDir, { recursive: true });

    // For now, create a placeholder file
    await fs.writeFile(reportPath, `Monthly Insights Report - ${report.title}`);

    // Update report with generated file info
    await Report.findByIdAndUpdate(reportId, {
      status: 'ready',
      file: {
        filename: `monthly-insights-${reportId}.pdf`,
        path: reportPath,
        size: 1024 // placeholder
      },
      summary: {
        totalRecords: 150,
        regionsCovered: report.parameters.region ? [report.parameters.region] : ['all'],
        cropsCovered: report.parameters.cropTypes || ['all'],
        keyInsights: [
          'Regional production increased by 12%',
          'Risk factors remained stable',
          'Market prices showed positive trend'
        ],
        dataQuality: {
          completeness: 0.92,
          accuracy: 0.88,
          timeliness: 0.95
        }
      },
      generationTime: 5000
    });

    console.log(`✅ Monthly insights report generated: ${reportId}`);

  } catch (error) {
    console.error('Monthly insights generation failed:', error);
    await Report.findByIdAndUpdate(reportId, { status: 'failed' });
  }
}

async function generateCustomEnterpriseReport(reportId) {
  try {
    const report = await Report.findById(reportId);
    if (!report) return;

    // Simulate longer custom report generation
    await new Promise(resolve => setTimeout(resolve, 8000)); // 8 seconds

    const reportPath = path.join(__dirname, '../reports', `custom-enterprise-${reportId}.pdf`);
    const reportsDir = path.dirname(reportPath);
    await fs.mkdir(reportsDir, { recursive: true });

    await fs.writeFile(reportPath, `Custom Enterprise Report - ${report.title}`);

    await Report.findByIdAndUpdate(reportId, {
      status: 'ready',
      file: {
        filename: `custom-enterprise-${reportId}.pdf`,
        path: reportPath,
        size: 2048 // placeholder
      },
      summary: {
        totalRecords: 500,
        regionsCovered: report.parameters.regions || [],
        cropsCovered: report.parameters.cropTypes || [],
        keyInsights: [
          'Custom analysis completed',
          'Enterprise-level insights generated',
          'Strategic recommendations provided'
        ],
        dataQuality: {
          completeness: 0.98,
          accuracy: 0.95,
          timeliness: 0.99
        }
      },
      generationTime: 8000
    });

    console.log(`✅ Custom enterprise report generated: ${reportId}`);

  } catch (error) {
    console.error('Custom enterprise generation failed:', error);
    await Report.findByIdAndUpdate(reportId, { status: 'failed' });
  }
}