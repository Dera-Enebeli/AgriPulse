import React, { useState } from 'react';
import SampleChart from '../components/SampleChart';
import RequestSampleModal from '../components/RequestSampleModal';
import DataNavigation from '../components/DataNavigation';
import { Link } from 'react-router-dom';

const MarketData: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('');

  const marketDatasets = [
    {
      id: 4,
      name: 'Input Demand Signals',
      description: 'Fertilizer, seed, and equipment demand patterns showing agricultural input purchasing trends',
      price: 'Contact for pricing',
      features: ['Demand forecasting', 'Input categories', 'Seasonal patterns', 'Market analysis'],
      chartType: 'bar' as const,
      whatItAnswers: 'What agricultural inputs are in demand and when?',
      whatsInside: {
        regions: 'All major agricultural regions',
        inputs: 'Fertilizer (NPK), Seeds, Equipment, Crop protection',
        timeRange: '3 years historical + current season',
        updateFrequency: 'Monthly',
        units: 'Demand index, volume trends, price sensitivity'
      },
      useCases: {
        buyers: 'Optimize input procurement timing and inventory',
        ngo: 'Understand farmer input costs and accessibility',
        government: 'Monitor agricultural supply chain health',
        insurers: 'Assess input-related risk factors'
      },
      trustStatement: 'Input demand data is aggregated from farmer purchasing cooperatives and suppliers, anonymized to protect individual purchasing decisions while maintaining market trend accuracy.'
    },
    {
      id: 5,
      name: 'Market Insights',
      description: 'Price trends and market opportunities for agricultural commodities and inputs',
      price: 'Contact for pricing',
      features: ['Price trends', 'Market analysis', 'Opportunity identification', 'Competitive insights'],
      chartType: 'doughnut' as const,
      whatItAnswers: 'Where are market opportunities and price trends heading?',
      whatsInside: {
        regions: 'Regional price hubs and national markets',
        commodities: 'Corn, Soybeans, Wheat, Input prices',
        timeRange: '5 years historical + forward-looking indicators',
        updateFrequency: 'Weekly',
        units: 'Price per bushel/ton, market volatility indices'
      },
      useCases: {
        buyers: 'Identify optimal purchasing timing and pricing',
        ngo: 'Budget for food programs and assistance',
        government: 'Monitor market stability and competition',
        insurers: 'Price risk assessment and hedging strategies'
      },
      trustStatement: 'Market insights combine aggregated transaction data from farmer cooperatives with public market data, providing a comprehensive view while protecting individual transaction confidentiality.'
    },
    {
      id: 6,
      name: 'Supply Chain Analytics',
      description: 'Agricultural supply chain flow analysis from farm to market including transportation and storage patterns',
      price: 'Contact for pricing',
      features: ['Supply chain mapping', 'Transportation analysis', 'Storage utilization', 'Flow optimization'],
      chartType: 'line' as const,
      whatItAnswers: 'How efficiently is agricultural produce moving through supply chain?',
      whatsInside: {
        regions: 'Major transportation corridors and storage hubs',
        metrics: 'Transportation costs, storage utilization, delivery times',
        timeRange: '2 years historical + seasonal patterns',
        updateFrequency: 'Bi-weekly',
        units: 'Cost per ton-mile, storage capacity %, delivery days'
      },
      useCases: {
        buyers: 'Optimize logistics and reduce transportation costs',
        ngo: 'Improve food distribution efficiency',
        government: 'Infrastructure planning and congestion management',
        insurers: 'Supply chain disruption risk assessment'
      },
      trustStatement: 'Supply chain data is aggregated from transportation partners, storage facilities, and farmer cooperatives, anonymized to protect individual business relationships while maintaining system-wide insights.'
    }
  ];

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
              Market Data
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Agricultural market intelligence including input demand signals, price trends, and supply chain analytics. All data is aggregated and anonymized to protect business confidentiality.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <DataNavigation />

      {/* Data Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {marketDatasets.map((dataset) => (
              <div key={dataset.id} className="bg-white rounded-lg card-shadow overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{dataset.name}</h3>
                      <p className="text-lg text-gray-600 mb-4">{dataset.description}</p>
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <p className="text-sm font-medium text-blue-800">
                          <strong>What this answers:</strong> {dataset.whatItAnswers}
                        </p>
                      </div>
                    </div>
                    <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full sm:ml-4 self-start">
                      {dataset.price}
                    </span>
                  </div>
                  
                  <div className="mb-8">
                    <SampleChart type={dataset.chartType} title={dataset.name} category={dataset.name} />
                    <p className="text-sm text-gray-500 text-center mt-2">Sample visualization – Demo data</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">What's Inside:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><strong>Regions:</strong> {dataset.whatsInside.regions}</li>
                        <li><strong>Metrics:</strong> {dataset.whatsInside.metrics || dataset.whatsInside.inputs}</li>
                        <li><strong>Time Range:</strong> {dataset.whatsInside.timeRange}</li>
                        <li><strong>Update Frequency:</strong> {dataset.whatsInside.updateFrequency}</li>
                        <li><strong>Units:</strong> {dataset.whatsInside.units}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Example Use Cases:</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li><strong>Buyers:</strong> {dataset.useCases.buyers}</li>
                        <li><strong>NGOs:</strong> {dataset.useCases.ngo}</li>
                        <li><strong>Government:</strong> {dataset.useCases.government}</li>
                        <li><strong>Insurers:</strong> {dataset.useCases.insurers}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-8">
                    <h4 className="font-semibold text-gray-900 mb-2">Data Trust Statement:</h4>
                    <p className="text-sm text-gray-600">{dataset.trustStatement}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {dataset.features.map((feature, index) => (
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
                      onClick={() => handleRequestSample(dataset.name)}
                    >
                      Request Sample
                    </button>
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
            Need Custom Market Data Solutions?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            We can provide tailored market intelligence for your specific industry needs
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

export default MarketData;