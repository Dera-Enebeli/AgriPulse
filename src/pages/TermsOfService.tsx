import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              This protects YOU, not just users.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why you need it</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You provide demo/sample data</li>
              <li>You provide insights, not guarantees</li>
              <li>You are running a pilot</li>
              <li>You don't want legal responsibility for misuse</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What it should include</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">A. What your service is</h3>
            <p className="text-gray-600">
              An agricultural insights and data pilot. Information is for decision support. 
              Not financial, legal, or farming guarantees.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">B. Acceptable use</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>No scraping</li>
              <li>No resale without permission</li>
              <li>No misuse or misrepresentation of your data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">C. Data accuracy disclaimer</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Insights are based on aggregated data</li>
              <li>Provided "as-is"</li>
              <li>Subject to change as the pilot evolves</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">D. Intellectual property</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Charts, reports, datasets belong to AgriPulse</li>
              <li>Samples are for evaluation only</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">E. Limitation of liability</h3>
            <p className="text-gray-600">
              You are not responsible for losses resulting from data use.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">F. Termination</h3>
            <p className="text-gray-600">
              You can deny access if terms are violated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;