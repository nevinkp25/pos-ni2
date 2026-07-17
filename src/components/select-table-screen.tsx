'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Scan, X, Minus, Plus, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getOrderForTable } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

interface SelectTableScreenProps {
  onBack?: () => void;
  onConfirmSelection?: (tableNumber: string, guestCount: number) => void;
  onNavigateToOrder?: (tableNumber: string, guestCount: number) => void;
  onScanQR?: () => void;
  mode?: 'order' | 'pay';
}

interface TableStatus {
  id: string;
  number: string;
  isAvailable: boolean;
}

export function SelectTableScreen({ onBack, onConfirmSelection, onNavigateToOrder, onScanQR, mode = 'order' }: SelectTableScreenProps) {
  const [tableNumber, setTableNumber] = useState<string>('');
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const { toast } = useToast();

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

  const filteredTables = useMemo(() => {
    if (!tableNumber) return [];
    return tables.filter(t => t.number.includes(tableNumber));
  }, [tableNumber, tables]);

  const handleNumberClick = (num: string) => {
    // Increased limit to 16 characters
    if (tableNumber.length < 16) {
      const newNum = tableNumber + num;
      setTableNumber(newNum);
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
    setShowBottomSheet(true);
  };

  const handleConfirm = () => {
    if (mode === 'pay') {
      const existingOrder = getOrderForTable(tableNumber);
      if (!existingOrder) {
        toast({
          title: "No Order Found",
          description: `Table #${tableNumber} does not have an active order to pay.`,
          variant: "destructive",
          action: (
            <ToastAction 
              altText="Start Order" 
              onClick={() => onNavigateToOrder?.(tableNumber, 1)}
            >
              Start Order
            </ToastAction>
          ),
        });
        return;
      }
    }
    onConfirmSelection?.(tableNumber, guestCount);
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

  // Dynamic font size based on string length to handle 8-16 characters
  const getDynamicFontSize = () => {
    if (tableNumber.length <= 4) return 'text-[48px]';
    if (tableNumber.length <= 8) return 'text-[36px]';
    if (tableNumber.length <= 12) return 'text-[28px]';
    return 'text-[22px]';
  };

  return (
    <div className="flex flex-col h-screen bg-[#fcfdff] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      <div className="bg-white px-6 h-16 flex items-center justify-between shrink-0 shadow-sm rounded-b-[24px] z-10">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-[#0066b2] stroke-[2.5px]" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-[#1a1c2e]">Select a Table</h1>
        
        <button 
          onClick={onScanQR}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Scan className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center px-6 pt-4 overflow-y-auto pb-4">
        <div className={cn(
          "w-full max-w-sm bg-white border border-[#f0f4f8] rounded-[24px] flex items-center justify-center relative transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.02)] mb-4 shrink-0 overflow-hidden",
          tableNumber ? "h-24" : "h-40"
        )}>
          {tableNumber ? (
            <>
              <div className="flex items-center gap-1 px-4 text-center">
                <span className={cn(
                  "text-[#1E293B] font-bold leading-none animate-in fade-in zoom-in-95 break-all",
                  getDynamicFontSize()
                )}>
                  {tableNumber}
                </span>
                <div className="w-[3px] h-10 bg-[#0066b2] ml-1 rounded-full animate-pulse shrink-0" />
              </div>
              <button 
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#f0f7ff] text-[#1E293B]/60 hover:bg-[#d1e9ff] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-[#94a3b8] text-[36px] font-bold tracking-tight opacity-60">
                Table #
              </span>
            </div>
          )}
        </div>

        <div className={cn(
          "w-full max-w-sm grid grid-cols-4 gap-2 mb-4 shrink-0 transition-all duration-300",
          filteredTables.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none h-0 mb-0"
        )}>
          {filteredTables.map((table) => (
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

        <div className="w-full max-w-sm grid grid-cols-3 gap-y-3 gap-x-5 mb-8">
          {keypadButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => {
                if (btn.type === 'number') handleNumberClick(btn.value);
                if (btn.type === 'clear') handleClear();
                if (btn.type === 'backspace') handleBackspace();
              }}
              className={cn(
                "h-16 flex items-center justify-center rounded-full text-[22px] font-bold transition-all active:scale-[0.9] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-[#f8f9fb]",
                btn.type === 'number' && "bg-white text-[#1a1c2e] hover:bg-gray-50",
                btn.type === 'clear' && "bg-white text-[#ef4444] hover:bg-red-50",
                btn.type === 'backspace' && "bg-white text-[#94a3b8] hover:bg-gray-50"
              )}
            >
              {btn.type === 'backspace' ? (
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current opacity-40">
                    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z" />
                  </svg>
                </div>
              ) : (
                btn.value
              )}
            </button>
          ))}
        </div>

        <div className="w-full max-w-sm bg-[#f0f7ff] rounded-[20px] py-4 flex items-center justify-center gap-2.5 border border-[#d1e9ff] mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="w-5 h-5 rounded-full border-[1.5px] border-[#0066b2] flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-[#0066b2] stroke-[4px]" />
          </div>
          <span className="text-[#0066b2] text-[14px] font-black tracking-tight">Tap a table number to begin</span>
        </div>
      </div>

      {showBottomSheet && (
        <div className="absolute inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
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
              
              {mode === 'order' && (
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
              )}
            </div>

            <div className="w-full border-t border-dashed border-[#d1e9ff] mb-4" />

            <div className="px-6">
              <button 
                onClick={handleConfirm}
                className="w-full h-[52px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[16px] text-[16px] font-black shadow-[0_6px_20px_rgba(0,102,178,0.25)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                {mode === 'order' ? 'Start Order' : 'Go to Order'}
                <ArrowRight className="w-5 h-5 stroke-[3.5px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
