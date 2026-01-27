import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MarketData {
  priceTrends: Array<{
    _id: {
      cropType: string;
      month: number;
      year: number;
    };
    avgPrice: number;
    minPrice: number;
    maxPrice: number;
    volume: number;
  }>;
  marketVolatility: Array<{
    cropType: string;
    avgPrice: number;
    volatility: number;
    riskLevel: string;
  }>;
  supplyDemand: Array<{
    cropType: string;
    region: string;
    supply: number;
    avgPrice: number;
    demandIndicator: string;
  }>;
  topMarkets: Array<{
    _id: string;
    volume: number;
    avgPrice: number;
    cropTypes: string[];
  }>;
}

const MarketIntelligence: React.FC = () => {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('3m');

  useEffect(() => {
    fetchMarketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCrop, selectedRegion, timeRange]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams();
      if (selectedCrop !== 'all') params.append('cropType', selectedCrop);
      if (selectedRegion !== 'all') params.append('region', selectedRegion);
      params.append('timeRange', timeRange);

      const response = await fetch(`/api/dashboard/market/intelligence?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market intelligence data');
      }

      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Prepare price trends chart
  const preparePriceTrendsChart = () => {
    if (!data?.priceTrends) return null;

    const monthlyData = data.priceTrends.reduce((acc, item) => {
      const monthKey = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { months: [], avgPrices: [], minPrices: [], maxPrices: [] };
      }
      acc[monthKey].months.push(monthKey);
      acc[monthKey].avgPrices.push(item.avgPrice);
      acc[monthKey].minPrices.push(item.minPrice);
      acc[monthKey].maxPrices.push(item.maxPrice);
      return acc;
    }, {} as Record<string, { months: string[], avgPrices: number[], minPrices: number[], maxPrices: number[] }>);

    const sortedMonths = Object.keys(monthlyData).sort();
    
    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
      }),
      datasets: [
        {
          label: 'Average Price',
          data: sortedMonths.map(month => {
            const prices = monthlyData[month].avgPrices;
            return prices.reduce((sum, price) => sum + price, 0) / prices.length;
          }),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Min Price',
          data: sortedMonths.map(month => Math.min(...monthlyData[month].minPrices)),
          borderColor: '#3B82F6',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        },
        {
          label: 'Max Price',
          data: sortedMonths.map(month => Math.max(...monthlyData[month].maxPrices)),
          borderColor: '#EF4444',
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderDash: [5, 5],
          fill: false,
          tension: 0.4
        }
      ]
    };
  };

  // Prepare volatility chart
  const prepareVolatilityChart = () => {
    if (!data?.marketVolatility) return null;

    return {
      labels: data.marketVolatility.map(item => item.cropType),
      datasets: [{
        label: 'Price Volatility',
        data: data.marketVolatility.map(item => item.volatility),
        backgroundColor: data.marketVolatility.map(item => {
          switch (item.riskLevel) {
            case 'low': return '#10B981';
            case 'medium': return '#F59E0B';
            case 'high': return '#EF4444';
            default: return '#6B7280';
          }
        }),
        borderColor: data.marketVolatility.map(item => {
          switch (item.riskLevel) {
            case 'low': return '#059669';
            case 'medium': return '#D97706';
            case 'high': return '#DC2626';
            default: return '#4B5563';
          }
        }),
        borderWidth: 1
      }]
    };
  };

  // Prepare supply/demand chart
  const prepareSupplyDemandChart = () => {
    if (!data?.supplyDemand) return null;

    const cropRegions = data.supplyDemand.reduce((acc, item) => {
      const key = `${item.cropType}-${item.region}`;
      if (!acc[key]) {
        acc[key] = { cropType: item.cropType, region: item.region, supply: 0, avgPrice: 0, count: 0 };
      }
      acc[key].supply += item.supply;
      acc[key].avgPrice += item.avgPrice;
      acc[key].count += 1;
      return acc;
    }, {} as Record<string, { cropType: string, region: string, supply: number, avgPrice: number, count: number }>);

    const aggregatedData = Object.values(cropRegions).map(item => ({
      ...item,
      avgPrice: item.avgPrice / item.count
    }));

    return {
      labels: aggregatedData.map(item => `${item.cropType} - ${item.region}`),
      datasets: [
        {
          label: 'Supply (Farms)',
          data: aggregatedData.map(item => item.supply),
          backgroundColor: '#10B981',
          borderColor: '#059669',
          borderWidth: 1,
          yAxisID: 'y'
        },
        {
          label: 'Average Price (NGN)',
          data: aggregatedData.map(item => item.avgPrice),
          backgroundColor: '#3B82F6',
          borderColor: '#1D4ED8',
          borderWidth: 1,
          yAxisID: 'y1'
        }
      ]
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
        <p className="text-gray-600">No market data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="1m">Last Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchMarketData}
              className="w-full btn-primary"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Price Trends */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trends Over Time</h3>
        {preparePriceTrendsChart() && (
          <Line
            data={preparePriceTrendsChart()!}
            options={{
              responsive: true,
              interaction: {
                mode: 'index' as const,
                intersect: false,
              },
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                tooltip: {
                  callbacks: {
                    label: function(context: TooltipItem<'line'>) {
                      let label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      label += `₦${(context.parsed?.y || 0).toFixed(2)}`;
                      return label;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '₦' + value;
                    }
                  }
                }
              }
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Volatility */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Volatility by Crop</h3>
          {prepareVolatilityChart() && (
            <Bar
              data={prepareVolatilityChart()!}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context: TooltipItem<'bar'>) {
                        const volatility = context.parsed?.y || 0;
                        const riskLevel = data.marketVolatility[context.dataIndex]?.riskLevel || 'medium';
                        return [
                          `Volatility: ${volatility.toFixed(2)}`,
                          `Risk Level: ${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}`
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
                      text: 'Volatility Score'
                    }
                  }
                }
              }}
            />
          )}
        </div>

        {/* Supply & Demand */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Supply vs Average Price</h3>
          {prepareSupplyDemandChart() && (
            <Bar
              data={prepareSupplyDemandChart()!}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const
                  }
                },
                scales: {
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    title: {
                      display: true,
                      text: 'Supply (Farms)'
                    }
                  },
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    title: {
                      display: true,
                      text: 'Avg Price (NGN)'
                    },
                    grid: {
                      drawOnChartArea: false,
                    }
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Top Markets */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Markets by Volume</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Market</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Avg Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Crop Types</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topMarkets.map((market, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-900">{market._id}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{market.volume.toLocaleString()}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">₦{market.avgPrice.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-1">
                      {market.cropTypes.slice(0, 3).map((crop, i) => (
                        <span key={i} className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          {crop}
                        </span>
                      ))}
                      {market.cropTypes.length > 3 && (
                        <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          +{market.cropTypes.length - 3}
                        </span>
                      )}
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

export default MarketIntelligence;