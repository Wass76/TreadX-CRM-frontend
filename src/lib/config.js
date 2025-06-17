// API Configuration
export const API_CONFIG = {
  // Switch between 'mock' and 'backend' modes
  MODE: 'backend',
  
  // Backend URL - direct connection to backend
  BACKEND_URL: 'http://159.198.75.161:9003',
  
  // Mock API delay to simulate network requests
  MOCK_DELAY: 500,
};

// Lead Status Enum
export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  CLOSED: 'CLOSED'
};

// Lead Source Enum
export const LEAD_SOURCE = {
  WEBSITE: 'WEBSITE',
  REFERRAL: 'REFERRAL',
  COLD_CALL: 'COLD_CALL',
  SOCIAL_MEDIA: 'SOCIAL_MEDIA',
  TRADE_SHOW: 'TRADE_SHOW',
  OTHER: 'OTHER'
};

// Dealer Status Enum
export const DEALER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  SUSPENDED: 'SUSPENDED'
};

// User Roles
export const USER_ROLES = {
  PLATFORM_ADMIN: 'PLATFORM_ADMIN',
  SALES_MANAGER: 'SALES_MANAGER',
  SALES_AGENT: 'SALES_AGENT'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/v1/users/login',
  
  // Users
  USERS: '/api/v1/users',
  USER_BY_ID: (id) => `/api/v1/users/${id}`,
  
  // Roles
  ROLES: '/api/v1/roles',
  ROLE_BY_ID: (id) => `/api/v1/roles/${id}`,
  ROLE_PERMISSIONS: (id) => `/api/v1/roles/${id}/permissions`,
  
  // Leads
  LEADS: '/api/v1/leads',
  LEAD_BY_ID: (id) => `/api/v1/leads/${id}`,
  CONVERT_LEAD_TO_CONTACT: (id) => `/api/v1/leads/${id}/convert-to-contact`,
  
  // Dealers
  DEALERS: '/api/v1/dealers',
  DEALER_BY_ID: (id) => `/api/v1/dealers/${id}`,
  
  // Contacts
  CONTACTS: '/api/v1/contacts',
  CONTACT_BY_ID: (id) => `/api/v1/contacts/${id}`,
  CONVERT_CONTACT_TO_DEALER: (id) => `/api/v1/contacts/${id}/convert-to-dealer`,
  
  // Addresses
  ADDRESSES: '/api/v1/addresses',
  ADDRESS_BY_ID: (id) => `/api/v1/addresses/${id}`,
  COUNTRIES: '/api/v1/addresses/base/countries',
  PROVINCES_BY_COUNTRY: (countryId) => `/api/v1/addresses/base/countries/${countryId}/provinces`,
  CITIES_BY_PROVINCE: (provinceId) => `/api/v1/addresses/base/provinces/${provinceId}/cities`,
};

