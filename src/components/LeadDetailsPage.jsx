import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Circle, Edit, Trash2, ArrowLeft, User, Mail, Phone, MapPin, Calendar, Tag } from 'lucide-react';
import { leadService } from '../lib/services.js';

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  // Helper function to parse date array format
  const parseDateArray = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 6) {
      return null;
    }
    
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second); // month is 0-indexed in Date constructor
  };

  // Helper function to format date
  const formatDate = (dateArray) => {
    const date = parseDateArray(dateArray);
    if (!date) {
      return 'Not available';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const leadData = await leadService.getLeadById(id);
      setLead(leadData);
    } catch (err) {
      console.error('Error fetching lead details:', err);
      setError('Failed to load lead details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        navigate('/leads');
      } catch (err) {
        console.error('Error deleting lead:', err);
        setError('Failed to delete lead. Please try again.');
      }
    }
  };

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

  const getSourceColor = (source) => {
    const colors = {
      'WEBSITE': '#3b82f6',
      'FACEBOOK': '#1877f2',
      'REFERRAL': '#10b981',
      'PHONE_CALL': '#f59e0b',
      'WALK_IN': '#8b5cf6',
      'GOOGLE_ADS': '#ef4444',
      'SALES_AGENT': '#6b7280'
    };
    return colors[source] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#fee2e2',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Circle className="h-8 w-8 text-red-500" />
          </div>
          <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>Error</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => navigate('/leads')}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#6b7280', marginBottom: '16px' }}>Lead Not Found</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>The lead you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/leads')}
            style={{
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/leads')}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>
                Lead Details
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.8 }}>
                {lead.businessName}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate(`/leads/${id}/edit`)}
              style={{
                padding: '12px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Edit className="h-4 w-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: '12px 20px',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#fecaca',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{
          display: 'grid',
          gap: '24px',
          gridTemplateColumns: '2fr 1fr'
        }}>
          {/* Main Information */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
              Business Information
            </h2>
            
            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#667eea',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Business Name</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{lead.businessName}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#10b981',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{lead.businessEmail}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#f59e0b',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Phone</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{lead.phoneNumber}</p>
                </div>
              </div>

              {lead.notes && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    Notes
                  </h3>
                  <div style={{
                    background: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>{lead.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Status & Source */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Status & Source
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px' }}>Status</p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    background: `${getStatusColor(lead.status)}20`,
                    color: getStatusColor(lead.status),
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: getStatusColor(lead.status),
                      borderRadius: '50%',
                      marginRight: '8px'
                    }}></div>
                    {lead.status}
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px' }}>Source</p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '6px 12px',
                    background: `${getSourceColor(lead.source)}20`,
                    color: getSourceColor(lead.source),
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <Tag className="h-4 w-4 mr-2" />
                    {lead.source.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {lead.address && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Address
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Street Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#8b5cf6',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                        {lead.address.streetNumber && `${lead.address.streetNumber} `}
                        {lead.address.streetName}
                        {lead.address.unitNumber && `, Unit ${lead.address.unitNumber}`}
                      </p>
                      {lead.address.postalCode && (
                        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                          Postal Code: {lead.address.postalCode}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* City, Province, Country */}
                  {(lead.address.city || lead.address.province || lead.address.country) && (
                    <div style={{ 
                      background: '#f9fafb', 
                      padding: '12px', 
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {lead.address.city && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>City:</span>
                            <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                              {lead.address.city}
                            </span>
                          </div>
                        )}
                        {lead.address.province && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Province/State:</span>
                            <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                              {lead.address.province}
                            </span>
                          </div>
                        )}
                        {lead.address.country && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Country:</span>
                            <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                              {lead.address.country}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special Instructions */}
                  {lead.address.specialInstructions && (
                    <div style={{ 
                      background: '#fef3c7', 
                      padding: '12px', 
                      borderRadius: '8px',
                      border: '1px solid #f59e0b'
                    }}>
                      <p style={{ fontSize: '12px', color: '#92400e', fontWeight: '500', marginBottom: '4px' }}>
                        Special Instructions:
                      </p>
                      <p style={{ fontSize: '14px', color: '#92400e', lineHeight: '1.5' }}>
                        {lead.address.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Timestamps
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>Created</p>
                    <p style={{ fontSize: '14px', color: '#374151' }}>
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                </div>
                
                {lead.updatedAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p style={{ fontSize: '12px', color: '#6b7280' }}>Updated</p>
                      <p style={{ fontSize: '14px', color: '#374151' }}>
                        {formatDate(lead.updatedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
