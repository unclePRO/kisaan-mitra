'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ScanLine, Bug, AlertCircle, X, Zap, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function UnifiedCropScan() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- CAMERA LOGIC ---
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setIsCameraOpen(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch (err) { alert("Camera access denied."); }
  };

  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    setSelectedImage(canvasRef.current.toDataURL('image/jpeg'));
    setIsCameraOpen(false);
    videoRef.current.srcObject.getTracks().forEach(t => t.stop());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSelectedImage(reader.result);
    reader.readAsDataURL(file);
  };

  // --- INTEGRATED API LOGIC ---
  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsScanning(true);
    setScanResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: "Analyze this crop image. Is it healthy? If not, what disease is it and what are the remedies?",
          chatId: "disease-scan-" + Date.now(),
          image: { 
            base64: selectedImage.split(',')[1], 
            mimeType: "image/jpeg" 
          }
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setScanResult({
          title: "Scan Analysis Complete",
          details: data.reply,
          icon: <Zap className="text-[#10B981]" />
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setScanResult({
        title: "Scan Error",
        details: "AI couldn't analyze the image. Please try again with a clearer photo.",
        icon: <AlertCircle className="text-yellow-500" />
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0F1C] text-[#F1F5F9] font-sans p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-[#10B981]">AI Agricultural Scanner</h1>

      {/* Main Scanner Card */}
      {!scanResult && (
        <div className="w-full max-w-2xl bg-[#141E30] p-8 rounded-3xl border border-[#64748B]/20 shadow-2xl flex flex-col items-center">
          <div className="w-full h-64 bg-[#0A0F1C] rounded-2xl mb-6 flex items-center justify-center border border-[#64748B]/10 overflow-hidden">
            {selectedImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={selectedImage} alt="Crop" className="h-full object-contain" />
            ) : (
              <div className="text-[#64748B] flex flex-col items-center">
                <ScanLine size={48} />
                <p className="text-sm mt-2">No image selected</p>
              </div>
            )}
          </div>

          {!isScanning && (
            <div className="flex gap-4 w-full">
              <button onClick={startCamera} className="flex-1 py-4 bg-[#0A0F1C] border border-[#64748B]/20 hover:border-[#10B981] rounded-xl flex justify-center gap-2 transition-colors"><Camera size={18} /> Camera</button>
              <button onClick={() => fileInputRef.current.click()} className="flex-1 py-4 bg-[#0A0F1C] border border-[#64748B]/20 hover:border-[#10B981] rounded-xl flex justify-center gap-2 transition-colors"><Upload size={18} /> Upload</button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          )}

          {selectedImage && !isScanning && (
            <button onClick={handleAnalyze} className="w-full mt-4 py-4 bg-[#10B981] text-[#0A0F1C] font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-[#10B981]/20">Analyze Now</button>
          )}

          {isScanning && <div className="py-8 animate-pulse text-[#10B981] font-bold">Consulting AI experts...</div>}
        </div>
      )}

      {/* Separate Result Container */}
      {scanResult && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl bg-[#141E30] p-10 rounded-3xl border border-[#10B981]/30 shadow-2xl mt-4"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-[#10B981]/10 rounded-2xl">{scanResult.icon}</div>
            <h3 className="font-bold text-2xl">{scanResult.title}</h3>
          </div>
          <div className="text-[#F1F5F9] text-base md:text-lg leading-relaxed whitespace-pre-wrap bg-[#0A0F1C] p-6 rounded-2xl border border-[#64748B]/10">
            {scanResult.details}
          </div>
          <button 
            onClick={() => { setSelectedImage(null); setScanResult(null); }} 
            className="mt-8 w-full py-4 bg-[#10B981] text-[#0A0F1C] font-bold rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
          >
            Scan Another Crop <ChevronRight size={20} />
          </button>
        </motion.div>
      )}

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-4">
            <video ref={videoRef} autoPlay className="max-h-[70vh] rounded-2xl shadow-2xl" />
            <button onClick={capturePhoto} className="mt-8 p-6 bg-[#10B981] rounded-full hover:bg-emerald-400 transition-all"><Camera size={32} color="#0A0F1C" /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}