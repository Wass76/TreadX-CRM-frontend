import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#667eea',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>
            <Circle className="h-8 w-8" />
          </div>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>
            TreadX CRM
          </h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>
            Tire Tracking & Management System
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
            {error && (
            <div style={{
              padding: '12px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              marginBottom: '16px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              {error}
            </div>
            )}
            
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Email
            </label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
                required
                disabled={loading}
              />
            </div>
            
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
              Password
            </label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
                required
                disabled={loading}
              />
            </div>
            
          <button
              type="submit" 
            style={{
              width: '100%',
              padding: '12px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
              disabled={loading}
            >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          </form>
          
        <div style={{
          padding: '16px',
          background: '#f3f4f6',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <p style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Demo Credentials:
          </p>
          <p style={{ margin: '0 0 4px', fontSize: '12px', fontFamily: 'monospace', color: '#6b7280' }}>
            Email: admin@treadx.com
          </p>
          <p style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#6b7280' }}>
            Password: admin123
          </p>
        </div>
        
        <div style={{
          padding: '16px',
          background: '#ecfdf5',
          border: '1px solid #d1fae5',
          borderRadius: '8px',
          marginBottom: '16px'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '600', color: '#065f46' }}>
            ✅ Application Features Ready:
          </h3>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: '#047857' }}>
            <li>Complete CRM with Lead → Contact → Dealer workflow</li>
            <li>User management with role-based access control</li>
            <li>Mock data integration (easily switchable to backend)</li>
            <li>Responsive design with modern UI components</li>
            <li>Dashboard with analytics and statistics</li>
          </ul>
        </div>
        
        <div style={{
          padding: '16px',
          background: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: '600', color: '#1e40af' }}>
            🔧 Backend Integration:
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#1e40af' }}>
            To connect to your Spring Boot backend, change the MODE in{' '}
            <code style={{ background: '#dbeafe', padding: '2px 4px', borderRadius: '3px' }}>
              src/lib/config.js
            </code>{' '}
            from 'mock' to 'backend' and update the BACKEND_URL.
          </p>
        </div>
          </div>
    </div>
  );
};

export default LoginPage;

