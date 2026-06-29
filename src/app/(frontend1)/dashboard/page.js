"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
  // Added status to track loading/unauthenticated state
  const { data: session, status } = useSession();

  // ── USER PROFILE & LOCATION STATE ──
  const [userLocation, setUserLocation] = useState("Loading Location...");
  const [coordinates, setCoordinates] = useState(null);
  const [needsProfile, setNeedsProfile] = useState(false); // New state to track if location is missing

  // ── SATELLITE & WEATHER DATA (DYNAMIC) ──
  const [weather, setWeather] = useState({
    temp: "--",
    condition: "Fetching...",
    humidity: "--",
    windSpeed: "--",
    rainProb: "--",
    soilMoisture: "34%", 
    nitrogen: "Low",     
    phosphorus: "Medium",
    potassium: "Low",    
    healthIndex: "Fair", 
    forecast: []
  });

  // ── ANALYTICS DATA (MOCK) ──
  const [yieldData] = useState([
    { month: "Jan", yield: 400 }, { month: "Feb", yield: 380 }, { month: "Mar", yield: 430 },
    { month: "Apr", yield: 480 }, { month: "May", yield: 520 }, { month: "Jun", yield: 600 }
  ]);

  const [expenseData] = useState([
    { name: "Seeds", value: 4500 }, { name: "Fertilizers", value: 6200 },
    { name: "Labor", value: 8000 }, { name: "Water/Power", value: 2300 }
  ]);

  const [priceTrend] = useState([
    { week: "W1", cotton: 7200, paddy: 3100 }, { week: "W2", cotton: 7350, paddy: 3050 },
    { week: "W3", cotton: 7100, paddy: 3150 }, { week: "W4", cotton: 7450, paddy: 3200 }
  ]);

  // ── INTERACTIVE TABS & STATE ──
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCrop, setSelectedCrop] = useState("Cotton");
  
  // Tasks State
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");

  // AI Mandi State
  const [mandiQuery, setMandiQuery] = useState("");
  const [mandiResponse, setMandiResponse] = useState("");
  const [isMandiLoading, setIsMandiLoading] = useState(false);

  // Floating Chat State
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Namaste! I am your Kisaan Mitra AI assistant. How can I help you optimize your farm today?" }
  ]);

  // Real-time clock tick
  const [currentTime, setCurrentTime] = useState("");
  useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) + ' | ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ── 1. INITIAL DATA FETCHING (Profile, Weather, Tasks) ──
  useEffect(() => {
    const fetchInitialData = async () => {
      // Don't fetch if not logged in
      if (status === "unauthenticated" || status === "loading") return;
      if (!session) return;

      try {
        // Fetch Profile & Location
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();
        
        // Check if profile is missing critical location data
        if (!profileData.profile || !profileData.profile.district || !profileData.profile.state) {
          setNeedsProfile(true);
          return; // Halt loading of weather/tasks until profile is complete
        }

        let lat = 28.6139; // Default Delhi
        let lng = 77.2090;

        setUserLocation(`${profileData.profile.district}, ${profileData.profile.state}`);
        if (profileData.profile.coordinates?.lat) {
          lat = profileData.profile.coordinates.lat;
          lng = profileData.profile.coordinates.lng;
          setCoordinates({ lat, lng });
        }

        // Fetch Real Weather via Open-Meteo (Free API)
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&daily=temperature_2m_max,precipitation_probability_max&timezone=auto`);
        const weatherData = await weatherRes.json();

        // Format 7-day forecast for the chart
        const formattedForecast = weatherData.daily.time.map((time, index) => {
          const date = new Date(time);
          return {
            day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
            temp: weatherData.daily.temperature_2m_max[index],
            rain: weatherData.daily.precipitation_probability_max[index]
          };
        }).slice(0, 7);

        setWeather(prev => ({
          ...prev,
          temp: weatherData.current.temperature_2m,
          humidity: weatherData.current.relative_humidity_2m,
          windSpeed: weatherData.current.wind_speed_10m,
          rainProb: weatherData.daily.precipitation_probability_max[0] || 0,
          forecast: formattedForecast
        }));

        // Fetch Tasks from DB
        const taskRes = await fetch('/api/tasks');
        const tasks = await taskRes.json();
        if (Array.isArray(tasks)) {
          // Map MongoDB _id to id for the UI
          setTodoList(tasks.map(t => ({ ...t, id: t._id })));
        }

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    fetchInitialData();
  }, [session, status]);

  // ── 2. TASK HANDLERS (DB CONNECTED) ──
  const handleToggleTodo = async (id, currentStatus) => {
    setTodoList(todoList.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
    
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: currentStatus })
    });
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const taskText = newTask;
    setNewTask("");

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: taskText })
    });
    
    const savedTask = await res.json();
    setTodoList([...todoList, { ...savedTask, id: savedTask._id }]);
  };

  // ── 3. AI MANDI HANDLER ──
const handleMandiAiSearch = async () => {
    if (!mandiQuery.trim()) return;
    setIsMandiLoading(true);
    setMandiResponse("");
    
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          // IMPROVED PROMPT: Instruct it to synthesize its internal knowledge instead of browsing
          message: `Acting as KisaanMitra, provide an expert market estimate for: "${mandiQuery}" in the ${userLocation} region. 
          
          Guidelines:
          1. Do not try to browse the internet.
          2. Based on typical seasonal trends and regional market data for this crop, give a realistic price range (₹ per quintal).
          3. Explicitly state: "Yeh ek estimated trend hai, sahi bhav ke liye Agmarknet ya nazdiki Mandi visit karein."
          4. Keep the tone helpful and grounded.`, 
          chatId: "mandi-chat-" + Date.now() 
        }) 
      });

      const data = await res.json();
      if (res.ok) setMandiResponse(data.reply);
    } catch (error) {
      setMandiResponse("⚠️ Failed to connect to the AI engine.");
    } finally {
      setIsMandiLoading(false);
    }
  };

  // ── 4. FLOATING CHAT HANDLER ──
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatInput(""); 
    setChatMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `[Context: I am in ${userLocation}.] ${userMessage}`, 
          chatId: "dashboard-quick-chat" 
        }) 
      });

      const data = await res.json();
      if (res.ok) {
        setChatMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
    }
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-[#F1F5F9] font-sans flex flex-col lg:flex-row">
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="w-full lg:w-64 bg-[#141E30] border-b lg:border-b-0 lg:border-r border-[#64748B]/15 flex flex-col justify-between h-auto lg:h-screen sticky top-0 z-50">
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-[#64748B]/15">
            <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B981]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight text-base leading-tight">Kisaan Mitra</h1>
              <p className="text-[10px] font-medium tracking-wider text-[#64748B] uppercase mt-0.5">Farmer Portal</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "overview" ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "text-[#64748B] hover:bg-[#1C2841] hover:text-[#F1F5F9]"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Dashboard Overview
            </button>
            <button onClick={() => setActiveTab("analytics")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "analytics" ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "text-[#64748B] hover:bg-[#1C2841] hover:text-[#F1F5F9]"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m18 9-9 9-5-5-3 3"/></svg> Yield & Finance
            </button>
            <button onClick={() => setActiveTab("mandi")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "mandi" ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "text-[#64748B] hover:bg-[#1C2841] hover:text-[#F1F5F9]"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 4.2 4.2"/><path d="m19.1 19.1-4.2-4.2"/><path d="m19.1 4.9-4.2 4.2"/><path d="m4.9 19.1 4.2-4.2"/></svg> Mandi Rates
            </button>
            <button onClick={() => setActiveTab("tasks")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "tasks" ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "text-[#64748B] hover:bg-[#1C2841] hover:text-[#F1F5F9]"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> Task Manager
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-[#64748B]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center font-bold text-xs text-[#10B981]">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-[11px] font-bold truncate max-w-[120px]">{session?.user?.name || "Guest Farmer"}</p>
              <p className="text-[9px] text-[#64748B] truncate max-w-[120px]">{session?.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN DASHBOARD AREA ── */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col">
        
        {/* State 1: Loading */}
        {status === "loading" ? (
           <div className="flex-1 flex items-center justify-center">
             <Loader2 className="animate-spin text-[#10B981]" size={40} />
           </div>
        ) : 
        
        /* State 2: Unauthenticated OR Needs Profile Details */
        status === "unauthenticated" || needsProfile ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="text-center p-8 bg-[#141E30] rounded-3xl border border-[#64748B]/20 shadow-2xl max-w-md w-full">
                <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-[#F1F5F9]">Action Required</h2>
                <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
                   {status === "unauthenticated" 
                     ? "Please log in to access your personalized Farm Command Center and real-time agricultural telemetry." 
                     : "Your profile is missing location data. We need your district and state to fetch accurate weather, soil, and mandi data."}
                </p>
                {status === "unauthenticated" ? (
                   <button onClick={() => signIn()} className="w-full py-4 bg-[#10B981] hover:bg-emerald-400 text-[#0A0F1C] font-extrabold rounded-xl transition-colors shadow-lg shadow-[#10B981]/20">
                     Log In / Sign Up
                   </button>
                ) : (
                   <Link href="/profile" className="block w-full py-4 bg-[#10B981] hover:bg-emerald-400 text-[#0A0F1C] font-extrabold rounded-xl transition-colors shadow-lg shadow-[#10B981]/20 text-center">
                     Update Profile Details
                   </Link>
                )}
             </div>
           </div>
        ) : (
          /* State 3: Fully Authenticated with Profile Data */
          <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Farm Command Center</h2>
                <p className="text-[#10B981] text-xs font-bold mt-1">Live Telemetry for: {userLocation}</p>
              </div>
              <div className="flex items-center gap-3 bg-[#141E30] px-4 py-2.5 rounded-xl border border-[#64748B]/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-xs font-bold text-[#F1F5F9]">{currentTime}</span>
              </div>
            </header>

            {/* ── TAB CONTENT: OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#64748B]">Soil Health</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-extrabold text-[#10B981]">{weather.healthIndex}</span>
                    </div>
                    <p className="text-[9px] text-[#64748B] mt-2">Optimal N-P-K balance</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#64748B]">Soil Moisture</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-extrabold">{weather.soilMoisture}</span>
                    </div>
                    <p className="text-[9px] text-[#64748B] mt-2">Satellite estimate</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#64748B]">Temperature</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-extrabold">{weather.temp}°C</span>
                    </div>
                    <p className="text-[9px] text-[#64748B] mt-2">Humidity: {weather.humidity}%</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#64748B]">Rainfall Prob.</span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-extrabold text-blue-400">{weather.rainProb}%</span>
                    </div>
                    <p className="text-[9px] text-[#64748B] mt-2">Wind Speed: {weather.windSpeed} km/h</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-bold uppercase tracking-wider">Satellite Sensor Grid</h3>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#10B981] border border-emerald-500/20">ESTIMATED</span>
                      </div>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 rounded-xl bg-[#0A0F1C]/60 border border-[#64748B]/10">
                            <span className="text-xs font-semibold text-[#64748B]">Nitrogen (N)</span>
                            <span className="text-xs font-bold text-amber-300">{weather.nitrogen}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-[#0A0F1C]/60 border border-[#64748B]/10">
                            <span className="text-xs font-semibold text-[#64748B]">Phosphorus (P)</span>
                            <span className="text-xs font-bold text-emerald-400">{weather.phosphorus}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 rounded-xl bg-[#0A0F1C]/60 border border-[#64748B]/10">
                            <span className="text-xs font-semibold text-[#64748B]">Potassium (K)</span>
                            <span className="text-xs font-bold text-amber-300">{weather.potassium}</span>
                          </div>
                      </div>
                    </div>
                    <div className="mt-6 border-t border-[#64748B]/10 pt-4">
                      <p className="text-[10px] text-[#64748B]">Data simulated based on regional agronomic averages for {userLocation}.</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-2">7-Day Local Forecast ({userLocation})</h3>
                      <p className="text-[10px] text-[#64748B] mb-6">Live telemetry powered by Open-Meteo.</p>
                      <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={weather.forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                              </linearGradient>
                              <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#64748B/10" vertical={false} />
                            <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                            <YAxis yAxisId="left" stroke="#64748B" fontSize={10} />
                            <YAxis yAxisId="right" orientation="right" stroke="#64748B" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: "#0A0F1C", border: "1px solid #64748B/20", borderRadius: "12px" }} />
                            <Area yAxisId="left" type="monotone" dataKey="temp" stroke="#10B981" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} name="Temp (°C)" />
                            <Area yAxisId="right" type="monotone" dataKey="rain" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRain)" strokeWidth={2} name="Rain Prob (%)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold tracking-tight">Crop Advisor Suite</h3>
                      <p className="text-[#64748B] text-[10px]">Inspect specific advice per crop currently under production</p>
                    </div>
                    <div className="flex gap-2">
                      {["Cotton", "Paddy", "Maize"].map(crop => (
                        <button 
                          key={crop}
                          onClick={() => setSelectedCrop(crop)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${selectedCrop === crop ? "bg-[#10B981]/10 border-[#10B981]/50 text-[#10B981]" : "bg-[#0A0F1C] border-[#64748B]/20 text-[#64748B] hover:border-[#64748B]"}`}
                        >
                          {crop}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#64748B]/20">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Sowing Period</span>
                      <p className="text-xs font-extrabold mt-1 text-[#F1F5F9]">{selectedCrop === "Cotton" ? "May - June" : selectedCrop === "Paddy" ? "June - July" : "Feb - March"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#64748B]/20">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Growth Stage</span>
                      <p className="text-xs font-extrabold mt-1 text-[#10B981]">{selectedCrop === "Cotton" ? "Vegetative Growth" : selectedCrop === "Paddy" ? "Tillering Stage" : "Flowering"}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#64748B]/20">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#64748B]">Alert Level</span>
                      <p className="text-xs font-extrabold mt-1 text-amber-400">{selectedCrop === "Cotton" ? "Moderate Bollworm Risk" : selectedCrop === "Paddy" ? "Maintain water levels" : "Safe"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB CONTENT: ANALYTICS (YIELD & FINANCE) ── */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                      <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Monthly Aggregate Yield (Quintals)</h3>
                      <div className="h-64 w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={yieldData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#64748B/10" vertical={false} />
                            <XAxis dataKey="month" stroke="#64748B" fontSize={10} />
                            <YAxis stroke="#64748B" fontSize={10} />
                            <Tooltip contentStyle={{ backgroundColor: "#0A0F1C", border: "1px solid #64748B/20", borderRadius: "12px" }} />
                            <Line type="monotone" dataKey="yield" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Operational Cost Allocation</h3>
                        <div className="h-52 w-full grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5}>
                                  {expenseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: "#0A0F1C", border: "1px solid #64748B/20", borderRadius: "12px" }} />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3">
                              {expenseData.map((exp, idx) => (
                                <div key={exp.name} className="flex justify-between items-center text-xs">
                                    <span className="flex items-center gap-1.5 font-semibold text-[#64748B]">
                                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                      {exp.name}
                                    </span>
                                    <span className="font-extrabold">₹{exp.value.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            )}

            {/* ── TAB CONTENT: MANDI RATES ── */}
            {activeTab === "mandi" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#141E30] border border-[#10B981]/30 flex flex-col gap-4 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#10B981]">AI Mandi Rate Checker</h3>
                    <p className="text-[10px] text-[#64748B] mt-1">Ask the AI for live estimated prices in {userLocation}</p>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. 'What is the rate of Cotton today?'"
                      value={mandiQuery}
                      onChange={(e) => setMandiQuery(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#0A0F1C] border border-[#64748B]/25 text-sm placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]"
                    />
                    <button onClick={handleMandiAiSearch} disabled={isMandiLoading} className="px-6 py-3 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-[#0A0F1C] text-sm font-extrabold transition-all disabled:opacity-50">
                      {isMandiLoading ? <Loader2 size={18} className="animate-spin" /> : "Check Price"}
                    </button>
                  </div>
                  {mandiResponse && (
                    <div className="mt-2 p-4 bg-[#0A0F1C]/80 rounded-xl border border-[#64748B]/20 text-sm leading-relaxed text-[#F1F5F9] [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4">
                      <ReactMarkdown>{mandiResponse}</ReactMarkdown>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Regional Price Trends (Mock Data)</h3>
                    <div className="h-64 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#64748B/10" vertical={false} />
                          <XAxis dataKey="week" stroke="#64748B" fontSize={10} />
                          <YAxis stroke="#64748B" fontSize={10} domain={['dataMin - 500', 'dataMax + 500']} />
                          <Tooltip contentStyle={{ backgroundColor: "#0A0F1C", border: "1px solid #64748B/20", borderRadius: "12px" }} />
                          <Line type="monotone" dataKey="cotton" stroke="#F59E0B" strokeWidth={3} name="Cotton (₹/q)" />
                          <Line type="monotone" dataKey="paddy" stroke="#3B82F6" strokeWidth={3} name="Paddy (₹/q)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Nearby Markets</h3>
                    <p className="text-[10px] text-[#64748B] mb-4">Closest wholesale yards to {userLocation}.</p>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#64748B]/20 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold">Main APMC Yard</p>
                            <p className="text-[9px] text-[#64748B] mt-0.5">Distance: 12 km</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-[#F59E0B]">Cotton: ₹7,450/q</p>
                          </div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#64748B]/20 flex justify-between items-center">
                          <div>
                            <p className="text-xs font-bold">Local Market Hub</p>
                            <p className="text-[9px] text-[#64748B] mt-0.5">Distance: 22 km</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-blue-400">Paddy: ₹3,200/q</p>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB CONTENT: TASK MANAGER ── */}
            {activeTab === "tasks" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 max-w-2xl">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Automated Agronomic Task Schedulers</h3>
                    <p className="text-[10px] text-[#64748B] mb-6">Create, edit and complete season checklists (Saved to your profile).</p>
                    
                    <div className="space-y-3 mb-6">
                      {todoList.map((item) => (
                        <div 
                          key={item.id} 
                          className={`p-4 rounded-xl border flex justify-between items-center transition-all ${item.completed ? "bg-[#0A0F1C]/30 border-[#64748B]/10" : "bg-[#0A0F1C] border-[#64748B]/25"}`}
                        >
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                checked={item.completed} 
                                onChange={() => handleToggleTodo(item.id, item.completed)}
                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#10B981] focus:ring-[#10B981] accent-[#10B981]"
                              />
                              <span className={`text-xs font-semibold ${item.completed ? "line-through text-[#64748B]" : "text-[#F1F5F9]"}`}>{item.text}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${item.completed ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-amber-500/10 text-amber-400 border border-amber-500/10"}`}>
                              {item.completed ? "DONE" : "PENDING"}
                            </span>
                        </div>
                      ))}
                      {todoList.length === 0 && <p className="text-xs text-[#64748B] italic">No tasks added yet.</p>}
                    </div>

                    <form onSubmit={handleAddTodo} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Add task, e.g. 'Harvest cotton on south acre'..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-[#0A0F1C] border border-[#64748B]/25 text-xs placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]"
                      />
                      <button type="submit" className="px-5 py-3 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-[#0A0F1C] text-xs font-extrabold shadow-lg shadow-[#10B981]/20 transition-all shrink-0">
                        Create Task
                      </button>
                    </form>
                </div>
              </div>
            )}
          </>
        )}

      </main>

      {/* ── FLOATING AI INTERACTIVE PROMPT BUTTON ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {aiChatOpen && (
           <div className="w-80 sm:w-96 h-96 bg-[#141E30] border border-[#64748B]/30 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-4 bg-[#141E30] border-b border-[#64748B]/15 flex justify-between items-center">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-[#10B981] flex items-center justify-center border border-emerald-500/30 animate-pulse">
                     <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
                   </div>
                   <span className="text-xs font-extrabold tracking-wider uppercase">AI Crop/Finance Assistant</span>
                 </div>
                 <button onClick={() => setAiChatOpen(false)} className="text-[#64748B] hover:text-[#F1F5F9]">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                 </button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-[#0A0F1C]/40">
                 {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                       <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-[10px] font-bold ${msg.role === "user" ? "bg-blue-600/20 text-blue-400 border border-blue-500/20" : "bg-emerald-500/20 text-[#10B981] border border-emerald-500/20"}`}>
                          {msg.role === "user" ? "ME" : "AI"}
                       </div>
                       <div className={`p-3 rounded-2xl max-w-[75%] text-xs font-medium leading-relaxed overflow-hidden ${msg.role === "user" ? "bg-[#10B981] text-[#0A0F1C] font-bold" : "bg-[#141E30] border border-[#64748B]/20 text-[#F1F5F9] [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4"}`}>
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                       </div>
                    </div>
                 ))}
              </div>

              <form onSubmit={handleSendChat} className="p-4 bg-[#141E30] border-t border-[#64748B]/15 flex gap-2">
                 <input 
                   type="text" 
                   placeholder="Ask about pest control, loans or soils..."
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   className="flex-1 px-3 py-2.5 rounded-xl bg-[#0A0F1C] border border-[#64748B]/25 text-xs text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]"
                 />
                 <button type="submit" className="w-10 h-10 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-[#0A0F1C] flex items-center justify-center transition-all shrink-0 pl-0.5">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                 </button>
              </form>
           </div>
        )}
        <button 
          onClick={() => setAiChatOpen(!aiChatOpen)}
          className="w-14 h-14 rounded-full bg-[#10B981] hover:bg-emerald-400 text-[#0A0F1C] flex items-center justify-center shadow-2xl shadow-[#10B981]/30 border border-[#F1F5F9]/20 transition-transform hover:scale-105"
        >
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
        </button>
      </div>

    </div>
  );
}