import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 blur-[120px] rounded-full -z-10" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10"
      >
        <div className="text-center mb-10">
          <Logo className="h-12 justify-center mb-10" />
          <h2 className="text-3xl font-black font-outfit uppercase tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-medium tracking-tight">Access your node via secure terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                required 
                className="input-field pl-12" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-400">Password</label>
                <a href="#" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">Forgot?</a>
             </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                required 
                className="input-field pl-12" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg">
            <LogIn className="w-5 h-5" /> Sign In
          </button>
        </form>

        <p className="text-center mt-8 text-gray-400">
          Don't have an account? {' '}
          <Link to="/register" className="text-primary-500 font-bold hover:text-primary-400 transition-colors">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
