import React, { useState, useEffect, useRef } from 'react';
import { Send, Plus, MessageSquare, X, User, ShieldCheck, Search, Clock, CheckCircle, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem('auth_token');
const headers = () => ({ 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json', 'Accept': 'application/json' });

const CATEGORIES = [
  { value: 'system_inquiry', label: 'System Inquiry', desc: 'Request a new system build' },
  { value: 'technical', label: 'Technical', desc: 'Technical support' },
  { value: 'general', label: 'General', desc: 'Other inquiries' },
];

const SupportCenter = () => {
  const [threads, setThreads] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newInquiry, setNewInquiry] = useState({ subject: '', message: '', category: 'system_inquiry' });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchThreads(); }, []);
  useEffect(() => { if (selectedId) fetchThread(selectedId); }, [selectedId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeThread?.messages]);

  const fetchThreads = async () => {
    try {
      const res = await fetch(`${API_URL}/support/threads`, { headers: headers() });
      if (res.ok) setThreads(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchThread = async (id) => {
    try {
      const res = await fetch(`${API_URL}/support/threads/${id}`, { headers: headers() });
      if (res.ok) setActiveThread(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedId || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/support/threads/${selectedId}/messages`, {
        method: 'POST', headers: headers(), body: JSON.stringify({ message }),
      });
      if (res.ok) { setMessage(''); fetchThread(selectedId); fetchThreads(); }
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const handleCreateInquiry = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/support/threads`, {
        method: 'POST', headers: headers(), body: JSON.stringify(newInquiry),
      });
      if (res.ok) {
        const thread = await res.json();
        setNewInquiry({ subject: '', message: '', category: 'system_inquiry' });
        setIsNewModalOpen(false);
        fetchThreads();
        setSelectedId(thread.id);
      }
    } catch (e) { console.error(e); }
  };

  const getStatusColor = (s) => {
    const map = { open: 'text-primary-500 bg-primary-500/10 border-primary-500/20', responded: 'text-green-500 bg-green-500/10 border-green-500/20', in_progress: 'text-blue-500 bg-blue-500/10 border-blue-500/20', closed: 'text-gray-500 bg-gray-500/10 border-gray-500/20' };
    return map[s] || map.closed;
  };

  const getCategoryIcon = (c) => {
    const icons = { system_inquiry: '🏗️', technical: '⚙️', general: '💬' };
    return icons[c] || '💬';
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Sidebar */}
      <div className="w-80 flex flex-col glass-card overflow-hidden">
        <div className="p-4 border-b border-dark-border flex items-center justify-between bg-white/5">
          <h2 className="font-bold flex items-center gap-2">
            <Headphones className="w-5 h-5 text-primary-500" /> My Inquiries
          </h2>
          <button onClick={() => setIsNewModalOpen(true)} className="p-2 bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 border-b border-dark-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search..." className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {threads.map(t => (
            <button key={t.id} onClick={() => setSelectedId(t.id)}
              className={`w-full p-4 border-b border-dark-border text-left transition-all hover:bg-white/5 ${selectedId === t.id ? 'bg-primary-600/10 border-r-2 border-r-primary-500' : ''}`}>
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(t.status)}`}>{t.status}</span>
                </div>
                {t.unread_count > 0 && <span className="w-5 h-5 bg-primary-500 rounded-full text-[10px] font-bold flex items-center justify-center">{t.unread_count}</span>}
              </div>
              <h4 className="font-medium text-sm truncate text-gray-200 mt-1">{t.subject}</h4>
              {t.latest_message && <p className="text-xs text-gray-500 truncate mt-1">{t.latest_message.message}</p>}
            </button>
          ))}
          {!loading && threads.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">No inquiries yet.</div>}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {activeThread ? (
          <>
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-100">{activeThread.subject}</h3>
                  <p className="text-xs text-gray-500">Thread #{activeThread.id} • {activeThread.category?.replace('_', ' ')}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${getStatusColor(activeThread.status)}`}>{activeThread.status}</span>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {activeThread.messages?.map((msg, idx) => {
                const isAdmin = msg.sender?.role === 'admin' || msg.sender?.role === 'superadmin';
                const isMe = !isAdmin;
                return (
                  <motion.div key={msg.id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md ${isMe ? 'bg-primary-600' : 'bg-dark-card border border-dark-border'}`}>
                      {isMe ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4 text-primary-500" />}
                    </div>
                    <div className={`max-w-[70%] space-y-1 flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{msg.sender?.name || 'You'}</span>
                        <span className="text-[10px] text-gray-600">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm text-left ${isMe ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-dark-bg border border-dark-border rounded-tl-none text-gray-200'}`}>
                        {msg.message}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {activeThread.status !== 'closed' && (
              <div className="p-6 bg-white/5 border-t border-dark-border">
                <form onSubmit={handleSendMessage} className="relative">
                  <input type="text" className="input-field pr-16 py-4 h-14 bg-dark-bg/80" placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                  <button type="submit" disabled={sending} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors shadow-lg disabled:opacity-50">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
            <div className="w-20 h-20 bg-dark-card border border-dark-border rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">Support Center</h3>
            <p className="max-w-xs text-gray-500 mb-8">Select an inquiry or start a new one to chat with our team.</p>
            <button onClick={() => setIsNewModalOpen(true)} className="btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" /> New Inquiry
            </button>
          </div>
        )}
      </div>

      {/* New Inquiry Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsNewModalOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg glass-card p-8 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary-600" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">New Support Inquiry</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateInquiry} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(c => (
                      <button key={c.value} type="button" onClick={() => setNewInquiry({ ...newInquiry, category: c.value })}
                        className={`p-3 rounded-xl border text-left transition-all ${newInquiry.category === c.value ? 'border-primary-500 bg-primary-500/10' : 'border-dark-border hover:bg-white/5'}`}>
                        <p className="text-sm font-bold">{c.label}</p>
                        <p className="text-[10px] text-gray-500">{c.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Subject</label>
                  <input type="text" required className="input-field" placeholder="e.g. System Build Request" value={newInquiry.subject} onChange={(e) => setNewInquiry({ ...newInquiry, subject: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Message</label>
                  <textarea required rows="4" className="input-field resize-none py-3" placeholder="Describe what you need..." value={newInquiry.message} onChange={(e) => setNewInquiry({ ...newInquiry, message: e.target.value })} />
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsNewModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                  <button
                    type="submit"
                    disabled={!newInquiry.subject.trim() || !newInquiry.message.trim()}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupportCenter;
