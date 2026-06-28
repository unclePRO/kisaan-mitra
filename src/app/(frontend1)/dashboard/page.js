"use client";

import React, { useState, useEffect } from "react";
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";

export default function Dashboard() {
  // ── SATELLITE & WEATHER DATA ──
  const [weather, setWeather] = useState({
    temp: 28,
    condition: "Sunny",
    humidity: 42,
    windSpeed: 12,
    rainProb: 10,
    soilMoisture: "34%",
    nitrogen: "Low",
    phosphorus: "Medium",
    potassium: "Low",
    healthIndex: "Fair",
    forecast: [
      { day: "Mon", temp: 30, rain: 0 },
      { day: "Tue", temp: 29, rain: 20 },
      { day: "Wed", temp: 27, rain: 60 },
      { day: "Thu", temp: 26, rain: 80 },
      { day: "Fri", temp: 29, rain: 10 },
      { day: "Sat", temp: 31, rain: 0 },
      { day: "Sun", temp: 32, rain: 0 }
    ]
  });

  // ── ANALYTICS DATA ──
  const [yieldData] = useState([
    { month: "Jan", yield: 400 },
    { month: "Feb", yield: 380 },
    { month: "Mar", yield: 430 },
    { month: "Apr", yield: 480 },
    { month: "May", yield: 520 },
    { month: "Jun", yield: 600 }
  ]);

  const [expenseData] = useState([
    { name: "Seeds", value: 4500 },
    { name: "Fertilizers", value: 6200 },
    { name: "Labor", value: 8000 },
    { name: "Water/Power", value: 2300 }
  ]);

  const [priceTrend] = useState([
    { week: "W1", cotton: 7200, paddy: 3100 },
    { week: "W2", cotton: 7350, paddy: 3050 },
    { week: "W3", cotton: 7100, paddy: 3150 },
    { week: "W4", cotton: 7450, paddy: 3200 }
  ]);

  // ── INTERACTIVE TABS & STATE ──
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCrop, setSelectedCrop] = useState("Cotton");
  const [todoList, setTodoList] = useState([
    { id: 1, text: "Apply NPK fertilizer to Cotton field", completed: true },
    { id: 2, text: "Schedule tractor for Rabi plowing", completed: false },
    { id: 3, text: "Check drip irrigation lateral lines", completed: false },
    { id: 4, text: "Renew KCC insurance documentation", completed: false }
  ]);
  const [newTask, setNewTask] = useState("");
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

  // ── HANDLERS ──
  const handleToggleTodo = (id) => {
    setTodoList(todoList.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTodoList([...todoList, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask("");
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: "user", text: chatInput }];
    setChatMessages(newMessages);
    setChatInput("");

    setTimeout(() => {
      setChatMessages([...newMessages, { role: "assistant", text: "Analyzing your soil and local mandi patterns... I recommend monitoring the upcoming Wednesday rain shower to schedule pesticide spraying accordingly." }]);
    }, 1000);
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-[#F1F5F9] font-sans flex flex-col lg:flex-row">
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="w-full lg:w-64 bg-[#141E30] border-b lg:border-b-0 lg:border-r border-[#64748B]/15 flex flex-col justify-between h-auto lg:h-screen sticky top-0 z-50">
        <div>
          {/* Logo */}
          <div className="p-6 flex items-center gap-3 border-b border-[#64748B]/15">
            <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center shadow-lg shadow-[#10B981]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0F1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight text-base leading-tight">Kisaan Mitra</h1>
              <p className="text-[10px] font-medium tracking-wider text-[#64748B] uppercase mt-0.5">Farmer Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "overview" ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "text-[#64748B] hover:bg-[#1C2841] hover:text-[#F1F5F9]"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              Dashboard Overview
            </button>
            <button 
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "analytics" ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "text-[#64748B] hover:bg-[#1C2841] hover:text-[#F1F5F9]"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m18 9-9 9-5-5-3 3"/></svg>
              Yield & Finance
            </button>
            <button 
              onClick={() => setActiveTab("mandi")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "mandi" ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "text-[#64748B] hover:bg-[#1C2841] hover:text-[#F1F5F9]"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 4.2 4.2"/><path d="m19.1 19.1-4.2-4.2"/><path d="m19.1 4.9-4.2 4.2"/><path d="m4.9 19.1 4.2-4.2"/></svg>
              Mandi Rates
            </button>
            <button 
              onClick={() => setActiveTab("tasks")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === "tasks" ? "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20" : "text-[#64748B] hover:bg-[#1C2841] hover:text-[#F1F5F9]"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Task Manager
            </button>
          </nav>
        </div>

        {/* Footer profile snippet */}
        <div className="p-4 border-t border-[#64748B]/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#64748B]/20 flex items-center justify-center font-bold text-xs text-[#F1F5F9]">RM</div>
            <div>
              <p className="text-[11px] font-bold">Ramesh Patel</p>
              <p className="text-[9px] text-[#64748B]">Village: Rampur, Gujarat</p>
            </div>
          </div>
          <button className="text-[#64748B] hover:text-red-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </aside>

      {/* ── MAIN DASHBOARD AREA ── */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Farm Command Center</h2>
            <p className="text-[#64748B] text-xs font-medium mt-1">Real-time agricultural telemetry, crop analytics & field schedules.</p>
          </div>
          <div className="flex items-center gap-3 bg-[#141E30] px-4 py-2.5 rounded-xl border border-[#64748B]/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="text-xs font-bold text-[#F1F5F9]">{currentTime}</span>
          </div>
        </header>

        {/* ── TAB CONTENT: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick stats ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#64748B]">Soil Health</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-[#10B981]">{weather.healthIndex}</span>
                </div>
                <p className="text-[9px] text-[#64748B] mt-2">Optimal N-P-K balance registered</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#64748B]">Soil Moisture</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold">{weather.soilMoisture}</span>
                </div>
                <p className="text-[9px] text-[#64748B] mt-2">Drip irrigation inactive</p>
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
              {/* Satellite/Weather Monitoring Widget */}
              <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 flex flex-col justify-between">
                <div>
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider">Satellite Sensor Grid</h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#10B981] border border-emerald-500/20">LIVE DATA</span>
                   </div>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-[#0A0F1C]/60 border border-[#64748B]/10">
                        <span className="text-xs font-semibold text-[#64748B]">Nitrogen (N)</span>
                        <span className="text-xs font-bold text-amber-300">LOW</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-[#0A0F1C]/60 border border-[#64748B]/10">
                        <span className="text-xs font-semibold text-[#64748B]">Phosphorus (P)</span>
                        <span className="text-xs font-bold text-emerald-400">OPTIMAL</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-[#0A0F1C]/60 border border-[#64748B]/10">
                        <span className="text-xs font-semibold text-[#64748B]">Potassium (K)</span>
                        <span className="text-xs font-bold text-amber-300">LOW</span>
                      </div>
                   </div>
                </div>
                <div className="mt-6 border-t border-[#64748B]/10 pt-4">
                   <p className="text-[10px] text-[#64748B]">Soil is slightly low on Nitrogen and Potassium. Suggest applying liquid urea along with irrigation before end of the week.</p>
                </div>
              </div>

              {/* Weekly Weather Forecast Bar Chart */}
              <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 lg:col-span-2 flex flex-col justify-between">
                <div>
                   <h3 className="text-sm font-bold uppercase tracking-wider mb-2">7-Day Precipitation & Temperature Forecast</h3>
                   <p className="text-[10px] text-[#64748B] mb-6">Visual tracking of precipitation risk (mm) compared to daily peak temps.</p>
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
                <div className="mt-4 border-t border-[#64748B]/10 pt-4 flex justify-between text-xs text-[#64748B]">
                   <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Peak Temp</span>
                   <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Rain Chance</span>
                </div>
              </div>
            </div>

            {/* Smart Crop Selector Block */}
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
              <p className="text-[11px] text-[#64748B] leading-relaxed border-t border-[#64748B]/10 pt-4">
                 {selectedCrop === "Cotton" 
                   ? "Notice: Whitefly or Bollworm can multiply quickly during hot temperatures. Check under leaves of 10 random plants every morning for early yellowing or eggs. Apply Neem seed extract (NSKE 5%) if infestation signs exceed 5% threshold."
                   : selectedCrop === "Paddy" 
                   ? "Notice: To prevent weeds during early tillering, maintain a 3-5 cm water layer in the field. Hand weeding along bunds keeps stem borers from establishing near seedlings."
                   : "Notice: Maize crop requires balanced irrigation. Avoid water logging during the vegetative phase to protect roots from fungal rot."
                 }
              </p>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: ANALYTICS (YIELD & FINANCE) ── */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cumulative Monthly Yield */}
                <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                   <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Monthly Aggregate Yield (Quintals)</h3>
                   <p className="text-[10px] text-[#64748B] mb-6">Total calculated yields over seasonal production intervals.</p>
                   <div className="h-64 w-full">
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

                {/* Expenses breakdown */}
                <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 flex flex-col justify-between">
                   <div>
                     <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Seasonal Operational Cost Allocation</h3>
                     <p className="text-[10px] text-[#64748B] mb-6">Financial monitoring of expenditure components.</p>
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
                   <div className="mt-4 border-t border-[#64748B]/15 pt-4 flex justify-between items-center">
                      <span className="text-[10px] text-[#64748B]">Total Outlay</span>
                      <span className="text-sm font-extrabold text-amber-400">₹{expenseData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}</span>
                   </div>
                </div>
             </div>

             {/* Financial Advisory Dashboard Alert Banner */}
             <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-[#141E30] border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">Kisan Credit Card (KCC) Status</span>
                  <h4 className="font-bold text-base mt-2">Active Limit: ₹1,50,000 | Utilized: ₹62,000</h4>
                  <p className="text-[#64748B] text-xs leading-relaxed max-w-xl mt-1">
                     Ensure timely clearing of short term crop loans before March 31st to avail the 3% prompt repayment interest subvention scheme. The effective borrowing interest rate will reduce to 4% per annum.
                  </p>
                </div>
                <button className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-[#0A0F1C] text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all shrink-0">
                  Pay Installment Online
                </button>
             </div>
          </div>
        )}

        {/* ── TAB CONTENT: MANDI RATES ── */}
        {activeTab === "mandi" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Local Mandi Prices Line Chart */}
              <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Regional Mandi Pricing (₹ / Quintal)</h3>
                <p className="text-[10px] text-[#64748B] mb-6">Compare Cotton versus Paddy weekly selling prices in your district.</p>
                <div className="h-64 w-full">
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

              {/* Mandi nearby list */}
              <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 flex flex-col justify-between">
                <div>
                   <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Nearby Agricultural Produce Market Committees</h3>
                   <p className="text-[10px] text-[#64748B] mb-4">Live auction summary for wholesale yards within 25 km.</p>
                   <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#64748B]/20 flex justify-between items-center">
                         <div>
                            <p className="text-xs font-bold">Patan APMC Yard</p>
                            <p className="text-[9px] text-[#64748B] mt-0.5">Distance: 12 km | Active Auctions</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-extrabold text-[#F59E0B]">Cotton: ₹7,450/q</p>
                            <p className="text-[10px] font-medium text-emerald-400">+₹150 vs. avg</p>
                         </div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#64748B]/20 flex justify-between items-center">
                         <div>
                            <p className="text-xs font-bold">Unjha Market Yard</p>
                            <p className="text-[9px] text-[#64748B] mt-0.5">Distance: 22 km | Major pulses hub</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-extrabold text-blue-400">Castor: ₹6,200/q</p>
                            <p className="text-[10px] font-medium text-red-400">-₹50 vs. avg</p>
                         </div>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0A0F1C] border border-[#64748B]/20 flex justify-between items-center">
                         <div>
                            <p className="text-xs font-bold">Siddhpur APMC</p>
                            <p className="text-[9px] text-[#64748B] mt-0.5">Distance: 18 km | General grains</p>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-extrabold text-[#10B981]">Paddy: ₹3,200/q</p>
                            <p className="text-[10px] font-medium text-emerald-400">+₹50 vs. avg</p>
                         </div>
                      </div>
                   </div>
                </div>
                <button className="mt-6 py-3 w-full bg-[#0A0F1C] border border-[#64748B]/20 hover:border-[#10B981] rounded-xl text-xs font-bold text-[#64748B] hover:text-[#10B981] transition-colors">
                  View Full e-NAM Price Ticker Directory
                </button>
              </div>
            </div>

            {/* Gov portal scheme announcement */}
            <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                 <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#F59E0B]">e-NAM Integration Update</span>
                 <h4 className="font-bold text-base mt-1">Direct Bank Transfers (DBT) enabled for all e-NAM auctions</h4>
                 <p className="text-[#64748B] text-xs leading-relaxed max-w-2xl mt-1">
                    Farmers can now link their bank passbook directly with the national electronic agricultural market portal. Post auction, payments are credited directly into your account within 24 hours without intermediary delay.
                 </p>
              </div>
              <button className="px-4 py-2.5 bg-transparent border border-[#64748B]/40 hover:border-[#F59E0B] rounded-xl text-xs font-bold text-[#64748B] hover:text-[#F59E0B] transition-all whitespace-nowrap">
                 Verify e-NAM Setup
              </button>
            </div>
          </div>
        )}

        {/* ── TAB CONTENT: TASK MANAGER ── */}
        {activeTab === "tasks" && (
          <div className="space-y-6">
             <div className="p-6 rounded-2xl bg-[#141E30] border border-[#64748B]/15 max-w-2xl">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-2">Automated Agronomic Task Schedulers</h3>
                <p className="text-[10px] text-[#64748B] mb-6">Create, edit and complete season checklists derived from soil sensor triggers.</p>
                
                {/* To-do list display */}
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
                             onChange={() => handleToggleTodo(item.id)}
                             className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-[#10B981] focus:ring-[#10B981] accent-[#10B981]"
                           />
                           <span className={`text-xs font-semibold ${item.completed ? "line-through text-[#64748B]" : "text-[#F1F5F9]"}`}>{item.text}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${item.completed ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-amber-500/10 text-amber-400 border border-amber-500/10"}`}>
                           {item.completed ? "DONE" : "PENDING"}
                        </span>
                     </div>
                  ))}
                </div>

                {/* Add new task form */}
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
                       <div className={`p-3 rounded-2xl max-w-[75%] text-xs font-medium leading-relaxed ${msg.role === "user" ? "bg-[#10B981] text-[#0A0F1C] font-bold" : "bg-[#141E30] border border-[#64748B]/20 text-[#F1F5F9]"}`}>
                          {msg.text}
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