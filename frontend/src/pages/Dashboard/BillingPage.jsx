import React from 'react';
import { CreditCard, Check, Shield, Zap, CheckCircle2, Star, Rocket, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  { 
    name: 'Starter', 
    price: '499', 
    features: ['AI Assistant', 'QR Code Generation', 'Basic Analytics'], 
    icon: <Rocket className="w-8 h-8 text-blue-400" />,
    desc: 'Perfect for individuals and small projects.'
  },
  { 
    name: 'Growth', 
    price: '999', 
    features: ['AI Assistant', 'QR Code Generation', 'Forecasting', 'Image Recognition', 'Priority Support'], 
    icon: <Zap className="w-8 h-8 text-primary-500" />,
    popular: true,
    desc: 'Everything you need to scale your business.'
  },
  { 
    name: 'Enterprise', 
    price: '2,499', 
    features: ['All Pro Features', '3D Manipulation', 'Custom API Access', 'Dedicated Account Manager'], 
    icon: <Building2 className="w-8 h-8 text-purple-400" />,
    desc: 'Advanced solutions for large organizations.'
  },
];

const BillingPage = () => {
  return (
    <div className="space-y-12 max-w-6xl mx-auto py-8">
      <div className="text-center md:text-left">
        <h2 className="text-4xl font-black mb-3 font-outfit tracking-tight">Subscription & Billing</h2>
        <p className="text-gray-500 max-w-lg">Choose the plan that fits your business needs. Upgrade or downgrade at any time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-10 flex flex-col relative group transition-all duration-500 ${plan.popular ? 'border-primary-500/30 bg-primary-500/[0.02]' : 'hover:bg-white/[0.03]'}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-orange-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 text-white border border-white/10">Most Popular</div>
            )}
            
            <div className="mb-10">
                <div className="mb-6 bg-white/[0.03] w-16 h-16 rounded-2xl flex items-center justify-center border border-white/[0.05] group-hover:scale-110 transition-transform duration-500">
                    {plan.icon}
                </div>
                <h3 className="text-2xl font-black mb-2 font-outfit tracking-tight">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{plan.desc}</p>
                <div className="flex items-baseline gap-1">
                   <span className="text-5xl font-black font-outfit tracking-tighter">₱{plan.price}</span>
                   <span className="text-gray-500 font-medium tracking-wide">/mo</span>
                </div>
            </div>

            <div className="space-y-5 flex-1 mb-12">
               {plan.features.map((feature, i) => (
                 <li key={i} className="flex items-center gap-3 text-sm text-gray-400 list-none font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
                    </div>
                    {feature}
                 </li>
               ))}
            </div>

            <button className={`btn-primary w-full !rounded-2xl !py-4 font-black tracking-widest text-xs uppercase ${
                !plan.popular && 'bg-white/[0.05] hover:bg-white/[0.08] text-white border border-white/10 shadow-none'
            }`}>
              {idx === 1 ? 'Current Plan' : 'Select Plan'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-10 overflow-hidden relative group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -z-10 group-hover:bg-primary-500/10 transition-all duration-700" />
         <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white/[0.03] rounded-3xl flex items-center justify-center border border-white/[0.05] shadow-inner group-hover:rotate-6 transition-transform duration-500">
                   <CreditCard className="w-10 h-10 text-gray-400 group-hover:text-primary-400 transition-colors" />
                </div>
                <div>
                    <h4 className="font-black text-xl mb-1 font-outfit tracking-tight">Payment Method</h4>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 font-medium">Visa ending in •••• 4242</span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/20">Active</span>
                    </div>
                </div>
            </div>
            <button className="btn-secondary !rounded-2xl px-10 font-bold text-sm tracking-wide">Update Method</button>
         </div>
      </div>
    </div>
  );
};

export default BillingPage;

