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

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch (fetchError: any) {
    // Handle browser extension/network errors
    console.error('Fetch error (possibly extension-related):', fetchError);
    throw new Error('Network error. Try disabling browser extensions or using incognito mode.');
  }
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.json();
    } catch (jsonError) {
      errorData = { error: `HTTP ${response.status}` };
    }
    console.log('Error response:', errorData);
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  try {
    return await response.json();
  } catch (jsonError) {
    throw new Error('Invalid response format');
  }
};

// Authentication API calls
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    organization: string;
    useCase: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async () => {
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

// Data API calls
export const dataAPI = {
  getCropData: async (params?: {
    region?: string;
    cropType?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/data/crops/regions?${query}`);
  },

  getMarketPrices: async (params?: {
    cropType?: string;
    region?: string;
    timeRange?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/data/market/prices?${query}`);
  },

  getRiskAnalysis: async (params?: {
    region?: string;
    riskType?: string;
    severity?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/data/risk/analysis?${query}`);
  },

  getHarvestTimeline: async (params?: {
    cropType?: string;
    region?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/data/harvest/timeline?${query}`);
  },

  getQualityMetrics: async (params?: {
    region?: string;
    cropType?: string;
  }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/data/quality/metrics?${query}`);
  },

  submitData: async (data: any) => {
    return apiRequest('/data/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Dashboard API calls
export const dashboardAPI = {
  getOverview: async (params?: {
    region?: string;
    cropType?: string;
    timeRange?: string;
  }) => {
    // Create clean parameters object - exclude undefined values
    const cleanParams: any = {};
    if (params?.region && params.region !== 'all' && params.region !== 'undefined') {
      cleanParams.region = params.region;
    }
    if (params?.cropType && params.cropType !== 'all' && params.cropType !== 'undefined') {
      cleanParams.cropType = params.cropType;
    }
    if (params?.timeRange) {
      cleanParams.timeRange = params.timeRange;
    }
    
    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/dashboard/overview?${query}`);
  },

  getCropTrends: async (params?: {
    region?: string;
    cropType?: string;
    granularity?: string;
  }) => {
    // Create clean parameters object - exclude undefined values
    const cleanParams: any = {};
    if (params?.region && params.region !== 'all' && params.region !== 'undefined') {
      cleanParams.region = params.region;
    }
    if (params?.cropType && params.cropType !== 'all' && params.cropType !== 'undefined') {
      cleanParams.cropType = params.cropType;
    }
    if (params?.granularity) {
      cleanParams.granularity = params.granularity;
    }
    
    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/dashboard/crops/trends?${query}`);
  },

  getMarketIntelligence: async (params?: {
    cropType?: string;
    region?: string;
    timeRange?: string;
  }) => {
    // Create clean parameters object - exclude undefined values
    const cleanParams: any = {};
    if (params?.region && params.region !== 'all' && params.region !== 'undefined') {
      cleanParams.region = params.region;
    }
    if (params?.cropType && params.cropType !== 'all' && params.cropType !== 'undefined') {
      cleanParams.cropType = params.cropType;
    }
    if (params?.timeRange) {
      cleanParams.timeRange = params.timeRange;
    }
    
    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/dashboard/market/intelligence?${query}`);
  },

  getRiskMonitoring: async (params?: {
    region?: string;
    riskType?: string;
    severity?: string;
  }) => {
    // Create clean parameters object - exclude undefined values
    const cleanParams: any = {};
    if (params?.region && params.region !== 'all' && params.region !== 'undefined') {
      cleanParams.region = params.region;
    }
    if (params?.riskType && params.riskType !== 'all' && params.riskType !== 'undefined') {
      cleanParams.riskType = params.riskType;
    }
    if (params?.severity && params.severity !== 'all' && params.severity !== 'undefined') {
      cleanParams.severity = params.severity;
    }
    
    const query = new URLSearchParams(cleanParams).toString();
    return apiRequest(`/dashboard/risk/monitoring?${query}`);
  },
};

// Payment API calls
export const paymentAPI = {
  getPlans: async () => {
    return apiRequest('/payment/plans');
  },

  createCheckoutSession: async (planId: string) => {
    return apiRequest('/payment/create-payment-session', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  },

  getSubscriptionStatus: async () => {
    return apiRequest('/payment/status');
  },

  cancelSubscription: async () => {
    return apiRequest('/payment/cancel', {
      method: 'POST',
    });
  },
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

// Health check
export const healthCheck = async () => {
  return apiRequest('/health');
};