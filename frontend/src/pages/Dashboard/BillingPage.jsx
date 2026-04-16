import React from 'react';
import { CreditCard, Check, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  { name: 'Starter', price: '499', features: ['AI Assistant', 'QR Code Generation', 'Basic Analytics'], stripe_id: 'price_starter' },
  { name: 'Growth', price: '999', features: ['AI Assistant', 'QR Code Generation', 'Forecasting', 'Image Recognition', 'Priority Support'], stripe_id: 'price_growth', popular: true },
  { name: 'Enterprise', price: '2,499', features: ['All Pro Features', '3D Manipulation', 'Custom API Access', 'Dedicated Account Manager'], stripe_id: 'price_enterprise' },
];

const BillingPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Subscription & Billing</h2>
        <p className="text-gray-500">Manage your plan and payment methods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-8 flex flex-col relative ${plan.popular ? 'border-primary-500/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Most Popular</div>
            )}
            <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                   <span className="text-4xl font-bold">₱{plan.price}</span>
                   <span className="text-gray-500">/mo</span>
                </div>
            </div>

            <ul className="space-y-4 flex-1 mb-10">
               {plan.features.map((feature, i) => (
                 <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="w-5 h-5 text-primary-500 flex-shrink-0" />
                    {feature}
                 </li>
               ))}
            </ul>

            <button className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.popular 
                ? 'bg-primary-600 hover:bg-primary-500 shadow-xl shadow-primary-500/20' 
                : 'bg-white/5 hover:bg-white/10 border border-dark-border'
            }`}>
              {idx === 1 ? 'Current Plan' : 'Upgrade Now'}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-8 bg-gradient-to-r from-dark-card to-dark-bg">
         <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-dark-border">
                   <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                    <h4 className="font-bold text-lg">Payment Method</h4>
                    <p className="text-gray-400 text-sm">Visa ending in •••• 4242</p>
                </div>
            </div>
            <button className="btn-secondary px-8">Update Card</button>
         </div>
      </div>
    </div>
  );
};

export default BillingPage;
