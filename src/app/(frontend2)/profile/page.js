'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, MapPin, 
  Shield, Key, Bell, LogOut, Edit3, 
  CheckCircle2, Camera, ChevronLeft, X,
  Info, Crosshair
} from 'lucide-react';

// Hackathon Mock Data for Cascading Dropdowns
const indiaLocations = {
  "Uttar Pradesh": ["Banda", "Agra", "Aligarh", "Prayagraj", "Lucknow", "Kanpur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Patan", "Unjha"],
  "Maharashtra": ["Pune", "Mumbai", "Nagpur", "Nashik", "Aurangabad"],
  "Punjab": ["Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
  "Haryana": ["Karnal", "Ambala", "Panipat", "Rohtak", "Hisar"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"]
};

export default function UserProfile() {
  const { data: session } = useSession();

  // --- STATE MANAGEMENT ---
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [userData, setUserData] = useState({
    name: "Farmer",
    address: "",
    age: "", 
    email: "",
    password: "••••••••••••", 
    phone: "",
    state: "Uttar Pradesh",
    district: "Banda",
    coordinates: { lat: null, lng: null },
    avatar: null 
  });

  // --- FETCH FROM DB ON MOUNT ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setUserData(prev => ({
              ...prev,
              address: data.profile.address || "",
              age: data.profile.age || "",
              state: data.profile.state || "Uttar Pradesh",
              district: data.profile.district || "Banda",
              coordinates: data.profile.coordinates || { lat: null, lng: null },
              avatar: data.profile.avatarBase64 || null
            }));
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session) fetchProfile();
  }, [session]);

  // --- HYDRATE GOOGLE AUTH DATA ---
  useEffect(() => {
    if (session?.user && userData.email === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserData(prev => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        avatar: prev.avatar || session.user.image 
      }));
    }
  }, [session, userData.email]);

  // --- CAMERA STATE & REFS ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- HANDLERS ---
  const handleSave = async () => {
    setIsEditing(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        alert("Profile saved successfully to Database!");
      }
    } catch (err) {
      console.error("Failed to save", err);
    }
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setUserData({
      ...userData,
      state: newState,
      district: indiaLocations[newState][0] // Auto-select first district of new state
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserData(prev => ({
          ...prev,
          coordinates: { 
            lat: position.coords.latitude.toFixed(4), 
            lng: position.coords.longitude.toFixed(4) 
          }
        }));
      },
      () => {
        alert("Unable to retrieve your location. Please allow permissions.");
      }
    );
  };

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      alert("Could not access the camera.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      setUserData({ ...userData, avatar: canvasRef.current.toDataURL('image/jpeg') });
      stopCamera();
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center text-[#10B981]">Loading Profile...</div>;

  return (
    <div className="w-full min-h-screen bg-[#0A0F1C] text-[#F1F5F9] font-sans p-4 md:p-8 flex flex-col md:h-screen md:fixed md:inset-0 md:overflow-hidden">
      
      {/* Header Area */}
      <div className="w-full mb-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#141E30] rounded-lg transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#141E30] hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-all text-[#64748B]">
          <LogOut size={18} />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>

      <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6 md:overflow-y-auto pb-8 hide-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141E30] rounded-[24px] p-6 border border-[#141E30] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#10B981]/20 to-transparent"></div>
            
            <div className="relative flex flex-col items-center mt-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-[#0A0F1C] border-4 border-[#141E30] flex items-center justify-center text-3xl font-bold shadow-xl overflow-hidden">
                  {userData.avatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userData.name.charAt(0)
                  )}
                </div>
                <button 
                  onClick={startCamera} 
                  className="absolute bottom-0 right-0 p-2 bg-[#10B981] text-[#0A0F1C] rounded-full hover:bg-[#059669] transition shadow-lg z-10"
                >
                  <Camera size={14} />
                </button>
              </div>
              
              <h2 className="mt-4 text-xl font-bold">{userData.name}</h2>
              <p className="text-[#10B981] text-sm font-medium mt-1">{userData.district}, {userData.state}</p>
              
              <div className="w-full mt-6 space-y-2">
                <button 
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'personal' ? 'bg-[#10B981]/10 text-[#10B981]' : 'hover:bg-[#0A0F1C] text-[#64748B]'}`}
                >
                  <User size={18} /> Personal Info
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'security' ? 'bg-[#10B981]/10 text-[#10B981]' : 'hover:bg-[#0A0F1C] text-[#64748B]'}`}
                >
                  <Shield size={18} /> Security
                </button>
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'notifications' ? 'bg-[#10B981]/10 text-[#10B981]' : 'hover:bg-[#0A0F1C] text-[#64748B]'}`}
                >
                  <Bell size={18} /> Notifications
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Main Content */}
        <div className="md:col-span-3 md:overflow-y-auto pb-8 hide-scrollbar">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#141E30] rounded-[24px] p-8 border border-[#141E30] shadow-2xl min-h-full"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">
                {activeTab === 'personal' && 'Personal Information'}
                {activeTab === 'security' && 'Security & Passwords'}
                {activeTab === 'notifications' && 'Notification Preferences'}
              </h3>
              {(activeTab === 'personal' || activeTab === 'security') && (
                <button 
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#10B981] text-[#0A0F1C] rounded-xl hover:bg-[#059669] transition font-bold"
                >
                  {isEditing ? <><CheckCircle2 size={16} /> Save</> : <><Edit3 size={16} /> Edit</>}
                </button>
              )}
            </div>

            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-2">
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Full Name</label>
                  <div className="relative flex items-center">
                    <User size={18} className="absolute left-4 text-[#64748B]" />
                    <input 
                      disabled={!isEditing}
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full bg-[#0A0F1C] border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all disabled:opacity-70 text-[#F1F5F9]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Email Address <span className="text-red-400/80">(Locked by Auth)</span></label>
                  <div className="relative flex items-center">
                    <Mail size={18} className="absolute left-4 text-[#64748B]" />
                    <input 
                      disabled={true} // Email is permanently locked
                      value={userData.email}
                      className="w-full bg-[#0A0F1C]/50 border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none text-[#64748B] cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">State</label>
                  <div className="relative flex items-center">
                    <MapPin size={18} className="absolute left-4 text-[#64748B]" />
                    <select
                      disabled={!isEditing}
                      value={userData.state}
                      onChange={handleStateChange}
                      className="w-full bg-[#0A0F1C] border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all disabled:opacity-70 text-[#F1F5F9] appearance-none"
                    >
                      {Object.keys(indiaLocations).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">District</label>
                  <div className="relative flex items-center">
                    <MapPin size={18} className="absolute left-4 text-[#64748B]" />
                    <select
                      disabled={!isEditing}
                      value={userData.district}
                      onChange={(e) => setUserData({...userData, district: e.target.value})}
                      className="w-full bg-[#0A0F1C] border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all disabled:opacity-70 text-[#F1F5F9] appearance-none"
                    >
                      {indiaLocations[userData.state].map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Farm Coordinates</label>
                  <div className="flex gap-2">
                    <div className="relative flex items-center flex-1">
                      <Crosshair size={18} className="absolute left-4 text-[#64748B]" />
                      <input 
                        disabled={true}
                        value={userData.coordinates.lat ? `${userData.coordinates.lat}, ${userData.coordinates.lng}` : "Not Set"}
                        className="w-full bg-[#0A0F1C]/50 border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none text-[#F1F5F9] disabled:opacity-70"
                        placeholder="Lat, Lng"
                      />
                    </div>
                    <button 
                      disabled={!isEditing}
                      onClick={detectLocation}
                      className="px-4 bg-[#10B981] hover:bg-emerald-400 disabled:bg-[#10B981]/30 text-[#0A0F1C] rounded-xl font-bold transition-colors shrink-0"
                    >
                      Detect GPS
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Age</label>
                  <div className="relative flex items-center">
                    <Info size={18} className="absolute left-4 text-[#64748B]" />
                    <input 
                      type="number"
                      disabled={!isEditing}
                      value={userData.age}
                      onChange={(e) => setUserData({...userData, age: e.target.value})}
                      className="w-full bg-[#0A0F1C] border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all disabled:opacity-70 text-[#F1F5F9]"
                    />
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'security' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Account Password</label>
                  <div className="relative flex items-center">
                    <Key size={18} className="absolute left-4 text-[#64748B]" />
                    <input 
                      disabled={!isEditing}
                      type="password"
                      value={userData.password}
                      onChange={(e) => setUserData({...userData, password: e.target.value})}
                      className="w-full bg-[#0A0F1C] border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all disabled:opacity-70 text-[#F1F5F9] tracking-widest"
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2 mt-4 p-6 bg-[#0A0F1C] rounded-xl border border-[#141E30] flex items-start gap-4">
                   <Shield size={24} className="text-[#10B981] mt-0.5" />
                   <div>
                     <p className="font-bold text-base text-[#F1F5F9]">Two-Factor Authentication</p>
                     <p className="text-sm text-[#64748B] mt-1">Protect your account with an extra layer of security. Currently disabled.</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="flex flex-col items-center justify-center py-24 text-[#64748B]">
                <Bell size={64} className="mb-6 opacity-30 text-[#10B981]" />
                <p className="text-2xl font-bold text-[#F1F5F9]">No Notifications</p>
                <p className="text-base mt-3 text-center max-w-sm">You are all caught up! When there are updates about your account or weather alerts, they will appear here.</p>
              </div>
            )}

          </motion.div>
        </div>
      </div>

      {/* --- CAMERA OVERLAY --- */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0A0F1C]/95 backdrop-blur-sm flex flex-col items-center justify-center p-4"
          >
            <div className="bg-[#141E30] p-6 rounded-[24px] border border-[#141E30] shadow-2xl max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl">Take Profile Photo</h3>
                <button onClick={stopCamera} className="p-2 hover:bg-[#0A0F1C] rounded-full transition text-[#64748B] hover:text-[#F1F5F9]">
                  <X size={20} />
                </button>
              </div>
              
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center shadow-inner border border-[#0A0F1C]">
                 <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   className="w-full h-full object-cover transform scale-x-[-1]" 
                 />
              </div>
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={capturePhoto} 
                  className="bg-[#10B981] text-[#0A0F1C] px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-[#059669] transition shadow-lg hover:scale-105"
                >
                  <Camera size={24} /> Capture Photo
                </button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}