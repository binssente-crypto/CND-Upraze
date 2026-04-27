import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  X, 
  ChevronRight,
  User,
  ShieldCheck,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [reply, setReply] = useState('');
  const navigate = useNavigate();

  // Mock data for Admin view
  useEffect(() => {
    setInquiries([
      {
        id: 1,
        user_name: "Juan Dela Cruz",
        user_email: "juan@upraze.com",
        subject: "Billing Issue - April 2026",
        status: "open",
        updated_at: "2026-04-27T10:00:00Z",
        messages: [
          { sender: "Juan Dela Cruz", message: "Hi, I noticed a double charge on my last invoice.", is_admin: false, created_at: "2026-04-27T09:00:00Z" }
        ]
      },
      {
        id: 2,
        user_name: "Maria Santos",
        user_email: "maria@corp.ph",
        subject: "Enterprise Plan Query",
        status: "responded",
        updated_at: "2026-04-26T15:30:00Z",
        messages: [
          { sender: "Maria Santos", message: "We want to upgrade to Enterprise. What's the process?", is_admin: false, created_at: "2026-04-26T15:30:00Z" },
          { sender: "Admin Support", message: "Hello Maria! I'll have our sales team contact you directly.", is_admin: true, created_at: "2026-04-26T16:00:00Z" }
        ]
      }
    ]);
  }, []);

  const selectedInquiry = inquiries.find(i => i.id === selectedId);

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!reply.trim() || !selectedId) return;

    const newMessage = {
      sender: "Admin Support",
      message: reply,
      is_admin: true,
      created_at: new Date().toISOString()
    };

    setInquiries(prev => prev.map(inq => 
      inq.id === selectedId 
        ? { ...inq, messages: [...inq.messages, newMessage], status: 'responded', updated_at: newMessage.created_at }
        : inq
    ));
    setReply('');
  };

  const handleCloseTicket = (id) => {
    setInquiries(prev => prev.map(inq => 
      inq.id === id ? { ...inq, status: 'closed' } : inq
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-primary-500 bg-primary-500/10 border-primary-500/20';
      case 'responded': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'closed': return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6">
      {/* Sidebar - All Inquiries */}
      <div className="w-96 flex flex-col glass-card overflow-hidden">
        <div className="p-6 border-b border-dark-border flex items-center justify-between bg-white/5">
          <div>
            <h2 className="font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-500" />
              Support Inbox
            </h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin View</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full"></span>
             <span className="text-[10px] text-gray-400 font-bold">LIVE</span>
          </div>
        </div>

        <div className="p-4 border-b border-dark-border bg-dark-bg/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search user or subject..." 
              className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {inquiries.map(inq => (
            <button
              key={inq.id}
              onClick={() => setSelectedId(inq.id)}
              className={`w-full p-5 border-b border-dark-border text-left transition-all hover:bg-white/5 relative ${
                selectedId === inq.id ? 'bg-primary-600/10' : ''
              }`}
            >
              {selectedId === inq.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 shadow-[0_0_10px_#e67e22]" />}
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${getStatusColor(inq.status)}`}>
                  {inq.status}
                </span>
                <span className="text-[10px] text-gray-500 font-medium">
                  {new Date(inq.updated_at).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-sm text-gray-200 mb-1">{inq.subject}</h4>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                    <User className="w-2.5 h-2.5 text-white" />
                 </div>
                 <span className="text-xs text-gray-400">{inq.user_name}</span>
              </div>
              <p className="text-xs text-gray-500 truncate italic">
                "{inq.messages[inq.messages.length - 1].message}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area - Conversation Management */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {selectedInquiry ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dark-bg border border-dark-border rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-100">{selectedInquiry.user_name}</h3>
                    <span className="text-xs text-gray-500">• {selectedInquiry.user_email}</span>
                  </div>
                  <p className="text-xs text-primary-500 font-bold uppercase tracking-widest mt-0.5">
                    {selectedInquiry.subject}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                 <button 
                  onClick={() => handleCloseTicket(selectedInquiry.id)}
                  className="px-4 py-2 text-xs font-bold bg-dark-bg border border-dark-border rounded-xl hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all text-gray-400"
                 >
                    Close & Archive
                 </button>
              </div>
            </div>

            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-dark-bg/20">
              {selectedInquiry.messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: msg.is_admin ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-6 ${msg.is_admin ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                    msg.is_admin ? 'bg-primary-600' : 'bg-dark-card border border-dark-border'
                  }`}>
                    {msg.is_admin ? <ShieldCheck className="w-5 h-5" /> : <User className="w-5 h-5 text-primary-500" />}
                  </div>
                  <div className={`max-w-[65%] space-y-2 ${msg.is_admin ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 ${msg.is_admin ? 'justify-end' : ''}`}>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{msg.sender}</span>
                      <span className="text-[9px] text-gray-600 font-bold">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-xl ${
                      msg.is_admin 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-dark-card border border-dark-border rounded-tl-none text-gray-200'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Reply Editor */}
            <div className="p-8 bg-white/5 border-t border-dark-border">
              <form onSubmit={handleSendReply} className="relative group">
                <textarea 
                  className="input-field pr-20 py-5 min-h-[80px] h-20 bg-dark-bg/80 border-2 border-dark-border focus:border-primary-500/50 transition-all resize-none overflow-hidden" 
                  placeholder="Draft your reply to the customer..." 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-3 bottom-3 p-3 bg-primary-600 rounded-2xl hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20 group-hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <div className="flex justify-between mt-3 px-1">
                 <p className="text-[10px] text-gray-500 font-medium italic">Customer will be notified via email upon submission.</p>
                 <div className="flex gap-4 text-[10px] font-bold text-primary-500">
                    <button type="button" className="hover:underline">USE TEMPLATE</button>
                    <button type="button" className="hover:underline">INSERT KNOWLEDGE BASE</button>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <div className="w-32 h-32 bg-dark-card border border-dark-border rounded-[2.5rem] flex items-center justify-center mb-10 rotate-3 shadow-2xl">
              <MessageSquare className="w-16 h-16 text-primary-500 -rotate-3" />
            </div>
            <h3 className="text-3xl font-black text-gray-100 mb-4 tracking-tight">Customer Success Inbox</h3>
            <p className="max-w-md text-gray-500 mb-10 text-lg leading-relaxed">
              Real-time monitoring of all incoming inquiries. Pick a ticket from the left to start assisting our users.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
               <div className="p-4 bg-white/5 border border-dark-border rounded-2xl text-center">
                  <p className="text-2xl font-bold text-primary-500">12</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Open Tickets</p>
               </div>
               <div className="p-4 bg-white/5 border border-dark-border rounded-2xl text-center">
                  <p className="text-2xl font-bold text-green-500">4m</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Avg Response</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
