import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, ArrowLeft, Check, ShieldCheck, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LegalModal from '../../components/LegalModal';
import Logo from '../../components/Logo';

const RegisterPage = () => {
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: 'privacy' });
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let interval;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const passwordRequirements = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'One uppercase letter', regex: /[A-Z]/ },
    { label: 'One number', regex: /[0-9]/ },
  ];

  const checkRequirement = (regex) => regex.test(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Registration failed');
      }

      setStep('verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: formData.email, otp: otp.join('') }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.otp?.[0] || 'Verification failed');
      }

      localStorage.setItem('auth_token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-dark-bg flex items-center justify-center p-8 relative overflow-hidden transition-all ${loading ? 'pointer-events-none select-none cursor-wait' : ''}`}>
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-dark-bg/40 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-primary-500 font-black uppercase tracking-widest text-[10px]">Processing Node Data...</p>
          </motion.div>
        </div>
      )}

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-600/10 blur-[130px] rounded-full -z-10" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <AnimatePresence mode="wait">
        {step === 'register' ? (
          <motion.div 
            key="register"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-card w-full max-w-xl p-10"
          >
            <div className="text-center mb-10">
              <Logo className="h-12 justify-center mb-10" />
              <h2 className="text-3xl font-black font-outfit uppercase tracking-tight mb-2">Create Account</h2>
              <p className="text-gray-500 font-medium tracking-tight">Join Upraze Solutions and start scaling today</p>
              
              {error && (
                <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}
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

              <div className="space-y-2 md:col-span-2">
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

              <div className="space-y-4 md:col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="password" 
                      required 
                      className="input-field pl-12" 
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-1">
                  {passwordRequirements.map((req, i) => {
                    const isMet = checkRequirement(req.regex);
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${isMet ? 'bg-green-500/20' : 'bg-gray-800'}`}>
                          {isMet ? <Check className="w-2.5 h-2.5 text-green-500" /> : <div className="w-1 h-1 bg-gray-600 rounded-full" />}
                        </div>
                        <span className={`text-[11px] font-medium transition-colors ${isMet ? 'text-gray-300' : 'text-gray-500'}`}>
                          {req.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg md:col-span-2 mt-4 disabled:opacity-50"
              >
                {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />} 
                {loading ? 'Creating Account...' : 'Get Started'}
              </button>
            </form>

            <p className="text-center mt-8 text-gray-400 text-sm">
              By signing up, you agree to our {' '}
              <button onClick={() => setLegalModal({ isOpen: true, type: 'terms' })} className="underline text-primary-500 hover:text-primary-400 transition-colors">Terms</button> and {' '}
              <button onClick={() => setLegalModal({ isOpen: true, type: 'privacy' })} className="underline text-primary-500 hover:text-primary-400 transition-colors">Privacy Policy</button>
            </p>

            <p className="text-center mt-6 text-gray-400">
              Already have an account? {' '}
              <Link to="/login" className="text-primary-500 font-bold hover:text-primary-400 transition-colors">Sign in</Link>
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card w-full max-w-xl p-10"
          >
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-ping" />
                <Mail className="w-12 h-12 text-primary-500 relative z-10" />
              </div>
              <h2 className="text-3xl font-black font-outfit uppercase tracking-tight mb-2">Check Your Email</h2>
              <p className="text-gray-500 font-medium tracking-tight mb-8">
                We've sent a verification link to <span className="text-white font-bold">{formData.email}</span>. 
                Please click the button in the email to activate your account.
              </p>

              <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl p-6 mb-8">
                <p className="text-sm text-gray-400 mb-4 italic">
                  "The verification button will automatically log you into your secure dashboard."
                </p>
                <div className="flex items-center justify-center gap-2 text-primary-500 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Secure Link Sent</span>
                </div>
              </div>

              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <a 
                  href={`https://mail.google.com/mail/u/0/#search/from%3A(CND+Upraze)+verification`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg"
                >
                  <Mail className="w-5 h-5" /> Open Gmail
                </a>

                <div className="flex items-center justify-center gap-4 text-sm mt-8">
                  {timer > 0 ? (
                    <p className="text-gray-500">Resend email in <span className="text-white font-bold">{timer}s</span></p>
                  ) : (
                    <button 
                      onClick={handleRegister}
                      className="text-primary-500 font-bold hover:text-primary-400 transition-colors flex items-center gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" /> Resend Verification Email
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep('register')}
              className="mt-10 text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Edit email address
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <LegalModal 
        isOpen={legalModal.isOpen} 
        type={legalModal.type} 
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })} 
      />
    </div>
  );
};

export default RegisterPage;
