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
          title: "1. Information Collection",
          body: "We collect information you provide directly to us (name, email, professional details) and technical data (IP addresses, device identifiers, and AI processing logs) to ensure the highest quality of service and security."
        },
        {
          title: "2. Data Processing & AI",
          body: "As an AI-driven platform, we process data using state-of-the-art encryption. Your inputs into our modules are utilized strictly for generating results for your account and are never shared with third parties for marketing purposes."
        },
        {
          title: "3. User Rights & Protection",
          body: "You maintain full ownership of your data. You may request data exports or account deletion at any time. We implement AES-256 encryption and follow strict SOC2-compliant data handling protocols."
        },
        {
          title: "4. Third-Party Integrations",
          body: "Our services may integrate with third-party providers. We ensure all partners adhere to equivalent privacy standards, ensuring your data remains protected across the entire digital infrastructure."
        }
      ]
    },
    terms: {
      title: "Terms of Service",
      icon: <Scale className="w-8 h-8 text-primary-500" />,
      sections: [
        {
          title: "1. Service Agreement",
          body: "By utilizing the CND Upraze platform, you enter into a binding agreement to adhere to our operational guidelines and professional standards of use."
        },
        {
          title: "2. Intellectual Property",
          body: "The AI modules, proprietary algorithms, and brand assets are the exclusive property of CND Upraze Solutions. Users are granted a non-transferable license to utilize these tools within their subscription tier."
        },
        {
          title: "3. Liability & Performance",
          body: "While we strive for 99.9% uptime and AI accuracy, CND Upraze is not liable for indirect losses resulting from system downtime or automated decision-making processes. Users should verify critical AI outputs."
        },
        {
          title: "4. Account Termination",
          body: "We reserve the right to suspend or terminate accounts that violate our security protocols or engage in unauthorized reverse-engineering of our proprietary AI models."
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
                  If you have any questions regarding our {active.title.toLowerCase()}, please contact our legal team at CND.Upraze@gmail.com
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
