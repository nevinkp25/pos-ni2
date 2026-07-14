'use client';

import React, { useState } from 'react';
import { ChevronLeft, Scan, Delete, CheckCircle2, X, Minus, Plus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectTableScreenProps {
  onBack?: () => void;
}

interface TableStatus {
  id: string;
  number: string;
  isAvailable: boolean;
}

export function SelectTableScreen({ onBack }: SelectTableScreenProps) {
  const [tableNumber, setTableNumber] = useState<string>('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [guestCount, setGuestCount] = useState(1);

  // Mock table data for the chips
  const tables: TableStatus[] = [
    { id: '1', number: '1020', isAvailable: true },
    { id: '2', number: '1021', isAvailable: true },
    { id: '3', number: '2002', isAvailable: true },
    { id: '4', number: '2003', isAvailable: true },
    { id: '5', number: '1024', isAvailable: true },
    { id: '6', number: '2013', isAvailable: false },
    { id: '7', number: '2341', isAvailable: false },
    { id: '8', number: '2347', isAvailable: false },
  ];

  const handleNumberClick = (num: string) => {
    if (tableNumber.length < 4) {
      setTableNumber(prev => prev + num);
      setShowBottomSheet(false);
    }
  };

  const handleClear = () => {
    setTableNumber('');
    setShowBottomSheet(false);
  };

  const handleBackspace = () => {
    setTableNumber(prev => prev.slice(0, -1));
    setShowBottomSheet(false);
  };

  const handleChipClick = (table: TableStatus) => {
    setTableNumber(table.number);
    if (table.isAvailable) {
      setShowBottomSheet(true);
    }
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
    <div className="flex flex-col h-screen bg-white font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      {/* Header */}
      <div className="bg-white px-6 h-16 flex items-center justify-between shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-b-[24px] z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-[#0066b2] stroke-[2.5px]" />
        </button>
        <h1 className="text-lg font-bold tracking-tight">Select a Table</h1>
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
          <Scan className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-6 pt-4 overflow-y-auto pb-4">
        {/* Table Number Display Card */}
        <div className={cn(
          "w-full max-w-sm bg-white border border-[#d1e9ff] rounded-[24px] flex items-center justify-center relative transition-all duration-300 shadow-sm mb-4 shrink-0",
          tableNumber ? "h-24" : "h-32"
        )}>
          {tableNumber ? (
            <div className="flex items-center gap-1 relative">
              <span className="text-[#1E293B] text-[48px] font-bold leading-none animate-in fade-in zoom-in-95">
                {tableNumber}
              </span>
              <div className="w-[3px] h-10 bg-[#0066b2] ml-1 rounded-full animate-pulse" />
              <button 
                onClick={handleClear}
                className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f7ff] text-[#1E293B]/60 hover:bg-[#d1e9ff] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-[#94a3b8] text-[24px] font-bold tracking-tight">Table</span>
              <span className="text-[#0066b2] text-[48px] font-bold leading-none opacity-30">
                #
              </span>
            </div>
          )}
        </div>

        {/* Table Status Chips - Only visible when typing */}
        {tableNumber && (
          <div className="w-full max-w-sm grid grid-cols-4 gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300 shrink-0">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleChipClick(table)}
                className={cn(
                  "h-10 rounded-full border-[1.5px] text-xs font-bold transition-all active:scale-95 flex items-center justify-center",
                  tableNumber === table.number 
                    ? "bg-[#0066b2]/10 border-[#0066b2] text-[#0066b2]"
                    : table.isAvailable 
                      ? "bg-[#ecf7ef] border-[#def0e5] text-[#26ab5f]" 
                      : "bg-[#fef2f2] border-[#fee2e2] text-[#ef4444]"
                )}
              >
                {table.number}
              </button>
            ))}
          </div>
        )}

        {/* Keypad Grid */}
        <div className="w-full max-w-sm grid grid-cols-3 gap-y-2 gap-x-3 mb-4">
          {keypadButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => {
                if (btn.type === 'number') handleNumberClick(btn.value);
                if (btn.type === 'clear') handleClear();
                if (btn.type === 'backspace') handleBackspace();
              }}
              className={cn(
                "h-12 flex items-center justify-center rounded-[18px] text-xl font-bold transition-all active:scale-[0.9] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-50",
                btn.type === 'number' && "bg-white text-[#1a1c2e] hover:bg-gray-50",
                btn.type === 'clear' && "bg-white text-[#ef4444] hover:bg-red-50",
                btn.type === 'backspace' && "bg-white text-gray-400 hover:bg-gray-50"
              )}
            >
              {btn.type === 'backspace' ? (
                <div className="bg-[#1a1c2e] p-1.5 rounded-lg">
                  <Delete className="w-4 h-4 text-white" />
                </div>
              ) : (
                btn.value
              )}
            </button>
          ))}
        </div>

        {/* Footer Banner (hidden when bottom sheet is open) */}
        {!showBottomSheet && (
          <div className="w-full max-w-sm bg-[#eff2ff] py-3 px-6 rounded-xl flex items-center justify-center gap-2 mt-auto shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#5c69ff]" />
            <span className="text-[#5c69ff] text-[12px] font-bold tracking-tight">
              Tap a table number to begin
            </span>
          </div>
        )}
      </div>

      {/* Selected Table Bottom Sheet */}
      {showBottomSheet && (
        <div className="absolute inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
          {/* Backdrop Overlay (Subtle) */}
          <div className="absolute inset-0 -top-screen bg-black/5" onClick={() => setShowBottomSheet(false)} />
          
          <div className="bg-white rounded-t-[24px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] border-t border-gray-100 flex flex-col pt-4 pb-5 relative">
            <div className="px-6 flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-[#0066b2]/60 text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">
                  SELECTED
                </span>
                <h2 className="text-[#1a1c2e] text-[20px] font-extrabold leading-tight">
                  Table #{tableNumber}
                </h2>
              </div>
              
              {/* Guest Counter */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#d1e9ff] shadow-sm text-[#0066b2] active:scale-90 transition-all"
                >
                  <Minus className="w-4 h-4 stroke-[3px]" />
                </button>
                <div className="flex flex-col items-center min-w-[28px]">
                  <span className="text-[#1a1c2e] text-xl font-black leading-none">{guestCount}</span>
                  <span className="text-[#0066b2]/60 text-[9px] font-black uppercase tracking-wider mt-0.5">GUEST</span>
                </div>
                <button 
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-[0_4px_12px_rgba(0,102,178,0.3)] active:scale-90 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3px]" />
                </button>
              </div>
            </div>

            {/* Dashed Separator */}
            <div className="w-full border-t border-dashed border-[#d1e9ff] mb-4" />

            <div className="px-6">
              <button 
                className="w-full h-[52px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[16px] text-[16px] font-black shadow-[0_6px_20px_rgba(0,102,178,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                Start Order
                <ArrowRight className="w-5 h-5 stroke-[3.5px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
