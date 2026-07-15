'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Zap, ZapOff, RefreshCcw, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRScanningScreenProps {
  onBack: () => void;
  onDetected: (tableId: string) => void;
}

export function QRScanningScreen({ onBack, onDetected }: QRScanningScreenProps) {
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  // Mock detection after 4 seconds of "scanning"
  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        onDetected('1020'); // Mock table detection
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, onDetected]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col font-sans text-white overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/60 to-transparent flex items-center justify-between px-6 z-20">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white stroke-[3px]" />
        </button>
        <h1 className="text-lg font-bold tracking-tight uppercase">Scan Table QR</h1>
        <div className="w-10 h-10" /> {/* Spacer */}
      </div>

      {/* Camera View Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Mock Camera Background (Dark gradient to simulate camera) */}
        <div className="absolute inset-0 bg-[#121212] flex items-center justify-center">
            {/* Pulsing light effect in center */}
            <div className="w-full h-full bg-gradient-to-tr from-blue-900/10 via-black to-blue-900/10 opacity-40" />
            <Camera className="w-24 h-24 text-white/5" />
        </div>

        {/* Scanner Frame */}
        <div className="relative w-[280px] h-[280px] flex items-center justify-center z-10">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#00d084] rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#00d084] rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#00d084] rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#00d084] rounded-br-2xl" />

            {/* Scanning Line Animation */}
            <div className="absolute top-0 inset-x-0 h-0.5 bg-[#00d084] shadow-[0_0_15px_rgba(0,208,132,0.8)] animate-scan" />
            
            {/* Center Hint */}
            <div className="flex flex-col items-center gap-4 opacity-40">
                <div className="w-16 h-16 border-2 border-dashed border-white/50 rounded-lg flex items-center justify-center">
                    <RefreshCcw className="w-6 h-6 animate-spin-slow" />
                </div>
            </div>
        </div>

        {/* Instructions Overlay */}
        <div className="absolute bottom-32 inset-x-0 flex flex-col items-center gap-3 px-10 text-center z-10">
            <p className="text-[15px] font-bold leading-tight">
                Align the table QR code within the frame to scan
            </p>
            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">
                Scanning active...
            </span>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center gap-12 px-6 z-20">
        <button 
          onClick={() => setIsFlashOn(!isFlashOn)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90",
            isFlashOn ? "bg-[#f59e0b] text-white" : "bg-white/10 text-white"
          )}
        >
          {isFlashOn ? <Zap className="w-6 h-6 fill-current" /> : <ZapOff className="w-6 h-6" />}
        </button>

        <button className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center active:scale-90 transition-all">
          <RefreshCcw className="w-6 h-6" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 3s infinite ease-in-out;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
