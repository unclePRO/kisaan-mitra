'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building, MapPin, Phone, 
  Shield, Key, Bell, LogOut, Edit3, 
  CheckCircle2, Camera, ChevronLeft, X,
  Info
} from 'lucide-react';

export default function UserProfile() {
  // --- STATE MANAGEMENT ---
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); 
  
  // Random placeholder data perfectly preserved
  const [userData, setUserData] = useState({
    name: "Aarav Patel",
    address: "123 Tech Park, Bengaluru",
    age: "28", 
    email: "aarav.patel@example.com",
    password: "randompassword123", 
    phone: "+91 91234 56789",
    location: "Bengaluru, Karnataka",
    avatar: null 
  });

  // --- CAMERA STATE & REFS ---
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- HANDLERS ---
  const handleSave = () => {
    setIsEditing(false);
  };

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please check your browser permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
      
      setUserData({ ...userData, avatar: imageDataUrl });
      stopCamera();
    }
  };

  return (
    // Changed to full screen rigidly fixed to viewport
    <div className="w-full h-screen fixed inset-0 bg-[#0A0F1C] text-[#F1F5F9] font-sans p-4 md:p-8 flex flex-col overflow-hidden">
      
      {/* Header Area - Now spans full width */}
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

      {/* Main Grid - Spans full width and remaining height, split into 4 columns for better widescreen scaling */}
      <div className="w-full flex-1 grid grid-cols-1 md:grid-cols-4 gap-8 overflow-hidden">
        
        {/* Left Sidebar: Profile Card (Takes 1/4 of screen on desktop) */}
        <div className="md:col-span-1 space-y-6 overflow-y-auto pb-8 hide-scrollbar">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141E30] rounded-[24px] p-6 border border-[#141E30] shadow-2xl relative overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#10B981]/20 to-transparent"></div>
            
            <div className="relative flex flex-col items-center mt-6">
              <div className="relative">
                {/* Avatar Display */}
                <div className="w-24 h-24 rounded-full bg-[#0A0F1C] border-4 border-[#141E30] flex items-center justify-center text-3xl font-bold shadow-xl overflow-hidden">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    userData.name.charAt(0)
                  )}
                </div>
                {/* Trigger startCamera */}
                <button 
                  onClick={startCamera} 
                  className="absolute bottom-0 right-0 p-2 bg-[#10B981] text-[#0A0F1C] rounded-full hover:bg-[#059669] transition shadow-lg z-10"
                >
                  <Camera size={14} />
                </button>
              </div>
              
              <h2 className="mt-4 text-xl font-bold">{userData.name}</h2>
              <p className="text-[#10B981] text-sm font-medium mt-1">{userData.address}</p>
              
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

        {/* Right Main Content Area (Takes 3/4 of screen on desktop) */}
        <div className="md:col-span-3 overflow-y-auto pb-8 hide-scrollbar">
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

            {/* Content switches based on Active Tab */}
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
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Address</label>
                  <div className="relative flex items-center">
                    <MapPin size={18} className="absolute left-4 text-[#64748B]" />
                    <input 
                      disabled={!isEditing}
                      value={userData.address}
                      onChange={(e) => setUserData({...userData, address: e.target.value})}
                      className="w-full bg-[#0A0F1C] border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all disabled:opacity-70 text-[#F1F5F9]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail size={18} className="absolute left-4 text-[#64748B]" />
                    <input 
                      disabled={!isEditing}
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full bg-[#0A0F1C] border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all disabled:opacity-70 text-[#F1F5F9]"
                    />
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
                  <label className="text-xs text-[#64748B] uppercase font-bold tracking-wider">Recovery Email</label>
                  <div className="relative flex items-center">
                    <Mail size={18} className="absolute left-4 text-[#64748B]" />
                    <input 
                      disabled={!isEditing}
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full bg-[#0A0F1C] border border-[#0A0F1C] rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#10B981] transition-all disabled:opacity-70 text-[#F1F5F9]"
                    />
                  </div>
                </div>

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

      {/* --- CAMERA OVERLAY (Appears when camera is active) --- */}
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
              
              {/* Video Feed */}
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
            {/* Hidden canvas required to grab the frame */}
            <canvas ref={canvasRef} className="hidden"></canvas>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}