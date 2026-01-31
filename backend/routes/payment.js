const express = require('express');
const Paystack = require('paystack-node');
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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

// Get available subscription plans
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'free',
      name: 'FREE — Awareness & Trust',
      price: 0,
      interval: 'month',
      description: 'For individuals and organizations exploring agricultural data',
      features: [
        'High-level agricultural summaries',
        'Sample regional insights (limited)',
        'Overview of crops and farming activity',
        'Access to published public reports'
      ],
      bestFor: 'Researchers, students, first-time users',
      limits: {
        apiRequests: 0,
        dataExports: 0,
        dashboardAccess: 'read-only',
        customReports: false,
        supportLevel: 'basic'
      }
    },
    {
      id: 'insights',
      name: 'INSIGHTS PLAN — Structured, Repeatable Reports',
      price: 150000,
      interval: 'month',
      description: 'For organizations that need regular, ready-made insights',
      usdPrice: 99,
      features: [
        'Monthly regional insight reports (fixed format)',
        'Crop production trends by location',
        'Seasonal risk insights (weather, pests, input challenges)',
        'Downloadable reports (PDF / CSV)',
        'Email support',
        'Important limitation: Reports are standardized',
        'No customization by request',
        'Same structure for all subscribers'
      ],
      bestFor: 'Buyers, NGOs, analysts, agri-projects monitoring regions',
      limits: {
        apiRequests: 5000,
        dataExports: 50,
        dashboardAccess: 'full',
        customReports: false,
        supportLevel: 'email'
      }
    },
    {
      id: 'enterprise',
      name: 'ENTERPRISE PLAN — Decision Support Partner',
      price: 520000,
      interval: 'month',
      description: 'For organizations needing custom, decision-level intelligence',
      usdPrice: 349,
      features: [
        'Everything in the Insights Plan',
        'Custom reports built to your needs',
        'Region-specific supply & risk forecasts',
        'Ability to request specific crops, states, or farm groups',
        'Direct communication (WhatsApp / calls / email)',
        'Priority support',
        'Early access to new datasets'
      ],
      bestFor: 'Large buyers, donors, lenders, government & agribusinesses',
      limits: {
        apiRequests: 10000,
        dataExports: 100,
        dashboardAccess: 'full',
        customReports: true,
        supportLevel: 'priority'
      }
    }
  ];

  res.json({
    success: true,
    plans
  });
});

