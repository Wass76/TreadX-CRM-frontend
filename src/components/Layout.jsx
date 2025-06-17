import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Building2, 
  Contact,
  LogOut,
  Circle,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { USER_ROLES } from '../lib/config.js';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: [USER_ROLES.PLATFORM_ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_AGENT]
    },
    {
      name: 'Leads',
      href: '/leads',
      icon: UserCheck,
      roles: [USER_ROLES.PLATFORM_ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_AGENT]
    },
    {
      name: 'Contacts',
      href: '/contacts',
      icon: Contact,
      roles: [USER_ROLES.PLATFORM_ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_AGENT]
    },
    {
      name: 'Dealers',
      href: '/dealers',
      icon: Building2,
      roles: [USER_ROLES.PLATFORM_ADMIN, USER_ROLES.SALES_MANAGER, USER_ROLES.SALES_AGENT]
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      roles: [USER_ROLES.PLATFORM_ADMIN]
    }
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      position: 'relative'
    }}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'block',
            '@media (min-width: 1024px)': {
              display: 'none'
            }
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        insetY: 0,
        left: 0,
        zIndex: 50,
        width: '280px',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.2)',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        '@media (min-width: 1024px)': {
          transform: 'translateX(0)',
          position: 'static'
        }
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          padding: '0 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              background: '#667eea',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Circle className="h-6 w-6 text-white" />
            </div>
            <span style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              TreadX
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            style={{
              display: 'block',
              '@media (min-width: 1024px)': {
                display: 'none'
              }
            }}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav style={{
          marginTop: '24px',
          padding: '0 16px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    color: isActive ? '#1f2937' : '#6b7280',
                    background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    ':hover': {
                      background: 'rgba(102, 126, 234, 0.1)',
                      color: '#1f2937'
                    }
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon style={{
                    marginRight: '12px',
                    width: '20px',
                    height: '20px',
                    color: isActive ? '#667eea' : '#6b7280'
                  }} />
                  {item.name}
                  {isActive && (
                    <ChevronRight style={{
                      marginLeft: 'auto',
                      width: '16px',
                      height: '16px',
                      color: '#667eea'
                    }} />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info & Logout */}
        <div style={{
          marginTop: 'auto',
          padding: '24px 16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#667eea',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#dc2626',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <LogOut style={{ marginRight: '8px', width: '16px', height: '16px' }} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: '0px',
        '@media (min-width: 1024px)': {
          marginLeft: '280px'
        }
      }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              '@media (min-width: 1024px)': {
                display: 'none'
              }
            }}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div style={{ color: 'white' }}>
            <h1 style={{ fontSize: '20px', fontWeight: '600' }}>
              {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>
          
          <div style={{ width: '40px' }}></div> {/* Spacer for mobile */}
        </div>

        {/* Page Content */}
        <div style={{
          flex: 1,
          width: '100%',
          minHeight: 'calc(100vh - 64px)'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

