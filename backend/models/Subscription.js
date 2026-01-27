const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({

  /* =====================
     CORE RELATION
  ====================== */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  /* =====================
     PLAN & STATUS
  ====================== */
  plan: {
    type: String,
    enum: ['free', 'explorer', 'insights', 'enterprise'],
    required: true,
    index: true
  },

  status: {
    type: String,
    enum: ['trialing', 'active', 'past_due', 'expired', 'cancelled'],
    default: 'trialing',
    index: true
  },

  /* =====================
     PRICING
  ====================== */
  pricing: {
    amount: {
      type: Number,
      min: 0,
      required: true
    },
    currency: {
      type: String,
      enum: ['NGN', 'USD', 'USDT'],
      default: 'NGN'
    },
    interval: {
      type: String,
      enum: ['month', 'year'],
      default: 'month'
    }
  },

  /* =====================
     ACCESS & LIMITS
  ====================== */
  limits: {
    apiRequests: { type: Number, default: 1000 },
    dataExports: { type: Number, default: 10 },

    dashboardAccess: {
      type: String,
      enum: ['full', 'read-only', 'none'],
      default: 'full'
    },

    customReports: { type: Boolean, default: false },

    supportLevel: {
      type: String,
      enum: ['basic', 'email', 'priority'],
      default: 'basic'
    }
  },

  /* =====================
     USAGE TRACKING
  ====================== */
  usage: {
    apiRequests: { type: Number, default: 0 },
    dataExports: { type: Number, default: 0 },
    lastReset: { type: Date, default: Date.now }
  },

  /* =====================
     BILLING PERIOD
  ====================== */
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },

  /* =====================
     CANCELLATION LOGIC
  ====================== */
  autoRenew: {
    type: Boolean,
    default: true
  },

  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },

  cancelledAt: Date,

  /* =====================
     PAYMENT
  ====================== */
  payment: {
    method: {
      type: String,
      enum: ['paystack', 'bank_transfer', 'usdt', 'stripe']
    },

    intent: {
      type: String,
      enum: ['subscription', 'one_time'],
      default: 'subscription'
    },

    reference: {
      type: String,
      index: true
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'refunded']
    },

    confirmedAt: Date,

    paystackData: mongoose.Schema.Types.Mixed,

    usdt: {
      address: String,
      network: String,
      amount: Number,
      txHash: String
    },

    proof: String
  },

  /* =====================
     METADATA
  ====================== */
  metadata: {
    signupSource: String,
    promoCode: String,
    notes: String
  }

}, { timestamps: true });

/* =====================
   INDEXES
===================== */
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ 'payment.reference': 1 });
subscriptionSchema.index({ plan: 1 });

/* =====================
   METHODS
===================== */

// Reset usage per billing cycle
subscriptionSchema.methods.resetUsage = function () {
  this.usage.apiRequests = 0;
  this.usage.dataExports = 0;
  this.usage.lastReset = new Date();
  return this.save();
};

// Check access limits
subscriptionSchema.methods.canUse = function (type) {
  if (!['active', 'past_due'].includes(this.status)) return false;

  switch (type) {
    case 'api':
      return this.usage.apiRequests < this.limits.apiRequests;
    case 'export':
      return this.usage.dataExports < this.limits.dataExports;
    case 'dashboard':
      return this.limits.dashboardAccess !== 'none';
    case 'custom':
      return this.limits.customReports;
    default:
      return false;
  }
};

// Increment usage
subscriptionSchema.methods.incrementUsage = function (type) {
  if (type === 'api') this.usage.apiRequests += 1;
  if (type === 'export') this.usage.dataExports += 1;
  return this.save();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);