import { apiClient } from '../lib/apiClient.js';
import { API_ENDPOINTS } from '../lib/config.js';

// Authentication Service
export const authService = {
  async login(email, password) {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, { email, password });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userInfo', JSON.stringify({
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role
      }));
    }
    return response;
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  },

  getCurrentUser() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getToken() {
    return localStorage.getItem('authToken');
  }
};

// User Service
export const userService = {
  async getUsers() {
    return apiClient.get(API_ENDPOINTS.USERS);
  },

  async createUser(userData) {
    return apiClient.post(API_ENDPOINTS.USERS, userData);
  },

  async deleteUser(userId) {
    return apiClient.delete(API_ENDPOINTS.USER_BY_ID(userId));
  }
};

// Role Service
export const roleService = {
  async getRoles() {
    return apiClient.get(API_ENDPOINTS.ROLES);
  },

  async deleteRole(roleId) {
    return apiClient.delete(API_ENDPOINTS.ROLE_BY_ID(roleId));
  },

  async getRolePermissions(roleId) {
    return apiClient.get(API_ENDPOINTS.ROLE_PERMISSIONS(roleId));
  }
};

// Lead Service
export const leadService = {
  async getLeads(page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      direction
    });
    return apiClient.get(`${API_ENDPOINTS.LEADS}?${params}`);
  },

  async getLeadById(leadId) {
    return apiClient.get(API_ENDPOINTS.LEAD_BY_ID(leadId));
  },

  async createLead(leadData) {
    return apiClient.post(API_ENDPOINTS.LEADS, leadData);
  },

  async updateLead(leadId, leadData) {
    return apiClient.put(API_ENDPOINTS.LEAD_BY_ID(leadId), leadData);
  },

  async deleteLead(leadId) {
    return apiClient.delete(API_ENDPOINTS.LEAD_BY_ID(leadId));
  },

  async convertLeadToContact(leadId, contactData) {
    return apiClient.post(API_ENDPOINTS.CONVERT_LEAD_TO_CONTACT(leadId), contactData);
  }
};

// Dealer Service
export const dealerService = {
  async getDealers(page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      direction
    });
    return apiClient.get(`${API_ENDPOINTS.DEALERS}?${params}`);
  },

  async getDealerById(dealerId) {
    return apiClient.get(API_ENDPOINTS.DEALER_BY_ID(dealerId));
  },

  async createDealer(dealerData) {
    return apiClient.post(API_ENDPOINTS.DEALERS, dealerData);
  },

  async updateDealer(dealerId, dealerData) {
    return apiClient.put(API_ENDPOINTS.DEALER_BY_ID(dealerId), dealerData);
  },

  async deleteDealer(dealerId) {
    return apiClient.delete(API_ENDPOINTS.DEALER_BY_ID(dealerId));
  }
};

// Contact Service
export const contactService = {
  async getContacts(page = 0, size = 10, sortBy = 'createdAt', direction = 'desc') {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      direction
    });
    return apiClient.get(`${API_ENDPOINTS.CONTACTS}?${params}`);
  },

  async deleteContact(contactId) {
    return apiClient.delete(API_ENDPOINTS.CONTACT_BY_ID(contactId));
  },

  async convertContactToDealer(contactId, dealerData) {
    return apiClient.post(API_ENDPOINTS.CONVERT_CONTACT_TO_DEALER(contactId), dealerData);
  }
};

// Address Service
export const addressService = {
  async getAddresses() {
    return apiClient.get(API_ENDPOINTS.ADDRESSES);
  },

  async createAddress(addressData) {
    return apiClient.post(API_ENDPOINTS.ADDRESSES, addressData);
  },

  async updateAddress(addressId, addressData) {
    return apiClient.put(API_ENDPOINTS.ADDRESS_BY_ID(addressId), addressData);
  },

  async deleteAddress(addressId) {
    return apiClient.delete(API_ENDPOINTS.ADDRESS_BY_ID(addressId));
  },

  async getCountries() {
    return apiClient.get(API_ENDPOINTS.COUNTRIES);
  },

  async getCitiesByCountry(countryId) {
    return apiClient.get(API_ENDPOINTS.CITIES_BY_COUNTRY(countryId));
  }
};

