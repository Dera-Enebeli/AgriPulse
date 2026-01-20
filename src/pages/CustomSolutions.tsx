import React, { useState } from 'react';

const CustomSolutions: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    email: '',
    whatAreYouSolving: '',
    dataUseCase: '',
    preferredFormat: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store submission
    const submission = {
      ...formData,
      timestamp: new Date().toISOString()
    };
    
    console.log('Custom solution request:', submission);
    
    // Store in localStorage for demo purposes
    const existingRequests = JSON.parse(localStorage.getItem('customSolutionRequests') || '[]');
    existingRequests.push(submission);
    localStorage.setItem('customSolutionRequests', JSON.stringify(existingRequests));
    
    // Send email notification (in real app, this would be handled by backend)
    console.log('Email notification sent to team for custom solution request:', submission);
    
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      organization: '',
      email: '',
      whatAreYouSolving: '',
      dataUseCase: '',
      preferredFormat: ''
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thanks — our team will review your request and reach out within 24–48 hours.
            </p>
            <button
              onClick={handleReset}
              className="btn-primary text-lg"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Let's Understand Your Data Needs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tell us what you're working on. We'll recommend the best crop data format and insights for your use case.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Required Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="fullName" className="block text-lg font-medium text-gray-900 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-lg font-medium text-gray-900 mb-3">
                    Organization / Company *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    required
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Acme Corporation"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-900 mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label htmlFor="whatAreYouSolving" className="block text-lg font-medium text-gray-900 mb-3">
                  What are you trying to solve? *
                </label>
                <textarea
                  id="whatAreYouSolving"
                  name="whatAreYouSolving"
                  required
                  rows={6}
                  value={formData.whatAreYouSolving}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. Yield forecasting, supply planning, policy research, market analysis."
                />
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="dataUseCase" className="block text-lg font-medium text-gray-900 mb-3">
                    Data Use Case *
                  </label>
                  <select
                    id="dataUseCase"
                    name="dataUseCase"
                    required
                    value={formData.dataUseCase}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select use case</option>
                    <option value="research">Research & Analysis</option>
                    <option value="investment">Investment / Market Planning</option>
                    <option value="government">Government / Policy</option>
                    <option value="agribusiness">Agribusiness Operations</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferredFormat" className="block text-lg font-medium text-gray-900 mb-3">
                    Preferred Data Format (optional)
                  </label>
                  <select
                    id="preferredFormat"
                    name="preferredFormat"
                    value={formData.preferredFormat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select format</option>
                    <option value="pdf">PDF summary</option>
                    <option value="excel">Excel / CSV</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-4"
                >
                  Submit Custom Solution Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Custom Solutions?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Tailored Insights</h3>
                <p className="text-gray-600">
                  Get data specifically formatted for your industry needs and use case requirements
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Consultation</h3>
                <p className="text-gray-600">
                  Our agricultural data experts will recommend the best approach for your specific challenges
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7m9 11l-1-4h-5l-1 4H9z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Rapid Response</h3>
                <p className="text-gray-600">
                  Quick turnaround with personalized recommendations within 24-48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomSolutions;