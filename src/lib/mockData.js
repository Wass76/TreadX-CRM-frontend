import { LEAD_STATUS, LEAD_SOURCE, DEALER_STATUS, USER_ROLES } from './config.js';

export const mockData = {
  // Authentication response
  authResponse: {
    token: 'mock-jwt-token-12345',
    email: 'admin@treadx.com',
    firstName: 'John',
    lastName: 'Admin',
    role: USER_ROLES.PLATFORM_ADMIN
  },

  // Users data
  users: [
    {
      id: 1,
      email: 'admin@treadx.com',
      firstName: 'John',
      lastName: 'Admin',
      position: 'Platform Administrator',
      role: {
        id: 1,
        name: USER_ROLES.PLATFORM_ADMIN,
        description: 'Full system access'
      },
      additionalPermissions: [],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      createdBy: 1,
      updatedBy: 1
    },
    {
      id: 2,
      email: 'manager@treadx.com',
      firstName: 'Sarah',
      lastName: 'Manager',
      position: 'Sales Manager',
      role: {
        id: 2,
        name: USER_ROLES.SALES_MANAGER,
        description: 'Sales management access'
      },
      additionalPermissions: [],
      createdAt: '2024-01-16T09:00:00Z',
      updatedAt: '2024-01-16T09:00:00Z',
      createdBy: 1,
      updatedBy: 1
    },
    {
      id: 3,
      email: 'agent@treadx.com',
      firstName: 'Mike',
      lastName: 'Agent',
      position: 'Sales Agent',
      role: {
        id: 3,
        name: USER_ROLES.SALES_AGENT,
        description: 'Basic sales access'
      },
      additionalPermissions: [],
      createdAt: '2024-01-17T08:00:00Z',
      updatedAt: '2024-01-17T08:00:00Z',
      createdBy: 2,
      updatedBy: 2
    }
  ],

  // Roles data
  roles: [
    {
      id: 1,
      name: USER_ROLES.PLATFORM_ADMIN,
      description: 'Full system access with all permissions'
    },
    {
      id: 2,
      name: USER_ROLES.SALES_MANAGER,
      description: 'Sales management with team oversight'
    },
    {
      id: 3,
      name: USER_ROLES.SALES_AGENT,
      description: 'Basic sales operations'
    }
  ],

  // Leads data with pagination
  leadsPage: {
    content: [
      {
        id: 1,
        businessName: 'Quick Tire Solutions',
        businessEmail: 'contact@quicktire.com',
        phoneNumber: '+1-555-0123',
        source: LEAD_SOURCE.WEBSITE,
        status: LEAD_STATUS.NEW,
        address: {
          id: 1,
          streetName: 'Main Street',
          streetNumber: '123',
          postalCode: '12345',
          unitNumber: 'Suite 100',
          city: 'Toronto',
          province: 'Ontario',
          country: 'Canada',
          specialInstructions: 'Ring buzzer for entry'
        },
        notes: 'Interested in bulk tire purchasing for fleet vehicles',
        dealerId: null,
        dealerUniqueId: null,
        createdAt: '2024-06-10T09:00:00Z',
        updatedAt: '2024-06-10T09:00:00Z',
        addedBy: 2,
        lastModifiedBy: 2
      },
      {
        id: 2,
        businessName: 'Metro Auto Service',
        businessEmail: 'info@metroauto.com',
        phoneNumber: '+1-555-0124',
        source: LEAD_SOURCE.REFERRAL,
        status: LEAD_STATUS.CONTACTED,
        address: {
          id: 2,
          streetName: 'Industrial Blvd',
          streetNumber: '456',
          postalCode: '67890',
          unitNumber: 'Unit 5',
          city: 'Vancouver',
          province: 'British Columbia',
          country: 'Canada',
          specialInstructions: 'Loading dock at rear'
        },
        notes: 'Follow up scheduled for next week',
        dealerId: null,
        dealerUniqueId: null,
        createdAt: '2024-06-08T14:30:00Z',
        updatedAt: '2024-06-12T10:15:00Z',
        addedBy: 3,
        lastModifiedBy: 2
      },
      {
        id: 3,
        businessName: 'Highway Tire Center',
        businessEmail: 'sales@highwaytire.com',
        phoneNumber: '+1-555-0125',
        source: LEAD_SOURCE.TRADE_SHOW,
        status: LEAD_STATUS.QUALIFIED,
        address: {
          id: 3,
          streetName: 'Highway 401',
          streetNumber: '789',
          postalCode: '54321',
          unitNumber: '',
          city: 'Calgary',
          province: 'Alberta',
          country: 'Canada',
          specialInstructions: 'Large facility, ask for manager'
        },
        notes: 'Ready to discuss partnership terms',
        dealerId: null,
        dealerUniqueId: null,
        createdAt: '2024-06-05T11:20:00Z',
        updatedAt: '2024-06-13T16:45:00Z',
        addedBy: 2,
        lastModifiedBy: 2
      }
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false
      },
      offset: 0,
      paged: true,
      unpaged: false
    },
    totalElements: 3,
    totalPages: 1,
    last: true,
    first: true,
    numberOfElements: 3,
    size: 10,
    number: 0,
    sort: {
      sorted: true,
      unsorted: false,
      empty: false
    },
    empty: false
  },

  // Dealers data with pagination
  dealersPage: {
    content: [
      {
        id: 1,
        name: 'Premium Tire Distributors',
        email: 'contact@premiumtire.com',
        phone: '+1-555-0200',
        status: DEALER_STATUS.ACTIVE,
        accessCount: 150,
        dealerUniqueId: 'PTD-001',
        address: {
          id: 10,
          streetName: 'Commerce Drive',
          streetNumber: '100',
          postalCode: '98765',
          unitNumber: 'Building A',
          city: 'Montreal',
          province: 'Quebec',
          country: 'Canada',
          specialInstructions: 'Main entrance'
        }
      },
      {
        id: 2,
        name: 'Elite Auto Parts',
        email: 'info@eliteauto.com',
        phone: '+1-555-0201',
        status: DEALER_STATUS.ACTIVE,
        accessCount: 89,
        dealerUniqueId: 'EAP-002',
        address: {
          id: 11,
          streetName: 'Industrial Park',
          streetNumber: '250',
          postalCode: '13579',
          unitNumber: 'Suite 200',
          city: 'Ottawa',
          province: 'Ontario',
          country: 'Canada',
          specialInstructions: 'Second floor office'
        }
      }
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false
      },
      offset: 0,
      paged: true,
      unpaged: false
    },
    totalElements: 2,
    totalPages: 1,
    last: true,
    first: true,
    numberOfElements: 2,
    size: 10,
    number: 0,
    sort: {
      sorted: true,
      unsorted: false,
      empty: false
    },
    empty: false
  },

  // Contacts data with pagination
  contactsPage: {
    content: [
      {
        id: 1,
        businessName: 'Tire Express Solutions',
        businessEmail: 'contact@tireexpress.com',
        phoneNumber: '+1-555-0300',
        source: LEAD_SOURCE.WEBSITE,
        status: 'CONTACT',
        address: {
          id: 20,
          streetName: 'Express Lane',
          streetNumber: '500',
          postalCode: '24680',
          unitNumber: '',
          city: 'Winnipeg',
          province: 'Manitoba',
          country: 'Canada',
          specialInstructions: 'Call ahead for appointment'
        },
        notes: 'Converted from lead, ready for dealer conversion',
        dealerId: null,
        dealerUniqueId: null,
        createdAt: '2024-06-01T12:00:00Z',
        updatedAt: '2024-06-14T09:30:00Z',
        addedBy: 2,
        lastModifiedBy: 2
      }
    ],
    pageable: {
      pageNumber: 0,
      pageSize: 10,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false
      },
      offset: 0,
      paged: true,
      unpaged: false
    },
    totalElements: 1,
    totalPages: 1,
    last: true,
    first: true,
    numberOfElements: 1,
    size: 10,
    number: 0,
    sort: {
      sorted: true,
      unsorted: false,
      empty: false
    },
    empty: false
  },

  // Countries data
  countries: [
    {
      id: 1,
      name: 'Canada',
      code: 'CA'
    },
    {
      id: 2,
      name: 'United States',
      code: 'US'
    },
    {
      id: 3,
      name: 'Mexico',
      code: 'MX'
    }
  ],

  // Cities data (for Canada)
  cities: [
    {
      id: 1,
      name: 'Toronto',
      province: 'Ontario'
    },
    {
      id: 2,
      name: 'Vancouver',
      province: 'British Columbia'
    },
    {
      id: 3,
      name: 'Montreal',
      province: 'Quebec'
    },
    {
      id: 4,
      name: 'Calgary',
      province: 'Alberta'
    },
    {
      id: 5,
      name: 'Ottawa',
      province: 'Ontario'
    },
    {
      id: 6,
      name: 'Winnipeg',
      province: 'Manitoba'
    }
  ]
};

