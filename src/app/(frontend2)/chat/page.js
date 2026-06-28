"use client";

import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  Send,
  Mic,
  Image as ImageIcon,
  Cloud,
  Wheat,
  Bug,
  User,
  Sun,
  Moon,
  Settings, // Kept import to avoid breaking anything, but removed from UI
  Mail, // Added for the Email ID icon
} from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // --- UPDATED STATE FOR REAL CHAT HISTORY ---
  const [chatHistory, setChatHistory] = useState([]); // Stores all chats: [{ title: 'Chat 1', messages: [...] }]
  const [activeChatIndex, setActiveChatIndex] = useState(null); // Tracks which chat is currently open
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  // --- NEW STATES FOR WEATHER & EMAIL MENU ---
  const [weather, setWeather] = useState({ temp: "--", desc: "Loading..." });
  const [showEmailOptions, setShowEmailOptions] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- FETCH WEATHER API ---
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "YOUR_OPENWEATHERMAP_API_KEY"; 
        const city = "Delhi";
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp) + "°C",
          desc: data.weather[0].main
        });
      } catch (error) {
        setWeather({ temp: "29°C", desc: "Sunny" }); // Fallback if API key is missing
      }
    };
    fetchWeather();
  }, []);

  // Derived state: Get messages for the currently active chat, or empty array if it's a new screen
  const messages = activeChatIndex !== null && chatHistory[activeChatIndex] 
    ? chatHistory[activeChatIndex].messages 
    : [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a text message
  const handleSend = () => {
    if (!inputText.trim()) return;

    const currentText = inputText;
    setInputText("");
    
    const userMsg = { text: currentText, sender: "user" };
    let targetIndex = activeChatIndex;

    // If starting a brand new chat, create it in the history
    if (targetIndex === null) {
      targetIndex = chatHistory.length;
      const newChat = { title: `Chat ${targetIndex + 1}`, messages: [userMsg] };
      setChatHistory((prev) => [...prev, newChat]);
      setActiveChatIndex(targetIndex);
    } else {
      // If continuing an existing chat, append the message
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[targetIndex] = {
          ...updated[targetIndex],
          messages: [...updated[targetIndex].messages, userMsg],
        };
        return updated;
      });
    }

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = { 
        text: `Here is a simulated response to: "${currentText}". In a real app, this connects to your backend API!`, 
        sender: "ai" 
      };
      
      setChatHistory((prev) => {
        const updated = [...prev];
        if (updated[targetIndex]) {
          updated[targetIndex] = {
            ...updated[targetIndex],
            messages: [...updated[targetIndex].messages, aiMsg],
          };
        }
        return updated;
      });
    }, 1000);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Handle Image Upload Selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const userMsg = { text: `📎 Image selected: ${file.name}`, sender: "user" };
    let targetIndex = activeChatIndex;

    if (targetIndex === null) {
      targetIndex = chatHistory.length;
      const newChat = { title: `Chat ${targetIndex + 1}`, messages: [userMsg] };
      setChatHistory((prev) => [...prev, newChat]);
      setActiveChatIndex(targetIndex);
    } else {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[targetIndex] = {
          ...updated[targetIndex],
          messages: [...updated[targetIndex].messages, userMsg],
        };
        return updated;
      });
    }
    e.target.value = ""; 

    // Simulate AI searching main points for the uploaded file
    setTimeout(() => {
      const aiMsg = { 
        text: `Taking the file and searching main points... Backend analysis for disease detection will appear here!`, 
        sender: "ai" 
      };
      
      setChatHistory((prev) => {
        const updated = [...prev];
        if (updated[targetIndex]) {
          updated[targetIndex] = {
            ...updated[targetIndex],
            messages: [...updated[targetIndex].messages, aiMsg],
          };
        }
        return updated;
      });
    }, 1500);
  };

  // Handle Disease Detection Sidebar Click
  const handleDiseaseDetectionClick = () => {
    let targetIndex = activeChatIndex;
    
    // Create a new chat for disease detection if we aren't in one
    if (targetIndex === null) {
      targetIndex = chatHistory.length;
      const newChat = { title: `Disease Detection`, messages: [] };
      setChatHistory((prev) => [...prev, newChat]);
      setActiveChatIndex(targetIndex);
    }

    // AI prompts user to upload the image
    setTimeout(() => {
      setChatHistory((prev) => {
        const updated = [...prev];
        if (updated[targetIndex]) {
          updated[targetIndex] = {
            ...updated[targetIndex],
            messages: [
              ...updated[targetIndex].messages,
              { text: "Please click the camera icon below to upload a photo of the crop, and I will search the main points to detect the disease.", sender: "ai" }
            ],
          };
        }
        return updated;
      });
    }, 200);

    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Handle clicking a recent chat
  const handleRecentChatClick = (index) => {
    setActiveChatIndex(index);
    // Auto-close sidebar on mobile devices for better UX
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Google OAuth backend simulation
  const handleGoogleAuthRedirect = () => {
    // In a real app, this would be: window.location.href = '/api/auth/google';
    alert("Redirecting to Google Account Sign-In... (Backend route executed)");
  };

  return (
    <div className="fixed inset-0 flex h-screen w-screen bg-slate-950 text-white overflow-hidden">
      {/* Mobile Menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg"
      >
        {sidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 h-full w-72 bg-slate-900 border-r border-slate-800 p-5 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <h1 className="text-3xl font-bold text-green-500">🌾 Kisaan Mitra</h1>
        <p className="text-gray-400 mt-2">Your Farming Assistant</p>

        <button 
          onClick={() => setActiveChatIndex(null)} // Clear screen for a new chat
          className="w-full mt-6 bg-green-600 py-3 rounded-xl hover:bg-green-700 transition"
        >
          + New Chat
        </button>

        <div className="mt-8 space-y-3">
          {/* Live Weather */}
          <div className="flex gap-3 p-3 hover:bg-slate-800 rounded-xl cursor-pointer">
            <Cloud /> Weather: {weather.temp} ({weather.desc})
          </div>
          
          {/* Disease Detection - Removed direct upload, added prompt logic */}
          <div 
            onClick={handleDiseaseDetectionClick}
            className="flex gap-3 p-3 hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            <Bug /> Disease Detection
          </div>

          {/* Email ID Dropdown (Replaces Settings) */}
          <div className="flex flex-col">
            <div 
              onClick={() => setShowEmailOptions(!showEmailOptions)}
              className="flex gap-3 p-3 hover:bg-slate-800 rounded-xl cursor-pointer transition"
            >
              <Mail /> Email ID
            </div>
            
            {showEmailOptions && (
              <div className="ml-11 flex flex-col gap-3 mt-2 mb-2">
                <button className="text-left text-gray-400 hover:text-white text-sm transition">
                  Sign In
                </button>
                <button 
                  onClick={handleGoogleAuthRedirect}
                  className="text-left text-gray-400 hover:text-white text-sm transition"
                >
                  Add Account
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <p className="text-gray-400 mb-3">Recent Chats</p>
          
          {/* Dynamically render actual chat history */}
          {chatHistory.length === 0 && (
            <p className="text-slate-600 text-sm italic">No recent chats yet</p>
          )}
          {chatHistory.map((chat, i) => (
            <div 
              key={i} 
              onClick={() => handleRecentChatClick(i)} 
              className={`mb-2 cursor-pointer transition-colors ${
                activeChatIndex === i ? "text-green-400 font-bold" : "text-gray-300 hover:text-white"
              }`}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900 shrink-0">
          <div>
            <h2 className="text-xl font-bold">Kisaan Mitra AI</h2>
            <p className="text-green-400 text-sm">Smart Farming Assistant</p>
          </div>
          <div className="flex gap-4">
            <Sun className="cursor-pointer hover:text-green-400 transition" />
            <Moon className="cursor-pointer hover:text-green-400 transition" />
            <User className="cursor-pointer hover:text-green-400 transition" />
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-6 relative flex flex-col">
          {/* Background */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col">
            
            {/* Show Welcome Screen ONLY if there are no messages */}
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                <h1 className="text-5xl font-bold text-green-500">🌾 Kisaan Mitra AI</h1>
                <p className="text-gray-400 mt-4 text-lg">
                  Your intelligent farming assistant. How can I help you today?
                </p>
              </div>
            ) : (
              /* Render Messages */
              <div className="space-y-6 pb-6">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start gap-4"}`}
                  >
                    {/* AI Avatar */}
                    {msg.sender === "ai" && (
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                        🌾
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div 
                      className={`px-5 py-3 rounded-2xl max-w-2xl ${
                        msg.sender === "user" 
                          ? "bg-green-600 text-white" 
                          : "bg-slate-800 border border-slate-700 text-gray-100"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {/* Invisible div to scroll to */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Input Area */}
        <div className="border-t border-slate-800 p-4 bg-slate-900 shrink-0">
          <div className="flex items-center gap-3 bg-slate-800 rounded-full px-5 py-4 max-w-4xl mx-auto focus-within:ring-1 focus-within:ring-green-500 transition">
            
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload}
            />
            
            {/* Camera Icon Triggers Hidden Input */}
            <ImageIcon 
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 cursor-pointer hover:text-white transition shrink-0" 
            />

            {/* Chat Input */}
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none placeholder-gray-500 min-w-0"
              placeholder="Ask anything about farming..."
            />

            {/* Mic Icon Toggles Recording State */}
            <Mic 
              onClick={() => setIsRecording(!isRecording)}
              className={`cursor-pointer transition shrink-0 ${isRecording ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-white"}`} 
            />

            {/* Send Button */}
            <button 
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="bg-green-600 p-2 rounded-full hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}