// Create payment session (Paystack, Bank Transfer, or USDT)
router.post('/create-payment-session', verifyToken, async (req, res) => {
  try {
    const { planId, paymentMethod } = req.body;
    
    // Get user info
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Define plan prices in NGN
    const planPrices = {
      free: { price: 0, name: 'Free' },
      insights: { price: 150000, name: 'Insights Plan' }, // ₦150,000 (~$99)
      enterprise: { price: 520000, name: 'Enterprise Plan' } // ₦520,000 (~$349)
    };

    const plan = planPrices[planId];
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    // Free plan - activate directly
    if (plan.price === 0) {
      await Subscription.findOneAndUpdate(
        { user: user._id },
        {
          plan: 'free',
          status: 'active',
          pricing: { amount: 0, currency: 'NGN', interval: 'month' },
          limits: {
            apiRequests: 0,
            dataExports: 0,
            dashboardAccess: 'read-only',
            customReports: false,
            supportLevel: 'basic'
          },
          period: {
            start: new Date(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        },
        { upsert: true }
      );

      return res.json({
        success: true,
        message: 'Free plan activated successfully',
        planId: 'free'
      });
    }

    // Handle different payment methods
    switch (paymentMethod) {
      case 'paystack':
        return await handlePaystackPayment(req, res, user, plan, planId);
      case 'bank_transfer':
        return await handleBankTransfer(req, res, user, plan, planId);
      case 'usdt':
        return await handleUSDTPayment(req, res, user, plan, planId);
      default:
        return res.status(400).json({ error: 'Invalid payment method' });
    }

  } catch (error) {
    console.error('Create payment session error:', error);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
});

// Handle Paystack payment
async function handlePaystackPayment(req, res, user, plan, planId) {
  try {
    const response = await paystack.transaction.initialize({
      email: user.email,
      amount: plan.price,
      currency: 'NGN',
      callback_url: `${process.env.FRONTEND_URL}/payment/success`,
      metadata: {
        userId: user._id.toString(),
        planId: planId,
        paymentMethod: 'paystack'
      }
    });

    // Create pending subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan: planId,
        status: 'trialing',
        pricing: { amount: plan.price, currency: 'NGN', interval: 'month' },
        limits: {
          apiRequests: planId === 'insights' ? 5000 : 10000,
          dataExports: planId === 'insights' ? 50 : 100,
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: planId === 'insights' ? 'email' : 'priority'
        },
        payment: {
          method: 'paystack',
          intent: 'subscription',
          reference: response.data.reference,
          status: 'pending'
        },
        period: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      { upsert: true }
    );

    res.json({
      success: true,
      paymentMethod: 'paystack',
      reference: response.data.reference,
      url: response.data.authorization_url
    });

  } catch (error) {
    console.error('Paystack error:', error);
    res.status(500).json({ error: 'Failed to initialize Paystack payment' });
  }
}

// Handle Bank Transfer
async function handleBankTransfer(req, res, user, plan, planId) {
  try {
    // Generate unique reference
    const reference = `AGRI${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create pending subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan: planId,
        status: 'trialing',
        pricing: { amount: plan.price, currency: 'NGN', interval: 'month' },
        limits: {
          apiRequests: planId === 'insights' ? 5000 : 10000,
          dataExports: planId === 'insights' ? 50 : 100,
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: planId === 'insights' ? 'email' : 'priority'
        },
        payment: {
          method: 'bank_transfer',
          intent: 'subscription',
          reference: reference,
          status: 'pending'
        },
        period: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      { upsert: true }
    );

    // Bank details
    const bankDetails = {
      bankName: 'Zenith Bank',
      accountName: 'AgriPulse Technologies Ltd',
      accountNumber: '1012345678',
      amount: plan.price,
      reference: reference,
      instructions: `Please transfer ₦${plan.price.toLocaleString()} to the account above and use the reference: ${reference}`
    };

    res.json({
      success: true,
      paymentMethod: 'bank_transfer',
      reference: reference,
      bankDetails: bankDetails
    });

  } catch (error) {
    console.error('Bank transfer error:', error);
    res.status(500).json({ error: 'Failed to generate bank transfer details' });
  }
}

// Handle USDT payment
async function handleUSDTPayment(req, res, user, plan, planId) {
  try {
    // Convert NGN to USDT (assuming 1 NGN = 0.00067 USDT)
    const usdtAmount = (plan.price * 0.00067).toFixed(2);
    const reference = `USDT${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create pending subscription
    await Subscription.findOneAndUpdate(
      { user: user._id },
      {
        plan: planId,
        status: 'trialing',
        pricing: { amount: plan.price, currency: 'NGN', interval: 'month' },
        limits: {
          apiRequests: planId === 'insights' ? 5000 : 10000,
          dataExports: planId === 'insights' ? 50 : 100,
          dashboardAccess: 'full',
          customReports: true,
          supportLevel: planId === 'insights' ? 'email' : 'priority'
        },
        payment: {
          method: 'usdt',
          intent: 'subscription',
          reference: reference,
          status: 'pending',
          usdt: {
            address: 'TQn9Y2khEsLMJz3YYFhX8E5tB5n5t8tX7W',
            network: 'TRC20',
            amount: usdtAmount
          }
        },
        period: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      { upsert: true }
    );

    // USDT wallet details
    const usdtDetails = {
      network: 'TRC20',
      walletAddress: 'TQn9Y2khEsLMJz3YYFhX8E5tB5n5t8tX7W',
      amount: usdtAmount,
      reference: reference,
      instructions: `Please send ${usdtAmount} USDT to the TRC20 wallet address above and use the reference: ${reference}`
    };

    res.json({
      success: true,
      paymentMethod: 'usdt',
      reference: reference,
      usdtDetails: usdtDetails
    });

  } catch (error) {
    console.error('USDT payment error:', error);
    res.status(500).json({ error: 'Failed to generate USDT payment details' });
  }
}

// Paystack webhook handler
router.post('/webhook/paystack', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = JSON.parse(req.body);
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle Paystack events
    if (event.event === 'charge.success') {
      await handlePaystackSuccess(event.data);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

// Manual payment confirmation (for bank transfer and USDT)
router.post('/confirm-payment', verifyToken, async (req, res) => {
  try {
    const { reference, paymentMethod, proof } = req.body;
    
    const subscription = await Subscription.findOne({ 
      user: req.user.id,
      'payment.reference': reference 
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update subscription to active
    subscription.status = 'active';
    subscription.payment.status = 'confirmed';
    subscription.payment.confirmedAt = new Date();
    if (proof) {
      subscription.payment.proof = proof;
    }
    await subscription.save();

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        period: subscription.period
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Handle Paystack successful payment
async function handlePaystackSuccess(data) {
  try {
    const { metadata, reference } = data;
    
    await Subscription.findOneAndUpdate(
      { 'payment.reference': reference },
      {
        status: 'active',
        payment: {
          status: 'confirmed',
          confirmedAt: new Date(),
          paystackData: data
        }
      }
    );

    console.log(`Paystack payment successful: ${reference}`);
  } catch (error) {
    console.error('Handle Paystack success error:', error);
  }
}

// Handle successful payment
async function handleSuccessfulPayment(session) {
  try {
    const { userId, planId } = session.metadata;
    
    // Update user subscription
    await Subscription.findOneAndUpdate(
      { user: userId },
      {
        plan: planId,
        status: 'active',
        pricing: { 
          amount: session.amount_total / 100, 
          currency: session.currency,
          interval: 'month'
        },
        payment: {
          method: 'stripe',
          status: 'confirmed',
          confirmedAt: new Date(),
          stripeData: session
        },
        period: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      },
      { upsert: true }
    );

    console.log(`Stripe payment successful for user ${userId}, plan ${planId}`);
  } catch (error) {
    console.error('Handle successful payment error:', error);
  }
}

// Handle subscription renewal (for future payment providers)
async function handleSubscriptionRenewal(invoice) {
  try {
    const subscriptionId = invoice.subscription;
    
    await Subscription.findOneAndUpdate(
      { 'payment.stripe.subscriptionId': subscriptionId },
      {
        status: 'active',
        period: {
          start: new Date(invoice.current_period_start * 1000),
          end: new Date(invoice.current_period_end * 1000)
        }
      }
    );

    console.log(`Subscription renewed: ${subscriptionId}`);
  } catch (error) {
    console.error('Handle subscription renewal error:', error);
  }
}

// Handle subscription cancellation (for future payment providers)
async function handleSubscriptionCancellation(subscription) {
  try {
    await Subscription.findOneAndUpdate(
      { user: req.user.id },
      {
        status: 'cancelled',
        cancelledAt: new Date()
      }
    );

    console.log(`Subscription cancelled for user ${req.user.id}`);
  } catch (error) {
    console.error('Handle subscription cancellation error:', error);
  }
}

// Get user subscription status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id })
      .populate('user', 'name email organization');

    if (!subscription) {
      return res.json({
        success: true,
        subscription: null,
        plan: 'explorer'
      });
    }

    res.json({
      success: true,
      subscription: {
        plan: subscription.plan,
        status: subscription.status,
        period: subscription.period,
        usage: subscription.usage,
        limits: subscription.limits,
        autoRenew: subscription.autoRenew,
        payment: subscription.payment
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

// Cancel subscription
router.post('/cancel', verifyToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    // Update local record
    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.autoRenew = false;
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

module.exports = router;