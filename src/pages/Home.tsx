import React from 'react';
import { Link } from 'react-router-dom';
import SampleChart from '../components/SampleChart';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Real-time Agricultural Intelligence
              <br />
              <span className="text-primary-200">Powered by AgriPulse</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-slide-in-left">
              Aggregated, anonymous agricultural data insights from farmer cooperatives worldwide
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-in-right">
              <Link to="/payment" className="btn-secondary text-lg hover-lift">
                View Pricing Plans
              </Link>
              <Link to="/data" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-lg hover-lift">
                View Sample Insights
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Who It's For
            </h2>
            <p className="text-lg text-gray-600">
              Trusted by leading organizations in agriculture
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg card-shadow text-center hover-lift animate-fade-in">
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Agribusinesses</h3>
              <p className="text-gray-600">Make data-driven decisions for operations and investments</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow text-center hover-lift animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">NGOs & Donors</h3>
              <p className="text-gray-600">Target interventions and measure impact effectively</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow text-center hover-lift animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Input Suppliers</h3>
              <p className="text-gray-600">Understand demand for seeds, fertilizers, and equipment</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow text-center hover-lift animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Researchers</h3>
              <p className="text-gray-600">Access high-quality data for agricultural studies</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Building trust through transparent processes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Data Collection</h3>
              <p className="text-gray-600">Farmers submit data via verified cooperatives</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Anonymization</h3>
              <p className="text-gray-600">Data is anonymized & cleaned for privacy</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Aggregation</h3>
              <p className="text-gray-600">Insights are aggregated (no individual farms)</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Access</h3>
              <p className="text-gray-600">Buyers access insights via dashboard</p>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <p className="text-red-800 font-medium">
                No farmer names, phone numbers, or exact locations are ever shared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Data We Provide */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Data We Provide
            </h2>
            <p className="text-lg text-gray-600">
              Clear value through comprehensive agricultural insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Crop Planting Trends</h3>
              <p className="text-gray-600">Regional patterns and seasonal variations</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Expected Harvest Timelines</h3>
              <p className="text-gray-600">Predictive harvest windows by crop and region</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Yield Ranges</h3>
              <p className="text-gray-600">Anonymized yield data (not exact figures)</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Input Demand Signals</h3>
              <p className="text-gray-600">Fertilizer, seed, and equipment demand patterns</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Risk Alerts</h3>
              <p className="text-gray-600">Pests, floods, drought warnings by region</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Market Insights</h3>
              <p className="text-gray-600">Price trends and market opportunities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Insights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sample Insights
            </h2>
            <p className="text-lg text-gray-600">
              See the power of agricultural data intelligence
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg card-shadow">
              <h3 className="font-semibold text-lg mb-4 text-center">Crop Planting Trends – Regional (Demo)</h3>
              <SampleChart type="line" title="Crop Planting Trend" />
              <p className="text-sm text-gray-500 text-center mt-4">Sample data for demonstration purposes</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg card-shadow">
              <h3 className="font-semibold text-lg mb-4 text-center">Expected Harvest Timelines – Seasonal (Demo)</h3>
              <SampleChart type="bar" title="Harvest Timeline" />
              <p className="text-sm text-gray-500 text-center mt-4">Sample data for demonstration purposes</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/data" className="btn-primary">
              View More Sample Insights
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Access Agricultural Intelligence?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Early access available for pilot partners
          </p>
          <Link to="/contact" className="btn-secondary text-lg">
            Request Early Access
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;