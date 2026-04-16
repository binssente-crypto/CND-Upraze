import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, LineChart, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Forecasting = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, complete

  const handleUpload = () => {
    setStatus('uploading');
    setTimeout(() => setStatus('complete'), 2000);
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Panel */}
        <div className="lg:col-span-1 glass-card p-8 flex flex-col">
          <h3 className="text-xl font-bold mb-6">New Forecast</h3>
          
          <div className="flex-1 border-2 border-dashed border-dark-border rounded-2xl flex flex-col items-center justify-center p-8 transition-colors hover:border-primary-500/50 group cursor-pointer">
            <input type="file" className="hidden" id="fileIn" onChange={(e) => setFile(e.target.files[0])} />
            <label htmlFor="fileIn" className="flex flex-col items-center cursor-pointer">
              <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-primary-500" />
              </div>
              <p className="font-medium text-center">{file ? file.name : 'Upload Sales Data'}</p>
              <p className="text-xs text-gray-500 mt-2">CSV or XLSX supported</p>
            </label>
          </div>

          <button 
            disabled={!file || status === 'uploading'}
            onClick={handleUpload}
            className="btn-primary w-full mt-8 py-4 flex items-center justify-center gap-2"
          >
            {status === 'idle' ? <><Play className="w-5 h-5" /> Run Analysis</> : status === 'uploading' ? 'Processing...' : 'Ready'}
          </button>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 glass-card p-0 overflow-hidden flex flex-col">
           <div className="p-6 border-bottom border-dark-border bg-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2"><LineChart className="w-6 h-6 text-primary-500" /> Prediction Results</h3>
              <span className="text-xs font-bold text-gray-500 uppercase">Interactive Visualization</span>
           </div>
           
           <div className="flex-1 p-8 flex items-center justify-center bg-dark-card/50">
             {status === 'complete' ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full space-y-8">
                 {/* Mock Chart Area */}
                 <div className="h-64 border-b border-l border-dark-border relative flex items-end justify-around px-8 pb-4">
                    {[40, 60, 45, 90, 75, 100].map((h, i) => (
                      <div key={i} className="w-12 bg-primary-600/20 border-t-4 border-primary-500 rounded-t-lg transition-all hover:bg-primary-600/40" style={{ height: `${h}%` }}>
                        <div className="w-full h-full bg-gradient-to-t from-primary-500/20 to-transparent" />
                      </div>
                    ))}
                    <div className="absolute top-4 right-4 bg-dark-bg p-3 rounded-lg border border-dark-border text-sm">
                       <p className="text-gray-400">Confidence Score</p>
                       <p className="text-2xl font-bold text-primary-500">98.4%</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-dark-border">
                       <p className="text-xs text-gray-500 uppercase">Growth Trend</p>
                       <p className="text-lg font-bold text-green-400">+22.4%</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-dark-border">
                       <p className="text-xs text-gray-500 uppercase">Max Peak</p>
                       <p className="text-lg font-bold">1,204 Units</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-dark-border">
                       <p className="text-xs text-gray-500 uppercase">Outlier Risk</p>
                       <p className="text-lg font-bold text-red-400 italic">Low</p>
                    </div>
                 </div>
               </motion.div>
             ) : (
               <div className="text-center text-gray-500">
                  <div className="w-20 h-20 border-4 border-white/5 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
                  <p>Awaiting Data Upload...</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Forecasting;
