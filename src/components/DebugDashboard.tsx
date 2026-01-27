import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const DebugDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API call...');
        setLoading(true);
        
        // Test health check first
        try {
          const healthData = await fetch('http://localhost:5002/api/health');
          console.log('Health check:', await healthData.json());
        } catch (e) {
          console.log('Health check failed:', e);
        }

        // Test dashboard API
        const result = await dashboardAPI.getOverview({});
        console.log('Dashboard data:', result);
        setData(result);
      } catch (err: any) {
        console.error('API Error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold text-red-600 mb-4">Error: {error}</h2>
        <p className="text-gray-600">Check console for details</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Dashboard Data Debug</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default DebugDashboard;