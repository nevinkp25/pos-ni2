'use client';

import React from 'react';
import { Check, Printer, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderSuccessScreenProps {
  onBackToHome: () => void;
}

export function OrderSuccessScreen({ onBackToHome }: OrderSuccessScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfdff] font-sans text-[#1a1c2e] items-center px-8 pt-20 pb-10">
      {/* Success Icon */}
      <div className="relative mb-10">
        <div className="w-32 h-32 rounded-full border-[6px] border-[#00d084]/20 flex items-center justify-center">
          <div className="w-24 h-24 bg-[#00d084] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,208,132,0.3)]">
            <Check className="w-12 h-12 text-white stroke-[5px]" />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="text-center mb-12">
        <h1 className="text-[28px] font-black text-[#1a1c2e] tracking-tight leading-tight">
          ORDER PLACED!
        </h1>
        <p className="text-[#94a3b8] text-[15px] font-bold mt-2">
          Your order has been placed successfully
        </p>
      </div>

      {/* Order Number Card */}
      <div className="w-full max-w-sm bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,102,178,0.06)] border border-[#f0f4f8] mb-12 flex flex-col items-center">
        <span className="text-[#94a3b8] text-[13px] font-black uppercase tracking-[0.2em] mb-2">
          Order Number
        </span>
        <h2 className="text-[#0066b2] text-[56px] font-black leading-none tracking-tighter">
          #4022
        </h2>
      </div>

      {/* Actions */}
      <div className="w-full max-w-sm space-y-4 mt-auto">
        <Button 
          variant="outline"
          className="w-full h-16 rounded-[20px] border-[#eef2f8] bg-white text-[#1a1c2e] text-[16px] font-black shadow-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Printer className="w-5 h-5 text-[#94a3b8]" />
          Print Receipt
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
