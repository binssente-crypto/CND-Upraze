import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  LineChart, 
  Box, 
  Image as ImageIcon, 
  QrCode, 
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Search,
  Filter,
  Layers,
  Cpu,
  Globe,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
  { 
    id: 'ai-assistant',
    icon: Bot, 
    title: 'AI Assistant', 
    desc: 'Intelligent automation and decision support powered by advanced neural networks.', 
    path: '/dashboard/ai-assistant',
    color: 'text-blue-400',
    bg: 'bg-blue-400/5',
    status: 'Ready'
  },
  { 
    id: 'forecasting',
    icon: LineChart, 
    title: 'Forecasting', 
    desc: 'Predictive analytics to visualize future trends and business metrics with high precision.', 
    path: '/dashboard/forecasting',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/5',
    status: 'Ready'
  },
  { 
    id: '3d-manipulation',
    icon: Box, 
    title: '3D Studio', 
    desc: 'Interactive 3D model viewer and editor for spatial data and asset visualization.', 
    path: '/dashboard/3d-manipulation',
    color: 'text-orange-400',
    bg: 'bg-orange-400/5',
    status: 'Ready'
  },
  { 
    id: 'image-recognition',
    icon: ImageIcon, 
    title: 'Vision AI', 
    desc: 'Identify, categorize, and analyze visual assets using custom computer vision models.', 
    path: '/dashboard/image-recognition',
    color: 'text-purple-400',
    bg: 'bg-purple-400/5',
    status: 'Ready'
  },
  { 
    id: 'qr-codes',
    icon: QrCode, 
    title: 'QR Engine', 
    desc: 'Generate, manage, and track engagement for custom high-security QR solutions.', 
    path: '/dashboard/qr-codes',
    color: 'text-pink-400',
    bg: 'bg-pink-400/5',
    status: 'Ready'
  },
  { 
    id: 'custom-dev',
    icon: Cpu, 
    title: 'Custom Logic', 
    desc: 'Build and deploy bespoke business logic tailored to your specific enterprise workflow.', 
    path: '#',
    color: 'text-gray-500',
    bg: 'bg-white/5',
    status: 'In Audit'
  }
];

const Modules = () => {
  return (
    <div className="space-y-16 max-w-7xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            <Layers className="w-4 h-4" /> System Inventory
          </div>
          <h2 className="text-5xl font-black tracking-tight font-outfit uppercase">Available Modules</h2>
          <p className="text-gray-500 text-lg mt-2 font-medium">Explore and launch your integrated business infrastructure.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="SEARCH MODULES..." 
              className="w-80 bg-white/[0.03] border border-white/[0.05] rounded-2xl pl-12 pr-4 py-4 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary-500/30 transition-all"
            />
          </div>
          <button className="h-14 w-14 glass-card glass-card-hover flex items-center justify-center !rounded-2xl">
            <Filter className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {modules.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group h-full"
          >
            <div className={`glass-card p-12 flex flex-col !rounded-[3rem] border-white/[0.03] hover:border-primary-500/20 transition-all duration-500 relative overflow-hidden group h-full`}>
              {/* Subtle background glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/[0.02] blur-3xl group-hover:bg-primary-500/[0.05] transition-all duration-700" />
              
              {/* Badge */}
              <div className="flex justify-between items-start mb-12">
                <div className={`w-16 h-16 rounded-2xl ${mod.bg} border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  <mod.icon className={`w-8 h-8 ${mod.color}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border ${
                  mod.status === 'Ready' 
                    ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10' 
                    : 'text-gray-500 bg-gray-500/5 border-gray-500/10'
                }`}>
                  {mod.status}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-3xl font-black mb-4 font-outfit tracking-tighter uppercase">{mod.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-12 flex-1 font-medium">
                {mod.desc}
              </p>

              {/* Action */}
              <Link 
                to={mod.path}
                className={`flex items-center justify-between w-full p-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  mod.status === 'Ready'
                    ? 'bg-white/[0.03] text-gray-300 border border-white/[0.05] group-hover:bg-primary-500 group-hover:text-white group-hover:shadow-xl group-hover:shadow-primary-500/20 group-hover:border-primary-500/30'
                    : 'bg-white/[0.01] text-gray-600 border border-white/[0.02] cursor-not-allowed'
                }`}
              >
                <span>Launch Node</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upgrade Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-[3rem] overflow-hidden mt-16 p-16 glass-card border-white/[0.03] group"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/10 via-primary-500/5 to-transparent -z-10 group-hover:from-primary-500/20 transition-all duration-700" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-primary-500 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
             <Sparkles className="w-5 h-5" /> Protocol: Custom Logic
          </div>
          <h3 className="text-5xl font-black mb-8 font-outfit tracking-tight uppercase leading-[0.9]">Need a custom node for your business architecture?</h3>
          <p className="text-gray-500 mb-12 leading-relaxed text-xl font-medium">
            Our engineering team can deploy bespoke integrations and automated protocols specifically for your enterprise data landscape.
          </p>
          <div className="flex flex-wrap gap-8">
             <button className="btn-primary !px-12 !py-5 !text-[10px] !font-black !uppercase !tracking-widest !rounded-2xl">Contact Engineering</button>
             <button className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Documentation Library</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Modules;


