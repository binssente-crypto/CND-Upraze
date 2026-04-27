import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Bot, 
  LineChart, 
  Box, 
  Image as ImageIcon, 
  QrCode, 
  LayoutDashboard, 
  LayoutGrid,
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  User as UserIcon,
  CreditCard,
  Headphones,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: LayoutGrid, label: 'Modules', path: '/dashboard/modules' },
  { icon: Headphones, label: 'Support Center', path: '/dashboard/support' },
  { icon: Bot, label: 'AI Assistant', path: '/dashboard/ai-assistant' },
  { icon: LineChart, label: 'Forecasting', path: '/dashboard/forecasting' },
  { icon: Box, label: '3D Manipulation', path: '/dashboard/3d-manipulation' },
  { icon: ImageIcon, label: 'Image Recognition', path: '/dashboard/image-recognition' },
  { icon: QrCode, label: 'QR Codes', path: '/dashboard/qr-codes' },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logout
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-dark-bg text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 bg-dark-card border-r border-dark-border flex flex-col z-50"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center font-bold">U</div>
                <span className="font-bold text-xl">Upraze</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    location.pathname === item.path
                      ? 'bg-primary-600/10 text-primary-500 border border-primary-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 mt-auto border-t border-dark-border space-y-1">
              <Link 
                to="/dashboard/admin/inquiries" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
              >
                <ShieldAlert className="w-5 h-5 text-primary-500" />
                <span className="font-bold">Support Inbox</span>
              </Link>
              <Link 
                to="/dashboard/billing" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
              >
                <CreditCard className="w-5 h-5" />
                <span>Subscription</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-dark-bg/50 backdrop-blur-xl border-bottom border-dark-border flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-dark-card rounded-lg border border-dark-border hover:border-primary-500/50 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-semibold hidden md:block">
              {sidebarItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-dark-bg"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-dark-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Juan Dela Cruz</p>
                <p className="text-xs text-gray-500">Starter Plan</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-green-600 border-2 border-dark-border flex items-center justify-center p-0.5">
                <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
                   <UserIcon className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
