import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const NicknameModal = ({ onComplete }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nickname.trim().length < 2) {
      setError('Nickname must be at least 2 characters.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/set-nickname`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ nickname: nickname.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store the nickname locally for immediate UI use
        localStorage.setItem('user_nickname', data.user.nickname);
        onComplete(data.user);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to set nickname.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop — no close on click (unskippable) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
      />

      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-card p-10 shadow-2xl overflow-hidden relative">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 via-orange-400 to-primary-600" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 blur-[80px] rounded-full -z-10" />

          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-orange-400 flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black font-outfit tracking-tight mb-2">Welcome to CND Upraze</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Set up your display name. This is how you'll appear across the platform.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary-500" /> Your Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Juan, JD, Boss..."
                maxLength={50}
                autoFocus
                className="input-field text-lg py-4 text-center font-bold tracking-wide"
              />
              {error && (
                <p className="text-red-400 text-xs font-bold text-center">{error}</p>
              )}
              <p className="text-[10px] text-gray-600 text-center">2–50 characters. You can change this later.</p>
            </div>

            <button
              type="submit"
              disabled={loading || nickname.trim().length < 2}
              className="btn-primary w-full !py-4 !rounded-2xl font-black tracking-widest text-xs uppercase flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting up...' : (
                <>Continue <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default NicknameModal;
