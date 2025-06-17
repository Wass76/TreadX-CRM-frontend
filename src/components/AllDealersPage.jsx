import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Circle, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building2
} from 'lucide-react';
import { dealerService } from '../lib/services.js';

const AllDealersPage = () => {
  const navigate = useNavigate();
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchDealers();
  }, [pagination.page, pagination.size]);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      const response = await dealerService.getDealers(pagination.page, pagination.size);
      setDealers(response.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (err) {
      console.error('Error fetching dealers:', err);
      setError('Failed to load dealers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dealerId) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      try {
        await dealerService.deleteDealer(dealerId);
        fetchDealers();
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
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = dealer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dealer.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || dealer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
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
          <p>Loading dealers...</p>
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
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              All Dealers
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.8 }}>
              Manage and track all your dealers
            </p>
          </div>
          
          <button
            onClick={() => navigate('/dealers/new')}
            style={{
              padding: '12px 24px',
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
            <Plus className="h-5 w-5" />
            Add New Dealer
          </button>
        </div>

        {/* Filters and Search */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ position: 'relative' }}>
                <Search className="h-5 w-5" style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280'
                }} />
                <input
                  type="text"
                  placeholder="Search dealers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                background: 'white',
                minWidth: '150px'
              }}
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
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

        {/* Dealers List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {filteredDealers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                No dealers found
              </h3>
              <p style={{ color: '#9ca3af' }}>
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first dealer'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredDealers.map(dealer => (
                <div
                  key={dealer.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    background: 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                          {dealer.name}
                        </h3>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          background: `${getStatusColor(dealer.status)}20`,
                          color: getStatusColor(dealer.status),
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {dealer.status}
                        </div>
                        {dealer.accessCount !== undefined && (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 8px',
                            background: '#8b5cf620',
                            color: '#8b5cf6',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500'
                          }}>
                            Access: {dealer.accessCount}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
                          <Mail className="h-4 w-4" />
                          <span style={{ fontSize: '14px' }}>{dealer.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
                          <Phone className="h-4 w-4" />
                          <span style={{ fontSize: '14px' }}>{dealer.phone}</span>
                        </div>
                        {dealer.address?.streetName && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
                            <MapPin className="h-4 w-4" />
                            <span style={{ fontSize: '14px' }}>
                              {dealer.address.streetName}
                              {dealer.address.city && `, ${dealer.address.city}`}
                            </span>
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280' }}>
                          <Calendar className="h-4 w-4" />
                          <span style={{ fontSize: '14px' }}>
                            Created: {formatDate(dealer.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => navigate(`/dealers/${dealer.id}`)}
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
                      <button
                        onClick={() => navigate(`/dealers/${dealer.id}/edit`)}
                        style={{
                          padding: '8px',
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Edit Dealer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(dealer.id)}
                        style={{
                          padding: '8px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Delete Dealer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              Showing {pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} dealers
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 0}
                style={{
                  padding: '8px 12px',
                  background: pagination.page === 0 ? '#f3f4f6' : 'white',
                  color: pagination.page === 0 ? '#9ca3af' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: pagination.page === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(pagination.totalPages - 5, pagination.page - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        padding: '8px 12px',
                        background: pageNum === pagination.page ? '#667eea' : 'white',
                        color: pageNum === pagination.page ? 'white' : '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        minWidth: '40px'
                      }}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages - 1}
                style={{
                  padding: '8px 12px',
                  background: pagination.page === pagination.totalPages - 1 ? '#f3f4f6' : 'white',
                  color: pagination.page === pagination.totalPages - 1 ? '#9ca3af' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: pagination.page === pagination.totalPages - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDealersPage;
