import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/Dashboard/DashboardHome'
import BillingPage from './pages/Dashboard/BillingPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import DevDebugger from './pages/Dashboard/DevDebugger'
import AIAssistant from './pages/Features/AIAssistant'
import Forecasting from './pages/Features/Forecasting'
import ThreeDManipulation from './pages/Features/ThreeDManipulation'
import ImageRecognition from './pages/Features/ImageRecognition'
import QRCodeManagement from './pages/Features/QRCodeManagement'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="debug" element={<DevDebugger />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="forecasting" element={<Forecasting />} />
        <Route path="3d-manipulation" element={<ThreeDManipulation />} />
        <Route path="image-recognition" element={<ImageRecognition />} />
        <Route path="qr-codes" element={<QRCodeManagement />} />
      </Route>
    </Routes>
  )
}

export default App
