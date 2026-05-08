import React, { useState } from 'react';
import { Check, X, Globe, Wrench, Server, MessageSquare, Layout, Palette, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const tier1 = [
  {
    name: 'Package 1A',
    price: '3,500',
    featureCount: '1 Feature',
    desc: 'A prebuilt system with a single core feature. Fast deployment, reliable infrastructure.',
  },
  {
    name: 'Package 1B',
    price: '6,500',
    featureCount: '2–3 Features',
    desc: 'A prebuilt system with multiple integrated features for growing operations.',
    popular: true,
  },
  {
    name: 'Package 1C',
    price: '12,000',
    featureCount: '4–5 Features',
    desc: 'A comprehensive prebuilt system with a full feature suite for established businesses.',
  },
];

const tier2 = [
  {
    name: 'Package 2A',
    price: '22,000',
    featureCount: '2–3 Features',
    desc: 'Fully customized system with your brand identity, tailored UI, and 2–3 bespoke features.',
  },
  {
    name: 'Package 2B',
    price: '40,000',
    featureCount: '4–5 Features',
    desc: 'The ultimate custom build. Full branding, complete UI control, and 4–5 tailored features.',
    popular: true,
  },
];

const sharedFeatures = [
  { label: 'Domain & Hosting', included: true },
  { label: 'Ongoing Maintenance', included: true },
  { label: 'Dedicated Support', included: true },
];

const BillingPage = () => {
  const navigate = useNavigate();
  const [activeTier, setActiveTier] = useState('prebuilt');

  const activePlans = activeTier === 'prebuilt' ? tier1 : tier2;
  const isCustom = activeTier === 'custom';

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-8">


      {/* Tier Switcher */}
      <div className="flex justify-center">
        <div className="glass-card p-1.5 inline-flex gap-1.5 !rounded-2xl">
          <button
            onClick={() => setActiveTier('prebuilt')}
            className={`px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTier === 'prebuilt'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layout className="w-4 h-4 inline mr-2 -mt-0.5" />
            Prebuilt Systems
          </button>
          <button
            onClick={() => setActiveTier('custom')}
            className={`px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTier === 'custom'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2 -mt-0.5" />
            Custom Systems
          </button>
        </div>
      </div>

      {/* Tier Description */}
      <motion.div
        key={activeTier}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        {isCustom ? (
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Fully customized systems with <span className="text-primary-500 font-bold">your brand identity</span>, bespoke UI design, and tailored features built from the ground up.
          </p>
        ) : (
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Pre-engineered systems from our <span className="text-blue-400 font-bold">curated template library</span>. Fast deployment with proven, battle-tested architectures.
          </p>
        )}
      </motion.div>

      {/* Package Cards */}
      <motion.div
        key={activeTier + '-cards'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`grid grid-cols-1 gap-8 pt-6 ${activePlans.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2 max-w-4xl mx-auto'}`}
      >
        {activePlans.map((pkg, idx) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-10 flex flex-col relative group transition-all duration-500 ${
              pkg.popular ? 'border-primary-500/30 bg-primary-500/[0.02]' : 'hover:bg-white/[0.03]'
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-orange-400 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 text-white border border-white/10">
                Most Popular
              </div>
            )}

            {/* Decorative Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 ${isCustom ? 'bg-primary-500/10' : 'bg-blue-500/10'} blur-[80px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

            <div className="mb-8">
              <div className={`mb-5 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/[0.05] group-hover:scale-110 transition-transform duration-500 ${isCustom ? 'bg-primary-500/10' : 'bg-blue-500/10'}`}>
                {isCustom ? <Palette className="w-7 h-7 text-primary-500" /> : <Layout className="w-7 h-7 text-blue-400" />}
              </div>
              <h3 className="text-2xl font-black mb-1 font-outfit tracking-tight">{pkg.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                  isCustom ? 'text-primary-500 bg-primary-500/10 border-primary-500/20' : 'text-blue-400 bg-blue-500/10 border-blue-500/20'
                }`}>
                  {pkg.featureCount}
                </span>
                {isCustom && (
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-purple-400 bg-purple-500/10 border border-purple-500/20">
                    Full Branding
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">{pkg.desc}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black font-outfit tracking-tighter">₱{pkg.price}</span>
                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">/ month</span>
              </div>
            </div>

            {/* Included Benefits */}
            <div className="space-y-3 flex-1 mb-8">
              {isCustom && (
                <>
                  <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    Full Customization
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    Custom Branding Suite
                  </div>
                </>
              )}
              {sharedFeatures.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  {f.label}
                </div>
              ))}
              {!isCustom && (
                <>
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    No Custom Branding
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                      <X className="w-3 h-3 text-red-400" />
                    </div>
                    Not Customizable
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => navigate('/dashboard/support')}
              className={`btn-primary w-full !rounded-2xl !py-4 font-black tracking-widest text-xs uppercase flex items-center justify-center gap-2 ${
                !pkg.popular && 'bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/10 shadow-none'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Inquire Now
            </button>
          </motion.div>
        ))}
      </motion.div>

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
    </div>
  );
};

export default BillingPage;
