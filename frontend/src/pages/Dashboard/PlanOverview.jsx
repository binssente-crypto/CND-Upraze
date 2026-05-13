import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;

const PlanOverview = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(`${API_URL}/user/subscription`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (res.ok) {
          const data = await res.json();
          setSubscription(data.subscription);
        }
      } catch (err) {
        console.error("Failed to fetch subscription:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto mt-12 text-center"
      >
        <div className="glass-card p-12 rounded-3xl border border-white/[0.05] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-6 border border-white/[0.05]">
            <Package className="w-12 h-12 text-gray-500" />
          </div>
          
          <h2 className="text-3xl font-black font-outfit uppercase tracking-tight mb-4">No Active Plan</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            You currently don't have an active subscription plan. Upgrade your account to unlock the full potential of the CND Neural Ecosystem.
          </p>
          
          <Link 
            to="/dashboard/billing"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-500/20"
          >
            <span>View Service Packages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  const { plan, ends_at } = subscription;
  const features = typeof plan?.features === 'string' ? JSON.parse(plan.features) : (plan?.features || []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Active until cancelled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-black font-outfit uppercase tracking-tight mb-2">Plan Overview</h2>
        <p className="text-gray-400 text-[11px] uppercase tracking-widest font-black">Manage your active subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Plan Details Card */}
          <div className="glass-card p-8 rounded-3xl border border-primary-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                <Package className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Current Plan</p>
                <h3 className="text-xl font-black font-outfit uppercase tracking-tight text-white">{plan?.name || 'Unknown Plan'}</h3>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.05]">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Billing Interval</p>
                <p className="text-sm font-semibold text-white capitalize">{plan?.billing_interval || 'Monthly'}</p>
              </div>
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.05]">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Price</p>
                <p className="text-sm font-semibold text-white">PHP {plan?.price || '0.00'} / {plan?.billing_interval === 'year' ? 'yr' : 'mo'}</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/[0.05]">
               <div className="flex items-start gap-3">
                 <Calendar className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1">Billing Cycle Ends</p>
                   <p className="text-sm font-semibold text-white">{formatDate(ends_at)}</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {/* Features Card */}
          <div className="glass-card p-8 rounded-3xl border border-white/[0.05]">
            <h3 className="text-lg font-black font-outfit uppercase tracking-tight mb-6 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Included Features
            </h3>
            
            {features.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.03]">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">No specific features listed for this plan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanOverview;
