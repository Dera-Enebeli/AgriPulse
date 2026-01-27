const express = require('express');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact form submission
router.post('/submit', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('organization').notEmpty().withMessage('Organization is required'),
  body('useCase').isIn(['agribusiness', 'research', 'ngo', 'input-supplier', 'policy', 'investment', 'other']).withMessage('Valid use case is required'),
  body('message').optional().isLength({ max: 1000 }).withMessage('Message too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, organization, useCase, message } = req.body;

    // Prepare email content
    const emailContent = `
      <h2>New Access Request - AgriPulse</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Organization:</strong> ${organization}</p>
      <p><strong>Use Case:</strong> ${useCase}</p>
      <p><strong>Message:</strong></p>
      <p>${message || 'No additional message provided'}</p>
      <hr>
      <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
    `;

    // Send email to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New AgriPulse Access Request - ${organization}`,
      html: emailContent
    };

    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'AgriPulse - We Received Your Request',
      html: `
        <h2>Thank You for Your Interest in AgriPulse!</h2>
        <p>Dear ${name},</p>
        <p>We have received your access request and will review it within 24 hours.</p>
        <p><strong>Request Details:</strong></p>
        <ul>
          <li>Organization: ${organization}</li>
          <li>Use Case: ${useCase}</li>
        </ul>
        <h3>What happens next?</h3>
        <ol>
          <li>We'll review your request within 24 hours</li>
          <li>You'll receive sample data and pricing information</li>
          <li>We'll schedule a demo to discuss your specific needs</li>
          <li>Early access partners receive special pricing</li>
        </ol>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>Best regards,<br>The AgriPulse Team</p>
        <hr>
        <p><small>Email: agripulse720@gmail.com | Phone: +234 9115434458</small></p>
      `
    };

    await transporter.sendMail(confirmationOptions);

    res.json({
      success: true,
      message: 'Request submitted successfully. We will contact you within 24 hours.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to submit request. Please try again.' });
  }
});

// Get contact information (public endpoint)
router.get('/info', (req, res) => {
  res.json({
    success: true,
    contact: {
      email: 'agripulse720@gmail.com',
      phone: '+234 9115434458',
      office: 'Abuja, Nigeria - Financial District',
      hours: 'Mon-Fri 9AM-5PM WAT'
    }
  });
});

module.exports = router;