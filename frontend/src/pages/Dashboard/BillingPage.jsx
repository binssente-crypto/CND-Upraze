import React, { useState, useEffect } from 'react';
import { Check, X, Globe, Wrench, Server, MessageSquare, Layout, Palette, Sparkles, ChevronRight, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const BillingPage = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    company_name: '',
    short_description: '',
    design_preference: '',
    feature_options: ''
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          offer_id: selectedPackage?.id,
          plan_name: selectedPackage?.name,
          ...formData
        })
      });
      if (res.ok) {
        const data = await res.json();
        showNotification("Order submitted successfully! Redirecting to payment...", "success");
        setShowOrderModal(false);
        setFormData({ company_name: '', short_description: '', design_preference: '', feature_options: '' });
        
        if (data.payment_url) {
            setTimeout(() => { window.location.href = data.payment_url; }, 1500);
        }
      } else {
        const errData = await res.json();
        showNotification(errData.message || "Failed to submit order", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error submitting order. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_URL}/offers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          const activeOffers = data.filter(offer => offer.status && offer.status.toLowerCase() === 'active');
          setOffers(activeOffers);
        }
      } catch (err) {
        console.error("Failed to fetch offers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8">

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-6 right-6 z-[100] max-w-md"
          >
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${
              notification.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-500/10' 
                : notification.type === 'error' 
                  ? 'bg-red-500/10 border-red-500/30 shadow-red-500/10' 
                  : 'bg-amber-500/10 border-amber-500/30 shadow-amber-500/10'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notification.type === 'success' 
                  ? 'bg-emerald-500/20' 
                  : notification.type === 'error' 
                    ? 'bg-red-500/20' 
                    : 'bg-amber-500/20'
              }`}>
                {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              </div>
              <p className="text-sm font-semibold text-white leading-snug">{notification.message}</p>
              <button onClick={() => setNotification(null)} className="ml-auto text-gray-500 hover:text-white transition-colors flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 border-4 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`grid grid-cols-1 gap-8 pt-6 lg:grid-cols-3 max-w-6xl mx-auto`}
        >
          {offers.map((pkg, idx) => {
            const isPopularFallback = idx === 1 && offers.length >= 3;
            return (
            <motion.div 
              key={pkg.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card p-10 flex flex-col relative group transition-all duration-500 border ${
                isPopularFallback 
                  ? 'border-[#f97316]/50 shadow-2xl shadow-orange-500/10 bg-[#f97316]/[0.02]' 
                  : 'border-white/[0.05] hover:border-white/[0.1] bg-[#050505]/80'
              } rounded-[2rem]`}
            >
              {isPopularFallback && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#f97316] to-[#fb923c] px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/30 text-white border border-white/10 z-10">Most Popular</div>
              )}

              {pkg.type && (
                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg text-white bg-white/10 border border-white/20 z-10 backdrop-blur-md">
                  {pkg.type}
                </div>
              )}

              <div className="mb-8 mt-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                   <Layout className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-2xl font-black mb-3 font-outfit tracking-tight text-white">{pkg.name}</h3>
                
                <div className="flex gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full text-blue-400 bg-blue-500/10 border border-blue-500/20">
                    {pkg.features?.length || 0} Feature{pkg.features?.length !== 1 && 's'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 font-medium leading-relaxed mt-6 mb-8 min-h-[60px]">
                  {pkg.description || "A powerful system designed to streamline your business operations and accelerate growth."}
                </p>

                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black font-outfit tracking-tighter text-white">₱{pkg.price}</span>
                  <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">/ {pkg.interval}</span>
                </div>
              </div>

              <div className="space-y-4 flex-1 mb-10 pt-6 border-t border-white/[0.05]">
                {Array.isArray(pkg.features) && pkg.features.map((feature, i) => {
                  const isNegative = feature.toLowerCase().startsWith('no ') || feature.toLowerCase().startsWith('not ');
                  return (
                    <div key={i} className={`flex items-center gap-4 ${isNegative ? 'text-gray-600' : 'text-gray-300'} font-medium`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isNegative ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                        {isNegative ? <X className="w-3 h-3 text-red-500" /> : <Check className="w-3 h-3 text-emerald-500" />}
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/dashboard/support')}
                  className={`flex-1 py-4 rounded-xl font-black tracking-widest text-[10px] uppercase text-center flex items-center justify-center gap-1 transition-all duration-300 ${
                    isPopularFallback 
                      ? 'bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white hover:opacity-90 shadow-lg shadow-orange-500/20' 
                      : 'bg-[#111] text-gray-300 hover:text-white border border-white/5 hover:bg-[#222]'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Inquire
                </button>
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setFormData({ company_name: '', short_description: '', design_preference: '', feature_options: '' });
                    setShowOrderModal(true);
                  }}
                  className={`flex-1 py-4 rounded-xl font-black tracking-widest text-[10px] uppercase text-center flex items-center justify-center gap-1 transition-all duration-300 ${
                    isPopularFallback 
                      ? 'bg-gradient-to-r from-[#ea580c] to-[#c2410c] text-white hover:opacity-90 shadow-lg shadow-orange-500/20' 
                      : 'bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white border border-primary-500/20 hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" /> Avail Package
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      )}

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-10 overflow-hidden relative group text-center"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -z-10 group-hover:bg-primary-500/10 transition-all duration-700" />
        <Sparkles className="w-8 h-8 text-primary-500 mx-auto mb-4" />
        <h4 className="font-black text-xl mb-3 font-outfit tracking-tight">Not sure which package fits?</h4>
        <p className="text-gray-500 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
          Reach out to our team and we'll recommend the best package based on your business requirements. All packages include domain hosting and ongoing maintenance.
        </p>
        <button
          onClick={() => navigate('/dashboard/support')}
          className="btn-primary !rounded-2xl !px-12 !py-4 font-black tracking-widest text-xs uppercase inline-flex items-center gap-2"
        >
          Talk to Our Team <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Order Modal */}
      {showOrderModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowOrderModal(false)}></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 overflow-y-auto max-h-[90vh]"
          >
            <button onClick={() => setShowOrderModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-black mb-2 text-white font-outfit">Avail {selectedPackage.name}</h3>
            <p className="text-gray-400 text-sm mb-6">Please fill up the details to proceed with your plan.</p>
            
            <form onSubmit={handleOrderSubmit} className="space-y-5">
              {(selectedPackage.name?.toLowerCase().includes('pro') || selectedPackage.name?.toLowerCase().includes('enterprise') || selectedPackage.name?.toLowerCase().includes('package b') || selectedPackage.name?.toLowerCase().includes('package c')) && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name of Company</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.company_name}
                    onChange={e => setFormData({...formData, company_name: e.target.value})}
                    placeholder="Enter company name"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Short Description</label>
                <textarea
                  required
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  value={formData.short_description}
                  onChange={e => setFormData({...formData, short_description: e.target.value})}
                  placeholder="Tell us a bit about your business and needs"
                ></textarea>
              </div>

              {!(selectedPackage.name?.toLowerCase().includes('package a') || selectedPackage.name?.toLowerCase().includes('starter')) && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Design Preference</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                    value={formData.design_preference}
                    onChange={e => setFormData({...formData, design_preference: e.target.value})}
                    placeholder="Describe your preferred style, colors, etc."
                  ></textarea>
                </div>
              )}

              {(() => {
                let options = [];
                let maxSelections = 5;
                const pkgName = selectedPackage?.name?.toLowerCase() || '';
                if (pkgName.includes('package a') || pkgName.includes('starter')) {
                  options = ['QR Implementation', 'Basic Forecasting Algorithm', 'AI Chatbot Assistant', '3D Viewer'];
                  maxSelections = 1;
                } else if (pkgName.includes('package b') || pkgName.includes('pro')) {
                  options = [
                    'AI Chatbot Assistant / Report',
                    'AI-Assisted Forecasting',
                    'QR Ordering with Session Expiration',
                    'Image Recognition Module',
                    '3D Viewer / Manipulation'
                  ];
                  maxSelections = 3;
                } else {
                  // Package C / Enterprise / Default
                  options = [
                    'AI Chatbot Assistant / Report',
                    'Advanced Forecasting',
                    'QR Ordering Access',
                    'Image Recognition',
                    '3D Customization / Viewer / Manipulation'
                  ];
                  maxSelections = 5;
                }

                const currentSelections = formData.feature_options ? formData.feature_options.split(', ').filter(Boolean) : [];

                return (
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Available feature options <span className="text-primary-500 lowercase">(select up to {maxSelections})</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {options.map((feature) => {
                        const isSelected = currentSelections.includes(feature);
                        const isDisabled = !isSelected && currentSelections.length >= maxSelections;
                        return (
                          <label key={feature} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isDisabled ? 'opacity-40 cursor-not-allowed bg-black/40 border-white/5 text-gray-600' : isSelected ? 'bg-primary-500/10 border-primary-500/50 text-white cursor-pointer' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 cursor-pointer'}`}>
                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-primary-500' : 'bg-black/50 border border-white/20'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <span className="text-sm font-medium leading-tight">{feature}</span>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={(e) => {
                                if (isDisabled) return;
                                let current = [...currentSelections];
                                if (e.target.checked) {
                                  if (current.length < maxSelections) {
                                    current.push(feature);
                                  }
                                } else {
                                  current = current.filter(f => f !== feature);
                                }
                                setFormData({...formData, feature_options: current.join(', ')});
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl font-bold text-sm bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
