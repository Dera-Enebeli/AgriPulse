const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Generic API request function
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
   
  // Debug logging
  console.log(`API Request: ${endpoint}`);
  console.log('Token exists:', !!token);
  console.log('Full URL:', `${API_BASE_URL}${endpoint}`);
   
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
   
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
   
  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText);
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API request failed: ${response.status}`);
  }
   
  const data = await response.json();
  return data;
};

// Contact API calls
export const contactAPI = {
  submitRequest: async (contactData: {
    name: string;
    email: string;
    organization: string;
    useCase: string;
    message?: string;
  }) => {
    return apiRequest('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  getContactInfo: async () => {
    return apiRequest('/contact/info');
  },
};

// Data API calls
export const dataAPI = {
  getCropData: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/data/crop-data?${queryString}`);
  },
  
  getMarketData: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/data/market-data?${queryString}`);
  },
  
  getRiskAnalysis: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/data/risk-analysis?${queryString}`);
  },
  
  getRegionalInsights: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/data/regional-insights?${queryString}`);
  },
};

// Auth API calls
export const authAPI = {
  login: async (formData: any) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  register: async (formData: any) => {
    return apiRequest('/auth/register', {
      method: 'POST', 
      body: JSON.stringify(formData),
    });
  },

  getUserProfile: async () => {
    return apiRequest('/auth/me');
  },
  
  updateProfile: async (profileData: {
    name?: string;
    organization?: string;
    useCase?: string;
  }) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Dashboard API calls
export const dashboardAPI = {
  getOverview: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/dashboard/overview?${queryString}`);
  },
  getMarketData: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/dashboard/market?${queryString}`);
  },
  getRiskData: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/dashboard/risk?${queryString}`);
  },
  getRiskMonitoring: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/dashboard/risk-monitoring?${queryString}`);
  }
};

// Reports API calls
export const reportsAPI = {
  getReports: async (params?: any) => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/reports?${queryString}`);
  },

  downloadReport: async (reportId: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Download failed');
    }

    const blob = await response.blob();
    const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'report.pdf';
    const downloadUrl = window.URL.createObjectURL(blob);
    
    return {
      success: true,
      filename,
      downloadUrl
    };
  },

  generateCustomReport: async (data: any) => {
    return apiRequest('/reports/generate/custom', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  generateMonthlyInsights: async (parameters: any) => {
    return apiRequest('/reports/generate/monthly-insights', {
      method: 'POST',
      body: JSON.stringify(parameters),
    });
  },

  getReportDetails: async (reportId: string) => {
    return apiRequest(`/reports/${reportId}`);
  }
};