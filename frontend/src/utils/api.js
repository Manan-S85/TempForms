import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    config.metadata = { startTime: new Date() };
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🔵 ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata.startTime;
    
    // Log successful response in development
    if (import.meta.env.DEV) {
      console.log(`🟢 ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
    }
    
    return response;
  },
  (error) => {
    // Calculate request duration
    const duration = error.config?.metadata ? new Date() - error.config.metadata.startTime : 0;
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.log(`🔴 ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'} (${duration}ms)`);
    }
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Bad request - show validation errors
          if (data.details && Array.isArray(data.details)) {
            data.details.forEach(detail => {
              toast.error(detail.message || detail);
            });
          } else {
            toast.error(data.message || 'Invalid request');
          }
          break;
          
        case 401:
          // Unauthorized
          toast.error(data.message || 'Authentication required');
          break;
          
        case 403:
          // Forbidden
          toast.error(data.message || 'Access denied');
          break;
          
        case 404:
          // Not found
          toast.error(data.message || 'Resource not found');
          break;
          
        case 409:
          // Conflict
          toast.error(data.message || 'Conflict occurred');
          break;
          
        case 410:
          // Gone (expired)
          toast.error(data.message || 'Resource has expired');
          break;
          
        case 429:
          // Rate limited
          toast.error(data.message || 'Too many requests. Please slow down.');
          break;
          
        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors
          toast.error(data.message || 'Server error. Please try again later.');
          break;
          
        default:
          toast.error(data.message || `Unexpected error (${status})`);
      }
    } else if (error.request) {
      // Network error
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please check your connection.');
      } else {
        toast.error('Network error. Please check your connection.');
      }
    } else {
      // Something else happened
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// API methods
export const formAPI = {
  // Create a new form
  create: async (formData) => {
    const response = await api.post('/forms', formData);
    return response.data;
  },
  
  // Get form by shareable link
  getByLink: async (shareableLink) => {
    const response = await api.get(`/forms/${shareableLink}`);
    return response.data;
  },
  
  // Get form info without full data
  getInfo: async (shareableLink) => {
    const response = await api.get(`/forms/${shareableLink}/info`);
    return response.data;
  },
  
  // Delete form (requires response link)
  delete: async (shareableLink, responseLink) => {
    const response = await api.delete(`/forms/${shareableLink}`, {
      data: { responseLink }
    });
    return response.data;
  },
  
  // Submit response to form
  submitResponse: async (shareableLink, answers) => {
    const response = await api.post(`/forms/${shareableLink}/responses`, {
      answers
    });
    return response.data;
  },
};

export const responseAPI = {
  // Get all responses for a form
  getAll: async (responseLink, password = null) => {
    const url = `/responses/${responseLink}${password ? `?password=${encodeURIComponent(password)}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },
  
  // Verify password for response viewing
  verifyPassword: async (responseLink, password) => {
    const response = await api.post(`/responses/${responseLink}/verify-password`, {
      password
    });
    return response.data;
  },
  
  // Export responses
  export: async (responseLink, password = null, format = 'json') => {
    const params = new URLSearchParams();
    if (password) params.append('password', password);
    params.append('format', format);
    
    const response = await api.get(`/responses/${responseLink}/export?${params}`, {
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    
    if (format === 'csv') {
      // Handle CSV download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `form_responses.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }
    
    return response.data;
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Check if API is available
  isAvailable: async () => {
    try {
      await healthAPI.check();
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Validate shareable link format
  validateShareableLink: (link) => {
    return /^[a-zA-Z0-9]{12}$/.test(link);
  },
  
  // Validate response link format
  validateResponseLink: (link) => {
    return /^[a-f0-9]{24}$/.test(link);
  },
  
  // Format error message from API response
  formatErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
  
  // Create download link for data
  downloadJSON: (data, filename = 'data.json') => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
  
  // Copy text to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast.success('Copied to clipboard');
        return true;
      } catch (err) {
        toast.error('Failed to copy to clipboard');
        return false;
      } finally {
        textArea.remove();
      }
    }
  },
};

export default api;