import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  MessageSquare,
  Activity,
  Calendar,
  Globe
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem('auth_token');

const COLORS = ['#e67e22', '#3b82f6', '#10b981', '#a855f7', '#f43f5e'];

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/overview`, {
        headers: { 
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Decrypting Metrics...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Revenue',
      value: `₱${parseFloat(data?.stats?.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      badge: 'GLOBAL'
    },
    {
      label: 'Registered Users',
      value: data?.stats?.total_users || 0,
      icon: Users,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      badge: 'GLOBAL'
    },
    {
      label: 'Open Inquiries',
      value: data?.stats?.open_tickets || 0,
      icon: MessageSquare,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      badge: 'SUPPORT'
    },
    {
      label: 'Active Admins',
      value: data?.stats?.total_admins || 0,
      icon: ShieldCheck,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      badge: 'SYSTEM'
    }
  ];

  const chartData = data?.sales_chart?.length > 0 ? data.sales_chart : [
    { month: 'Jan', total: 0 },
    { month: 'Feb', total: 0 },
    { month: 'Mar', total: 0 },
    { month: 'Apr', total: 0 },
    { month: 'May', total: 0 },
    { month: 'Jun', total: 0 }
  ];

  const pieData = data?.plan_distribution?.length > 0 ? data.plan_distribution : [
    { name: 'No Active Plans', value: 1 }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 !rounded-[2rem] relative overflow-hidden group border-white/[0.03] hover:border-white/10 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl ${s.bg} border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                <Globe className="w-3 h-3" /> {s.badge}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">{s.label}</p>
              <h3 className="text-3xl font-black font-outfit tracking-tight uppercase text-gray-100">{s.value}</h3>
            </div>
            
            {/* Subtle background glow */}
            <div className={`absolute -bottom-10 -right-10 w-24 h-24 ${s.bg} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 !rounded-[2.5rem] border-white/[0.03]">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black font-outfit uppercase tracking-tight text-white">Revenue Trajectory</h3>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 rounded-full bg-[#e67e22]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Sales (PHP)</span>
            </div>
          </div>
          
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e67e22" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e67e22" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
                  tickFormatter={(val) => `₱${val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #ffffff10', 
                    borderRadius: '16px',
                    fontSize: '10px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#e67e22' }}
                  formatter={(val) => [`₱${val.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  name="Monthly Sales"
                  type="monotone" 
                  dataKey="total" 
                  stroke="#e67e22" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-10 !rounded-[2.5rem] border-white/[0.03]">
           <h3 className="text-2xl font-black font-outfit uppercase tracking-tight text-white mb-10">Market Share</h3>
           <div className="h-[350px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   innerRadius={80}
                   outerRadius={120}
                   paddingAngle={5}
                   dataKey="value"
                   animationDuration={2000}
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0a0a0a', 
                      border: '1px solid #ffffff10', 
                      borderRadius: '16px',
                      fontSize: '10px',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: '#fff'
                    }}
                 />
                 <Legend verticalAlign="bottom" height={36}/>
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="mt-8 space-y-4">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-white">{item.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
