import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, Edit2, Trash2, CheckCircle2, XCircle, DollarSign, Zap, Globe, Shield, Loader2, X, PlusCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    interval: 'Monthly',
    features: [''],
    status: 'Active',
    type: 'Starter'
  });

  useEffect(() => {
    fetchOffers();
    const interval = setInterval(fetchOffers, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/offers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok) {
        setOffers(data);
      } else {
        setError(data.message || 'Failed to fetch offers');
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setCurrentOffer(offer);
      setFormData({
        name: offer.name,
        price: offer.price,
        interval: offer.interval,
        features: offer.features,
        status: offer.status,
        type: offer.type
      });
    } else {
      setCurrentOffer(null);
      setFormData({
        name: '',
        price: '',
        interval: 'Monthly',
        features: [''],
        status: 'Active',
        type: 'Starter'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = currentOffer ? 'PUT' : 'POST';
    const url = currentOffer ? `${API_URL}/admin/offers/${currentOffer.id}` : `${API_URL}/admin/offers`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        fetchOffers();
        setIsModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.message || 'Operation failed');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const res = await fetch(`${API_URL}/admin/offers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Accept': 'application/json'
        }
      });
      if (res.ok) fetchOffers();
    } catch (e) {
      alert(e.message);
    }
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });
  const updateFeature = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };
  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end items-center">
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-500 hover:bg-primary-400 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </button>
      </div>

      {loading && offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-500">Syncing Neural Offers...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <motion.div 
              key={offer.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card overflow-hidden group border-white/5 hover:border-primary-500/30 transition-all duration-500"
            >
              <div className="p-8 border-b border-white/5 relative">
                <div className="absolute top-6 right-8">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                    offer.type === 'Pro' ? 'bg-orange-500/10 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 
                    offer.type === 'Enterprise' ? 'bg-purple-500/10 text-purple-500' : 
                    'bg-blue-500/10 text-blue-500'
                  }`}>
                    {offer.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-1">{offer.name}</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-black font-outfit">₱{offer.price}</span>
                  <span className="text-xs text-gray-500 font-bold uppercase">/ {offer.interval}</span>
                </div>
              </div>
              
              <div className="p-8 space-y-6 flex flex-col flex-1">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Included Features</p>
                  <ul className="space-y-3 min-h-[180px]">
                    {offer.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /> 
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 flex gap-3 items-stretch">
                  <button 
                    onClick={() => handleOpenModal(offer)}
                    className="flex-1 h-[48px] flex items-center justify-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.05] hover:border-white/20 transition-all group"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary-500 transition-colors" /> 
                    <span>Edit Offer</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="w-[48px] h-[48px] flex items-center justify-center bg-red-500/5 border border-red-500/10 rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Backdrop */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-card border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <h3 className="text-lg font-bold">{currentOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Package Name</label>
                    <input 
                      type="text" required value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field py-2 text-sm" placeholder="e.g. Package 1A" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Price (PHP)</label>
                    <input 
                      type="text" required value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="input-field py-2 text-sm" placeholder="3,500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Interval</label>
                    <select 
                      value={formData.interval}
                      onChange={(e) => setFormData({...formData, interval: e.target.value})}
                      className="input-field py-2 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%20stroke%3D%22white%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="Monthly" className="bg-[#0A0A0A]">Monthly</option>
                      <option value="Annual" className="bg-[#0A0A0A]">Annual</option>
                      <option value="Lifetime" className="bg-[#0A0A0A]">Lifetime</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Tier Type</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="input-field py-2 text-sm appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%20stroke%3D%22white%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="Starter" className="bg-[#0A0A0A]">Starter</option>
                      <option value="Pro" className="bg-[#0A0A0A]">Pro</option>
                      <option value="Enterprise" className="bg-[#0A0A0A]">Enterprise</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Features</label>
                    <button type="button" onClick={addFeature} className="text-primary-500 hover:text-primary-400 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                      <PlusCircle className="w-3 h-3" /> Add Feature
                    </button>
                  </div>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input 
                        type="text" value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="input-field py-2 text-sm" placeholder="Feature description..." 
                      />
                      <button 
                        type="button" onClick={() => removeFeature(index)}
                        className="p-2 text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-400 text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all mt-4 shadow-xl shadow-primary-500/20"
                >
                  {currentOffer ? 'Update Neural Package' : 'Create Neural Package'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfferManagement;
