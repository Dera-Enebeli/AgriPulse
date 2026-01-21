import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              This is the first thing serious buyers, NGOs, and partners look for.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Why you need it</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You collect farmer data (even if anonymized)</li>
              <li>You collect contact forms / emails</li>
              <li>You offer sample requests</li>
              <li>You position yourself as a data platform</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Without this, many organizations will not engage.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What it should include (simple, honest)</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">A. What data you collect</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Farmer-submitted data (aggregated, anonymized)</li>
              <li>Contact information (name, email, organization)</li>
              <li>Website usage data (basic analytics)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">B. How the data is used</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To generate aggregated insights</li>
              <li>To improve data quality</li>
              <li>To respond to requests and inquiries</li>
              <li>To build anonymized reports</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">C. What you do NOT do (important trust signal)</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>You do not sell individual farmer data</li>
              <li>You do not expose personally identifiable information</li>
              <li>You do not track individuals across platforms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">D. Data sharing</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Only aggregated, anonymized insights</li>
              <li>Shared with buyers, NGOs, governments, partners</li>
              <li>No raw farmer-level data shared</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">E. Data security</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access controlled</li>
              <li>Limited internal access</li>
              <li>Secure storage (even if simple for now)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">F. Farmer rights</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Right to opt out</li>
              <li>Right to request removal</li>
              <li>Right to ask how data is used</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">G. Contact info</h3>
            <p className="text-gray-600">
              Simple contact email: dataprotection@agripulse.ng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;