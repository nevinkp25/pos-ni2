'use client';

import React, { useState } from 'react';
import { ChevronLeft, Scan, Delete, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectTableScreenProps {
  onBack?: () => void;
}

export function SelectTableScreen({ onBack }: SelectTableScreenProps) {
  const [tableNumber, setTableNumber] = useState<string>('');

  const handleNumberClick = (num: string) => {
    if (tableNumber.length < 4) {
      setTableNumber(prev => prev + num);
    }
  };

  const handleClear = () => {
    setTableNumber('');
  };

  const handleBackspace = () => {
    setTableNumber(prev => prev.slice(0, -1));
  };

  const keypadButtons = [
    { value: '1', type: 'number' },
    { value: '2', type: 'number' },
    { value: '3', type: 'number' },
    { value: '4', type: 'number' },
    { value: '5', type: 'number' },
    { value: '6', type: 'number' },
    { value: '7', type: 'number' },
    { value: '8', type: 'number' },
    { value: '9', type: 'number' },
    { value: 'C', type: 'clear' },
    { value: '0', type: 'number' },
    { value: 'backspace', type: 'backspace' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 h-20 flex items-center justify-between shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-b-[32px] z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-[#0066b2] stroke-[2.5px]" />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Select a Table</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
          <Scan className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto">
        {/* Table Number Display Card */}
        <div className="w-full aspect-[4/3] max-w-sm bg-[#f0f7ff] border border-[#d1e9ff] rounded-[32px] flex items-center justify-center mb-10 shadow-sm">
          {tableNumber ? (
            <span className="text-[#1E293B] text-[80px] font-bold leading-none transition-all duration-200 animate-in fade-in zoom-in-95">
              {tableNumber}
            </span>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-[#94a3b8] text-[40px] font-bold tracking-tight">Table</span>
              <span className="text-[#0066b2] text-[64px] font-bold leading-none opacity-30">
                #
              </span>
            </div>
          )}
        </div>

        {/* Keypad Grid */}
        <div className="w-full max-w-sm grid grid-cols-3 gap-y-5 gap-x-6 mb-10">
          {keypadButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => {
                if (btn.type === 'number') handleNumberClick(btn.value);
                if (btn.type === 'clear') handleClear();
                if (btn.type === 'backspace') handleBackspace();
              }}
              className={cn(
                "h-16 flex items-center justify-center rounded-[24px] text-2xl font-bold transition-all active:scale-[0.9] shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-50",
                btn.type === 'number' && "bg-white text-[#1a1c2e] hover:bg-gray-50",
                btn.type === 'clear' && "bg-white text-[#ef4444] hover:bg-red-50",
                btn.type === 'backspace' && "bg-white text-gray-400 hover:bg-gray-50"
              )}
            >
              {btn.type === 'backspace' ? (
                <Delete className="w-7 h-7" />
              ) : (
                btn.value
              )}
            </button>
          ))}
        </div>

        {/* Footer Banner */}
        <div className="w-full max-w-sm bg-[#eff2ff] py-4 px-6 rounded-2xl flex items-center justify-center gap-2 mb-4 shrink-0">
          <CheckCircle2 className="w-5 h-5 text-[#5c69ff]" />
          <span className="text-[#5c69ff] text-sm font-bold tracking-tight">
            Tap a table number to begin
          </span>
        </div>
      </div>
    </div>
  );
}
