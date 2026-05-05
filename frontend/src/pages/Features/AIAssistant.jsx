import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Trash2, MoreVertical, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`${API_URL}/features/ai-assistant`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Accept': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setConversationId(data[0].id);
            setMessages(data[0].messages || []);
          } else {
            setMessages([
              { role: 'assistant', content: "Hello! I'm your Upraze AI Assistant. How can I help you optimize your business today?", ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      }
    };
    
    fetchConversations();
  }, [API_URL]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/features/ai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          message: userMsg.content,
          conversation_id: conversationId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.id);
        setMessages(data.messages || []);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again.", ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, a network error occurred.", ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsLoading(false);
    }
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
               <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-primary-500 animate-pulse'}`}></span>
               <span className={`text-xs font-medium uppercase tracking-wider ${isLoading ? 'text-yellow-500' : 'text-primary-500'}`}>
                 {isLoading ? 'Processing Request' : 'Online & Thinking'}
               </span>
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
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md bg-dark-card border border-dark-border">
              <Bot className="w-5 h-5 text-primary-500 animate-pulse" />
            </div>
            <div className="max-w-[70%] space-y-1">
               <div className="p-4 rounded-2xl text-sm leading-relaxed bg-dark-card border border-dark-border rounded-tl-none text-gray-200">
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

      {/* Input */}
      <div className="p-6 bg-white/5 border-t border-dark-border">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            className="input-field pr-24 py-4 h-16 bg-dark-bg/80 disabled:opacity-50" 
            placeholder="Ask anything or type a command (/forecast, /summarize)..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
             <button type="button" className="p-2 text-gray-500 hover:text-primary-500 transition-colors disabled:opacity-50" disabled={isLoading}>
                <Sparkles className="w-5 h-5" />
             </button>
             <button type="submit" className="p-3 bg-primary-600 rounded-xl hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
