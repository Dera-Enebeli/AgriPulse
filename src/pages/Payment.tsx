import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const Payment: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [plansLoading, setPlansLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [currentSubscription, setCurrentSubscription] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    fetchPlans();
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/payment/plans');
      const data = await response.json();
      if (response.ok) {
        setPlans(data.plans);
      }
    } catch (err) {
      console.error('Failed to fetch plans, using static data:', err);
      // Fallback to static plans when API is not available
      const staticPlans = [
        {
          _id: 'basic',
          name: 'Basic Plan',
          price: 0,
          description: 'Free access to basic agricultural insights',
          features: [
            '1,000 API requests/month',
            '10 data exports/month', 
            'Basic dashboard access',
            'Email support'
          ],
          apiRequests: '1,000',
          dataExports: '10',
          dashboardAccess: 'Basic',
          support: 'Email',
          highlighted: false
        },
        {
          _id: 'premium',
          name: 'Premium Plan',
          price: 99,
          description: 'Advanced agricultural intelligence for professionals',
          features: [
            '10,000 API requests/month',
            '100 data exports/month',
            'Advanced dashboard access', 
            'Custom reports',
            'Priority support'
          ],
          apiRequests: '10,000',
          dataExports: '100',
          dashboardAccess: 'Advanced',
          support: 'Priority',
          highlighted: true
        },
        {
          _id: 'enterprise',
          name: 'Enterprise Plan',
          price: 499,
          description: 'Complete solution for large organizations',
          features: [
            'Unlimited API requests',
            'Unlimited data exports',
            'Full dashboard access',
            'Custom analytics',
            'Dedicated support'
          ],
          apiRequests: 'Unlimited',
          dataExports: 'Unlimited', 
          dashboardAccess: 'Full',
          support: 'Dedicated',
          highlighted: false
        }
      ];
      setPlans(staticPlans);
    } finally {
      setPlansLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Don't redirect - allow viewing pricing without authentication
        setUser(null);
        setCurrentSubscription(null);
        return;
      }

      // Fetch user data
      const userResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
      }

      // Fetch subscription status
      const subscriptionResponse = await fetch('/api/payment/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        setCurrentSubscription(subscriptionData.subscription);
        if (subscriptionData.subscription?.plan) {
          setSelectedPlan(subscriptionData.subscription.plan);
        }
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const handleSubscribe = async (planId: string, paymentMethod: string = 'paystack') => {
    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token) {
      await Swal.fire({
        title: 'Login Required',
        text: 'Please login or create an account to subscribe to a plan.',
        icon: 'info',
        confirmButtonText: 'Login',
        confirmButtonColor: '#10B981',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#6B7280'
      }).then((result) => {
        if (result.isConfirmed) {
          history.push('/login');
        }
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/create-payment-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId, paymentMethod })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.url) {
          // Redirect to Paystack payment
          window.location.href = data.url;
        } else if (data.bankDetails) {
          // Show beautiful bank transfer modal
          await Swal.fire({
            title: 'Bank Transfer Instructions',
            html: `
              <div style="text-align: left;">
                <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                  <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Transfer Details:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <p><span style="font-weight: 500;">Bank:</span> ${data.bankDetails.bankName}</p>
                    <p><span style="font-weight: 500;">Account Name:</span> ${data.bankDetails.accountName}</p>
                    <p><span style="font-weight: 500;">Account Number:</span> <span style="font-weight: bold; color: #2563eb; font-size: 18px;">${data.bankDetails.accountNumber}</span></p>
                    <p><span style="font-weight: 500;">Amount:</span> <span style="font-weight: bold; color: #059669; font-size: 18px;">₦${data.bankDetails.amount.toLocaleString()}</span></p>
                    <p><span style="font-weight: 500;">Reference:</span> <span style="background: #fef3c7; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${data.bankDetails.reference}</span></p>
                  </div>
                </div>
                <div style="background: #dbeafe; padding: 12px; border-radius: 8px;">
                  <p style="color: #1e40af; font-size: 14px;">
                    <strong>Next Steps:</strong> Make the transfer and contact support with your payment receipt and reference number to activate your subscription.
                  </p>
                </div>
              </div>
            `,
            icon: 'info',
            confirmButtonText: 'I Understand',
            confirmButtonColor: '#10B981',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#6B7280'
          });
        } else if (data.usdtDetails) {
          // Show beautiful USDT modal
          await Swal.fire({
            title: 'USDT Payment Instructions',
            html: `
              <div style="text-align: left;">
                <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                  <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">Cryptocurrency Details:</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <p><span style="font-weight: 500;">Network:</span> <span style="color: #059669;">${data.usdtDetails.network}</span></p>
                    <p><span style="font-weight: 500;">Wallet Address:</span> <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-family: monospace; font-size: 12px;">${data.usdtDetails.walletAddress}</span></p>
                    <p><span style="font-weight: 500;">Amount:</span> <span style="font-weight: bold; color: #10b981; font-size: 18px;">${data.usdtDetails.amount} USDT</span></p>
                    <p><span style="font-weight: 500;">Reference:</span> <span style="background: #fef3c7; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${data.usdtDetails.reference}</span></p>
                  </div>
                </div>
                <div style="background: #dbeafe; padding: 12px; border-radius: 8px;">
                  <p style="color: #1e40af; font-size: 14px;">
                    <strong>Next Steps:</strong> Send the USDT amount to the wallet address and contact support with your transaction hash and reference number to activate your subscription.
                  </p>
                </div>
              </div>
            `,
            icon: 'info',
            confirmButtonText: 'I Understand',
            confirmButtonColor: '#10B981',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#6B7280'
          });
        } else {
          // Free plan activated with beautiful success modal
          await Swal.fire({
            title: 'Welcome to AgriPulse! 🌾',
            html: `
              <div class="text-center">
                <div class="mb-4">
                  <svg class="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p class="text-lg font-semibold text-gray-900 mb-2">Explorer Plan Activated!</p>
                <p class="text-gray-600">You now have access to high-level agricultural insights and overview data.</p>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Get Started',
            confirmButtonColor: '#10B981'
          });
          fetchUserData(); // Refresh user data
        }
      } else {
        await Swal.fire({
          title: 'Payment Failed',
          text: data.error || 'Failed to create subscription',
          icon: 'error',
          confirmButtonText: 'Try Again',
          confirmButtonColor: '#EF4444'
        });
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    // Check authentication first
    const token = localStorage.getItem('token');
    if (!token) {
      await Swal.fire({
        title: 'Login Required',
        text: 'Please login to manage your subscription.',
        icon: 'info',
        confirmButtonText: 'Login',
        confirmButtonColor: '#10B981',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        cancelButtonColor: '#6B7280'
      }).then((result) => {
        if (result.isConfirmed) {
          history.push('/login');
        }
      });
      return;
    }

    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payment/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Subscription cancelled successfully');
        fetchUserData(); // Refresh user data
      } else {
        setError(data.error || 'Failed to cancel subscription');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Don't require user for viewing pricing - allow non-authenticated users
  // Only show loading if plans are still loading

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">🌾 AgriPulse Payment</h1>
              <p className="text-xl mb-2">Complete Your Subscription to Access Agricultural Intelligence</p>
              <p className="text-green-100 opacity-90">Real-time farm data • Market insights • Risk analysis</p>
            </div>
            
            <div className="flex justify-center space-x-4">
              {user ? (
                <div className="text-center">
                  <p className="text-sm font-medium opacity-90">Logged in as:</p>
                  <p className="font-semibold">{user.name}</p>
                  {currentSubscription && (
                      <p className="text-sm text-green-100 opacity-90">
                        {currentSubscription.plan === 'free' && '🆓 FREE — Awareness & Trust'}
                        {currentSubscription.plan === 'insights' && '📊 INSIGHTS PLAN'}
                        {currentSubscription.plan === 'enterprise' && '🏢 ENTERPRISE PLAN'}
                      </p>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium opacity-90">Viewing pricing plans</p>
                  <p className="font-semibold">Guest User</p>
                  <p className="text-sm text-green-100 opacity-90">
                    Login to subscribe to a plan
                  </p>
                </div>
              )}
              
              {user ? (
                <button
                  onClick={() => history.push('/dashboard')}
                  className="text-white hover:text-green-100 transition-colors px-4 py-2 rounded-lg border border-white/20 hover:border-white/30"
                >
                  ← Back to Dashboard
                </button>
              ) : (
                <button
                  onClick={() => history.push('/')}
                  className="text-white hover:text-green-100 transition-colors px-4 py-2 rounded-lg border border-white/20 hover:border-white/30"
                >
                  ← Back to Home
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`rounded-lg p-4 ${
            currentSubscription.status === 'active' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-medium text-gray-900">
                   Current Plan: {currentSubscription.plan === 'free' ? 'FREE — Awareness & Trust' : 
                                 currentSubscription.plan === 'insights' ? 'INSIGHTS PLAN — Structured, Repeatable Reports' :
                                 currentSubscription.plan === 'enterprise' ? 'ENTERPRISE PLAN — Decision Support Partner' :
                                 currentSubscription.plan.charAt(0).toUpperCase() + currentSubscription.plan.slice(1)}
                 </h3>
                <p className="text-sm text-gray-600">
                  Status: {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                </p>
                {currentSubscription.period && (
                  <p className="text-sm text-gray-600">
                    Period: {new Date(currentSubscription.period.start).toLocaleDateString()} - {new Date(currentSubscription.period.end).toLocaleDateString()}
                  </p>
                )}
              </div>
              {currentSubscription.status === 'active' && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="btn-secondary"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}

        {/* Pricing Plans Section */}
        <div className="bg-white/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Perfect Plan</h2>
              <p className="text-xl text-gray-600 mb-2">
                Unlock agricultural intelligence that drives smart decisions
              </p>
              <p className="text-gray-500 max-w-2xl mx-auto">
                From high-level overviews to enterprise-grade insights, we have the right plan for your agricultural data needs.
              </p>
            </div>



          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {plans.map((plan: any) => (
              <div key={plan.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    {plan.price === 0 ? (
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        Free
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-gray-900 mb-1">
                          ${plan.usdPrice || Math.round(plan.price / 1500)}
                          <span className="text-lg font-normal text-gray-600">/month</span>
                        </div>
                        <div className="text-lg text-gray-600 mb-2">
                          (~₦{plan.price.toLocaleString()}/month)
                        </div>
                      </div>
                    )}
                    {plan.description && (
                      <p className="text-gray-600">{plan.description}</p>
                    )}
                  </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">What You Get</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.bestFor && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4-4-4 4-4-4h4m-4 4 0 00 8 0v8a4 4 0 008-4z"></path>
                      </svg>
                      <h4 className="text-sm font-semibold text-gray-900">Perfect For:</h4>
                    </div>
                    <p className="text-sm text-gray-700">{plan.bestFor}</p>
                  </div>
                )}

                <button
                  onClick={async () => {
                    if (plan.price === 0) {
                      handleSubscribe(plan.id);
                    } else if (plan.id === selectedPlan && plan.price > 0) {
                      // Show payment details with embedded payment methods
                      const selectedPlanData = plans.find(p => p.id === plan.id);
                      const { value: selectedPayment } = await Swal.fire({
                        title: `${selectedPlanData?.name}`,
                        html: `
                          <div style="text-align: left;">
                            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                              <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">💰 Price:</p>
                              <p style="font-size: 20px; font-weight: bold; color: #059669; margin-bottom: 4px;">
                                $${selectedPlanData?.usdPrice || Math.round(plan.price / 1500)}/month
                              </p>
                              <p style="font-size: 16px; color: #6b7280;">
                                (~₦${plan.price.toLocaleString()}/month)
                              </p>
                            </div>
                            <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                              <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">✨ What You Get:</p>
                              <ul style="margin: 0; padding-left: 20px;">
                                ${selectedPlanData?.features.map((feature: string) => `<li style="margin-bottom: 6px; color: #374151;">✅ ${feature}</li>`).join('')}
                              </ul>
                            </div>
                            ${selectedPlanData?.bestFor ? `
                            <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                              <p style="font-weight: 600; color: #111827; margin-bottom: 4px;">🎯 Perfect For:</p>
                              <p style="color: #374151;">${selectedPlanData.bestFor}</p>
                            </div>
                            ` : ''}
                            <div style="background: #ede9fe; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                              <p style="font-weight: 600; color: #111827; margin-bottom: 8px;">💳 Choose Payment Method:</p>
                              <div style="display: flex; flex-direction: column; gap: 8px;">
                                <label style="display: flex; align-items: center; padding: 8px; background: white; border: 2px solid #ddd; border-radius: 6px; cursor: pointer;">
                                  <input type="radio" name="payment" value="paystack" checked style="margin-right: 8px;">
                                  <div>
                                    <strong>Paystack</strong> - Fast & Secure (Card, Bank Transfer)
                                  </div>
                                </label>
                                <label style="display: flex; align-items: center; padding: 8px; background: white; border: 2px solid #ddd; border-radius: 6px; cursor: pointer;">
                                  <input type="radio" name="payment" value="bank_transfer" style="margin-right: 8px;">
                                  <div>
                                    <strong>Bank Transfer</strong> - Traditional Banking
                                  </div>
                                </label>
                                <label style="display: flex; align-items: center; padding: 8px; background: white; border: 2px solid #ddd; border-radius: 6px; cursor: pointer;">
                                  <input type="radio" name="payment" value="usdt" style="margin-right: 8px;">
                                  <div>
                                    <strong>USDT</strong> - Cryptocurrency
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                        `,
                        icon: 'info',
                        showCancelButton: true,
                        cancelButtonText: 'Cancel',
                        cancelButtonColor: '#6B7280',
                        confirmButtonText: 'Complete Payment',
                        confirmButtonColor: '#10B981',
                        preConfirm: () => {
                          const selected = (document.querySelector('input[name="payment"]:checked') as HTMLInputElement)?.value;
                          if (!selected) {
                            Swal.showValidationMessage('Please select a payment method');
                            return false;
                          }
                          return selected;
                        }
                      });

                      if (selectedPayment) {
                        setSelectedPaymentMethod(selectedPayment);
                        handleSubscribe(plan.id, selectedPayment);
                      }
                    } else {
                      setSelectedPlan(plan.id);
                      setSelectedPaymentMethod('paystack');
                    }
                  }}
                  disabled={loading || (currentSubscription?.status === 'active' && currentSubscription?.plan === plan.id)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    currentSubscription?.plan === plan.id && currentSubscription?.status === 'active'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.id === selectedPlan
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {loading ? 'Processing...' : 
                   currentSubscription?.plan === plan.id && currentSubscription?.status === 'active'
                    ? 'Current Plan ✓'
                    : plan.id === selectedPlan && plan.price > 0
                    ? 'Continue to Payment →'
                    : plan.id === selectedPlan
                    ? 'Select Plan'
                    : 'Select Plan'}
                </button>
                </div>
               </div>
             ))}
           </div>

           {/* Enterprise Differentiator */}
           <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
             <div className="text-center">
               <h3 className="text-xl font-bold text-gray-900 mb-4">The Enterprise Difference</h3>
               <p className="text-gray-700 mb-4">
                 <span className="font-medium text-green-700">Insights = "Here is the report"</span>
                 <span className="mx-3 text-gray-500">vs</span>
                 <span className="font-medium text-emerald-700">Enterprise = "Tell us what you need, we'll analyze it"</span>
               </p>
               <div className="bg-white rounded-lg p-4 border border-gray-200">
                 <p className="text-gray-800 leading-relaxed">
                   Enterprise clients don't just receive reports — they influence what data is collected, analyzed, and delivered.
                 </p>
               </div>
             </div>
           </div>
          </div>

        {/* Data Collection Information */}
        <div className="mt-12 bg-green-50 rounded-lg border border-green-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">How Our Data Is Collected</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                    <span className="text-green-600 font-medium text-sm">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Direct farmer registration</h4>
                  <p className="text-gray-600">Farmers sign up and provide their farm information directly</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                    <span className="text-green-600 font-medium text-sm">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Monthly farm updates</h4>
                  <p className="text-gray-600">Regular updates on planting, growth, and harvesting activities</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                    <span className="text-green-600 font-medium text-sm">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Field verification and photo checks</h4>
                  <p className="text-gray-600">Our team verifies farm data through site visits and photo documentation</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                    <span className="text-green-600 font-medium text-sm">4</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Community and group-based validation</h4>
                  <p className="text-gray-600">Data is cross-validated through farmer cooperatives and community groups</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold text-green-800 mb-2">Real farmers. Real farms. Real data.</h4>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-8 bg-yellow-50 rounded-lg border border-yellow-200 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Important Notes</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">No API access at this stage</h4>
                <p className="text-gray-600">Current plans focus on insights and reports, not raw data API access</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">No "unlimited" usage promises</h4>
                <p className="text-gray-600">We focus on quality insights rather than unlimited data volume</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <h4 className="font-medium text-gray-900">Data is curated, verified, and insight-focused</h4>
                <p className="text-gray-600">All data goes through quality checks and is transformed into actionable insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Can I change my plan anytime?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How do you verify the data?</h4>
              <p className="text-gray-600">We use field verification, photo documentation, and community validation to ensure data accuracy.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-gray-600">The Explorer plan is free forever with basic insights. You can explore premium features with a 14-day trial.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How does billing work?</h4>
              <p className="text-gray-600">Billing is monthly and you can cancel anytime. We offer discounts for annual subscriptions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;