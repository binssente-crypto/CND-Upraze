import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/Dashboard/DashboardHome'
import Modules from './pages/Dashboard/Modules'
import BillingPage from './pages/Dashboard/BillingPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminOverview from './pages/Admin/AdminOverview'
import DevDebugger from './pages/Dashboard/DevDebugger'
import AIAssistant from './pages/Features/AIAssistant'
import Forecasting from './pages/Features/Forecasting'
import ThreeDManipulation from './pages/Features/ThreeDManipulation'
import ImageRecognition from './pages/Features/ImageRecognition'
import QRCodeManagement from './pages/Features/QRCodeManagement'
import SupportCenter from './pages/Support/SupportCenter'
import AdminInquiries from './pages/Admin/AdminInquiries'
import OfferManagement from './pages/Admin/OfferManagement'

import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('user_role');

  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole === 'admin' && !['admin', 'superadmin'].includes(role)) return <Navigate to="/dashboard" replace />;
  if (requiredRole && requiredRole !== 'admin' && role !== requiredRole) return <Navigate to="/dashboard" replace />;
  
  return <Outlet />;
};

function App() {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'C' || e.key === 'A')) {
        e.preventDefault();
        return false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="admin/overview" element={<AdminOverview />} />
          <Route path="admin/users" element={<AdminDashboard />} />
          <Route path="admin/offers" element={<OfferManagement />} />
          <Route path="admin/inquiries" element={<AdminInquiries />} />
          <Route path="modules" element={<Modules />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="debug" element={<DevDebugger />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="forecasting" element={<Forecasting />} />
          <Route path="3d-manipulation" element={<ThreeDManipulation />} />
          <Route path="image-recognition" element={<ImageRecognition />} />
          <Route path="qr-codes" element={<QRCodeManagement />} />
          <Route path="support" element={<SupportCenter />} />
        </Route>
      </Route>

      {/* Admin Specific Routes */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="inquiries" element={<AdminInquiries />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App
