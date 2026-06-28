'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, ScanLine, Droplets, Bug, AlertCircle, X, Zap } from 'lucide-react';

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
    // Stop tracks
    videoRef.current.srcObject.getTracks().forEach(t => t.stop());
  };

  // --- API LOGIC (UPDATED) ---
  const handleAnalyze = async () => {
    setIsScanning(true);
    setScanResult(null);

    try {
      // 1. Send the image to your backend (e.g., a Python FastAPI or Flask server)
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We send the base64 image string to the server
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) {
        throw new Error('Backend failed to respond');
      }

      // 2. Wait for the real AI result from your backend
      const data = await response.json();

      // 3. Display the real data
      setScanResult({
        type: data.type,
        title: data.title,
        details: data.details,
        icon: data.type === "crop" ? <Bug className="text-red-500" /> : <Droplets className="text-blue-500" />
      });

    } catch (error) {
      console.error("API Error:", error);
      // Fallback message if your backend isn't running yet
      setScanResult({
        type: "error",
        title: "Backend Disconnected",
        details: "The frontend is ready! Please start your backend server on port 5000 to process this image.",
        icon: <AlertCircle className="text-yellow-500" />
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full h-screen fixed inset-0 bg-[#0A0F1C] text-[#F1F5F9] font-sans p-8 flex flex-col items-center">
      
      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 text-[#10B981]">AI Agricultural Scanner</h1>

      {/* Main Scanner Card */}
      <div className="w-full max-w-2xl bg-[#141E30] p-8 rounded-3xl border border-[#141E30] shadow-2xl flex flex-col items-center">
        
        {/* Preview Area */}
        <div className="w-full h-64 bg-[#0A0F1C] rounded-2xl mb-6 flex items-center justify-center border border-[#141E30] overflow-hidden">
          {selectedImage ? (
            <img src={selectedImage} className="h-full object-contain" />
          ) : (
            <div className="text-[#64748B] flex flex-col items-center">
              <ScanLine size={48} />
              <p>No image selected</p>
            </div>
          )}
        </div>

        {/* Controls */}
        {!isScanning && !scanResult && (
          <div className="flex gap-4 w-full">
            <button onClick={startCamera} className="flex-1 py-4 bg-[#141E30] border border-[#10B981] rounded-xl flex justify-center gap-2"><Camera /> Camera</button>
            <button onClick={() => fileInputRef.current.click()} className="flex-1 py-4 bg-[#141E30] border border-[#10B981] rounded-xl flex justify-center gap-2"><Upload /> Upload</button>
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setSelectedImage(URL.createObjectURL(e.target.files[0]))} />
          </div>
        )}

        {/* Scan Button */}
        {selectedImage && !isScanning && !scanResult && (
          <button onClick={handleAnalyze} className="w-full mt-4 py-4 bg-[#10B981] text-[#0A0F1C] font-bold rounded-xl hover:bg-[#059669]">Analyze Now</button>
        )}

        {/* Loading */}
        {isScanning && <div className="py-8 animate-pulse text-[#10B981] font-bold">Sending to Backend Server...</div>}

        {/* Result */}
        {scanResult && (
          <div className="w-full p-6 bg-[#0A0F1C] rounded-2xl border border-[#141E30]">
            <div className="flex items-center gap-4 mb-4">
              {scanResult.icon}
              <h3 className="font-bold text-xl">{scanResult.title}</h3>
            </div>
            <p className="text-[#64748B]">{scanResult.details}</p>
            <button onClick={() => { setSelectedImage(null); setScanResult(null); }} className="mt-6 w-full py-2 bg-[#141E30] rounded-lg">Scan another</button>
          </div>
        )}
      </div>

      {/* Camera Modal */}
      <AnimatePresence>
        {isCameraOpen && (
          <motion.div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
            <video ref={videoRef} autoPlay className="max-h-[80vh]" />
            <button onClick={capturePhoto} className="mt-8 p-6 bg-[#10B981] rounded-full"><Camera size={32} /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}