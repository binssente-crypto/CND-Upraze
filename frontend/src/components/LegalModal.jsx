import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, Scale } from 'lucide-react';

const LegalModal = ({ isOpen, onClose, type }) => {
  const content = {
    privacy: {
      title: "Privacy Policy",
      icon: <Shield className="w-8 h-8 text-primary-500" />,
      sections: [
        {
          title: "1. Information We Collect",
          body: "We collect information you provide directly to us when you create an account, use our AI tools, or communicate with us. This includes your name, email, company details, and any data processed through our modules."
        },
        {
          title: "2. How We Use Information",
          body: "We use the information to provide, maintain, and improve our services, develop new features, and protect CND Upraze and our users. Your data processed through AI modules is handled securely and according to industry standards."
        },
        {
          title: "3. Data Security",
          body: "We implement robust security measures to protect your personal information and business data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security."
        }
      ]
    },
    terms: {
      title: "Terms of Service",
      icon: <Scale className="w-8 h-8 text-primary-500" />,
      sections: [
        {
          title: "1. Acceptance of Terms",
          body: "By accessing or using CND Upraze Solutions, you agree to be bound by these Terms of Service and all applicable laws and regulations."
        },
        {
          title: "2. Subscription and Billing",
          body: "Our services are provided on a subscription basis. You agree to pay all fees associated with your chosen plan. Subscriptions automatically renew unless canceled at least 24 hours before the end of the billing cycle."
        },
        {
          title: "3. User License",
          body: "Permission is granted to use our modules for business and personal purposes according to your subscription tier. This is a license, not a transfer of title, and you may not reverse engineer or misuse the AI systems."
        }
      ]
    }
  };

  const active = content[type] || content.privacy;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-3xl glass-card max-h-[80vh] flex flex-col overflow-hidden shadow-2xl border-white/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#1a1a1a]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-500/10 rounded-2xl">
                  {active.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-white">{active.title}</h2>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Last Updated: April 2026</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar bg-dark-bg/50">
              {active.sections.map((section, i) => (
                <div key={i} className="space-y-4">
                  <h3 className="text-xl font-bold text-primary-500">{section.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-inter text-lg">
                    {section.body}
                  </p>
                </div>
              ))}
              
              <div className="p-8 bg-primary-500/5 border border-primary-500/10 rounded-2xl mt-12">
                <p className="text-sm text-gray-500 italic text-center">
                  If you have any questions regarding our {active.title.toLowerCase()}, please contact our legal team at legal@upraze.com
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-[#1a1a1a] flex justify-end">
              <button 
                onClick={onClose}
                className="btn-primary px-8"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
