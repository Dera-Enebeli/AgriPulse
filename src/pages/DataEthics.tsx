import React from 'react';

const DataEthics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Ethics & Trust Statement</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 leading-relaxed text-lg font-medium">
              At AgriPulse, we believe agricultural data should serve farmers first, not exploit them.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Our Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Consent-based collection</h3>
                <p className="text-blue-700">Data is shared voluntarily</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Anonymization by default</h3>
                <p className="text-green-700">Individual farmers are never identifiable</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-2">Aggregation only</h3>
                <p className="text-purple-700">Insights represent regions, not individuals</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-2">No surveillance</h3>
                <p className="text-red-700">We do not monitor or profile farmers</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-700">We clearly communicate how data is used</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why This Matters</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Agricultural data often benefits institutions while excluding farmers. Our pilot is designed to reverse that by:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Improving access to inputs, finance, and support programs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Informing policy without exposing individuals</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Creating long-term value for farming communities</span>
              </li>
            </ul>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-lg">
              <p className="text-gray-800 font-semibold text-lg mb-2">
                We are building trust before scale.
              </p>
              <p className="text-gray-600">
                Our commitment to ethical data practices isn't just about compliance — it's about creating 
                a sustainable agricultural ecosystem where farmers benefit from their own data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataEthics;