import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';

const stats = [
  { label: 'System Throughput', value: '1.2M', change: '+12.5%', isUp: true, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/5' },
  { label: 'Active Compute', value: '45.2k', change: '+5.2%', isUp: true, icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-400/5' },
  { label: 'Database Load', value: '12%', change: '-2%', isUp: false, icon: Database, color: 'text-primary-500', bg: 'bg-primary-500/5' },
];

const DashboardHome = () => {
  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            <Sparkles className="w-4 h-4" /> System Operational
          </div>
          <h2 className="text-5xl font-black font-outfit uppercase tracking-tight">Welcome, Admin.</h2>
          <p className="text-gray-500 text-lg mt-2 font-medium">Node Alpha-01 status: <span className="text-emerald-400">Optimal Performance</span></p>
        </div>
        <div className="flex gap-4">
           <div className="glass-card px-6 py-3 flex items-center gap-3 !rounded-2xl border-white/[0.03]">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Uptime: 142h 12m</span>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-10 !rounded-[2.5rem] relative overflow-hidden group hover:border-primary-500/20 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
               <stat.icon className="w-24 h-24" />
            </div>
            <div className="flex justify-between items-start mb-10">
              <div className={`p-4 ${stat.bg} rounded-2xl border border-white/[0.05] ${stat.color} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-emerald-400 bg-emerald-400/5' : 'text-red-400 bg-red-400/5'}`}>
                {stat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-5xl font-black font-outfit tracking-tighter group-hover:text-white transition-colors">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Activity */}
        <div className="glass-card p-10 !rounded-[2.5rem] border-white/[0.03]">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-2xl font-black font-outfit uppercase tracking-tight">Recent Logs</h3>
             <button className="text-[10px] font-black uppercase tracking-widest text-primary-500 hover:text-white transition-colors">Export .LOG</button>
          </div>
          <div className="space-y-4">
            {[
              { t: 'Neural flow analysis completed', d: 'Job #F-29402 • 2m ago', icon: <Zap className="text-blue-400" /> },
              { t: 'Cluster expansion successful', d: 'Node #C-12 • 1h ago', icon: <Database className="text-emerald-400" /> },
              { t: 'System audit performed', d: 'Admin ID: 092 • 4h ago', icon: <ShieldAlert className="w-5 h-5 text-purple-400" /> }
            ].map((act, i) => (
              <div key={i} className="flex items-center gap-6 p-6 hover:bg-white/[0.02] rounded-3xl transition-all group cursor-pointer border border-transparent hover:border-white/[0.05]">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                   {act.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-tight group-hover:text-primary-500 transition-colors">{act.t}</p>
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">{act.d}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-primary-500 transition-colors" />
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors border-t border-white/[0.05]">View All System Activity</button>
        </div>

        {/* Feature Highlights */}
        <div className="glass-card p-10 !rounded-[2.5rem] border-white/[0.03] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-transparent -z-10" />
          <h3 className="text-2xl font-black font-outfit uppercase tracking-tight mb-10">Active Protocol</h3>
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-10 relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 blur-[60px] rounded-full group-hover:bg-primary-500/20 transition-all duration-700" />
             <div className="flex justify-between items-start mb-10">
                <div>
                   <p className="text-primary-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Current Tier</p>
                   <h4 className="text-4xl font-black font-outfit uppercase tracking-tight">Enterprise Pro</h4>
                </div>
                <div className="px-4 py-2 bg-emerald-400 text-black text-[10px] font-black rounded-xl uppercase tracking-widest">Active Node</div>
             </div>
             <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center pb-6 border-b border-white/[0.05]">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Next Audit</span>
                   <span className="text-sm font-black uppercase tracking-tight">May 16, 2026</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Compute Cost</span>
                   <span className="text-sm font-black uppercase tracking-tight text-emerald-400">₱1,249.00/MO</span>
                </div>
             </div>
             <button className="btn-primary w-full !py-5 !text-[10px] !font-black !uppercase !tracking-[0.3em] !rounded-2xl shadow-2xl shadow-primary-500/20">Manage Infrastructure</button>
          </div>
          
          <div className="mt-10 flex items-center gap-4 p-6 bg-white/[0.01] rounded-2xl border border-white/[0.03]">
             <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-500" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex-1">Accelerate your workflow with <span className="text-white">Turbo Mode</span></p>
             <button className="text-[10px] font-black uppercase tracking-widest text-primary-500">Enable</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

