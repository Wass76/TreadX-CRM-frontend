import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Circle, ArrowLeft } from 'lucide-react';
import { dealerService } from '../lib/services.js';
import { API_CONFIG, API_ENDPOINTS } from '../lib/config.js';

const EditDealerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+400',
    accessCount: 0,
    status: 'ACTIVE',
    address: {
      streetName: '',
      streetNumber: '',
      postalCode: '',
      unitNumber: '',
      specialInstructions: '',
      cityId: 0,
      stateId: 0,
      countryId: 0
    }
  });

  useEffect(() => {
    fetchDealerData();
    fetchCountries();
  }, [id]);

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
    }
  }, [selectedState]);

  const fetchDealerData = async () => {
    try {
      setLoading(true);
      const dealerData = await dealerService.getDealerById(id);
      
      // Set form data with existing dealer data
      setFormData({
        name: dealerData.name || '',
        email: dealerData.email || '',
        phone: dealerData.phone || '+400',
        accessCount: dealerData.accessCount || 0,
        status: dealerData.status || 'ACTIVE',
        address: {
          streetName: dealerData.address?.streetName || '',
          streetNumber: dealerData.address?.streetNumber || '',
          postalCode: dealerData.address?.postalCode || '',
          unitNumber: dealerData.address?.unitNumber || '',
          specialInstructions: dealerData.address?.specialInstructions || '',
          cityId: dealerData.address?.cityId || 0,
          stateId: dealerData.address?.stateId || 0,
          countryId: dealerData.address?.countryId || 0
        }
      });

      // Set selected values for dropdowns
      if (dealerData.address?.countryId) {
        setSelectedCountry(dealerData.address.countryId.toString());
      }
      if (dealerData.address?.stateId) {
        setSelectedState(dealerData.address.stateId.toString());
      }
    } catch (err) {
      console.error('Error fetching dealer data:', err);
      setError('Failed to load dealer data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}${API_ENDPOINTS.COUNTRIES}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const simplifiedCountries = data.map(country => ({
        id: country.id,
        name: country.name,
        flag: '🏳️'
      }));
      setCountries(simplifiedCountries);
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError('Failed to load countries. Please try again.');
    }
  };

  const fetchStates = async (countryId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}${API_ENDPOINTS.PROVINCES_BY_COUNTRY(countryId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStates(data);
    } catch (err) {
      console.error('Error fetching states:', err);
      setError('Failed to load states. Please try again.');
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_CONFIG.BACKEND_URL}${API_ENDPOINTS.CITIES_BY_PROVINCE(stateId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCities(data);
    } catch (err) {
      console.error('Error fetching cities:', err);
      setError('Failed to load cities. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    setSelectedState('');
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        countryId: parseInt(countryId),
        stateId: 0,
        cityId: 0
      }
    }));
  };

  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setSelectedState(stateId);
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        stateId: parseInt(stateId),
        cityId: 0
      }
    }));
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        cityId: parseInt(cityId)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await dealerService.updateDealer(id, formData);
      navigate(`/dealers/${id}`);
    } catch (err) {
      console.error('Error updating dealer:', err);
      setError('Failed to update dealer. Please try again.');
    } finally {
      setSaving(false);
    }
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
          <p>Loading dealer data...</p>
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
        maxWidth: '800px',
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
              onClick={() => navigate(`/dealers/${id}`)}
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
                Edit Dealer
              </h1>
              <p style={{ fontSize: '16px', opacity: 0.8 }}>
                Update dealer information
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {error && (
            <div style={{
              padding: '12px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              marginBottom: '24px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Business Information
              </h3>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Business Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      background: 'white'
                    }}
                    disabled={saving}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Access Count
                  </label>
                  <input
                    type="number"
                    name="accessCount"
                    value={formData.accessCount}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    min="0"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Address Information
              </h3>
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Street Name *
                  </label>
                  <input
                    type="text"
                    name="address.streetName"
                    value={formData.address.streetName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    required
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Street Number
                  </label>
                  <input
                    type="text"
                    name="address.streetNumber"
                    value={formData.address.streetNumber}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Unit Number
                  </label>
                  <input
                    type="text"
                    name="address.unitNumber"
                    value={formData.address.unitNumber}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    disabled={saving}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Country *
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      background: 'white'
                    }}
                    required
                    disabled={saving}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    State *
                  </label>
                  <select
                    value={selectedState}
                    onChange={handleStateChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      background: 'white'
                    }}
                    required
                    disabled={saving || !selectedCountry}
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    City *
                  </label>
                  <select
                    value={formData.address.cityId}
                    onChange={handleCityChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      background: 'white'
                    }}
                    required
                    disabled={saving || !selectedState}
                  >
                    <option value="">Select City</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                    Special Instructions
                  </label>
                  <textarea
                    name="address.specialInstructions"
                    value={formData.address.specialInstructions}
                    onChange={handleChange}
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => navigate(`/dealers/${id}`)}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  color: '#1f2937',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                  transition: 'all 0.2s'
                }}
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Update Dealer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDealerPage;
