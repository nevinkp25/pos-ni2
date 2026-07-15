'use client';

import React, { useState } from 'react';
import { Check, Printer, Home, CreditCard, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SettledScreenProps {
  onBackToHome: () => void;
  guestCount: number;
}

export function SettledScreen({ onBackToHome, guestCount }: SettledScreenProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Logic to determine how many buttons to show initially
  // If count is 6 or less, we show all. If > 6, we show 5 + a "More" button unless expanded.
  const showMoreButton = guestCount > 6 && !showAll;
  const buttonsToDisplay = showAll || guestCount <= 6 ? guestCount : 5;
  const remainingCount = guestCount - 5;

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] items-center px-6 pt-12 pb-8 safe-top safe-bottom tracking-tight overflow-y-auto">
      {/* Success Icon */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full border-[6px] border-[#00d084]/20 flex items-center justify-center">
          <div className="w-20 h-20 bg-[#00d084] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,208,132,0.3)]">
            <Check className="w-10 h-10 text-white stroke-[5px]" />
          </div>
        </div>
      </div>

      {/* Settled Message */}
      <div className="text-center mb-10">
        <h1 className="text-[34px] font-black text-[#1a1c2e] leading-none uppercase mb-4">
          SETTLED!
        </h1>
        <p className="text-[#94a3b8] text-[15px] font-bold leading-tight max-w-[280px] mx-auto">
          You have completely settled the payment for this table!
        </p>
      </div>

      {/* Transaction Details Card */}
      <div className="w-full max-w-md bg-white rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#f0f4f8] mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#f0f7ff] rounded-xl flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-[#0066b2] fill-current" />
          </div>
          <span className="text-[#0066b2] text-[13px] font-black uppercase tracking-wider">
            TRANSACTION DETAILS
          </span>
        </div>

        <div className="w-full border-t border-gray-50 mb-6" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[#94a3b8] text-[14px] font-bold">Transaction ID:</span>
            <span className="text-[#1a1c2e] text-[14px] font-black">#TXN-2026-102028</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#94a3b8] text-[14px] font-bold">Date:</span>
            <span className="text-[#1a1c2e] text-[14px] font-black">07/07/2026</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#94a3b8] text-[14px] font-bold">Time:</span>
            <span className="text-[#1a1c2e] text-[14px] font-black">12:23:23 PM</span>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="w-full border-t border-dotted border-gray-200 mb-6" />

      {/* Primary Print Actions */}
      <div className="w-full max-w-md space-y-3 mb-8">
        <Button 
          variant="outline"
          className="w-full h-14 rounded-[18px] border-gray-100 bg-white text-[#1a1c2e] text-[15px] font-black shadow-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Printer className="w-5 h-5 text-[#1a1c2e] stroke-[2.5px]" />
          Print Merchant Receipt
        </Button>
        <Button 
          variant="outline"
          className="w-full h-14 rounded-[18px] border-gray-100 bg-white text-[#1a1c2e] text-[15px] font-black shadow-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Printer className="w-5 h-5 text-[#1a1c2e] stroke-[2.5px]" />
          Print Customer Receipt
        </Button>
      </div>

      {/* Print Per Guest Section - Dynamic */}
      {guestCount > 1 && (
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[#94a3b8] text-[11px] font-black uppercase tracking-widest">Print per Guest</span>
            <div className="bg-[#f0f7ff] rounded-md px-2 py-1 flex items-center justify-center">
              <span className="text-[#0066b2] text-[10px] font-black uppercase">{guestCount} Guests</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: buttonsToDisplay }).map((_, i) => (
              <button 
                key={i}
                className="h-14 bg-white rounded-xl border border-gray-50 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all animate-in fade-in zoom-in-95 duration-200"
              >
                <User className="w-4 h-4 text-[#1a1c2e]" />
                <span className="text-[12px] font-black text-[#1a1c2e]">Guest {i + 1}</span>
              </button>
            ))}
            {showMoreButton && (
              <button 
                onClick={() => setShowAll(true)}
                className="h-14 bg-white rounded-xl border border-[#d1e9ff] shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-center gap-2 hover:bg-[#f0f7ff] active:scale-95 transition-all"
              >
                <span className="text-[#0066b2] text-[12px] font-black">+ {remainingCount} More</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Back to Home Action */}
      <div className="w-full max-w-md mt-auto">
        <Button 
          onClick={onBackToHome}
          className="w-full h-16 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[16px] font-black shadow-[0_8px_30px_rgba(0,102,178,0.25)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Home className="w-5 h-5 text-white fill-current" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
