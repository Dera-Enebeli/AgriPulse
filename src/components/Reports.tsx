import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { reportsAPI } from '../services/api';

interface Report {
  _id: string;
  title: string;
  type: string;
  format: string;
  status: string;
  file?: {
    filename: string;
    size: number;
    downloadCount: number;
  };
  summary?: {
    totalRecords: number;
    regionsCovered: string[];
    cropsCovered: string[];
    keyInsights: string[];
    dataQuality: {
      completeness: number;
      accuracy: number;
      timeliness: number;
    };
  };
  createdAt: string;
  expiresAt?: string;
  customRequestId?: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [userSubscription, setUserSubscription] = useState<any>(null);

  useEffect(() => {
    fetchReports();
    fetchUserSubscription();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportsAPI.getReports();
      if (response.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const userResponse = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserSubscription(userData.user.subscription);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const response = await reportsAPI.downloadReport(reportId);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Download Started',
          text: 'Your report is downloading...',
          timer: 2000
        });
        
        // Trigger browser download
        const link = document.createElement('a');
        link.href = response.downloadUrl;
        link.download = response.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download report. Please try again.'
      });
    }
  };

  const generateMonthlyReport = async (parameters: any) => {
    try {
      const response = await reportsAPI.generateMonthlyInsights(parameters);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Report Generation Started',
          text: 'Your monthly report will be ready in a few minutes.'
        });
        setShowGenerateModal(false);
        fetchReports(); // Refresh list
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Generation Failed',
        text: error?.message || 'Failed to generate report.'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'generating': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return '✅';
      case 'generating': return '⏳';
      case 'failed': return '❌';
      case 'expired': return '⏰';
      default: return '📋';
    }
  };

  const canGenerateMonthlyReport = userSubscription && ['insights', 'enterprise'].includes(userSubscription);
  const canGenerateCustomReport = userSubscription === 'enterprise';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
            <p className="mt-2 text-gray-600">Access your generated agricultural insights reports</p>
          </div>
          
          <div className="flex gap-4">
            {canGenerateMonthlyReport && (
              <button
                onClick={() => setShowGenerateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                📊 Generate Monthly Report
              </button>
            )}
            {canGenerateCustomReport && (
              <button
                onClick={() => {/* TODO: Open custom report modal */}}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                🎯 Custom Report
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Yet</h3>
            <p className="text-gray-600 mb-6">
              {canGenerateMonthlyReport 
                ? 'Generate your first monthly insights report to get started.'
                : 'Upgrade to Insights plan to generate downloadable reports.'
              }
            </p>
            {canGenerateMonthlyReport && (
              <button
                onClick={() => setShowGenerateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Generate First Report
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)} {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                      {report.type === 'custom_enterprise' && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          🎯 Custom
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <div>Type: {report.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                      <div>Format: {report.format.toUpperCase()}</div>
                      <div>Generated: {new Date(report.createdAt).toLocaleDateString()}</div>
                      {report.expiresAt && (
                        <div>Expires: {new Date(report.expiresAt).toLocaleDateString()}</div>
                      )}
                    </div>

                    {report.summary && (
                      <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm text-gray-600">Records</div>
                          <div className="font-semibold">{report.summary.totalRecords.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Regions</div>
                          <div className="font-semibold">{report.summary.regionsCovered.join(', ')}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Crops</div>
                          <div className="font-semibold">{report.summary.cropsCovered.join(', ')}</div>
                        </div>
                      </div>
                    )}

                    {report.file && (
                      <div className="text-sm text-gray-600">
                        <div>Size: {(report.file.size / 1024).toFixed(1)} KB</div>
                        <div>Downloads: {report.file.downloadCount}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {report.status === 'ready' && (
                      <button
                        onClick={() => downloadReport(report._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        📥 Download
                      </button>
                    )}
                    {report.status === 'generating' && (
                      <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm text-center">
                        ⏳ Generating...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Generate Monthly Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 Generate Monthly Insights Report
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region (Optional)
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">All Regions</option>
                <option value="north-central">North Central</option>
                <option value="north-east">North East</option>
                <option value="north-west">North West</option>
                <option value="south-east">South East</option>
                <option value="south-south">South South</option>
                <option value="south-west">South West</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include Charts
              </label>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span>Include charts and visualizations</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => generateMonthlyReport({})}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;