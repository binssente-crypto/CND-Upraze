import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Trash2, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello Juan! I'm your Upraze AI Assistant. How can I help you optimize your business today?", ts: '10:00 AM' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiMsg = { 
        role: 'assistant', 
        content: `I've analyzed your request: "${input}". Based on your current growth plan, I recommend focusing on QR code engagement for your Q3 marketing campaign to boost revenue by an estimated 15%.`, 
        ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col glass-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-dark-border flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/10">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Upraze AI Assistant</h3>
            <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
               <span className="text-xs text-primary-500 font-medium uppercase tracking-wider">Online & Thinking</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"><Trash2 className="w-5 h-5" /></button>
           <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md ${
              msg.role === 'user' ? 'bg-primary-600' : 'bg-dark-card border border-dark-border'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-primary-500" />}
            </div>
            <div className={`max-w-[70%] space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
               <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                 msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none shadow-lg' 
                  : 'bg-dark-card border border-dark-border rounded-tl-none text-gray-200'
               }`}>
                 {msg.content}
               </div>
               <span className="text-[10px] text-gray-500 uppercase font-medium">{msg.ts}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 bg-white/5 border-t border-dark-border">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            className="input-field pr-24 py-4 h-16 bg-dark-bg/80" 
            placeholder="Ask anything or type a command (/forecast, /summarize)..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
             <button type="button" className="p-2 text-gray-500 hover:text-primary-500 transition-colors">
                <Sparkles className="w-5 h-5" />
             </button>
             <button type="submit" className="p-3 bg-primary-600 rounded-xl hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20">
                <Send className="w-5 h-5" />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
