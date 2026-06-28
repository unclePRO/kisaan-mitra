'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, MessageSquare, Plus, Settings, Sun, CloudRain, TrendingUp, 
  Landmark, User, Send, Mic, Image as ImageIcon, Copy, ThumbsUp, 
  ThumbsDown, Volume2, Menu, X, ChevronDown, CheckCircle2 
} from 'lucide-react';

export default function KisaanMitraApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello! How can I help your farming today?" }
  ]);
  const [input, setInput] = useState("");

  return (
    <div className="flex h-screen bg-[#111827] text-[#f9fafb] font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className="bg-[#0b1220] border-r border-[#1f2937] flex flex-col h-full"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg"><Leaf size={24} /></div>
          <h1 className="font-bold text-xl">Kisaan Mitra</h1>
        </div>
        
        <div className="px-4 mb-6">
          <button className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all">
            <Plus size={20} /> New Chat
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <p className="text-xs text-[#9ca3af] uppercase font-bold px-2 mb-2">Recent</p>
          {['Best fertilizer for wheat', 'Tomato disease', 'Weather tomorrow'].map((item, i) => (
            <button key={i} className="w-full text-left p-3 rounded-lg hover:bg-[#1f2937] text-sm text-[#9ca3af] hover:text-white transition">
              {item}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-[70px] border-b border-[#1f2937] flex items-center justify-between px-6 bg-[#111827]">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20} /></button>
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">🤖</div>
            <span className="font-semibold">Kisaan Mitra AI</span>
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#1f2937] rounded-full"><Sun size={20} /></button>
            <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center border border-[#374151]">U</div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[850px] mx-auto space-y-8">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${m.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {m.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-[#1f2937] flex items-center justify-center">🤖</div>}
                  <div className={`p-5 rounded-[18px] max-w-[80%] ${
                    m.sender === 'user' ? 'bg-green-600' : 'bg-[#1f2937] border border-[#374151]'
                  }`}>
                    {m.text}
                    {m.sender === 'ai' && (
                      <div className="flex gap-4 mt-4 pt-4 border-t border-[#374151]">
                        <Copy size={16} className="cursor-pointer hover:text-green-500" />
                        <ThumbsUp size={16} className="cursor-pointer hover:text-green-500" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#111827]">
          <div className="max-w-[850px] mx-auto">
            <div className="flex gap-2 mb-4">
              {['🌾 Crop Advice', '☀ Weather', '💰 Market Prices', '🏛 Schemes'].map(chip => (
                <button key={chip} className="px-4 py-1.5 rounded-full bg-[#1f2937] border border-[#374151] text-xs hover:bg-[#2d3748] transition">
                  {chip}
                </button>
              ))}
            </div>
            <div className="relative flex items-center h-[64px] bg-[#1f2937] border border-[#374151] rounded-[30px] px-6">
              <ImageIcon className="text-[#9ca3af] cursor-pointer hover:text-white" />
              <input 
                className="flex-1 bg-transparent px-4 outline-none" 
                placeholder="Ask anything about crops..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="bg-green-600 p-2 rounded-full hover:bg-green-500 transition">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}