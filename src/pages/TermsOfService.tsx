import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 leading-relaxed">
              By accessing AgriPulse services, you agree to the following terms and conditions.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Nature of Service</h2>
            <p className="text-gray-600 mb-6">
              AgriPulse provides aggregated agricultural insights for research and decision support. 
              All data is provided on an "as-is" basis.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Acceptable Use</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Misrepresent our data</li>
              <li>Resell or redistribute without permission</li>
              <li>Attempt to access raw or individual-level data</li>
              <li>Scrape or copy content without authorization</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Accuracy</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-700">
                While we strive for accuracy, insights are based on pilot-stage data and may change 
                as the system evolves.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>All charts, datasets, reports, and content belong to AgriPulse unless stated otherwise</li>
              <li>Sample data is for evaluation only</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-700">
                AgriPulse is not responsible for decisions, losses, or outcomes based on the use of our insights.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Termination</h2>
            <p className="text-gray-600 mb-6">
              We reserve the right to restrict access if these terms are violated.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-700">
                For questions: <strong>contact@agripulse.ng</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;