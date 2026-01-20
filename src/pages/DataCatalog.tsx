import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SampleChart from '../components/SampleChart';
import RequestSampleModal from '../components/RequestSampleModal';

const DataCatalog: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('');

  const dataCategories = [
    {
      id: 1,
      name: 'Crop Planting Trends',
      description: 'Regional patterns and seasonal variations for major crops',
      price: 'Contact for pricing',
      features: ['Real-time updates', 'Regional breakdown', 'Historical trends', 'Seasonal analysis'],
      chartType: 'line' as const
    },
    {
      id: 2,
      name: 'Expected Harvest Timelines',
      description: 'Predictive harvest windows by crop and region',
      price: 'Contact for pricing',
      features: ['Harvest predictions', 'Crop-specific data', 'Regional insights', 'Monthly updates'],
      chartType: 'bar' as const
    },
    {
      id: 3,
      name: 'Yield Ranges',
      description: 'Anonymized yield data and productivity metrics',
      price: 'Contact for pricing',
      features: ['Yield ranges', 'Productivity metrics', 'Regional comparisons', 'Annual reports'],
      chartType: 'doughnut' as const
    },
    {
      id: 4,
      name: 'Input Demand Signals',
      description: 'Fertilizer, seed, and equipment demand patterns',
      price: 'Contact for pricing',
      features: ['Demand forecasting', 'Input categories', 'Seasonal patterns', 'Market analysis'],
      chartType: 'bar' as const
    },
    {
      id: 5,
      name: 'Risk Alerts',
      description: 'Pests, floods, drought warnings by region',
      price: 'Contact for pricing',
      features: ['Real-time alerts', 'Risk categories', 'Regional coverage', 'Mitigation insights'],
      chartType: 'line' as const
    },
    {
      id: 6,
      name: 'Market Insights',
      description: 'Price trends and market opportunities',
      price: 'Contact for pricing',
      features: ['Price trends', 'Market analysis', 'Opportunity identification', 'Competitive insights'],
      chartType: 'doughnut' as const
    }
  ];

  const getCategoryPath = (categoryName: string): string => {
    const categoryMap: { [key: string]: string } = {
      'Crop Planting Trends': 'crop-data',
      'Expected Harvest Timelines': 'crop-data',
      'Yield Ranges': 'crop-data',
      'Input Demand Signals': 'market-data',
      'Market Insights': 'market-data',
      'Risk Alerts': 'risk-analysis',
      'Climate Impact Analysis': 'risk-analysis',
      'Operational Risk Index': 'risk-analysis',
      'Regional Performance Benchmarks': 'regional-insights',
      'Infrastructure Capacity Analysis': 'regional-insights',
      'Regional Economic Impact': 'regional-insights'
    };
    return categoryMap[categoryName] || 'data';
  };

  const handleRequestSample = (datasetName: string) => {
    setSelectedDataset(datasetName);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Data Catalog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive agricultural data insights. All data is aggregated and anonymized to protect farmer privacy.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/data" className="px-4 py-2 bg-primary-600 text-white rounded-lg">All Categories</Link>
            <Link to="/data/crop-data" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Crop Data</Link>
            <Link to="/data/market-data" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Market Data</Link>
            <Link to="/data/risk-analysis" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Risk Analysis</Link>
            <Link to="/data/regional-insights" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Regional Insights</Link>
          </div>
        </div>
      </section>

      {/* Data Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dataCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg card-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                    </div>
                    <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                      {category.price}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <SampleChart type={category.chartType} title={category.name} />
                    <p className="text-sm text-gray-500 text-center mt-2">Sample visualization - Demo data</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {category.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      className="flex-1 btn-primary"
                      onClick={() => handleRequestSample(category.name)}
                    >
                      Request Sample
                    </button>
                    <Link 
                      to={`/data/${getCategoryPath(category.name)}`}
                      className="flex-1 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Need Custom Regional Insights?
                </h2>
                <p className="text-xl mb-8 text-primary-100">
                  We can provide tailored regional intelligence for your specific geographic needs
                </p>
                <Link to="/custom-solutions" className="btn-secondary text-lg">
                  Discuss Custom Solutions
                </Link>
              </div>
            </section>

      {/* Request Sample Modal */}
      <RequestSampleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        datasetName={selectedDataset}
      />
    </div>
  );
};

export default DataCatalog;