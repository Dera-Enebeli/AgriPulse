import React, { useState, useEffect, useCallback } from 'react';
import { dashboardAPI } from '../services/api';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardData {
  summary: {
    totalFarms: number;
    avgQuality: number;
    dataFreshness: number;
  };
  cropDistribution: Array<{
    _id: string;
    count: number;
  }>;
  regionalData: Array<{
    _id: string;
    farms: number;
    avgYield: number;
  }>;
  qualityMetrics: {
    avgQuality: number;
    avgCompleteness: number;
    avgAccuracy: number;
  };
  recentSubmissions: Array<{
    cropType: string;
    region: string;
    plantingDate: string;
    expectedHarvestDate: string;
    quality: {
      overall: number;
    };
  }>;
}

const DashboardOverview: React.FC<{ subscription?: any }> = ({ subscription }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Free plan gets no filters - hardcoded to 'all'
  const isFreePlan = subscription?.plan === 'free' || !subscription;
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('6m');

  // Handler functions
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isFreePlan) {
      setSelectedRegion(e.target.value);
    }
  };

  const handleCropChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isFreePlan) {
      setSelectedCrop(e.target.value);
    }
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isFreePlan) {
      setTimeRange(e.target.value);
    }
  };
  

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = {
        region: selectedRegion !== 'all' ? selectedRegion : '',
        cropType: selectedCrop !== 'all' ? selectedCrop : '',
        timeRange
      };

      const result = await dashboardAPI.getOverview(params);
      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [selectedRegion, selectedCrop, timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Prepare chart data
  const prepareCropDistributionChart = () => {
    if (!data?.cropDistribution) return null;

    if (isFreePlan) {
      // Show percentage ranges only for Free plan
      const total = data.cropDistribution.reduce((sum, item) => sum + item.count, 0);
      return {
        labels: data.cropDistribution.map(item => item._id),
        datasets: [{
          data: data.cropDistribution.map(item => ((item.count / total) * 100).toFixed(1) as any),
          backgroundColor: [
            '#10B981',
            '#3B82F6',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6',
            '#EC4899',
            '#14B8A6',
            '#F97316'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      };
    }

    return {
      labels: data.cropDistribution.map(item => item._id),
      datasets: [{
        data: data.cropDistribution.map(item => item.count as any),
        backgroundColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
          '#14B8A6',
          '#F97316'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    };
  };

  const prepareRegionalChart = () => {
    if (!data?.regionalData) return null;

    if (isFreePlan) {
      // Show regions covered (no drill-down) for Free plan
      return {
        labels: data.regionalData.map(item => item._id),
        datasets: [{
          label: 'Regions Covered',
          data: data.regionalData.map(() => 100), // Show as 100% covered
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1
        }]
      };
    }

    return {
      labels: data.regionalData.map(item => item._id),
      datasets: [{
        label: 'Number of Farms',
        data: data.regionalData.map(item => item.farms),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1
      }]
    };
  };

  const prepareQualityChart = () => {
    if (!data?.qualityMetrics) return null;

    return {
      labels: ['Completeness', 'Accuracy', 'Overall Quality'],
      datasets: [{
        label: 'Quality Score',
        data: [
          data.qualityMetrics.avgCompleteness * 100,
          data.qualityMetrics.avgAccuracy * 100,
          data.qualityMetrics.avgQuality * 100
        ],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
        borderColor: ['#1D4ED8', '#059669', '#D97706'],
        borderWidth: 1
      }]
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {isFreePlan && (
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Upgrade to Insights Plan to enable filters
              </div>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={handleRegionChange}
              disabled={isFreePlan}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isFreePlan 
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300'
              }`}
            >
              <option value="all">All Regions</option>
              <option value="north-west">North West</option>
              <option value="north-east">North East</option>
              <option value="north-central">North Central</option>
              <option value="south-west">South West</option>
              <option value="south-east">South East</option>
              <option value="south-south">South South</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
            <select
              value={selectedCrop}
              onChange={handleCropChange}
              disabled={isFreePlan}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isFreePlan 
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300'
              }`}
            >
              <option value="all">All Crops</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
              <option value="cassava">Cassava</option>
              <option value="yam">Yam</option>
              <option value="beans">Beans</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={handleTimeRangeChange}
              disabled={isFreePlan}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                isFreePlan 
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300'
              }`}
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="1y">Last Year</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchDashboardData}
              className="w-full btn-primary"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Farms</p>
              <p className="text-2xl font-bold text-gray-900">
                {isFreePlan ? '150+' : data.summary.totalFarms.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Quality Score</p>
              <p className="text-2xl font-bold text-gray-900">{(data.summary.avgQuality * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6 -3a5 5 0 01-9.99 0A5 5 0 0112 8a5 5 0 01-9.99 0zM17 18a1 1 0 011 1h2a1 1 0 011 1v5a1 1 0 01-1 1h-2a1 1 0 001 1v-5zM9 18a1 1 0 00-1-1H6a1 1 0 00-1 1v5a1 1 0 001 1h2a1 1 0 001 1v-5z"></path>
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data Freshness</p>
              <p className="text-2xl font-bold text-gray-900">{data.summary.dataFreshness} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Distribution</h3>
          {prepareCropDistributionChart() && (
            <Doughnut
              data={prepareCropDistributionChart()!}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  }
                }
              }}
            />
          )}
        </div>

        {/* Regional Data */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Farms by Region</h3>
          {prepareRegionalChart() && (
            <Bar
              data={prepareRegionalChart()!}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Quality Metrics</h3>
        {prepareQualityChart() && (
          <Bar
            data={prepareQualityChart()!}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
          />
        )}
      </div>

      {/* Free Plan Purpose Statement - Moved to Bottom */}
      {isFreePlan && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Content */}
            <div className="flex-1 p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Free Plan</h3>
                  <p className="text-sm text-amber-600 font-medium">Preview Access</p>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg mb-6 font-medium">
                Get a glimpse of agricultural insights
              </p>
              
              {/* Quick Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Overview</p>
                    <p className="text-sm text-gray-600">High-level insights</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Reports</p>
                    <p className="text-sm text-gray-600">Public access</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Upgrade required</span> for detailed analysis, filters, and downloads
                </p>
              </div>
            </div>
            
            {/* Right side - CTA */}
            <div className="bg-gradient-to-b from-amber-100 to-orange-100 p-8 flex flex-col justify-center items-center text-center md:border-l border-amber-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Unlock Full Access</h4>
              <p className="text-sm text-gray-600 mb-6">Get detailed insights, real-time data, and advanced analytics</p>
              
              <a href="/payment" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                Upgrade Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;