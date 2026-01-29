import React, { useState } from 'react';
import SampleChart from '../components/SampleChart';
import RequestSampleModal from '../components/RequestSampleModal';
import DataNavigation from '../components/DataNavigation';
import { Link } from 'react-router-dom';

const RegionalInsights: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('');

  const regionalDatasets = [
    {
      id: 10,
      name: 'Regional Performance Benchmarks',
      description: 'Comparative analysis of agricultural performance across different regions and growing zones',
      price: 'Contact for pricing',
      features: ['Regional comparisons', 'Performance metrics', 'Growing zone analysis', 'Competitive insights'],
      chartType: 'bar' as const,
      whatItAnswers: 'How do different agricultural regions compare in performance and productivity?',
      whatsInside: {
        regions: 'All USDA crop reporting districts and growing zones',
        metrics: 'Yield efficiency, input utilization, profitability indices',
        timeRange: '5 years historical trends',
        updateFrequency: 'Quarterly',
        units: 'Relative performance indices, efficiency ratios, benchmark comparisons'
      },
      useCases: {
        buyers: 'Identify high-performing regions for sourcing',
        ngo: 'Target regional development programs effectively',
        government: 'Regional agricultural policy optimization',
        insurers: 'Regional risk pricing and portfolio management'
      },
      trustStatement: 'Regional benchmarks are compiled from aggregated farm data, anonymized to protect individual farm performance while maintaining accurate regional comparisons and competitive insights.'
    },
    {
      id: 11,
      name: 'Infrastructure Capacity Analysis',
      description: 'Regional agricultural infrastructure assessment including storage, processing, and transportation capacity',
      price: 'Contact for pricing',
      features: ['Storage capacity', 'Processing facilities', 'Transportation networks', 'Infrastructure gaps'],
      chartType: 'doughnut' as const,
      whatItAnswers: 'What is infrastructure capacity and where are the bottlenecks?',
      whatsInside: {
        regions: 'Major agricultural production areas',
        infrastructure: 'Grain storage, processing plants, transportation networks',
        timeRange: 'Current capacity + 5-year utilization trends',
        updateFrequency: 'Semi-annual',
        units: 'Capacity utilization %, throughput volumes, gap analysis'
      },
      useCases: {
        buyers: 'Plan logistics around infrastructure constraints',
        ngo: 'Identify infrastructure investment opportunities',
        government: 'Infrastructure planning and development priorities',
        insurers: 'Assess infrastructure-related business interruption risks'
      },
      trustStatement: 'Infrastructure data is aggregated from facility operators, transportation providers, and government sources, anonymized to protect individual business information while providing regional capacity insights.'
    },
    {
      id: 12,
      name: 'Regional Economic Impact',
      description: 'Agricultural economic contribution and multiplier effects by region',
      price: 'Contact for pricing',
      features: ['Economic contribution', 'Employment impact', 'Multiplier effects', 'Regional development'],
      chartType: 'line' as const,
      whatItAnswers: 'What is agriculture\'s economic impact on different regions?',
      whatsInside: {
        regions: 'County, state, and regional economic areas',
        metrics: 'Direct economic impact, employment, multiplier effects',
        timeRange: '10 years historical economic trends',
        updateFrequency: 'Annual',
        units: 'Economic impact in $, employment numbers, multiplier ratios'
      },
      useCases: {
        buyers: 'Understand regional economic dependencies',
        ngo: 'Assess community development opportunities',
        government: 'Economic development planning and policy',
        insurers: 'Regional economic risk assessment and underwriting'
      },
      trustStatement: 'Economic impact data combines aggregated agricultural production data with regional economic models, anonymized to protect individual business information while providing accurate regional economic insights.'
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
              Regional Insights
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Regional agricultural intelligence including performance benchmarks, infrastructure analysis, and economic impact assessments. All data is aggregated and anonymized to protect regional business confidentiality.
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
            {regionalDatasets.map((dataset) => (
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
                        <li><strong>Metrics:</strong> {dataset.whatsInside.metrics || dataset.whatsInside.infrastructure}</li>
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

export default RegionalInsights;