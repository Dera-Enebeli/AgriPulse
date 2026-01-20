import React, { useState } from 'react';
import SampleChart from '../components/SampleChart';
import RequestSampleModal from '../components/RequestSampleModal';
import DataNavigation from '../components/DataNavigation';
import { Link } from 'react-router-dom';

const RiskAnalysis: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('');

  const riskDatasets = [
    {
      id: 7,
      name: 'Risk Alerts',
      description: 'Pests, floods, drought warnings and other agricultural risk factors by region',
      price: 'Contact for pricing',
      features: ['Real-time alerts', 'Risk categories', 'Regional coverage', 'Mitigation insights'],
      chartType: 'line' as const,
      whatItAnswers: 'What agricultural risks are emerging and where?',
      whatsInside: {
        regions: 'All agricultural regions with risk scoring',
        riskTypes: 'Weather, pests, disease, market, operational',
        timeRange: 'Current season + historical patterns',
        updateFrequency: 'Daily for high-risk, weekly for moderate',
        units: 'Risk severity index, probability scores, impact assessments'
      },
      useCases: {
        buyers: 'Anticipate supply disruptions and adjust sourcing',
        ngo: 'Target assistance to high-risk areas proactively',
        government: 'Coordinate disaster response and prevention',
        insurers: 'Underwriting accuracy and claim prediction'
      },
      trustStatement: 'Risk alerts are generated from aggregated farmer reports, weather data, and agricultural extension services, anonymized to protect individual farm vulnerability while providing regional risk intelligence.'
    },
    {
      id: 8,
      name: 'Climate Impact Analysis',
      description: 'Climate change effects on agricultural productivity and adaptation patterns',
      price: 'Contact for pricing',
      features: ['Climate trends', 'Impact assessments', 'Adaptation strategies', 'Yield correlations'],
      chartType: 'bar' as const,
      whatItAnswers: 'How is climate change affecting agricultural production?',
      whatsInside: {
        regions: 'Climate zones and agricultural regions',
        factors: 'Temperature, precipitation, extreme events, growing seasons',
        timeRange: '20 years historical + climate projections',
        updateFrequency: 'Quarterly',
        units: 'Yield impact %, growing degree days, precipitation variance'
      },
      useCases: {
        buyers: 'Long-term supply planning and risk management',
        ngo: 'Climate adaptation program planning',
        government: 'Climate policy and resilience planning',
        insurers: 'Climate risk modeling and pricing'
      },
      trustStatement: 'Climate impact analysis uses aggregated yield data correlated with climate stations, anonymized to protect individual farm performance while maintaining regional climate impact accuracy.'
    },
    {
      id: 9,
      name: 'Operational Risk Index',
      description: 'Comprehensive assessment of operational risks including equipment failure, labor shortages, and input access',
      price: 'Contact for pricing',
      features: ['Equipment risk', 'Labor availability', 'Input access', 'Infrastructure constraints'],
      chartType: 'doughnut' as const,
      whatItAnswers: 'What operational factors could disrupt agricultural production?',
      whatsInside: {
        regions: 'County-level operational risk assessment',
        factors: 'Equipment age, labor availability, input supply chains, infrastructure',
        timeRange: 'Current assessment + 3-year trends',
        updateFrequency: 'Monthly',
        units: 'Risk index scores, constraint severity levels, capacity utilization'
      },
      useCases: {
        buyers: 'Assess supplier reliability and continuity',
        ngo: 'Identify operational bottlenecks affecting food security',
        government: 'Infrastructure investment and workforce planning',
        insurers: 'Operational risk underwriting and loss prevention'
      },
      trustStatement: 'Operational risk data is aggregated from equipment dealers, labor providers, and farmer cooperatives, anonymized to protect individual business relationships while providing system-wide risk insights.'
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
              Risk Analysis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Agricultural risk intelligence including weather alerts, climate impacts, and operational risk factors. All data is aggregated and anonymized to protect individual farm vulnerability.
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
            {riskDatasets.map((dataset) => (
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
                        <li><strong>Risk Factors:</strong> {dataset.whatsInside.riskTypes || dataset.whatsInside.factors}</li>
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
            Need Custom Risk Analysis Solutions?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            We can provide tailored risk intelligence for your specific risk management needs
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

export default RiskAnalysis;