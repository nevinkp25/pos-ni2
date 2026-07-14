'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home, Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderMenuScreenProps {
  tableNumber: string;
  onBack?: () => void;
  onHome?: () => void;
}

export function OrderMenuScreen({ tableNumber, onBack, onHome }: OrderMenuScreenProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Show the success toast when component mounts
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { title: 'STARTERS' },
    { title: 'PIZZA' },
    { title: 'MAINS' },
    { title: 'PIZZA' },
    { title: 'SIDES & SAUCES' },
    { title: 'DESSERTS' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#fcfdff] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      {/* Header */}
      <div className="bg-white px-6 h-20 flex items-center justify-between shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-b-[32px] z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-7 h-7 text-[#0066b2] stroke-[2.5px]" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-black leading-tight text-[#1a1c2e]">Menu</h1>
            <span className="text-[#94a3b8] text-[13px] font-bold">Table # {tableNumber}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onHome}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-[0_4px_12px_rgba(0,102,178,0.2)] active:scale-95 transition-all"
          >
            <Home className="w-5 h-5 fill-current" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
            <Search className="w-5 h-5 text-gray-700 stroke-[2.5px]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pt-6 overflow-y-auto pb-24">
        <div className="bg-white rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#f0f4f8] overflow-hidden">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={cn(
                "h-16 px-6 flex items-center justify-between transition-colors active:bg-gray-50",
                index !== categories.length - 1 && "border-b border-[#f0f4f8]"
              )}
            >
              <span className="text-[14px] font-black text-[#334155] tracking-wide">
                {category.title}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center">
                <ChevronDown className="w-4 h-4 text-[#0066b2] stroke-[3px]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Notification Bottom Sheet */}
      {showSuccess && (
        <div className="absolute bottom-6 inset-x-6 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-4 flex items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-[1.5px] border-[#00d084]/20 overflow-hidden relative group">
            {/* Gradient Border Overlay */}
            <div className="absolute inset-0 border-[1.5px] rounded-[20px] border-transparent bg-gradient-to-r from-transparent via-[#d1e9ff]/50 to-[#dce4ff]/50 pointer-events-none" />
            
            <div className="w-12 h-12 bg-[#00b8e6] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,184,230,0.3)]">
              <Check className="w-6 h-6 text-white stroke-[4px]" />
            </div>
            
            <div className="flex flex-col flex-1">
              <h3 className="text-[#1a1c2e] text-[15px] font-black tracking-tight leading-tight">
                Table Accessed Successfully
              </h3>
              <p className="text-[#94a3b8] text-[12px] font-bold mt-0.5 leading-tight">
                You can now take orders for Table #{tableNumber}.
              </p>
            </div>

            <button 
              onClick={() => setShowSuccess(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Re-importing X icon for the toast
import { X as CloseIcon } from 'lucide-react';
