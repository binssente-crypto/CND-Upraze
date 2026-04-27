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
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const modules = [
  { 
    id: 'ai-assistant',
    icon: Bot, 
    title: 'AI Assistant', 
    desc: 'Intelligent automation and decision support powered by advanced LLMs.', 
    path: '/dashboard/ai-assistant',
    color: 'from-blue-500 to-indigo-600',
    status: 'Ready'
  },
  { 
    id: 'forecasting',
    icon: LineChart, 
    title: 'Data Forecasting', 
    desc: 'Predictive analytics to visualize future trends and business metrics.', 
    path: '/dashboard/forecasting',
    color: 'from-emerald-500 to-teal-600',
    status: 'Ready'
  },
  { 
    id: '3d-manipulation',
    icon: Box, 
    title: '3D Manipulation', 
    desc: 'Interactive 3D model viewer and editor for spatial data visualization.', 
    path: '/dashboard/3d-manipulation',
    color: 'from-orange-500 to-red-600',
    status: 'Ready'
  },
  { 
    id: 'image-recognition',
    icon: ImageIcon, 
    title: 'Image Recognition', 
    desc: 'Identify and categorize visual assets using computer vision.', 
    path: '/dashboard/image-recognition',
    color: 'from-purple-500 to-pink-600',
    status: 'Ready'
  },
  { 
    id: 'qr-codes',
    icon: QrCode, 
    title: 'QR Code Engine', 
    desc: 'Generate, manage, and track engagement for custom QR solutions.', 
    path: '/dashboard/qr-codes',
    color: 'from-yellow-500 to-orange-600',
    status: 'Ready'
  },
  { 
    id: 'custom-dev',
    icon: Zap, 
    title: 'Custom Logic', 
    desc: 'Build and deploy custom business logic tailored to your workflow.', 
    path: '#',
    color: 'from-gray-600 to-gray-800',
    status: 'Coming Soon'
  }
];

const Modules = () => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Available Modules</h2>
          <p className="text-gray-500 text-lg">Explore and launch your integrated business tools.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search modules..." 
              className="input-field pl-10 py-3 h-12 w-64 bg-dark-bg/50 backdrop-blur-sm border-dark-border/50"
            />
          </div>
          <button className="p-3 bg-dark-card border border-dark-border rounded-xl hover:text-primary-500 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {modules.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
            className="group relative h-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 blur-2xl -z-10 rounded-3xl" />
            
            <div className="glass-card h-full p-8 flex flex-col border-dark-border/40 group-hover:border-primary-500/30 transition-colors overflow-hidden relative">
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  mod.status === 'Ready' 
                    ? 'text-primary-500 bg-primary-500/10 border-primary-500/20' 
                    : 'text-gray-500 bg-gray-500/10 border-gray-500/20'
                }`}>
                  {mod.status}
                </span>
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mod.color} p-4 mb-8 shadow-lg group-hover:scale-110`}>
                <mod.icon className="w-full h-full text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold mb-4 text-gray-100">{mod.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-1">
                {mod.desc}
              </p>

              {/* Action */}
              <Link 
                to={mod.path}
                className={`flex items-center justify-between w-full p-4 rounded-xl font-bold text-sm transition-all ${
                  mod.status === 'Ready'
                    ? 'bg-white/5 text-gray-200 group-hover:bg-primary-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(230,126,34,0.3)]'
                    : 'bg-white/5 text-gray-600 cursor-not-allowed'
                }`}
              >
                <span>Launch Module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upgrade Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="relative rounded-3xl overflow-hidden mt-16 p-12 bg-[#1a1a1a] border border-dark-border/60"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-600/20 to-transparent -z-10" />
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-primary-500 font-black text-xs uppercase tracking-[0.2em] mb-4">
             <Sparkles className="w-4 h-4" /> Power Your Workflow
          </div>
          <h3 className="text-3xl font-bold mb-4">Need a custom module for your unique business logic?</h3>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Our engineering team can build bespoke integrations and automated workflows specifically for your company's data architecture.
          </p>
          <div className="flex gap-4">
             <button className="btn-primary px-8">Contact Engineering</button>
             <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Modules;
