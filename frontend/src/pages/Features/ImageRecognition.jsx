import React, { useState } from 'react';
import { Image as ImageIcon, Camera, Search, CheckCircle, List, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageRecognition = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [results, setResults] = useState(null);

  const handleProcess = () => {
    setResults([
      { label: 'Asset Detected', value: 'High Performance Server', conf: 0.99 },
      { label: 'Category', value: 'IT Infrastructure', conf: 0.94 },
      { label: 'Serial Match', value: 'CND-8940-X', conf: 0.82 },
    ]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input area */}
        <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
            {selectedImage ? (
                <div className="relative w-full max-w-sm aspect-video rounded-3xl overflow-hidden border-4 border-primary-500/20 shadow-2xl">
                    <img src={URL.createObjectURL(selectedImage)} className="w-full h-full object-cover" alt="Selected" />
                    <button className="absolute top-4 right-4 bg-dark-bg/80 p-2 rounded-full hover:text-red-400" onClick={() => {setSelectedImage(null); setResults(null);}}>
                        <Search className="w-4 h-4 rotate-45" />
                    </button>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
                </div>
            ) : (
                <motion.div whileHover={{ scale: 1.02 }} className="w-full h-80 border-2 border-dashed border-dark-border rounded-3xl flex flex-col items-center justify-center p-12 bg-white/5 cursor-pointer hover:border-primary-500/50 transition-all">
                    <input type="file" id="imgUpload" className="hidden" onChange={(e) => setSelectedImage(e.target.files[0])} />
                    <label htmlFor="imgUpload" className="cursor-pointer flex flex-col items-center">
                        <div className="w-20 h-20 bg-primary-600/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl"><Camera className="w-10 h-10 text-primary-500" /></div>
                        <h4 className="text-xl font-bold mb-2">Drop image here</h4>
                        <p className="text-gray-500">Capture or upload for instant recognition</p>
                    </label>
                </motion.div>
            )}

            <button 
                onClick={handleProcess}
                disabled={!selectedImage || results}
                className="btn-primary w-full max-w-sm mt-10 py-5 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(34,197,94,0.3)]"
            >
                {results ? 'Analysis Complete' : 'Run Smart Scan'}
            </button>
        </div>

        {/* Results Area */}
        <div className="glass-card flex flex-col p-0 overflow-hidden">
            <div className="p-6 bg-white/5 border-b border-dark-border flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2"><List className="w-5 h-5 text-primary-500" /> Recognition Logs</h3>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    <div className="w-2 h-2 rounded-full bg-gray-700" />
                    <div className="w-2 h-2 rounded-full bg-gray-700" />
                </div>
            </div>

            <div className="flex-1 p-8 space-y-6">
                <AnimatePresence>
                {results ? (
                    results.map((res, i) => (
                        <motion.div 
                            key={i}
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 bg-dark-bg/60 border border-dark-border rounded-2xl relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3"><CheckCircle className="w-5 h-5 text-primary-500 opacity-20 group-hover:opacity-100 transition-opacity" /></div>
                            <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">{res.label}</p>
                            <p className="text-xl font-bold">{res.value}</p>
                            <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${res.conf * 100}%` }} className="h-full bg-primary-500 shadow-[0_0_10px_#22c55e]" />
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center opacity-40">
                        <Pin className="w-16 h-16 mb-4" />
                        <p>No active scan results yet.</p>
                    </div>
                )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageRecognition;
