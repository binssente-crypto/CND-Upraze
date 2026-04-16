import React from 'react';
import { motion } from 'framer-motion';
import { Users, CreditCard, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
  { label: 'Total Scans', value: '1,284', change: '+12.5%', isUp: true, icon: Activity },
  { label: 'AI Tokens Used', value: '45.2k', change: '+5.2%', isUp: true, icon: Users },
  { label: 'Active Tasks', value: '12', change: '-2', isUp: false, icon: CreditCard },
];

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome Back, Juan! 👋</h2>
        <p className="text-gray-400">Here's what is happening with your business tools today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-500/10 rounded-xl text-primary-500">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.isUp ? 'text-primary-500' : 'text-red-400'}`}>
                {stat.isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6">Recent AI Interactions</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-dark-border">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold">
                  JS
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:text-primary-400 transition-colors">Forecasting analysis completed for Monthly_Sales.csv</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago • Job #F-29402</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 text-sm font-medium text-gray-400 hover:text-white transition-colors border-t border-dark-border">View All Activity</button>
        </div>

        {/* Feature Highlights */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6">Active Subscriptions</h3>
          <div className="bg-primary-600/5 border border-primary-500/20 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
                <div>
                   <p className="text-primary-400 text-sm font-medium">Current Plan</p>
                   <h4 className="text-2xl font-bold">Growth Pro</h4>
                </div>
                <div className="px-3 py-1 bg-primary-500 text-dark-bg text-xs font-bold rounded-full uppercase">Active</div>
             </div>
             <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between">
                   <span className="text-gray-400">Next Billing</span>
                   <span>May 16, 2026</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-gray-400">Monthly Cost</span>
                   <span>₱999.00</span>
                </div>
             </div>
             <button className="btn-primary w-full">Manage Billing</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
