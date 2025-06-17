import { API_CONFIG, API_ENDPOINTS } from './config.js';

// Base API client
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BACKEND_URL;
    this.mode = API_CONFIG.MODE;
  }

  async request(endpoint, options = {}) {
    if (this.mode === 'mock') {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.MOCK_DELAY));
      return this.mockRequest(endpoint, options);
    }

    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async mockRequest(endpoint, options = {}) {
    // Import mock data
    const { mockData } = await import('./mockData.js');
    const method = options.method || 'GET';
    
    // Simple mock routing
    if (endpoint === API_ENDPOINTS.LOGIN && method === 'POST') {
      const { email, password } = options.body;
      if (email === 'admin@treadx.com' && password === 'admin123') {
        return mockData.authResponse;
      }
      throw new Error('Invalid credentials');
    }
    
    if (endpoint === API_ENDPOINTS.LEADS) {
      if (method === 'GET') {
        return mockData.leadsPage;
      }
      if (method === 'POST') {
        const newLead = {
          id: Date.now(),
          ...options.body,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return newLead;
      }
    }
    
    if (endpoint === API_ENDPOINTS.DEALERS && method === 'GET') {
      return mockData.dealersPage;
    }
    
    if (endpoint === API_ENDPOINTS.CONTACTS && method === 'GET') {
      return mockData.contactsPage;
    }
    
    if (endpoint === API_ENDPOINTS.USERS && method === 'GET') {
      return mockData.users;
    }
    
    if (endpoint === API_ENDPOINTS.ROLES && method === 'GET') {
      return mockData.roles;
    }
    
    if (endpoint === API_ENDPOINTS.COUNTRIES && method === 'GET') {
      return mockData.countries;
    }
    
    // Default response for unhandled endpoints
    return { message: 'Mock response', data: null };
  }

  // HTTP methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();

