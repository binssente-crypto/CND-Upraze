import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PublicAIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the CND Upraze public assistant. I can answer questions about our features and services like AI Assistance, Forecasting, Vision AI, and QR Codes. How can I help you explore our platform?", ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/public/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...newMessages, { role: 'assistant', content: data.reply, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I encountered an error. Please try again.", ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, a network error occurred.", ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl flex flex-col h-[80vh] max-h-[800px] overflow-hidden relative"
      >
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">CND Upraze Guide</h3>
              <div className="flex items-center gap-2">
                 <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-primary-500 animate-pulse'}`}></span>
                 <span className={`text-xs font-medium uppercase tracking-wider ${isLoading ? 'text-yellow-500' : 'text-primary-500'}`}>
                   {isLoading ? 'Processing' : 'Online'}
                 </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar z-10">
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${
                msg.role === 'user' ? 'bg-primary-600' : 'bg-white/5 border border-white/10'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-primary-400" />}
              </div>
              <div className={`max-w-[80%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                 <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                   msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none shadow-lg' 
                    : 'bg-white/5 border border-white/10 rounded-tl-none text-gray-200'
                 }`}>
                   {msg.content}
                 </div>
                 <span className="text-[10px] text-gray-500 uppercase font-medium">{msg.ts}</span>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md bg-white/5 border border-white/10">
                <Bot className="w-5 h-5 text-primary-400 animate-pulse" />
              </div>
              <div className="max-w-[70%] space-y-1">
                 <div className="p-4 rounded-2xl text-sm leading-relaxed bg-white/5 border border-white/10 rounded-tl-none text-gray-200">
                   <div className="flex gap-1.5 items-center h-5">
                     <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                     <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                     <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                   </div>
                 </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Footer Actions */}
        <div className="p-5 bg-white/[0.02] border-t border-white/10 z-10">
          <form onSubmit={handleSend} className="relative mb-4">
            <input 
              type="text" 
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-5 pr-14 py-4 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all disabled:opacity-50" 
              placeholder="Ask about our features..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
            </button>
          </form>
          
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Limited Public Preview</span>
            <button 
              type="button"
              onClick={() => { onClose(); navigate('/dashboard/ai-assistant'); }}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-colors"
            >
              Access Full Feature <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PublicAIChatbot;
