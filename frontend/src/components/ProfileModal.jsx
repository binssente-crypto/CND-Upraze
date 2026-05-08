import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const ProfileModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // Auto-clear status after 3 seconds
  React.useEffect(() => {
    if (status) {
      const timer = setTimeout(() => setStatus(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleUpdateNickname = async (e) => {
    e.preventDefault();
    
    if (nickname === user?.nickname) {
      setStatus({ type: 'error', message: 'Your nickname is already this nickname' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/profile/update-nickname`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ nickname })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Profile updated successfully' });
        onUpdate(data.user);
      } else {
        setStatus({ type: 'error', message: data.message || 'Update failed' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Connection error' });
    }
    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_URL}/profile/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          current_password: passwords.current,
          new_password: passwords.new,
          new_password_confirmation: passwords.confirm
        })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Password changed successfully' });
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        setStatus({ type: 'error', message: data.message || 'Change failed' });
      }
    } catch (e) {
      setStatus({ type: 'error', message: 'Connection error' });
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.9, opacity: 0, y: 20 }} 
            className="relative w-full max-w-lg glass-card overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/[0.05] bg-white/[0.02] flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black font-outfit uppercase tracking-tight">Account Settings</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Manage your CND identity and security</p>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-colors border border-transparent hover:border-white/10">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 bg-white/[0.02] border-b border-white/[0.05]">
              <button 
                onClick={() => { setActiveTab('profile'); setStatus(null); }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'profile' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Profile Info
              </button>
              <button 
                onClick={() => { setActiveTab('security'); setStatus(null); }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'security' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Lock className="w-3.5 h-3.5" /> Security
              </button>
            </div>

            <div className="p-8">
              {/* Status Message */}
              {status && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${
                    status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span className="text-xs font-bold">{status.message}</span>
                </motion.div>
              )}

              {activeTab === 'profile' ? (
                <form onSubmit={handleUpdateNickname} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Platform Nickname</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary-500 transition-colors" />
                      <input 
                        type="text" 
                        required 
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" 
                        placeholder="Choose your moniker..." 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl">
                    <p className="text-[10px] text-primary-400 font-bold leading-relaxed uppercase tracking-wider">
                      This nickname will be visible across the CND Neural Ecosystem and used in executive reports.
                    </p>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Profile'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Current Password</label>
                      <input 
                        type="password" 
                        required 
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" 
                        value={passwords.current} 
                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} 
                      />
                    </div>
                    <div className="h-px bg-white/5 mx-2" />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">New Password</label>
                      <input 
                        type="password" 
                        required 
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" 
                        value={passwords.new} 
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Confirm Password</label>
                      <input 
                        type="password" 
                        required 
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all" 
                        value={passwords.confirm} 
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} 
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
