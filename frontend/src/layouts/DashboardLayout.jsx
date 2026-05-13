import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Users,
  Tag,
  ChevronDown,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo';
import NicknameModal from '../components/NicknameModal';

import ProfileModal from '../components/ProfileModal';

const userSidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
  { icon: FileText, label: 'Plan Overview', path: '/dashboard/plan-overview' },
  { 
    icon: LayoutGrid, 
    label: 'Modules', 
    id: 'modules',
    subItems: [
      { icon: Bot, label: 'AI Assistant', path: '/dashboard/ai-assistant' },
      { icon: LineChart, label: 'Forecasting', path: '/dashboard/forecasting' },
      { icon: Box, label: '3D Manipulation', path: '/dashboard/3d-manipulation' },
      { icon: ImageIcon, label: 'Image Recognition', path: '/dashboard/image-recognition' },
      { icon: QrCode, label: 'QR Codes', path: '/dashboard/qr-codes' },
    ]
  }
];

const adminSidebarItems = [
  { icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin/overview' },
  { icon: Users, label: 'User Directory', path: '/dashboard/admin/users' },
  { icon: Headphones, label: 'Support Control', path: '/dashboard/admin/inquiries' },
  { icon: Tag, label: 'Offer Management', path: '/dashboard/admin/offers' },
  { icon: FileText, label: 'Orders', path: '/dashboard/admin/orders' },
];

const API_URL = import.meta.env.VITE_API_URL;

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdmin = ['admin', 'superadmin'].includes(user?.role);
  const currentSidebarItems = isAdmin ? adminSidebarItems : userSidebarItems;

  useEffect(() => {
    // Auto-expand modules if we're on a sub-item page
    if (!isAdmin) {
      const isModulePath = userSidebarItems.some(
        item => item.subItems && item.subItems.some(sub => location.pathname === sub.path)
      );
      if (isModulePath) {
        setExpandedMenus(prev => ({ ...prev, modules: true }));
      }
    }
  }, [location.pathname, isAdmin]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setAuthLoading(false);
      return;
    }
    fetch(`${API_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user);
          if (data.unread_support_count !== undefined) {
             setUnreadSupportCount(data.unread_support_count);
          }
          if (!data.user.nickname) setShowNicknameModal(true);
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) {
    return (
      <div className="h-screen bg-[#030303] flex flex-col items-center justify-center gap-4">
        <Logo className="h-12 animate-pulse" />
        <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-full h-full bg-primary-500"
          />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Synchronizing Identity...</p>
      </div>
    );
  }

  const handleNicknameComplete = (updatedUser) => {
    setUser(updatedUser);
    setShowNicknameModal(false);
  };

  const confirmLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_nickname');
    navigate('/');
  };

  const displayName = user?.nickname || user?.name || 'User';

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  return (
    <>
    <div className="flex h-screen bg-[#030303] text-gray-100 overflow-hidden font-inter">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 bg-white/[0.01] border-r border-white/[0.05] flex flex-col z-50 backdrop-blur-3xl"
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



            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
              <div className="px-4 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Main Menu</div>
              {currentSidebarItems.map((item) => {
                if (item.subItems) {
                  const isExpanded = expandedMenus[item.id];
                  const isChildActive = item.subItems.some(subItem => location.pathname === subItem.path);
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                          isChildActive && !isExpanded
                            ? 'bg-white/[0.03] text-white'
                            : 'text-gray-500 hover:bg-white/[0.03] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-5 h-5 ${isChildActive ? 'text-white' : 'group-hover:text-primary-500'}`} />
                          <span className={`text-[11px] font-black uppercase tracking-widest ${isChildActive ? 'text-white' : ''}`}>{item.label}</span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pr-2 py-1 space-y-1 border-l-2 border-white/[0.05] ml-6 mt-1">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.path}
                                  to={subItem.path}
                                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                                    location.pathname === subItem.path
                                      ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20'
                                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <subItem.icon className={`w-4 h-4 ${location.pathname === subItem.path ? 'text-white' : 'group-hover:text-primary-500'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{subItem.label}</span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
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
                  </Link>
                );
              })}
            </nav>

            {!isAdmin && (
              <div className="p-6 mt-auto border-t border-white/[0.05] space-y-1">
                <div className="px-4 mb-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">System</div>
                <Link 
                  to="/dashboard/support" 
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                    location.pathname === '/dashboard/support'
                      ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Headphones className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Support Center</span>
                  </div>
                  {unreadSupportCount > 0 && (
                    <div className="bg-primary-500 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-lg shadow-primary-500/20">
                      {unreadSupportCount > 9 ? '9+' : unreadSupportCount}
                    </div>
                  )}
                </Link>
                <Link 
                  to="/dashboard/billing" 
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                    location.pathname === '/dashboard/billing'
                      ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20'
                      : 'text-gray-500 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Service Packages</span>
                </Link>
              </div>
            )}

            <div className="p-6 mt-auto border-t border-white/[0.05]">
              <button 
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-[11px] font-black uppercase tracking-widest">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-grid">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        {/* Header */}
        <header className="h-20 border-b border-white/[0.05] flex items-center justify-between px-8 z-40 relative">
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
                 {currentSidebarItems.find(i => i.path === location.pathname)?.label || 
                  (location.pathname === '/dashboard/billing' ? 'Service Packages' : 
                   location.pathname === '/dashboard/support' ? 'Support Center' : 'Console')}
               </h1>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-4 pl-8 border-l border-white/[0.05] cursor-pointer group"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black uppercase tracking-widest group-hover:text-primary-500 transition-colors">{displayName}</p>
                <p className="text-[10px] text-primary-500 font-black uppercase tracking-[0.2em] mt-1">
                  {user?.role === 'superadmin' ? 'Superadmin' : user?.role === 'admin' ? 'Admin' : 'Active'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-primary-500/50 transition-all p-1">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-primary-500 to-orange-400 flex items-center justify-center">
                   <UserIcon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet context={{ user, setUser }} />
          </motion.div>
        </main>
      </div>
    </div>

      {/* Unskippable Nickname Modal */}
      {showNicknameModal && (
        <NicknameModal onComplete={handleNicknameComplete} />
      )}

      {/* Profile Management Modal */}
      <ProfileModal 
        user={user} 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)}
        onUpdate={(updatedUser) => setUser(updatedUser)}
      />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setShowLogoutModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="relative w-full max-w-sm glass-card p-8 shadow-2xl overflow-hidden text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <LogOut className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-black font-outfit uppercase tracking-tight mb-2">Confirm Logout</h3>
              <p className="text-xs text-gray-500 font-medium mb-8 leading-relaxed px-4">
                Are you sure you want to exit the CND Neural Ecosystem? You will need to re-verify your identity to return.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-4 bg-white/[0.03] border border-white/10 hover:bg-white/[0.05] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  Stay
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-500/20"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardLayout;

