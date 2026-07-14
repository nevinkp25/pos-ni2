'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export function ProcessingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 border-4 border-[#f1f5f9] rounded-full" />
        <Loader2 className="w-24 h-24 text-[#0066b2] animate-spin absolute" />
      </div>
      <h2 className="mt-8 text-[22px] font-black text-[#1a1c2e] tracking-tight">Processing Order...</h2>
      <p className="mt-2 text-[#94a3b8] text-[14px] font-bold">Please wait a moment</p>
    </div>
  );
}
