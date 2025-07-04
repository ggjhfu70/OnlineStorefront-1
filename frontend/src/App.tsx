
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/ui/toast';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoader from './components/ui/PageLoader';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Products from './pages/Products/Products';
import Inventory from './pages/Inventory/Inventory';
import Orders from './pages/Orders/Orders';
import Customers from './pages/Customers/Customers';

import Suppliers from './pages/Suppliers/Suppliers';
import PurchaseOrders from './pages/PurchaseOrders/PurchaseOrders';
import Reports from './pages/Reports/Reports';
import UserManagement from './pages/UserManagementNormalized';

// Removed unused ProtectedRoute component

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader text="Đang khởi tạo ứng dụng..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/purchase-orders" element={<PurchaseOrders />} />
        
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
