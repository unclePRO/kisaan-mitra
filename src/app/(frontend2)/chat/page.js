"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Menu, X, Send, Mic, Image as ImageIcon, 
  Cloud, Bug, User, ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- STATE ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState("Unknown Location");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- API CALLS ---
  const fetchRecentChats = async () => {
    try {
      const res = await fetch('/api/chat/sessions');
      const data = await res.json();
      if (Array.isArray(data)) setRecentChats(data);
    } catch (err) {
      console.error("Failed to load recent chats", err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profile?.location) {
          setUserLocation(`${data.profile.district}, ${data.profile.state}`);
        }
      }
    } catch (err) {
      console.error("Failed to load profile location", err);
    }
  };

    // --- PROTECT ROUTE & FETCH INITIAL DATA ---
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

// --- PROTECT ROUTE & FETCH INITIAL DATA ---
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchRecentChats();
      fetchUserProfile();
    }
  }, [status]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadChatSession = async (chatId) => {
    setCurrentChatId(chatId);
    setMessages([]);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chat/sessions/${chatId}`);
      const data = await res.json();
      if (data.history) setMessages(data.history);
    } catch (err) {
      console.error("Failed to load session", err);
    } finally {
      setIsLoading(false);
    }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const startNewChat = () => {
    setCurrentChatId(Date.now().toString());
    setMessages([]);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // --- MESSAGE HANDLERS ---
  const handleSend = async (customText = null, imageData = null) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && !imageData) return;

    // Ensure we have a chat ID
    const activeChatId = currentChatId || Date.now().toString();
    if (!currentChatId) setCurrentChatId(activeChatId);

    if (!customText) setInputText("");

    // Optimistic UI Update
    const displayMsg = imageData ? `[Image Uploaded] ${textToSend}` : textToSend;
    setMessages((prev) => [...prev, { role: "user", parts: [{ text: displayMsg }] }]);
    setIsLoading(true);

    try {
      const payload = { message: textToSend, chatId: activeChatId };
      if (imageData) payload.image = imageData;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages((prev) => [...prev, { role: "model", parts: [{ text: data.reply }] }]);
        fetchRecentChats(); // Refresh sidebar titles
      }
    } catch (error) {
      console.error("Network Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // --- SMART FEATURES ---
  const handleWeatherClick = () => {
    startNewChat();
    const prompt = `What is the current weather forecast for ${userLocation}, and based on that, what farming activities should I prioritize or avoid today?`;
    handleSend(prompt);
  };

  const handleDiseaseDetectionClick = () => {
    startNewChat();
    setMessages([{ 
      role: "model", 
      parts: [{ text: "Please click the camera icon below to upload a clear photo of the affected crop leaf, and I will analyze it for diseases." }] 
    }]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      const mimeType = file.type;
      
      handleSend("Please analyze this crop image for any signs of disease, nutrient deficiency, or pests. Provide actionable remedies.", {
        base64: base64String,
        mimeType: mimeType
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ""; 
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-[#10B981]">Loading encrypted session...</div>;
  }

  return (
    <div className="fixed inset-0 flex h-screen w-screen bg-[#0A0F1C] text-[#F1F5F9] overflow-hidden font-sans">
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#141E30] border border-[#64748B]/30 rounded-lg text-[#F1F5F9]"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed md:relative z-40 h-full w-72 bg-[#141E30]/95 backdrop-blur-md border-r border-[#64748B]/20 p-5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B981]/20 text-[#0A0F1C] font-bold">
            KM
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-lg text-[#F1F5F9]">Kisaan Mitra</h1>
            <p className="text-[10px] font-medium tracking-wider text-[#10B981] uppercase">AI Assistant</p>
          </div>
        </Link>

        <button 
          onClick={startNewChat}
          className="w-full mt-8 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] font-bold py-3 rounded-xl hover:bg-[#10B981]/20 transition-all flex justify-center items-center gap-2"
        >
          <span>+</span> New Consultation
        </button>

        <div className="mt-6 space-y-2">
          <div 
            onClick={handleWeatherClick}
            className="flex items-center gap-3 p-3 bg-[#0A0F1C]/50 border border-[#64748B]/10 hover:border-[#10B981]/50 rounded-xl cursor-pointer transition-colors"
          >
            <Cloud size={18} className="text-[#3B82F6]" /> 
            <span className="text-sm font-semibold">Local Weather Insights</span>
          </div>
          
          <div 
            onClick={handleDiseaseDetectionClick}
            className="flex items-center gap-3 p-3 bg-[#0A0F1C]/50 border border-[#64748B]/10 hover:border-[#10B981]/50 rounded-xl cursor-pointer transition-colors"
          >
            <Bug size={18} className="text-[#F59E0B]" /> 
            <span className="text-sm font-semibold">Crop Disease Scan</span>
          </div>
        </div>

        <div className="mt-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
          <p className="text-[#64748B] text-xs font-bold uppercase tracking-wider mb-3">Consultation History</p>
          
          {recentChats.length === 0 && (
            <p className="text-[#64748B] text-sm italic">No recent chats.</p>
          )}
          {recentChats.map((chat) => (
            <div 
              key={chat.chatId} 
              onClick={() => loadChatSession(chat.chatId)} 
              className={`p-3 mb-2 rounded-xl cursor-pointer text-sm truncate transition-colors border ${
                currentChatId === chat.chatId 
                  ? "bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981] font-bold" 
                  : "bg-transparent border-transparent text-[#64748B] hover:bg-[#0A0F1C] hover:text-[#F1F5F9]"
              }`}
            >
              {chat.title || "New Chat"}
            </div>
          ))}
        </div>
      </aside>

      {/* ── MAIN CHAT AREA ── */}
      <div className="flex flex-col flex-1 h-full relative">
        
        {/* Header */}
        <header className="h-[73px] border-b border-[#64748B]/20 flex items-center justify-between px-6 bg-[#0A0F1C]/80 backdrop-blur-md shrink-0">
          <div className="pl-12 md:pl-0">
            <h2 className="text-lg font-bold text-[#F1F5F9]">AI Diagnostic Thread</h2>
            <p className="text-[#64748B] text-xs font-medium">Location Context: <span className="text-[#10B981]">{userLocation}</span></p>
          </div>
          <Link href="/profile" className="w-9 h-9 rounded-full bg-[#141E30] border border-[#64748B]/30 flex items-center justify-center hover:bg-[#1C2841] transition-colors">
            <User size={16} className="text-[#F1F5F9]" />
          </Link>
        </header>

        {/* Chat Feed */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 relative flex flex-col custom-scrollbar">
          <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col">
            
            {messages.length === 0 && !isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 mt-10">
                <div className="w-20 h-20 rounded-3xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-6">
                  <Cloud size={40} className="text-[#10B981]" />
                </div>
                <h1 className="text-2xl font-bold text-[#F1F5F9]">Kisaan Mitra AI Core</h1>
                <p className="text-[#64748B] mt-2 text-sm max-w-md">
                  Upload photos for disease scanning or ask for hyper-local weather advisory.
                </p>
              </div>
            ) : (
              <div className="space-y-6 pb-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[75%] text-sm md:text-base leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-[#10B981] text-[#0A0F1C] font-semibold rounded-tr-none shadow-lg shadow-[#10B981]/10" 
                        : "bg-[#141E30] border border-[#64748B]/30 text-[#F1F5F9] rounded-tl-none shadow-md"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="p-4 rounded-2xl bg-[#141E30] border border-[#64748B]/30 text-[#64748B] rounded-tl-none animate-pulse text-sm">
                      Processing environmental data...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* ── INPUT AREA ── */}
        <div className="border-t border-[#64748B]/20 p-4 bg-[#0A0F1C]/95 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 bg-[#141E30] border border-[#64748B]/30 rounded-2xl px-4 py-3 max-w-4xl mx-auto focus-within:border-[#10B981] transition-colors shadow-inner">
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl text-[#64748B] hover:text-[#10B981] hover:bg-[#10B981]/10 transition-colors shrink-0" 
            >
              <ImageIcon size={20} />
            </button>

            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none placeholder-[#64748B] text-[#F1F5F9] text-sm md:text-base min-w-0 px-2"
              placeholder="Query the database or ask for advice..."
            />

            <button 
              onClick={() => handleSend()}
              disabled={isLoading || (!inputText.trim())}
              className="bg-[#10B981] p-2.5 rounded-xl text-[#0A0F1C] hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}