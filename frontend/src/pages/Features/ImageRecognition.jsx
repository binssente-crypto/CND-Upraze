import React, { useState } from 'react';
import { CheckCircle, List, Info, Eye, Tag, Zap, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const scenarios = {
  office: {
    name: 'Example 1: Modern Office',
    image: '/nv_example1.jpg',
    results: [
      { label: 'Primary Object', value: 'Corporate Workspace', conf: 0.98 },
      { label: 'Category', value: 'Architecture / Interior', conf: 0.95 },
      { label: 'Environment', value: 'Conference Room', conf: 0.92 },
      { label: 'Material', value: 'Glass / Wood / Metal', conf: 0.88 },
      { label: 'Color Dominant', value: 'Warm White / Oak', conf: 0.85 },
    ],
    labels: ['Modern Office', 'Meeting Room', 'Interior Design', 'Corporate', 'Workplace', 'Furniture']
  },
  sports: {
    name: 'Example 2: Sports Logistics',
    image: '/nv_example2.jpg',
    results: [
      { label: 'Primary Object', value: 'Sports Equipment', conf: 0.99 },
      { label: 'Category', value: 'Athletics / Recreation', conf: 0.96 },
      { label: 'Environment', value: 'Outdoor Turf', conf: 0.91 },
      { label: 'Object Count', value: '12+ Items Detected', conf: 0.89 },
      { label: 'Color Dominant', value: 'Lush Green / Multi', conf: 0.84 },
    ],
    labels: ['Sports', 'Logistics', 'Inventory', 'Athletics', 'Equipment', 'Outdoor', 'Recreation']
  }
};

const ImageRecognition = () => {
  const [activeScenario, setActiveScenario] = useState('office');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scenario = scenarios[activeScenario];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/15 rounded-2xl mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-blue-300 font-bold">Powered by CND Neural Vision Engine</p>
          <p className="text-xs text-gray-500">Advanced object detection and environmental auditing synchronized with your dashboard.</p>
        </div>
      </motion.div>

      <div className="flex justify-center mb-6">
        <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveScenario('office')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeScenario === 'office' 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Example 1: Office
          </button>
          <button 
            onClick={() => setActiveScenario('sports')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeScenario === 'sports' 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Example 2: Sports
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
          <motion.div 
            key={activeScenario}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsModalOpen(true)}
            className="relative w-full max-w-sm aspect-video rounded-3xl overflow-hidden border-4 border-primary-500/20 shadow-2xl mb-6 group cursor-zoom-in"
          >
            <img 
              src={scenario.image} 
              alt="Recognition Scene" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <motion.div className="absolute inset-0 border-2 border-primary-500/30 rounded-3xl"
              animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            <div className="absolute bottom-4 left-0 right-0 z-10">
               <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Neural Scan Active</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="p-3 bg-primary-500/20 backdrop-blur-md rounded-full border border-primary-500/30 shadow-lg shadow-primary-500/20">
                 <Eye className="w-6 h-6 text-white" />
               </div>
            </div>
          </motion.div>
          <div className="w-full max-w-sm">
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 flex items-center gap-2 justify-center">
              <Tag className="w-3 h-3" /> Detected Labels
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {scenario.labels.map((label, i) => (
                <motion.span key={`${activeScenario}-${i}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className="px-3 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-lg text-xs font-bold text-primary-400">
                  {label}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-bold">Analysis Complete</span>
          </div>
        </div>

        <div className="glass-card flex flex-col p-0 overflow-hidden">
          <div className="p-6 bg-white/5 border-b border-dark-border flex justify-between items-center">
            <h3 className="font-bold text-lg flex items-center gap-2"><List className="w-5 h-5 text-primary-500" /> Recognition Results</h3>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">CND Neural Engine</span>
            </div>
          </div>
          <div className="flex-1 p-8 space-y-5">
            {scenario.results.map((res, i) => (
              <motion.div key={`${activeScenario}-${i}`} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 bg-dark-bg/60 border border-dark-border rounded-2xl relative group overflow-hidden hover:border-primary-500/20 transition-colors">
                <div className="absolute top-0 right-0 p-3"><CheckCircle className="w-5 h-5 text-primary-500 opacity-20 group-hover:opacity-100 transition-opacity" /></div>
                <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">{res.label}</p>
                <p className="text-xl font-bold">{res.value}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${res.conf * 100}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                      className="h-full bg-primary-500 shadow-[0_0_100px_rgba(34,197,94,0.05)] rounded-full" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500">{(res.conf * 100).toFixed(0)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-bg/95 backdrop-blur-xl cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full aspect-video rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl shadow-primary-500/20"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-all group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
              </button>
              <img 
                src={scenario.image} 
                alt="Enlarged View" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <h4 className="text-2xl font-black font-outfit text-white uppercase tracking-tight">{scenario.name}</h4>
                <p className="text-gray-400 font-medium mt-1">High-fidelity neural environmental scan</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageRecognition;
