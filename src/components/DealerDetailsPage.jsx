import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Users,
  Globe,
  Hash
} from 'lucide-react';
import { dealerService } from '../lib/services.js';

const DealerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dealer, setDealer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDealerData();
  }, [id]);

  const fetchDealerData = async () => {
    try {
      setLoading(true);
      const dealerData = await dealerService.getDealerById(id);
      setDealer(dealerData);
    } catch (err) {
      console.error('Error fetching dealer data:', err);
      setError('Failed to load dealer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      try {
        await dealerService.deleteDealer(id);
        navigate('/dealers');
      } catch (err) {
        console.error('Error deleting dealer:', err);
        setError('Failed to delete dealer. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'ACTIVE': '#10b981',
      'INACTIVE': '#6b7280',
      'SUSPENDED': '#ef4444'
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <p>Loading dealer details...</p>
        </div>
      </div>
    );
  }

  if (!dealer) {
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
          <Building2 className="h-16 w-16 mx-auto mb-4" />
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
            Dealer Not Found
          </h2>
          <p style={{ opacity: 0.8, marginBottom: '20px' }}>
            The dealer you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/dealers')}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Dealers
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
        maxWidth: '1000px',
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
              onClick={() => navigate('/dealers')}
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
              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {dealer.name}
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.8 }}>
                Dealer Details
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate(`/dealers/${id}/edit`)}
              style={{
                padding: '12px 20px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
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
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            border: '1px solid #fecaca',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        {/* Dealer Information */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
            Business Information
          </h2>
          
          <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
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
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Business Name</p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.name}</p>
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
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Email Address</p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Phone Number</p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: getStatusColor(dealer.status),
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Hash className="h-5 w-5" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Status</p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.status}</p>
              </div>
            </div>

            {dealer.accessCount !== undefined && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#8b5cf6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Access Count</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.accessCount}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Address Information */}
        {dealer.address && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
              Address Information
            </h2>
            
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              {dealer.address.streetName && (
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Street Name</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.address.streetName}</p>
                </div>
              )}
              
              {dealer.address.streetNumber && (
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Street Number</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.address.streetNumber}</p>
                </div>
              )}
              
              {dealer.address.unitNumber && (
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Unit Number</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.address.unitNumber}</p>
                </div>
              )}
              
              {dealer.address.postalCode && (
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Postal Code</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.address.postalCode}</p>
                </div>
              )}
              
              {dealer.address.cityId && (
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>City</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>City ID: {dealer.address.cityId}</p>
                </div>
              )}
              
              {dealer.address.stateId && (
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>State/Province</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>State ID: {dealer.address.stateId}</p>
                </div>
              )}
              
              {dealer.address.countryId && (
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Country</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>Country ID: {dealer.address.countryId}</p>
                </div>
              )}
              
              {dealer.address.specialInstructions && (
                <div style={{ gridColumn: 'span 2' }}>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Special Instructions</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{dealer.address.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '24px' }}>
            Timestamps
          </h2>
          
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
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
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Created At</p>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
                  {formatDate(dealer.createdAt)}
                </p>
              </div>
            </div>

            {dealer.updatedAt && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#8b5cf6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Last Updated</p>
                  <p style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>
                    {formatDate(dealer.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerDetailsPage;
