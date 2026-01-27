import React, { useState, useEffect } from 'react';
import { authAPI, dashboardAPI, paymentAPI } from '../services/api';
import DashboardOverview from './DashboardOverview';
import MarketIntelligence from './MarketIntelligence';
import RiskMonitoring from './RiskMonitoring';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'market' | 'risk'>('overview');
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // For development, allow access without token
        setUser({ name: 'Test User', email: 'test@example.com' });
        setSubscription({ plan: 'free', status: 'active' });
        return;
      }

      // Fetch user data (this now includes subscription)
      try {
        const userData = await authAPI.getProfile();
        console.log('User data from API:', userData);
        setUser(userData.user);
        setSubscription({
          plan: userData.user.subscription || 'free',
          status: 'active'
        });
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Set default user for development
        setUser({ name: 'Test User', email: 'test@example.com' });
        setSubscription({ plan: 'free', status: 'active' });
      }

      // Also fetch from payment API for confirmation
      try {
        const paymentSubscription = await paymentAPI.getSubscriptionStatus();
        console.log('Payment API subscription:', paymentSubscription);
        if (paymentSubscription.subscription) {
          setSubscription(paymentSubscription.subscription);
        }
      } catch (error) {
        console.error('Failed to fetch payment subscription:', error);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Set defaults for development
      setUser({ name: 'Test User', email: 'test@example.com' });
      setSubscription({ plan: 'free', status: 'active' });
    }
  };

  const handleTabClick = (tab: 'market' | 'risk') => {
    if (subscription?.plan === 'free' || subscription?.plan === 'explorer') {
      const tabContent = tab === 'market' 
        ? 'Upgrade to unlock detailed market intelligence, price trends, and downloadable reports.'
        : 'Upgrade to unlock detailed risk forecasts, hotspot analysis, and seasonal alerts.';
      
      // Show upgrade modal or alert
      alert('🔒 ' + tabContent + '\\n\\nClick "Upgrade to Decision-Ready Insights" in the header to unlock premium features.');
      return;
    }
    setActiveTab(tab);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AgriPulse Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.organization}</p>
                {subscription && (
                  <p className="text-xs text-primary-600 font-medium">
                    {subscription.plan === 'free' ? 'Free' :
                     subscription.plan === 'explorer' ? 'Explorer' :
                     subscription.plan === 'insights' ? 'Insights' :
                     subscription.plan === 'enterprise' ? 'Enterprise' :
                     subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                  </p>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="p-2 text-gray-400 hover:text-gray-600 relative"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  {subscription?.status === 'active' && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full"></span>
                  )}
                </button>
              </div>
              
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Plan Value Proposition */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {subscription?.plan === 'free' && '🆓 Free Plan — Awareness Only'}
              {subscription?.plan === 'explorer' && '🌾 Explorer Plan — Awareness Only'}
              {subscription?.plan === 'insights' && '📊 Insights Plan — Decision-Ready'}
              {subscription?.plan === 'enterprise' && '🏢 Enterprise Plan — Power & Influence'}
              {!subscription?.plan && '🆓 Free Plan — Awareness Only'}
            </h2>
            <p className="text-lg text-gray-600">
              {subscription?.plan === 'free' && 'Keep this lightweight and non-decision-ready. See what\'s possible, then unlock deeper insights.'}
              {subscription?.plan === 'explorer' && 'Keep this lightweight and non-decision-ready. See what\'s possible, then unlock deeper insights.'}
              {subscription?.plan === 'insights' && 'This is where real value starts. Make confident decisions with reliable agricultural intelligence.'}
              {subscription?.plan === 'enterprise' && 'Perfect timing and custom insights. Direct access to experts and early data signals.'}
              {!subscription?.plan && 'Keep this lightweight and non-decision-ready. See what\'s possible, then unlock deeper insights.'}
            </p>
            
            {/* Call-to-action based on plan */}
            {(subscription?.plan === 'free' || subscription?.plan === 'explorer') && (
              <div className="mt-4">
                <a href="/payment" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  Upgrade to Decision-Ready Insights
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabClick('market')}
              className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                activeTab === 'market'
                  ? 'border-primary-500 text-primary-600'
                  : subscription?.plan !== 'explorer' && subscription?.plan !== 'free'
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-300 cursor-not-allowed'
              }`}
              disabled={subscription?.plan === 'explorer' || subscription?.plan === 'free'}
            >
              Market Intelligence
              {(subscription?.plan === 'explorer' || subscription?.plan === 'free') && (
                <span className="absolute -top-1 -right-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Locked
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabClick('risk')}
              className={`py-4 px-1 border-b-2 font-medium text-sm relative ${
                activeTab === 'risk'
                  ? 'border-primary-500 text-primary-600'
                  : subscription?.plan !== 'explorer' && subscription?.plan !== 'free'
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-300 cursor-not-allowed'
              }`}
              disabled={subscription?.plan === 'explorer' || subscription?.plan === 'free'}
            >
              Risk Monitoring
              {(subscription?.plan === 'explorer' || subscription?.plan === 'free') && (
                <span className="absolute -top-1 -right-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  Locked
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <DashboardOverview subscription={subscription} />}
        
        {/* Market Intelligence Tab - Locked for Explorer plan */}
        {activeTab === 'market' && (
          (subscription?.plan === 'explorer' || subscription?.plan === 'free') ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Market Intelligence Locked</h3>
                <p className="text-gray-600 mb-6">
                  Upgrade to unlock detailed insights, risk forecasts, and downloadable reports.
                </p>
                <a href="/payment" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  Upgrade to Decision-Ready Insights
                </a>
              </div>
            </div>
          ) : <MarketIntelligence />
        )}
        
        {/* Risk Monitoring Tab - Locked for Explorer plan */}
        {activeTab === 'risk' && (
          (subscription?.plan === 'explorer' || subscription?.plan === 'free') ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <div className="max-w-md mx-auto">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Monitoring Locked</h3>
                <p className="text-gray-600 mb-6">
                  Upgrade to unlock detailed risk analysis, seasonal forecasts, and early warning alerts.
                </p>
                <a href="/payment" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  Upgrade to Decision-Ready Insights
                </a>
              </div>
            </div>
          ) : <RiskMonitoring />
        )}
      </div>
    </div>
  );
};

export default Dashboard;