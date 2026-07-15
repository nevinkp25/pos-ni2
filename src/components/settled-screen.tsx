'use client';

import React from 'react';
import { Check, Printer, Home, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SettledScreenProps {
  onBackToHome: () => void;
}

export function SettledScreen({ onBackToHome }: SettledScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] items-center px-8 pt-16 pb-10 safe-top safe-bottom">
      {/* Success Icon */}
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-full border-[6px] border-[#00d084]/20 flex items-center justify-center">
          <div className="w-24 h-24 bg-[#00d084] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,208,132,0.3)]">
            <Check className="w-12 h-12 text-white stroke-[5px]" />
          </div>
        </div>
      </div>

      {/* Settled Message */}
      <div className="text-center mb-10">
        <h1 className="text-[32px] font-black text-[#1a1c2e] tracking-tight leading-none uppercase mb-4">
          SETTLED!
        </h1>
        <p className="text-[#94a3b8] text-[16px] font-bold leading-tight max-w-[280px] mx-auto">
          You have completely settled the payment for this table!
        </p>
      </div>

      {/* Transaction Details Card */}
      <div className="w-full max-w-sm bg-white rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-[#f0f4f8] mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#f0f7ff] rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#0066b2] fill-current" />
          </div>
          <span className="text-[#0066b2] text-[13px] font-black uppercase tracking-tight">
            TRANSACTION DETAILS
          </span>
        </div>

        <div className="w-full border-t border-gray-50 mb-6 border-dashed" />

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

      <div className="w-full border-t border-dotted border-gray-200 mb-8" />

      {/* Actions */}
      <div className="w-full max-w-sm space-y-4 mt-auto">
        <Button 
          variant="outline"
          className="w-full h-16 rounded-[20px] border-[#eef2f8] bg-white text-[#1a1c2e] text-[16px] font-black shadow-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Printer className="w-5 h-5 text-[#1a1c2e] stroke-[2.5px]" />
          Print Merchant Receipt
        </Button>
        <Button 
          variant="outline"
          className="w-full h-16 rounded-[20px] border-[#eef2f8] bg-white text-[#1a1c2e] text-[16px] font-black shadow-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Printer className="w-5 h-5 text-[#1a1c2e] stroke-[2.5px]" />
          Print Customer Receipt
        </Button>
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
