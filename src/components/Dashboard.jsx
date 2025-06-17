import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Building2, 
  Contact,
  TrendingUp,
  TrendingDown,
  Activity,
  Circle,
  ArrowRight,
  Plus,
  Eye,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import { leadService, dealerService, contactService, userService } from '../lib/services.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalContacts: 0,
    totalDealers: 0,
    totalUsers: 0,
    recentLeads: [],
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [leadsData, contactsData, dealersData, usersData] = await Promise.all([
          leadService.getLeads(0, 5),
          contactService.getContacts(0, 5),
          dealerService.getDealers(0, 5),
          userService.getUsers()
        ]);

        setStats({
          totalLeads: leadsData.totalElements || 0,
          totalContacts: contactsData.totalElements || 0,
          totalDealers: dealersData.totalElements || 0,
          totalUsers: Array.isArray(usersData) ? usersData.length : 0,
          recentLeads: leadsData.content || [],
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'NEW': '#3b82f6',
      'CONTACTED': '#f59e0b',
      'QUALIFIED': '#8b5cf6',
      'CONVERTED': '#10b981',
      'CLOSED': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  // Helper function to parse date array format
  const parseDateArray = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 6) {
      return null;
    }
    
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second);
  };

  const formatDate = (dateArray) => {
    const date = parseDateArray(dateArray);
    if (!date) {
      return 'Not available';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (stats.loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: 'white', fontSize: '16px' }}>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        gap: '24px'
      }}>
        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
            color: 'white'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Circle className="h-10 w-10 text-white" />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              Welcome to TreadX CRM
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.8 }}>
              Your complete tire tracking & management solution
            </p>
          </div>

          {/* Stats Cards - 2x2 Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {/* Total Leads */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onClick={() => navigate('/leads')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Total Leads</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>
                    {stats.totalLeads}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  <TrendingUp className="inline h-4 w-4 mr-2" />
                  Active prospects
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Total Contacts */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onClick={() => navigate('/contacts')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Total Contacts</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>
                    {stats.totalContacts}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Contact className="h-8 w-8 text-white" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  <TrendingUp className="inline h-4 w-4 mr-2" />
                  Converted leads
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Total Dealers */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onClick={() => navigate('/dealers')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Total Dealers</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>
                    {stats.totalDealers}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  <TrendingUp className="inline h-4 w-4 mr-2" />
                  Business partners
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* System Users */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
            onClick={() => navigate('/users')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>System Users</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937' }}>
                    {stats.totalUsers}
                  </div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  padding: '16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  <Activity className="inline h-4 w-4 mr-2" />
                  Active users
                </p>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Recent Leads */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
                Recent Leads
              </h2>
              <button
                onClick={() => navigate('/leads')}
                style={{
                  padding: '8px 16px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {stats.recentLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Circle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                  No leads yet
                </h3>
                <p style={{ color: '#9ca3af', marginBottom: '20px' }}>
                  Get started by creating your first lead
                </p>
                <button
                  onClick={() => navigate('/leads/new')}
                  style={{
                    padding: '12px 24px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto'
                  }}
                >
                  <Plus className="h-5 w-5" />
                  Add New Lead
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stats.recentLeads.slice(0, 5).map(lead => (
                  <div
                    key={lead.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: '#667eea',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>
                          {lead.businessName}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail className="h-4 w-4" />
                            {lead.businessEmail}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone className="h-4 w-4" />
                            {lead.phoneNumber}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar className="h-4 w-4" />
                            {formatDate(lead.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        background: `${getStatusColor(lead.status)}20`,
                        color: getStatusColor(lead.status),
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {lead.status}
                      </div>
                      <button
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        style={{
                          padding: '8px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div style={{
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Quick Actions */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
              Quick Actions
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => navigate('/leads/new')}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Plus className="h-5 w-5" />
                  Add New Lead
                </div>
                <ArrowRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => navigate('/dealers/new')}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Building2 className="h-5 w-5" />
                  Register Dealer
                </div>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
              Quick Navigation
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => navigate('/leads')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserCheck className="h-4 w-4" />
                  Manage Leads
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate('/dealers')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  color: '#8b5cf6',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 className="h-4 w-4" />
                  Manage Dealers
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => navigate('/contacts')}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Contact className="h-4 w-4" />
                  View Contacts
                </div>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

