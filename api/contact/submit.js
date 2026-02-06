/**
 * Serverless function for contact form submission
 * POST /api/contact/submit
 */

const { validateBody, formatResponse, createErrorHandler } = require('../utils/auth');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, organization, useCase, message } = req.body;

    // Validate required fields
    const validation = validateBody(req.body, ['name', 'email', 'organization', 'useCase']);
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Valid email is required' 
      });
    }

    // Validate use case
    const validUseCases = ['agribusiness', 'research', 'ngo', 'input-supplier', 'policy', 'investment', 'other'];
    if (!validUseCases.includes(useCase)) {
      return res.status(400).json({ 
        error: 'Valid use case is required' 
      });
    }

    // Here you would normally:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation email to user
    // For now, we'll just simulate success

    const responseData = {
      contactId: `contact_${Date.now()}`,
      receivedAt: new Date().toISOString(),
      message: 'Contact form submitted successfully'
    };

    return res.status(201).json(
      formatResponse(true, responseData, 'Contact form submitted successfully')
    );

  } catch (error) {
    const errorHandler = createErrorHandler('Failed to submit contact form');
    return errorHandler(res, error);
  }
};