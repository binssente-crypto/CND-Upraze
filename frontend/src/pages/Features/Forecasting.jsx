import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, LineChart, Play, Bot, ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Forecasting = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, complete
  const [results, setResults] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/features/forecasting`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        // data.result_json contains the graph data
        
        // Format for Recharts
        const chartData = data.result_json.labels.map((label, idx) => ({
          name: label,
          Actual: data.result_json.actual[idx],
          Predicted: data.result_json.predicted[idx]
        }));

        setResults({
            ...data.result_json,
            chartData
        });
        setStatus('complete');
      } else {
        setStatus('idle');
        alert("Upload failed. Please ensure it's a valid CSV/XLSX file.");
      }
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert("Network error.");
    }
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-card border border-dark-border p-4 rounded-xl shadow-2xl">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
               <span className="text-sm font-bold text-white">{entry.name}:</span>
               <span className="text-sm font-black text-gray-200">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
         <h2 className="text-3xl font-black font-outfit uppercase tracking-tight">Predictive Analytics</h2>
         <p className="text-gray-500 font-medium mt-1 text-sm">Upload historical data to generate AI-driven forecasts and executive insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Panel */}
        <div className="lg:col-span-1 glass-card p-8 flex flex-col !rounded-[2rem]">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">Data Intake</h3>
          
          <div className="flex-1 border-2 border-dashed border-dark-border rounded-3xl flex flex-col items-center justify-center p-8 transition-colors hover:border-primary-500/50 group cursor-pointer bg-dark-bg/50">
            <input type="file" className="hidden" id="fileIn" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="fileIn" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-primary-500" />
              </div>
              <p className="font-bold text-center text-white">{file ? file.name : 'Upload Dataset'}</p>
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 mt-2">CSV or XLSX Format</p>
            </label>
          </div>

          <button 
            disabled={!file || status === 'uploading'}
            onClick={handleUpload}
            className="btn-primary w-full mt-8 py-5 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-black rounded-2xl shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none"
          >
            {status === 'idle' ? <><Play className="w-4 h-4" /> Run Prediction Model</> : status === 'uploading' ? 'Analyzing...' : 'Analysis Complete'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 glass-card p-0 flex flex-col !rounded-[2rem] overflow-hidden relative">
           <div className="p-6 border-b border-dark-border bg-white/[0.02] flex justify-between items-center z-10">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                 <LineChart className="w-4 h-4 text-primary-500" /> Forecast Projection
              </h3>
              {status === 'complete' && (
                 <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">
                    Confidence: {results?.accuracy}
                 </span>
              )}
           </div>
           
           <div className="flex-1 p-8 flex flex-col justify-center relative min-h-[400px]">
             {status === 'complete' && results ? (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full h-full space-y-8 flex flex-col">
                 
                 {/* Recharts Area */}
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={results.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

                 {/* Metrics Grid */}
                 <div className="grid grid-cols-3 gap-4 shrink-0">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-colors">
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Growth Trend</p>
                       <p className="text-xl font-black font-outfit text-emerald-400">{results.growth_trend}</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-colors">
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Predicted Peak</p>
                       <p className="text-xl font-black font-outfit text-white">{results.max_peak}</p>
                    </div>
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary-500/30 transition-colors">
                       <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Outlier Risk</p>
                       <p className="text-xl font-black font-outfit text-blue-400">{results.outlier_risk}</p>
                    </div>
                 </div>

                 {/* Financial Projections */}
                 {results.financials && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[1.5rem] relative overflow-hidden group hover:bg-emerald-500/10 transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Zap className="w-12 h-12 text-emerald-400" />
                            </div>
                            <p className="text-[10px] text-emerald-500/60 uppercase font-black tracking-widest mb-2">Est. Monthly Revenue</p>
                            <p className="text-3xl font-black font-outfit text-emerald-400">{results.financials.predicted_revenue}</p>
                            <p className="text-[10px] text-emerald-500/40 uppercase font-black mt-2 tracking-widest">Based on projected demand</p>
                        </div>
                        <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-[1.5rem] relative overflow-hidden group hover:bg-blue-500/10 transition-all">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <ArrowUpRight className="w-12 h-12 text-blue-400" />
                            </div>
                            <p className="text-[10px] text-blue-500/60 uppercase font-black tracking-widest mb-2">Net Profit Forecast</p>
                            <p className="text-3xl font-black font-outfit text-blue-400">{results.financials.predicted_profit}</p>
                            <p className="text-[10px] text-blue-500/40 uppercase font-black mt-2 tracking-widest">Average Margin: {results.financials.margin}</p>
                        </div>
                    </motion.div>
                 )}

                 {/* AI Insight Panel */}
                 <div className="p-6 bg-gradient-to-r from-primary-900/20 to-transparent border border-primary-500/20 rounded-2xl relative overflow-hidden shrink-0 mt-4">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[40px] rounded-full pointer-events-none" />
                    <div className="flex gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
                          <Bot className="w-6 h-6 text-primary-500" />
                       </div>
                       <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-2 flex items-center gap-2">
                             <Zap className="w-3 h-3" /> Executive AI Insight
                          </h4>
                          <p className="text-sm text-gray-300 leading-relaxed font-medium">
                             {results.insight}
                          </p>
                       </div>
                    </div>
                 </div>

               </motion.div>
             ) : (
               <div className="text-center flex flex-col items-center justify-center h-full text-gray-500 z-10">
                  {status === 'uploading' ? (
                     <>
                        <div className="relative w-20 h-20 mb-6">
                           <div className="absolute inset-0 border-4 border-white/5 border-t-primary-500 rounded-full animate-spin" />
                           <div className="absolute inset-2 border-4 border-white/5 border-b-blue-500 rounded-full animate-spin animation-delay-200" />
                           <Bot className="absolute inset-0 m-auto w-6 h-6 text-primary-500 animate-pulse" />
                        </div>
                        <p className="font-bold text-white tracking-wide">Processing Dataset...</p>
                        <p className="text-xs uppercase tracking-widest mt-2">AI Neural Networks Engaged</p>
                     </>
                  ) : (
                     <>
                        <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-6">
                           <LineChart className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="font-bold text-gray-400">Awaiting Data Upload</p>
                        <p className="text-xs uppercase tracking-widest mt-2">Ready for Analysis</p>
                     </>
                  )}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
