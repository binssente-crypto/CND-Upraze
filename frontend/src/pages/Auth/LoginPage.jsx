import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, ShieldCheck, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../components/Logo';

const LoginPage = () => {
  const [step, setStep] = useState('login'); // 'login' or 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Handle Automatic Verification from Email Button
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isVerify = params.get('verify');
    const emailParam = params.get('email');
    const otpParam = params.get('otp');

    if (isVerify && emailParam && otpParam) {
      setEmail(emailParam);
      const otpArray = otpParam.split('').slice(0, 6);
      setOtp(otpArray);
      setStep('verify');
      
      // Auto-trigger verification after state updates
      const performAutoVerify = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_URL}/verify-otp`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ email: emailParam, otp: otpParam }),
          });
          const data = await response.json();
          if (response.ok) {
            localStorage.setItem('auth_token', data.token);
            navigate('/dashboard');
          } else {
            setError(data.message || 'Auto-verification failed. Please try again.');
          }
        } catch (err) {
          setError('Auto-verification error.');
        } finally {
          setLoading(false);
        }
      };
      performAutoVerify();
    }
  }, [navigate, API_URL]);

  useEffect(() => {
    let interval;
    if (step === 'verify' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.email?.[0] || 'Login failed');
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

    // Auto-focus next input
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
        body: JSON.stringify({ email, otp: otp.join('') }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.otp?.[0] || 'Verification failed');
      }

      // Store token
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
            <p className="text-primary-500 font-black uppercase tracking-widest text-[10px]">Authenticating Protocol...</p>
          </motion.div>
        </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 blur-[120px] rounded-full -z-10" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <AnimatePresence mode="wait">
        {step === 'login' ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-card w-full max-w-md p-10"
          >
            <div className="text-center mb-10">
              <Logo className="h-12 justify-center mb-10" />
              <h2 className="text-3xl font-black font-outfit uppercase tracking-tight mb-2">Welcome Back</h2>
              <p className="text-gray-500 font-medium tracking-tight">Access your node via secure terminal</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                {error}
              </div>
            )}

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

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
              >
                {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />} 
                {loading ? 'Processing...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center mt-8 text-gray-400">
              Don't have an account? {' '}
              <Link to="/register" className="text-primary-500 font-bold hover:text-primary-400 transition-colors">Create one</Link>
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card w-full max-w-md p-10"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-primary-500" />
              </div>
              <h2 className="text-3xl font-black font-outfit uppercase tracking-tight mb-2">Verify Identity</h2>
              <p className="text-gray-500 font-medium tracking-tight">
                A secure code was sent to <span className="text-white">{email}</span>
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    maxLength="1"
                    className="w-12 h-14 bg-dark-bg/50 border border-gray-800 rounded-xl text-center text-2xl font-bold text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                  />
                ))}
              </div>

              <button 
                type="submit" 
                disabled={otp.some(d => !d) || loading}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>

            <div className="text-center mt-10">
              <p className="text-gray-500 text-sm mb-4">Didn't receive the code?</p>
              {timer > 0 ? (
                <p className="text-gray-400 font-medium">Resend available in <span className="text-primary-500">{timer}s</span></p>
              ) : (
                <button 
                  onClick={() => { setTimer(30); setOtp(['','','','','','']); }}
                  className="flex items-center justify-center gap-2 text-primary-500 font-bold hover:text-primary-400 transition-colors mx-auto"
                >
                  <RefreshCcw className="w-4 h-4" /> Resend Code
                </button>
              )}
            </div>

            <button 
              onClick={() => setStep('login')}
              className="mt-8 text-sm text-gray-500 hover:text-white transition-colors"
            >
              ← Back to Login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;

