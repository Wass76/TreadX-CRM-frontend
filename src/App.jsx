import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './components/LoginPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import UsersPage from './components/UsersPage.jsx';
import LeadsPage from './components/LeadsPage.jsx';
import AllLeadsPage from './components/AllLeadsPage.jsx';
import ContactsPage from './components/ContactsPage.jsx';
import DealersPage from './components/DealersPage.jsx';
import AllDealersPage from './components/AllDealersPage.jsx';
import DealerDetailsPage from './components/DealerDetailsPage.jsx';
import NewLeadPage from './components/NewLeadPage.jsx';
import EditLeadPage from './components/EditLeadPage.jsx';
import NewDealerPage from './components/NewDealerPage.jsx';
import EditDealerPage from './components/EditDealerPage.jsx';
import LeadDetailsPage from './components/LeadDetailsPage.jsx';
// import ReportsPage from './components/ReportsPage.jsx';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<AllLeadsPage />} />
            <Route path="leads/new" element={<NewLeadPage />} />
            <Route path="leads/:id" element={<LeadDetailsPage />} />
            <Route path="leads/:id/edit" element={<EditLeadPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="dealers" element={<AllDealersPage />} />
            <Route path="dealers/new" element={<NewDealerPage />} />
            <Route path="dealers/:id" element={<DealerDetailsPage />} />
            <Route path="dealers/:id/edit" element={<EditDealerPage />} />
            <Route path="users" element={<UsersPage />} />
            {/* <Route path="reports" element={<ReportsPage />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;