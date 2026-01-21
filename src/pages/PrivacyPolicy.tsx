import React from 'react';

const PrivacyPolicy: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Effective Date: {currentDate}</p>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8 leading-relaxed">
              AgriPulse operates an agricultural insights pilot focused on generating 
              aggregated, anonymized data to improve decision-making across the agricultural value chain.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Data We Collect</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Farmer-submitted agricultural data (non-identifiable)</li>
              <li>Contact information from forms (name, email, organization)</li>
              <li>Basic website usage data (analytics)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How We Use Data</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To generate aggregated agricultural insights</li>
              <li>To improve data quality and reporting</li>
              <li>To respond to sample requests and inquiries</li>
              <li>To support pilot research and analysis</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What We Do Not Do</h2>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <ul className="list-disc pl-6 text-red-700 space-y-2">
                <li>We do not sell individual farmer data</li>
                <li>We do not share personally identifiable information</li>
                <li>We do not track farmers or users across platforms</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Sharing</h2>
            <p className="text-gray-600 mb-4">
              We only share aggregated and anonymized insights with buyers, NGOs, governments, and partners. 
              Raw or individual-level data is never shared.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We apply reasonable technical and organizational measures to protect data and limit internal access.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Request information about how data is used</li>
              <li>Request removal from our datasets</li>
              <li>Opt out of future data collection</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact</h2>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-700">
                For privacy questions, contact: <strong>privacy@agripulse.ng</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;