import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  Bot,
  LineChart,
  Box,
  Image as ImageIcon,
  QrCode,
  Cpu,
  Layers
} from 'lucide-react';

const modules = [
  { icon: Bot, title: 'AI Assistant', desc: 'AI chat and automated help', path: '/dashboard/ai-assistant', color: 'text-blue-400', bg: 'bg-blue-400/5', status: 'Ready' },
  { icon: LineChart, title: 'Forecasting', desc: 'Predictive analytics & trend modeling', path: '/dashboard/forecasting', color: 'text-emerald-400', bg: 'bg-emerald-400/5', status: 'Ready' },
  { icon: Box, title: '3D Studio', desc: 'Spatial asset viewer & editor', path: '/dashboard/3d-manipulation', color: 'text-orange-400', bg: 'bg-orange-400/5', status: 'Ready' },
  { icon: ImageIcon, title: 'Image Recognition', desc: 'CND image recognition', path: '/dashboard/image-recognition', color: 'text-purple-400', bg: 'bg-purple-400/5', status: 'Ready' },
  { icon: QrCode, title: 'QR Engine', desc: 'Smart redirect code system', path: '/dashboard/qr-codes', color: 'text-pink-400', bg: 'bg-pink-400/5', status: 'Ready' },
  { icon: Cpu, title: 'Custom Logic', desc: 'Customized features and logic', path: '#', color: 'text-gray-500', bg: 'bg-white/5', status: 'Coming Soon' },
];

const API_URL = import.meta.env.VITE_API_URL;

const DashboardHome = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const displayName = user?.nickname || user?.name || 'User';

  useEffect(() => {
    if (user && ['admin', 'superadmin'].includes(user.role)) {
      navigate('/dashboard/admin/overview', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black font-outfit uppercase tracking-tight">Welcome, {displayName}.</h2>
        </div>
      </div>

      {/* Service Status */}
      <div className="glass-card p-8 !rounded-[2rem] border-white/[0.03] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-transparent -z-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-primary-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Account Type</p>
              <h4 className="text-2xl font-black font-outfit uppercase tracking-tight">CND Client</h4>
            </div>
            <div className="px-3 py-1.5 bg-emerald-400 text-black text-[9px] font-black rounded-lg uppercase tracking-widest">Active</div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">Platform</span>
              <span className="text-xs font-black uppercase tracking-tight">CND Upraze</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">Support</span>
              <span className="text-xs font-black uppercase tracking-tight text-emerald-400">Available</span>
            </div>
            <Link to="/dashboard/billing" className="btn-primary !py-3 !px-8 !text-[10px] !font-black !uppercase !tracking-[0.2em] !rounded-xl">View Packages</Link>
            <Link to="/dashboard/support" className="glass-card !py-3 !px-6 !rounded-xl text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-white transition-colors flex items-center gap-2 border-primary-500/20">
              <Zap className="w-3 h-3" /> Inquire
            </Link>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <Layers className="w-4 h-4" /> Available Modules
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, idx) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.08 }}
            >
              <Link
                to={mod.path}
                className={`glass-card p-8 !rounded-[2rem] flex flex-col border-white/[0.03] hover:border-primary-500/20 transition-all duration-500 group h-full relative overflow-hidden ${mod.status !== 'Ready' ? 'pointer-events-none opacity-60' : ''}`}
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/[0.02] blur-3xl group-hover:bg-primary-500/[0.05] transition-all duration-700" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl ${mod.bg} border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <mod.icon className={`w-6 h-6 ${mod.color}`} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-lg border ${
                    mod.status === 'Ready' 
                      ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10' 
                      : 'text-gray-500 bg-gray-500/5 border-gray-500/10'
                  }`}>
                    {mod.status}
                  </span>
                </div>

                <h4 className="text-xl font-black font-outfit tracking-tight uppercase mb-2">{mod.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed mb-6 flex-1">{mod.desc}</p>

                <div className={`flex items-center justify-between w-full p-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  mod.status === 'Ready'
                    ? 'bg-white/[0.03] text-gray-400 border border-white/[0.05] group-hover:bg-primary-500 group-hover:text-white group-hover:border-primary-500/30'
                    : 'bg-white/[0.01] text-gray-600 border border-white/[0.02]'
                }`}>
                  <span>Launch</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
