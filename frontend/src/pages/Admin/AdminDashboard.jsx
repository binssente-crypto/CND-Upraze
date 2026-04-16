import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Database, TrendingUp, Search, Filter, ShieldCheck } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Juan Dela Cruz', email: 'juan@upraze.com', plan: 'Growth', status: 'Active', joined: 'Mar 12, 2026' },
  { id: 2, name: 'Maria Santos', email: 'maria@corp.ph', plan: 'Enterprise', status: 'Active', joined: 'Feb 28, 2026' },
  { id: 3, name: 'Liam Wilson', email: 'liam@startup.io', plan: 'Starter', status: 'Canceled', joined: 'Apr 01, 2026' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
               <ShieldCheck className="w-8 h-8 text-primary-500" /> Admin Control Center
            </h2>
            <p className="text-gray-500 mt-1">Platform-wide overview and user management</p>
         </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Total Revenue', value: '₱2.4M', icon: DollarSign, color: 'text-green-400' },
           { label: 'Active Subscriptions', value: '1,842', icon: Users, color: 'text-primary-500' },
           { label: 'API Health', value: '99.9%', icon: Activity, color: 'text-blue-400' },
           { label: 'DB Size', value: '12.4 GB', icon: Database, color: 'text-purple-400' },
         ].map((stat, i) => (
           <div key={i} className="glass-card p-6">
              <div className="flex justify-between mb-4">
                 <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">Global</div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <h4 className="text-2xl font-bold">{stat.value}</h4>
           </div>
         ))}
      </div>

      {/* User Management Table */}
      <div className="glass-card overflow-hidden">
         <div className="p-6 border-b border-dark-border flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-lg">User Directory</h3>
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input type="text" className="input-field pl-10 py-2 h-10 text-sm" placeholder="Search email..." />
               </div>
               <button className="p-2 border border-dark-border rounded-lg text-gray-400 hover:text-white transition-colors"><Filter className="w-5 h-5" /></button>
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-white/5 text-xs text-gray-500 uppercase font-bold tracking-widest">
                  <tr>
                     <th className="px-8 py-4">User</th>
                     <th className="px-8 py-4">Plan</th>
                     <th className="px-8 py-4">Status</th>
                     <th className="px-8 py-4">Joined</th>
                     <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-dark-border">
                  {mockUsers.map((user) => (
                     <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                           <p className="font-medium">{user.name}</p>
                           <p className="text-xs text-gray-500">{user.email}</p>
                        </td>
                        <td className="px-8 py-6">
                           <span className="px-2 py-1 bg-white/5 border border-dark-border rounded text-xs">{user.plan}</span>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                              <span className="text-sm">{user.status}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-400">{user.joined}</td>
                        <td className="px-8 py-6 text-right">
                           <button className="text-xs font-bold text-primary-500 hover:text-primary-400 transition-colors">Manage User</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

// Activity component used in stats
const Activity = ({className}) => (
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
   </svg>
)

export default AdminDashboard;
