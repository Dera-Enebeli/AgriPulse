import React, { useState } from 'react';
import SampleChart from '../components/SampleChart';
import RequestSampleModal from '../components/RequestSampleModal';
import DataNavigation from '../components/DataNavigation';
import { Link } from 'react-router-dom';

const CropData: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('');



  const cropDatasets = [
    {
      id: 1,
      name: 'Crop Planting Trends',
      description: 'Regional patterns and seasonal variations for major crops including corn, soybeans, wheat, and specialty crops',
      price: 'Contact for pricing',
      features: ['Real-time updates', 'Regional breakdown', 'Historical trends', 'Seasonal analysis'],
      chartType: 'line' as const,
      whatItAnswers: 'Which crops are being planted where and when?',
      whatsInside: {
        regions: 'Midwest, Plains, Southeast, Pacific Northwest',
        crops: 'Corn, Soybeans, Wheat, Cotton, Specialty Vegetables',
        timeRange: '5 years historical + current season',
        updateFrequency: 'Weekly during planting season, monthly otherwise',
        units: 'Acres planted, % of total farmland'
      },
      useCases: {
        buyers: 'Inform procurement timing and volume planning',
        ngo: 'Target food security programs to planting patterns',
        government: 'Monitor agricultural policy compliance',
        insurers: 'Assess crop insurance portfolio risk'
      },
      trustStatement: 'Data is aggregated from farmer cooperatives across 12 states, fully anonymized to protect individual farmer privacy while maintaining regional accuracy.'
    },
    {
      id: 2,
      name: 'Expected Harvest Timelines',
      description: 'Predictive harvest windows by crop and region based on planting dates, growing conditions, and historical patterns',
      price: 'Contact for pricing',
      features: ['Harvest predictions', 'Crop-specific data', 'Regional insights', 'Monthly updates'],
      chartType: 'bar' as const,
      whatItAnswers: 'When will crops be ready for harvest in different regions?',
      whatsInside: {
        regions: 'All major agricultural regions',
        crops: 'Corn, Soybeans, Wheat, Sorghum, Barley',
        timeRange: 'Current season predictions + 3 years accuracy tracking',
        updateFrequency: 'Bi-weekly during growing season',
        units: 'Projected harvest dates, confidence intervals'
      },
      useCases: {
        buyers: 'Plan logistics and storage capacity',
        ngo: 'Coordinate food distribution timing',
        government: 'Manage seasonal agricultural workforce',
        insurers: 'Time crop insurance claim processing'
      },
      trustStatement: 'Harvest predictions are based on aggregated planting data, weather patterns, and verified historical outcomes from our farmer network.'
    },
    {
      id: 3,
      name: 'Yield Ranges',
      description: 'Anonymized yield data and productivity metrics showing expected output ranges by crop and region',
      price: 'Contact for pricing',
      features: ['Yield ranges', 'Productivity metrics', 'Regional comparisons', 'Annual reports'],
      chartType: 'doughnut' as const,
      whatItAnswers: 'What yields can farmers expect under different conditions?',
      whatsInside: {
        regions: 'County-level aggregation for major farming areas',
        crops: 'All major row crops and selected specialty crops',
        timeRange: '10 years historical yield data',
        updateFrequency: 'Annually with quarterly preliminary estimates',
        units: 'Bushels per acre, tons per hectare, yield variance'
      },
      useCases: {
        buyers: 'Forecast supply volumes and pricing opportunities',
        ngo: 'Assess food production capacity',
        government: 'Evaluate agricultural productivity policies',
        insurers: 'Set appropriate crop insurance coverage levels'
      },
      trustStatement: 'Yield data is aggregated from thousands of farms, with individual farm results anonymized and blended to protect confidentiality while maintaining statistical accuracy.'
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
              Crop Data
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive crop intelligence including planting trends, harvest predictions, and yield analysis. All data is aggregated and anonymized to protect farmer privacy.
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
            {cropDatasets.map((dataset) => (
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
                        <li><strong>Crops:</strong> {dataset.whatsInside.crops}</li>
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
            Need Custom Crop Data Solutions?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            We can provide tailored agricultural insights for your specific crop data needs
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


export default CropData;