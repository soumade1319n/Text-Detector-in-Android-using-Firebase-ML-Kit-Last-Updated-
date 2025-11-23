import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AppState } from '../types';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Prefer back camera on mobile
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please ensure permissions are granted.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl);
      }
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-4">
        <div className="text-red-400 text-xl font-semibold">Camera Error</div>
        <p className="text-slate-400">{error}</p>
        <button 
          onClick={onCancel}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black flex flex-col">
      {/* Video Stream */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="absolute w-full h-full object-cover"
        />
        {/* Helper Overlay */}
        <div className="absolute inset-0 border-2 border-white/30 m-8 rounded-lg pointer-events-none flex items-center justify-center">
          <p className="text-white/50 text-sm font-medium bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            Align text within frame
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="h-24 bg-slate-900/90 backdrop-blur flex items-center justify-between px-8 pb-4 pt-2 shrink-0">
        <button 
          onClick={onCancel}
          className="text-white p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button 
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:bg-white/50 transition-all hover:scale-105"
        >
          <div className="w-12 h-12 bg-white rounded-full"></div>
        </button>

        <div className="w-12"></div> {/* Spacer for symmetry */}
      </div>

      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};