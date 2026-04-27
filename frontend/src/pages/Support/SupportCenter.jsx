import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  X, 
  ChevronRight,
  User,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SupportCenter = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newInquiry, setNewInquiry] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration until connected to real backend
  useEffect(() => {
    setInquiries([
      {
        id: 1,
        subject: "Billing Issue - April 2026",
        status: "responded",
        updated_at: "2026-04-27T10:00:00Z",
        messages: [
          { sender: "Juan Dela Cruz", message: "Hi, I noticed a double charge on my last invoice.", is_admin: false, created_at: "2026-04-27T09:00:00Z" },
          { sender: "Admin Support", message: "Hello Juan! We are looking into this. It seems like a synchronization error with Stripe.", is_admin: true, created_at: "2026-04-27T10:00:00Z" }
        ]
      },
      {
        id: 2,
        subject: "How to use 3D Manipulation?",
        status: "open",
        updated_at: "2026-04-26T15:30:00Z",
        messages: [
          { sender: "Juan Dela Cruz", message: "Can you provide a tutorial for the 3D tool?", is_admin: false, created_at: "2026-04-26T15:30:00Z" }
        ]
      }
    ]);
  }, []);

  const selectedInquiry = inquiries.find(i => i.id === selectedId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedId) return;

    const newMessage = {
      sender: "Juan Dela Cruz",
      message: message,
      is_admin: false,
      created_at: new Date().toISOString()
    };

    setInquiries(prev => prev.map(inq => 
      inq.id === selectedId 
        ? { ...inq, messages: [...inq.messages, newMessage], updated_at: newMessage.created_at }
        : inq
    ));
    setMessage('');
  };

  const handleCreateInquiry = (e) => {
    e.preventDefault();
    const newId = inquiries.length + 1;
    const inquiry = {
      id: newId,
      subject: newInquiry.subject,
      status: "open",
      updated_at: new Date().toISOString(),
      messages: [
        {
          sender: "Juan Dela Cruz",
          message: newInquiry.message,
          is_admin: false,
          created_at: new Date().toISOString()
        }
      ]
    };
    setInquiries([inquiry, ...inquiries]);
    setNewInquiry({ subject: '', message: '' });
    setIsNewModalOpen(false);
    setSelectedId(newId);
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
      {/* Sidebar - Tickets List */}
      <div className="w-80 flex flex-col glass-card overflow-hidden">
        <div className="p-4 border-b border-dark-border flex items-center justify-between bg-white/5">
          <h2 className="font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            Support Inquiries
          </h2>
          <button 
            onClick={() => setIsNewModalOpen(true)}
            className="p-2 bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 border-b border-dark-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {inquiries.map(inq => (
            <button
              key={inq.id}
              onClick={() => setSelectedId(inq.id)}
              className={`w-full p-4 border-b border-dark-border text-left transition-all hover:bg-white/5 ${
                selectedId === inq.id ? 'bg-primary-600/10 border-r-2 border-r-primary-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusColor(inq.status)}`}>
                  {inq.status}
                </span>
                <span className="text-[10px] text-gray-500">
                  {new Date(inq.updated_at).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-medium text-sm truncate text-gray-200">{inq.subject}</h4>
              <p className="text-xs text-gray-500 truncate mt-1">
                {inq.messages[inq.messages.length - 1].message}
              </p>
            </button>
          ))}
          {inquiries.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">
              No inquiries found.
            </div>
          )}
        </div>
      </div>

      {/* Main Area - Conversation */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden">
        {selectedInquiry ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-dark-bg border border-dark-border rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-100">{selectedInquiry.subject}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    Ticket #{selectedInquiry.id} • Last active {new Date(selectedInquiry.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 text-xs font-medium border border-dark-border rounded-lg hover:bg-white/5 transition-colors text-gray-400">
                    Close Ticket
                 </button>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {selectedInquiry.messages.map((msg, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${!msg.is_admin ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center shadow-md ${
                    !msg.is_admin ? 'bg-primary-600' : 'bg-dark-card border border-dark-border'
                  }`}>
                    {!msg.is_admin ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4 text-primary-500" />}
                  </div>
                  <div className={`max-w-[70%] space-y-1 ${!msg.is_admin ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{msg.sender}</span>
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      !msg.is_admin 
                        ? 'bg-primary-600 text-white rounded-tr-none' 
                        : 'bg-dark-bg border border-dark-border rounded-tl-none text-gray-200'
                    }`}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-gray-600 block mt-1 uppercase font-medium">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-6 bg-white/5 border-t border-dark-border">
              <form onSubmit={handleSendMessage} className="relative">
                <input 
                  type="text" 
                  className="input-field pr-16 py-4 h-14 bg-dark-bg/80" 
                  placeholder="Type your message here..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-50">
            <div className="w-20 h-20 bg-dark-card border border-dark-border rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">Welcome to Support Center</h3>
            <p className="max-w-xs text-gray-500 mb-8">
              Select an inquiry from the sidebar to view the conversation or start a new one.
            </p>
            <button 
              onClick={() => setIsNewModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Start New Inquiry
            </button>
          </div>
        )}
      </div>

      {/* New Inquiry Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsNewModalOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass-card p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary-600" />
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">New Support Inquiry</h3>
                <button onClick={() => setIsNewModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInquiry} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Subject</label>
                  <input 
                    type="text" 
                    required
                    className="input-field" 
                    placeholder="e.g. Billing Issue, Feature Request"
                    value={newInquiry.subject}
                    onChange={(e) => setNewInquiry({...newInquiry, subject: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Message</label>
                  <textarea 
                    required
                    rows="4"
                    className="input-field resize-none py-3" 
                    placeholder="Describe your inquiry in detail..."
                    value={newInquiry.message}
                    onChange={(e) => setNewInquiry({...newInquiry, message: e.target.value})}
                  ></textarea>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsNewModalOpen(false)} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary flex-1">
                    Submit Inquiry
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
