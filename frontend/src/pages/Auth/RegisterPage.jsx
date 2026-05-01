import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LegalModal from '../../components/LegalModal';
import Logo from '../../components/Logo';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    company: ''
  });
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: 'privacy' });
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Simulate register
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[130px] rounded-full -z-10" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-xl p-10"
      >
        <div className="text-center mb-10">
          <Logo className="h-12 justify-center mb-10" />
          <h2 className="text-3xl font-black font-outfit uppercase tracking-tight mb-2">Create Account</h2>
          <p className="text-gray-500 font-medium tracking-tight">Join Upraze Solutions and start scaling today</p>
        </div>

        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                required 
                className="input-field pl-12" 
                placeholder="Juan Dela Cruz"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                required 
                className="input-field pl-12" 
                placeholder="juan@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Company Name</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                className="input-field pl-12" 
                placeholder="Acme Corp"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                required 
                className="input-field pl-12" 
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg md:col-span-2 mt-4">
            <UserPlus className="w-5 h-5" /> Get Started
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400 text-sm">
          By signing up, you agree to our {' '}
          <button 
            type="button"
            onClick={() => setLegalModal({ isOpen: true, type: 'terms' })}
            className="underline text-primary-500 hover:text-primary-400 transition-colors"
          >
            Terms
          </button> and {' '}
          <button 
            type="button"
            onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })}
            className="underline text-primary-500 hover:text-primary-400 transition-colors"
          >
            Privacy Policy
          </button>
        </p>

        <p className="text-center mt-6 text-gray-400">
          Already have an account? {' '}
          <Link to="/login" className="text-primary-500 font-bold hover:text-primary-400 transition-colors">Sign in</Link>
        </p>
      </motion.div>

      <LegalModal 
        isOpen={legalModal.isOpen} 
        type={legalModal.type} 
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })} 
      />
    </div>
  );
};

export default RegisterPage;
