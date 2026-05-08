import React, { useState } from 'react';
import { LineChart, Bot, ArrowUpRight, Zap, TrendingUp, BarChart3, Info, List, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const scenarios = {
  steady: {
    name: 'Example 1: Steady Growth',
    data: [
      { name: 'Jan 2026', Actual: 142, Predicted: 138, Revenue: '₱63,900', Profit: '₱39,618' },
      { name: 'Feb 2026', Actual: 156, Predicted: 152, Revenue: '₱70,200', Profit: '₱43,524' },
      { name: 'Mar 2026', Actual: 171, Predicted: 168, Revenue: '₱76,950', Profit: '₱47,709' },
      { name: 'Apr 2026', Actual: null, Predicted: 185, Revenue: '₱83,250', Profit: '₱51,615' },
      { name: 'May 2026', Actual: null, Predicted: 203, Revenue: '₱91,350', Profit: '₱56,637' },
      { name: 'Jun 2026', Actual: null, Predicted: 224, Revenue: '₱100,800', Profit: '₱62,720' },
    ],
    metrics: {
      accuracy: '96.4%',
      growth_trend: '+28.4%',
      max_peak: '224 Units',
      outlier_risk: 'Low',
      insight: 'The dataset reveals a consistent upward trajectory in unit sales over the observed period. Our model projects this trend to continue through Q2 2026, with predicted peak demand reaching 224 units by June. Financial health indicators remain strong with no significant outlier risks detected.',
      financials: {
        predicted_revenue: '₱100,800.00',
        predicted_profit: '₱62,720.00',
        margin: '62%',
      },
    }
  },
  volatile: {
    name: 'Example 2: Market Volatility',
    data: [
      { name: 'Jan 2026', Actual: 142, Predicted: 140, Revenue: '₱63,900', Profit: '₱39,618' },
      { name: 'Feb 2026', Actual: 198, Predicted: 158, Revenue: '₱89,100', Profit: '₱55,242' },
      { name: 'Mar 2026', Actual: 152, Predicted: 175, Revenue: '₱68,400', Profit: '₱42,408' },
      { name: 'Apr 2026', Actual: null, Predicted: 160, Revenue: '₱72,000', Profit: '₱44,640' },
      { name: 'May 2026', Actual: null, Predicted: 210, Revenue: '₱94,500', Profit: '₱58,590' },
      { name: 'Jun 2026', Actual: null, Predicted: 130, Revenue: '₱58,500', Profit: '₱36,270' },
    ],
    metrics: {
      accuracy: '84.2%',
      growth_trend: '+12.1%',
      max_peak: '210 Units',
      outlier_risk: 'High',
      insight: 'WARNING: Unusual volatility detected in February actuals. The model predicts erratic demand patterns for Q2. Outlier risk has spiked to HIGH due to inconsistent historical signals. We recommend maintaining a safety stock buffer of 25% and deferring aggressive expansion until the variance stabilizes.',
      financials: {
        predicted_revenue: '₱58,500.00',
        predicted_profit: '₱36,270.00',
        margin: '62%',
      },
    }
  }
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-card border border-dark-border p-4 rounded-xl shadow-2xl">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-bold text-white">{entry.name}:</span>
            <span className="text-sm font-black text-gray-200">{entry.value ?? '—'}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Forecasting = () => {
  const [activeScenario, setActiveScenario] = useState('steady');
  const [isScanning, setIsScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  const scenario = scenarios[activeScenario];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsScanned(true);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* Demo Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/15 rounded-2xl"
      >
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-blue-300 font-bold">Simulation Mode</p>
          <p className="text-xs text-gray-500">Toggle between datasets to observe how the AI adapts its executive insights to different market conditions.</p>
        </div>
      </motion.div>

      {/* Header / Tabs */}
      <div className="flex justify-center">
        <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
          <button 
            onClick={() => { setActiveScenario('steady'); setIsScanned(false); }}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeScenario === 'steady' 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Example 1: Steady Growth
          </button>
          <button 
            onClick={() => { setActiveScenario('volatile'); setIsScanned(false); }}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeScenario === 'volatile' 
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Example 2: Market Volatility
          </button>
        </div>
      </div>

      {/* Raw Data Table (Full Width) */}
      <motion.div 
        key={activeScenario}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card !rounded-[2rem] overflow-hidden"
      >
        <div className="p-6 border-b border-dark-border bg-white/[0.02]">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <List className="w-4 h-4 text-primary-500" /> Source Data Registry ({scenario.name})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.05]">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Period</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Actual Units</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Predicted</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Revenue</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Est. Profit</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {scenario.data.map((row, i) => {
                return (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-4">
                      <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{row.name}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-black font-outfit">{row.Actual || '—'}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-black font-outfit text-gray-500">{row.Predicted}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-black font-outfit text-emerald-400">{row.Revenue}</span>
                    </td>
                    <td className="px-8 py-4">
                      <span className="text-sm font-black font-outfit text-blue-400">{row.Profit}</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        row.Actual ? 'bg-emerald-400/10 text-emerald-400' : 'bg-primary-500/10 text-primary-500'
                      }`}>
                        {row.Actual ? 'Verified' : 'Projected'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 !rounded-[2rem]">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-500" /> Quick Metrics
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Model Accuracy', value: scenario.metrics.accuracy, color: parseInt(scenario.metrics.accuracy) > 90 ? 'text-emerald-400' : 'text-amber-400' },
                { label: 'Growth Trend', value: scenario.metrics.growth_trend, color: 'text-emerald-400' },
                { label: 'Predicted Peak', value: scenario.metrics.max_peak, color: 'text-white' },
                { label: 'Outlier Risk', value: scenario.metrics.outlier_risk, color: scenario.metrics.outlier_risk === 'Low' ? 'text-blue-400' : 'text-red-400' },
              ].map((m, i) => (
                <motion.div
                  key={`${activeScenario}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary-500/30 transition-colors"
                >
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">{m.label}</p>
                  <p className={`text-xl font-black font-outfit ${m.color}`}>{m.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visual Intelligence Integration */}
          <div className="glass-card p-8 !rounded-[2rem] border-primary-500/10 bg-primary-500/[0.01]">
            <h3 className="text-sm font-black uppercase tracking-widest text-primary-500 mb-6 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Visual Intelligence
            </h3>
            <button 
              onClick={handleScan}
              disabled={isScanning || isScanned}
              className={`w-full p-6 bg-white/5 rounded-2xl border border-white/5 border-dashed flex flex-col items-center justify-center text-center group hover:border-primary-500/30 transition-all cursor-pointer ${
                (isScanning || isScanned) ? 'cursor-default opacity-80' : ''
              }`}
            >
               <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {isScanning ? (
                    <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                  ) : isScanned ? (
                    <List className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Bot className="w-6 h-6 text-primary-500" />
                  )}
               </div>
               <p className="text-xs font-black uppercase tracking-widest mb-1">
                 {isScanning ? 'Processing...' : isScanned ? 'Scan Complete' : 'Scan Document'}
               </p>
               <p className="text-[10px] text-gray-500 leading-tight">
                 {isScanned ? 'Neural extraction complete. Predictive engine synchronized.' : 'AI-powered visual auditing for automated forecast synchronization'}
               </p>
            </button>
          </div>
        </div>

        {/* Chart Panel */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-0 flex flex-col !rounded-[2rem] overflow-hidden relative">
            <div className="p-6 border-b border-dark-border bg-white/[0.02] flex justify-between items-center z-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <LineChart className="w-4 h-4 text-primary-500" /> Forecast Projection
              </h3>
              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${
                parseInt(scenario.metrics.accuracy) > 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                Confidence: {scenario.metrics.accuracy}
              </span>
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center relative min-h-[400px]">
              <motion.div 
                key={activeScenario}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="w-full h-full space-y-8 flex flex-col"
              >
                {/* Chart */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scenario.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="Actual" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                      <Area type="monotone" dataKey="Predicted" stroke="#f97316" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Financial Projections */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] relative overflow-hidden group hover:bg-emerald-500/10 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <Zap className="w-12 h-12 text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-emerald-500/60 uppercase font-black tracking-widest mb-2">Est. Monthly Revenue</p>
                    <p className="text-3xl font-black font-outfit text-emerald-400">{scenario.metrics.financials.predicted_revenue}</p>
                    <p className="text-[10px] text-emerald-500/40 uppercase font-black mt-2 tracking-widest">Based on projected demand</p>
                  </div>
                  <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[1.5rem] relative overflow-hidden group hover:bg-blue-500/10 transition-all">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-12 h-12 text-blue-400" />
                    </div>
                    <p className="text-[10px] text-blue-500/60 uppercase font-black tracking-widest mb-2">Net Profit Forecast</p>
                    <p className="text-3xl font-black font-outfit text-blue-400">{scenario.metrics.financials.predicted_profit}</p>
                    <p className="text-[10px] text-blue-500/40 uppercase font-black mt-2 tracking-widest">Average Margin: {scenario.metrics.financials.margin}</p>
                  </div>
                </motion.div>

                {/* AI Insight Panel */}
                <AnimatePresence mode="wait">
                  {isScanned && (
                    <motion.div 
                      key={activeScenario}
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      className={`p-6 bg-gradient-to-r ${activeScenario === 'steady' ? 'from-primary-900/20' : 'from-red-900/20'} to-transparent border ${activeScenario === 'steady' ? 'border-primary-500/20' : 'border-red-500/20'} rounded-2xl relative overflow-hidden shrink-0 mt-4`}
                    >
                      <div className={`absolute top-0 right-0 w-32 h-32 ${activeScenario === 'steady' ? 'bg-primary-500/10' : 'bg-red-500/10'} blur-[40px] rounded-full pointer-events-none`} />
                      <div className="flex gap-5">
                        <div className={`w-12 h-12 rounded-2xl ${activeScenario === 'steady' ? 'bg-primary-500/20 border-primary-500/30 shadow-primary-500/20' : 'bg-red-500/20 border-red-500/30 shadow-red-500/20'} border flex items-center justify-center shrink-0 shadow-lg`}>
                          <Bot className={`w-6 h-6 ${activeScenario === 'steady' ? 'text-primary-500' : 'text-red-500'}`} />
                        </div>
                        <div>
                          <h4 className={`text-xs font-black uppercase tracking-widest ${activeScenario === 'steady' ? 'text-primary-500' : 'text-red-500'} mb-2 flex items-center gap-2`}>
                            <Zap className="w-3 h-3" /> Executive AI Insight
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed font-medium">
                            {scenario.metrics.insight}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
