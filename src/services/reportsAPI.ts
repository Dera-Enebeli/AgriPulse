import { reportsAPI } from './api';

interface ReportsService {
  getReports: (params?: any) => Promise<any>;
  downloadReport: (reportId: string) => Promise<any>;
  generateMonthlyInsights: (parameters: any) => Promise<any>;
  generateCustomReport: (data: any) => Promise<any>;
  getReportDetails: (reportId: string) => Promise<any>;
}

const reportsService: ReportsService = {
  getReports: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`/api/reports?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  },

  downloadReport: async (reportId: string) => {
    const response = await fetch(`/api/reports/${reportId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Download failed');
    }

    // Create blob from response
    const blob = await response.blob();
    const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'report.pdf';
    
    // Create download URL
    const downloadUrl = window.URL.createObjectURL(blob);
    
    return {
      success: true,
      filename,
      downloadUrl
    };
  },

  generateMonthlyInsights: async (parameters: any) => {
    const response = await fetch('/api/reports/generate/monthly-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(parameters)
    });
    
    return response.json();
  },

  generateCustomReport: async (data: any) => {
    const response = await fetch('/api/reports/generate/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    
    return response.json();
  },

  getReportDetails: async (reportId: string) => {
    const response = await fetch(`/api/reports/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    return response.json();
  }
};

export { reportsService as reportsAPI };