import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Send, MessageSquare, User, ShieldCheck, Search, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL;
const getToken = () => localStorage.getItem('auth_token');
const headers = () => ({ 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'application/json', 'Accept': 'application/json' });

const AdminInquiries = () => {
  const { user: currentUser } = useOutletContext();
  const [threads, setThreads] = useState([]);
  const [activeTab, setActiveTab] = useState('available'); // available, mine, closed
  const [selectedId, setSelectedId] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [reply, setReply] = useState('');
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
  };

  const filteredThreads = threads.filter(t => {
    if (activeTab === 'mine') return t.assigned_admin_id === currentUser?.id && t.status !== 'closed';
    if (activeTab === 'closed') return t.status === 'closed';
    return !t.assigned_admin_id && t.status !== 'closed';
  });

  const fetchThread = async (id) => {
    try {
      const res = await fetch(`${API_URL}/support/threads/${id}`, { headers: headers() });
      if (res.ok) setActiveThread(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedId || sending) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/support/threads/${selectedId}/messages`, {
        method: 'POST', headers: headers(), body: JSON.stringify({ message: reply }),
      });
      if (res.ok) { setReply(''); fetchThread(selectedId); fetchThreads(); }
    } catch (e) { console.error(e); }
    setSending(false);
  };

  const handleCloseTicket = async (id) => {
    try {
      await fetch(`${API_URL}/support/threads/${id}/close`, { method: 'PATCH', headers: headers() });
      fetchThreads();
      if (selectedId === id) fetchThread(id);
    } catch (e) { console.error(e); }
  };

  const handleReopenTicket = async (id) => {
    try {
      await fetch(`${API_URL}/support/threads/${id}/reopen`, { method: 'PATCH', headers: headers() });
      fetchThreads();
      if (selectedId === id) fetchThread(id);
    } catch (e) { console.error(e); }
  };

  const handleAssign = async (id) => {
    try {
      await fetch(`${API_URL}/support/threads/${id}/assign`, { method: 'PATCH', headers: headers() });
      fetchThreads();
      fetchThread(id);
    } catch (e) { console.error(e); }
  };

  const handleUnassign = async (id) => {
    try {
      await fetch(`${API_URL}/support/threads/${id}/unassign`, { method: 'PATCH', headers: headers() });
      fetchThreads();
      fetchThread(id);
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
      <div className="w-96 flex flex-col glass-card overflow-hidden">
        <div className="p-6 border-b border-dark-border flex items-center justify-between bg-white/5">
          <div>
            <h2 className="font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary-500" /> Support Inbox</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin View</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-[10px] text-gray-400 font-bold">LIVE</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-dark-bg/50 border-b border-dark-border gap-1">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'available' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Available ({threads.filter(t => !t.assigned_admin_id && t.status !== 'closed').length})
          </button>
          <button
            onClick={() => setActiveTab('mine')}
            className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'mine' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            My Desk ({threads.filter(t => t.assigned_admin_id === currentUser?.id && t.status !== 'closed').length})
          </button>
          <button
            onClick={() => setActiveTab('closed')}
            className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'closed' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Archived ({threads.filter(t => t.status === 'closed').length})
          </button>
        </div>

        <div className="p-4 border-b border-dark-border bg-dark-bg/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Search user or subject..." className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredThreads.map(t => (
            <button key={t.id} onClick={() => setSelectedId(t.id)}
              className={`w-full p-5 border-b border-dark-border text-left transition-all hover:bg-white/5 relative ${selectedId === t.id ? 'bg-primary-600/10' : ''}`}>
              {selectedId === t.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 shadow-[0_0_10px_#e67e22]" />}
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${getStatusColor(t.status)}`}>{t.status}</span>
                </div>
                {t.unread_count > 0 && <span className="w-5 h-5 bg-primary-500 rounded-full text-[10px] font-bold flex items-center justify-center">{t.unread_count}</span>}
              </div>
              <h4 className="font-bold text-sm text-gray-200 mb-1">{t.subject}</h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400">{t.user?.name || 'User'}</span>
              </div>
              {t.latest_message && <p className="text-xs text-gray-500 truncate italic">"{t.latest_message.message}"</p>}
            </button>
          ))}
          {filteredThreads.length === 0 && (
            <div className="p-10 text-center text-gray-600">
               <p className="text-xs font-bold uppercase tracking-widest">No {activeTab} tickets</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {activeThread ? (
          <>
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dark-bg border border-dark-border rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-100">{activeThread.user?.name || 'User'}</h3>
                    <span className="text-xs text-gray-500">• {activeThread.user?.email || ''}</span>
                  </div>
                  <p className="text-xs text-primary-500 font-bold uppercase tracking-widest mt-0.5">{activeThread.subject}</p>
                </div>
              </div>
              <div className="flex gap-3">
                {activeThread.assigned_admin_id !== currentUser?.id && activeThread.status !== 'closed' && (
                  <button onClick={() => handleAssign(activeThread.id)} className="px-4 py-2 text-xs font-bold bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all text-blue-400">
                    {activeThread.assigned_admin_id ? 'Take Over' : 'Assign to Me'}
                  </button>
                )}
                {activeThread.assigned_admin_id === currentUser?.id && activeThread.status !== 'closed' && (
                  <button onClick={() => handleUnassign(activeThread.id)} className="px-4 py-2 text-xs font-bold bg-orange-500/10 border border-orange-500/20 rounded-xl hover:bg-orange-500/20 transition-all text-orange-400">
                    Return to Available
                  </button>
                )}
                {activeThread.status !== 'closed' ? (
                  <button onClick={() => handleCloseTicket(activeThread.id)} className="px-4 py-2 text-xs font-bold bg-dark-bg border border-dark-border rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all text-gray-400">
                    Close & Archive
                  </button>
                ) : (
                  <button onClick={() => handleReopenTicket(activeThread.id)} className="px-4 py-2 text-xs font-bold bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all text-green-400">
                    Reopen Ticket
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-dark-bg/20">
              {activeThread.messages?.map((msg, idx) => {
                const isAdmin = msg.sender?.role === 'admin' || msg.sender?.role === 'superadmin';
                return (
                  <motion.div key={msg.id || idx} initial={{ opacity: 0, x: isAdmin ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex gap-6 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg ${isAdmin ? 'bg-primary-600' : 'bg-dark-card border border-dark-border'}`}>
                      {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5 text-primary-500" />}
                    </div>
                    <div className={`max-w-[65%] space-y-2 flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                      <div className={`flex items-center gap-2 mb-1`}>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{msg.sender?.name || 'Unknown'}</span>
                        <span className="text-[9px] text-gray-600 font-bold">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                      <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-xl text-left ${isAdmin ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-dark-card border border-dark-border rounded-tl-none text-gray-200'}`}>
                        {msg.message}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {activeThread.status !== 'closed' && (
              <div className="p-8 bg-white/5 border-t border-dark-border">
                <form onSubmit={handleSendReply} className="relative group">
                  <textarea className="input-field pr-20 py-5 min-h-[80px] h-20 bg-dark-bg/80 border-2 border-dark-border focus:border-primary-500/50 transition-all resize-none overflow-hidden" placeholder="Draft your reply..." value={reply} onChange={(e) => setReply(e.target.value)} />
                  <button type="submit" disabled={sending} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-primary-600 rounded-2xl hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50">
                    <Send className="w-5 h-5" />
                  </button>
                </form>

              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <div className="w-32 h-32 bg-dark-card border border-dark-border rounded-[2.5rem] flex items-center justify-center mb-10 rotate-3 shadow-2xl">
              <MessageSquare className="w-16 h-16 text-primary-500 -rotate-3" />
            </div>
            <h3 className="text-3xl font-black text-gray-100 mb-4 tracking-tight">Customer Success Inbox</h3>
            <p className="max-w-md text-gray-500 mb-10 text-lg leading-relaxed">Pick a ticket from the left to start assisting our customers.</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              <div className="p-4 bg-white/5 border border-dark-border rounded-2xl text-center">
                <p className="text-2xl font-bold text-primary-500">{threads.filter(t => t.status === 'open').length}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Open Tickets</p>
              </div>
              <div className="p-4 bg-white/5 border border-dark-border rounded-2xl text-center">
                <p className="text-2xl font-bold text-green-500">{threads.filter(t => t.status === 'responded').length}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Responded</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
