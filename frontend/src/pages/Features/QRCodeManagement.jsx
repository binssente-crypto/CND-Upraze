import React, { useState } from 'react';
import { ExternalLink, Download, Info, Scan, FileDown, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const demoQRs = [
  { id: 1, name: 'Order 1', image: '/assets/order1.jpg', status: 'Active' },
  { id: 2, name: 'Order 2', image: '/assets/order2.jpg', status: 'Active' },
  { id: 3, name: 'Order 3', image: '/assets/order3.jpg', status: 'Active' },
];

const QRCodeManagement = () => {
  const [selectedQR, setSelectedQR] = useState(null);

  const downloadQR = async (imageSrc, name) => {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name.toLowerCase().replace(/ /g, '_')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <div className="space-y-8">


      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 bg-blue-500/5 border border-blue-500/15 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-blue-300 font-bold">QR Link Active</p>
          <p className="text-xs text-gray-500">The QR codes below are functional. Click any QR to enlarge it for easier scanning. Point your mobile camera at them to test.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {demoQRs.map((qr, idx) => (
          <motion.div
            key={qr.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card flex flex-col group overflow-hidden border-primary-500/10 hover:border-primary-500/30 transition-all"
          >
            <div className="p-8 flex-1 flex flex-col items-center text-center">
              <div 
                onClick={() => setSelectedQR(qr)}
                className="bg-white p-4 rounded-[2rem] mb-6 shadow-2xl relative group/qr transition-transform duration-500 hover:scale-105 cursor-zoom-in flex items-center justify-center w-[172px] h-[172px]"
              >
                <img src={qr.image} alt={qr.name} className="max-w-[140px] max-h-[140px] object-contain rounded-xl" />
                <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center rounded-[2rem] backdrop-blur-[2px]">
                  <Maximize2 className="w-10 h-10 text-primary-600" />
                </div>
              </div>

              <h4 className="text-lg font-black font-outfit uppercase tracking-tight mb-1">{qr.name}</h4>
              <div className="flex items-center gap-1 text-primary-500 text-[10px] font-black uppercase tracking-widest mb-4">
                <ExternalLink className="w-3.5 h-3.5" /> Direct Link Active
              </div>
              
              <div className="w-full flex gap-3 pt-6 border-t border-dark-border">
                <button 
                  onClick={() => downloadQR(qr.image, qr.name)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-all whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" /> Download QR
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {selectedQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedQR(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-bg/95 backdrop-blur-xl cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full glass-card p-12 flex flex-col items-center text-center border-white/10"
            >
              <button 
                onClick={() => setSelectedQR(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/10 transition-all group"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
              </button>

              <div className="bg-white p-4 rounded-[3rem] shadow-2xl mb-10 flex items-center justify-center w-[352px] h-[352px]">
                <img src={selectedQR.image} alt={selectedQR.name} className="max-w-[320px] max-h-[320px] object-contain rounded-2xl" />
              </div>

              <h4 className="text-2xl font-black font-outfit uppercase tracking-tight text-white mb-2">{selectedQR.name}</h4>
              <p className="text-primary-500 font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
                <Scan className="w-4 h-4" /> Ready for scanning
              </p>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRCodeManagement;
