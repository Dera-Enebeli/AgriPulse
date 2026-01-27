import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { dashboardAPI } from '../services/api';
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
  TooltipItem
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
  Legend
);

interface RiskData {
  riskOverview: Array<{
    riskType: string;
    severity: string;
    count: number;
    affectedRegions: number;
    riskScore: number;
  }>;
  riskHotspots: Array<{
    region: string;
    totalRisks: number;
    highSeverityRisks: number;
    riskLevel: string;
    uniqueRiskTypes: number;
  }>;
  riskTrends: Array<{
    period: {
      month: number;
      year: number;
    };
    riskType: string;
    count: number;
  }>;
  affectedCrops: Array<{
    cropType: string;
    riskCount: number;
    uniqueRiskTypes: number;
    affectedRegions: number;
    vulnerabilityScore: number;
  }>;
}

// Prepare risk trends chart function (moved outside component to avoid recreation)
const prepareRiskTrendsChart = (data: RiskData | null) => {
  if (!data?.riskTrends) return null;

  console.log('🔍 Frontend received risk trends:', data.riskTrends.length, 'records');
  data.riskTrends.slice(0, 3).forEach((item, i) => {
    console.log(`  ${i+1}. ${item.period.month}/${item.period.year}: ${item.riskType} = ${item.count}`);
  });

  const monthlyData = data.riskTrends.reduce((acc, item) => {
    const monthKey = `${item.period.year}-${item.period.month.toString().padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = {};
    }
    if (!acc[monthKey][item.riskType]) {
      acc[monthKey][item.riskType] = 0;
    }
    acc[monthKey][item.riskType] += item.count;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  console.log('📅 Monthly data processed:', monthlyData);

  const sortedMonths = Object.keys(monthlyData).sort();
  const allRiskTypes = Array.from(new Set(data.riskTrends.map(item => item.riskType)));

  console.log('🏷️ Sorted months:', sortedMonths);
  console.log('🏷️ Risk types:', allRiskTypes);

  const chartData = {
    labels: sortedMonths.map(month => {
      const [year, monthNum] = month.split('-');
      return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
    }),
    datasets: allRiskTypes.map((riskType, index) => {
      const datasetData = sortedMonths.map(month => monthlyData[month][riskType] || 0);
      console.log(`📊 ${riskType} dataset: [${datasetData.join(', ')}]`);
      
      return {
        label: riskType.charAt(0).toUpperCase() + riskType.slice(1),
        data: datasetData,
        borderColor: [
          '#EF4444', '#F59E0B', '#10B981', '#3B82F6', 
          '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
        ][index % 8],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.1,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 6
      };
    })
  };

  console.log('✅ Final chart data:', {
    labels: chartData.labels,
    datasetCount: chartData.datasets.length,
    firstDataset: chartData.datasets[0]?.label,
    firstDataPoints: chartData.datasets[0]?.data
  });

  return chartData;
};

const RiskMonitoring: React.FC = () => {
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedRiskType, setSelectedRiskType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  
  // Memoize chart data to prevent unnecessary re-renders
  const riskTrendsChartData = React.useMemo(() => prepareRiskTrendsChart(data), [data]);

  useEffect(() => {
    fetchRiskData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion, selectedRiskType, selectedSeverity]);

  const fetchRiskData = async () => {
    try {
      setLoading(true);
      
      // Use the enhanced API service with proper parameter cleaning
      const params = {
        region: selectedRegion !== 'all' ? selectedRegion : undefined,
        riskType: selectedRiskType !== 'all' ? selectedRiskType : undefined,
        severity: selectedSeverity !== 'all' ? selectedSeverity : undefined
      };
      
      const result = await dashboardAPI.getRiskMonitoring(params);
      setData(result.data);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Prepare risk overview chart
  const prepareRiskOverviewChart = () => {
    if (!data?.riskOverview) return null;

    const riskByType = data.riskOverview.reduce((acc, item) => {
      if (!acc[item.riskType]) {
        acc[item.riskType] = { low: 0, medium: 0, high: 0, severe: 0 };
      }
      const riskTypeData = acc[item.riskType] as { low: number; medium: number; high: number; severe: number; [key: string]: number };
      riskTypeData[item.severity] = item.count;
      return acc;
    }, {} as Record<string, { low: number; medium: number; high: number; severe: number; [key: string]: number }>);

    return {
      labels: Object.keys(riskByType),
      datasets: [
        {
          label: 'Low',
          data: Object.values(riskByType).map(item => item.low),
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1
        },
        {
          label: 'Medium',
          data: Object.values(riskByType).map(item => item.medium),
          backgroundColor: '#F59E0B',
          borderColor: '#D97706',
          borderWidth: 1
        },
        {
          label: 'High',
          data: Object.values(riskByType).map(item => item.high),
          backgroundColor: '#EF4444',
          borderColor: '#DC2626',
          borderWidth: 1
        },
        {
          label: 'Severe',
          data: Object.values(riskByType).map(item => item.severe),
          backgroundColor: '#7C2D12',
          borderColor: '#451A03',
          borderWidth: 1
        }
      ]
    };
  };

  // Prepare risk hotspots chart
  const prepareRiskHotspotsChart = () => {
    if (!data?.riskHotspots) return null;

    return {
      labels: data.riskHotspots.map(item => item.region),
      datasets: [
        {
          label: 'Total Risks',
          data: data.riskHotspots.map(item => item.totalRisks),
          backgroundColor: data.riskHotspots.map(item => {
            switch (item.riskLevel) {
              case 'low': return '#10B981';
              case 'medium': return '#F59E0B';
              case 'high': return '#EF4444';
              default: return '#6B7280';
            }
          }),
          borderColor: data.riskHotspots.map(item => {
            switch (item.riskLevel) {
              case 'low': return '#059669';
              case 'medium': return '#D97706';
              case 'high': return '#DC2626';
              default: return '#4B5563';
            }
          }),
          borderWidth: 1
        },
        {
          label: 'High Severity Risks',
          data: data.riskHotspots.map(item => item.highSeverityRisks),
          backgroundColor: '#DC2626',
          borderColor: '#991B1B',
          borderWidth: 1
        }
      ]
    };
  };

  // Prepare crop vulnerability chart
  const prepareCropVulnerabilityChart = () => {
    if (!data?.affectedCrops) return null;

    return {
      labels: data.affectedCrops.map(item => item.cropType),
      datasets: [{
        label: 'Vulnerability Score',
        data: data.affectedCrops.map(item => item.vulnerabilityScore),
        backgroundColor: data.affectedCrops.map(item => {
          if (item.vulnerabilityScore >= 20) return '#DC2626';
          if (item.vulnerabilityScore >= 10) return '#F59E0B';
          return '#10B981';
        }),
        borderColor: data.affectedCrops.map(item => {
          if (item.vulnerabilityScore >= 20) return '#991B1B';
          if (item.vulnerabilityScore >= 10) return '#D97706';
          return '#059669';
        }),
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-gray-600">No risk data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Regions</option>
              <option value="north-central">North Central</option>
              <option value="north-east">North East</option>
              <option value="north-west">North West</option>
              <option value="south-east">South East</option>
              <option value="south-south">South South</option>
              <option value="south-west">South West</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Type</label>
            <select
              value={selectedRiskType}
              onChange={(e) => setSelectedRiskType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Risk Types</option>
              <option value="drought">Drought</option>
              <option value="flood">Flood</option>
              <option value="pests">Pests</option>
              <option value="disease">Disease</option>
              <option value="market-price">Market Price</option>
              <option value="conflict">Conflict</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="severe">Severe</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchRiskData}
              className="w-full btn-primary"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Overview by Type and Severity</h3>
        {prepareRiskOverviewChart() && (
          <Bar
            data={prepareRiskOverviewChart()!}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Incidents'
                  }
                }
              }
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Hotspots */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Hotspots by Region</h3>
          {prepareRiskHotspotsChart() && (
            <Bar
              data={prepareRiskHotspotsChart()!}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context: TooltipItem<'bar'>) {
                        const hotspot = data.riskHotspots[context.dataIndex];
                        return [
                          `Total Risks: ${context.parsed?.y || 0}`,
                          `High Severity: ${hotspot.highSeverityRisks}`,
                          `Risk Level: ${hotspot.riskLevel.charAt(0).toUpperCase() + hotspot.riskLevel.slice(1)}`
                        ];
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Risks'
                    }
                  }
                }
              }}
            />
          )}
        </div>

        {/* Crop Vulnerability */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Vulnerability Assessment</h3>
          {prepareCropVulnerabilityChart() && (
            <Bar
              data={prepareCropVulnerabilityChart()!}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context: TooltipItem<'bar'>) {
                        const crop = data.affectedCrops[context.dataIndex];
                        return [
                          `Vulnerability Score: ${context.parsed?.y || 0}`,
                          `Risk Count: ${crop.riskCount}`,
                          `Risk Types: ${crop.uniqueRiskTypes}`,
                          `Regions: ${crop.affectedRegions}`
                        ];
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Vulnerability Score'
                    }
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Risk Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Trends Over Time</h3>
        <div style={{ height: '400px', position: 'relative' }}>
          {riskTrendsChartData ? (
            <Line
              data={riskTrendsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                interaction: {
                  mode: 'index' as const,
                  intersect: false,
                },
                plugins: {
                  legend: {
                    position: 'top' as const,
                    display: true
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    enabled: true
                  }
                },
                scales: {
                  x: {
                    display: true,
                    title: {
                      display: true,
                      text: 'Time Period'
                    },
                    grid: {
                      display: true
                    }
                  },
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Number of Incidents'
                    },
                    grid: {
                      display: true
                    },
                    min: 0
                  }
                }
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No risk trends data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Risk Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Risk Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Risk Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Affected Regions</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Risk Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.riskOverview.slice(0, 10).map((risk, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">
                    {risk.riskType.charAt(0).toUpperCase() + risk.riskType.slice(1)}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      risk.severity === 'low' ? 'bg-green-100 text-green-800' :
                      risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                      'bg-red-200 text-red-900'
                    }`}>
                      {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{risk.count}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{risk.affectedRegions}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            risk.riskScore >= 3 ? 'bg-red-500' :
                            risk.riskScore >= 2 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${(risk.riskScore / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-900">{risk.riskScore}/4</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskMonitoring;