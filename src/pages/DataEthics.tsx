import React from 'react';

const DataEthics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Ethics & Trust</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6 italic">
              This is not legal — this is credibility. This is what will separate you from "fake data platforms".
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Commitment</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Farmer-first approach</h3>
            <p className="text-gray-600">
              We prioritize the welfare and privacy of farmers in all our data practices. 
              Farmers are not just data sources — they are partners in building better agricultural insights.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Aggregation & anonymization principles</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>All individual farmer data is aggregated before analysis</li>
              <li>Personal identifiers are removed from all datasets</li>
              <li>No farmer can be identified from our insights</li>
              <li>Geographic data is broadened to protect local privacy</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Consent-driven data collection</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Clear explanation of how data will be used</li>
              <li>Voluntary participation in all data collection</li>
              <li>Right to withdraw consent at any time</li>
              <li>Transparent about data sharing practices</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">No exploitation, no surveillance</h3>
            <p className="text-gray-600">
              We do not track farmers across platforms, do not sell individual data, 
              and do not use data for purposes beyond agricultural insight generation.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Long-term goal: better access to credit, grants, inputs</h3>
            <p className="text-gray-600">
              Our mission is to help farmers gain better access to financial services, 
              agricultural grants, and quality inputs through verified, aggregated data insights 
              that demonstrate farming patterns and needs without compromising individual privacy.
            </p>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-8">
              <p className="text-green-700">
                <strong>This page builds belief, not compliance.</strong>
              </p>
              <p className="text-green-600 mt-2">
                We believe ethical data practices create trust, and trust creates better 
                agricultural outcomes for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEthics;