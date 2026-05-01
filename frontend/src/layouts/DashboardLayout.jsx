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
  ShieldAlert,
  Search,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';

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
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-[#030303] text-gray-100 overflow-hidden font-inter">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-80 bg-white/[0.01] border-r border-white/[0.05] flex flex-col z-50 backdrop-blur-3xl"
          >
            <div className="p-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Logo className="h-8" />
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="px-6 mb-8">
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search systems..." 
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-2xl pl-12 pr-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary-500/30 transition-all"
                  />
               </div>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
              <div className="px-4 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Main Menu</div>
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    location.pathname === item.path
                      ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20'
                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-white' : 'group-hover:text-primary-500'}`} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                  {location.pathname === item.path && <ChevronRight className="w-4 h-4" />}
                </Link>
              ))}
            </nav>

            <div className="p-6 mt-auto border-t border-white/[0.05] space-y-2">
              <div className="px-4 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">System</div>
              <Link 
                to="/dashboard/admin/inquiries" 
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-white/[0.03] hover:text-white transition-all group"
              >
                <ShieldAlert className="w-5 h-5 group-hover:text-primary-500" />
                <span className="text-[11px] font-black uppercase tracking-widest">Support Inbox</span>
              </Link>
              <Link 
                to="/dashboard/billing" 
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-white/[0.03] hover:text-white transition-all group"
              >
                <CreditCard className="w-5 h-5 group-hover:text-primary-500" />
                <span className="text-[11px] font-black uppercase tracking-widest">Billing & Plans</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Header */}
        <header className="h-24 border-b border-white/[0.05] flex items-center justify-between px-10 z-40 relative">
          <div className="flex items-center gap-6">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.05] hover:border-primary-500/50 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
               <h1 className="text-2xl font-black font-outfit uppercase tracking-tight hidden md:block">
                 {sidebarItems.find(i => i.path === location.pathname)?.label || 'Console'}
               </h1>
               <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-1">System Node: Alpha-01</div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="relative p-3 text-gray-500 hover:text-white transition-colors group">
              <Bell className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary-500 rounded-full border-2 border-[#030303]"></span>
            </button>
            
            <div className="flex items-center gap-4 pl-8 border-l border-white/[0.05]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black uppercase tracking-widest">Juan Dela Cruz</p>
                <p className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em] mt-1">Enterprise Plan</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group cursor-pointer hover:border-primary-500/50 transition-all p-1">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-primary-500 to-orange-400 flex items-center justify-center">
                   <UserIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

