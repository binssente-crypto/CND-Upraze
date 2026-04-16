import React from 'react';
import { QrCode, Plus, Download, ExternalLink, Trash2, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const qrs = [
  { id: 1, name: 'Marketing Campaign Q3', scans: 432, target: 'upraze.com/promo' },
  { id: 2, name: 'Inventory Asset A1', scans: 12, target: 'internal.upraze.com/asset/A1' },
  { id: 3, name: 'Product Demo Video', scans: 1840, target: 'youtube.com/v/upraze' },
];

const QRCodeManagement = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold">Manage QR Codes</h2>
            <p className="text-gray-500">Generate and track smart redirection codes</p>
         </div>
         <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Generate New
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {qrs.map((qr, idx) => (
            <motion.div 
               key={qr.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="glass-card flex flex-col group overflow-hidden"
            >
               <div className="p-8 flex-1 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white p-3 rounded-2xl mb-6 shadow-xl relative group">
                     <div className="absolute inset-0 bg-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <Download className="w-8 h-8 text-primary-600" />
                     </div>
                     <QrCode className="w-full h-full text-dark-bg" />
                  </div>
                  <h4 className="text-lg font-bold mb-1">{qr.name}</h4>
                  <div className="flex items-center gap-1 text-primary-500 text-sm font-medium mb-4">
                     <ExternalLink className="w-3 h-3" /> {qr.target}
                  </div>
                  
                  <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-dark-border">
                     <div className="text-left">
                        <p className="text-[10px] text-gray-500 uppercase font-bold">Total Scans</p>
                        <p className="text-xl font-bold">{qr.scans}</p>
                     </div>
                     <div className="flex justify-end gap-2 items-center">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"><Eye className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                     </div>
                  </div>
               </div>
            </motion.div>
         ))}

         {/* Empty State / Add New */}
         <div className="border-2 border-dashed border-dark-border rounded-xl flex flex-col items-center justify-center p-8 min-h-[300px] hover:border-primary-500/50 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Quick Generate</p>
         </div>
      </div>
    </div>
  );
};

export default QRCodeManagement;
