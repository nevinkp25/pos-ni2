'use client';

import React from 'react';
import { Menu, User, ArrowRight, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function StaffSignInScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] overflow-y-auto safe-top safe-bottom">
      {/* Header Section - More condensed */}
      <div className="bg-gradient-to-b from-[#0081d3] to-[#005ea1] h-[120px] pt-8 px-6 shrink-0 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[#005ea1] font-bold text-base">BC</span>
            </div>
            <h2 className="text-white text-lg font-bold tracking-tight">Bella Cuchina</h2>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Card - More condensed padding and margins */}
      <div className="flex-1 -mt-8 bg-white rounded-t-[32px] px-6 pt-8 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        <div className="w-full max-w-sm mx-auto flex flex-col h-full">
          <h1 className="text-[22px] font-bold mb-1 tracking-tight">Staff Sign In</h1>
          <p className="text-[#94a3b8] text-sm mb-6 font-medium">Enter your Staff ID to unlock actions</p>

          <div className="space-y-3 mb-8">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbd5e1]">
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Staff ID (e.g. ABC1)"
                className="h-12 rounded-xl border-[#e2e8f0] border-[1.5px] pl-12 text-base placeholder:text-[#cbd5e1] focus-visible:ring-0 focus-visible:border-[#0081d3] transition-all font-medium"
              />
            </div>

            <Button className="w-full h-12 bg-[#adc9e2] hover:bg-[#adc9e2] text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 shadow-none transition-all active:scale-[0.98]">
              Sign in
              <ArrowRight className="w-5 h-5 stroke-[3px]" />
            </Button>

            <Button className="w-full h-12 bg-[#ecf7ef] hover:bg-[#def0e5] text-[#26ab5f] rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-none transition-all border-none active:scale-[0.98]">
              <Lock className="w-4 h-4 fill-current" />
              Sign in to enable actions
            </Button>
          </div>

          {/* Status Section - Condensed illustration and text */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-28 h-28 mb-3">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                  {/* Terminal Body */}
                  <rect x="25" y="25" width="50" height="65" rx="8" fill="#d1e0f3" />
                  <rect x="25" y="25" width="50" height="35" rx="8" fill="#eff6ff" />
                  {/* Screen */}
                  <rect x="30" y="30" width="40" height="25" rx="4" fill="#bfdbfe" />
                  {/* Keypad */}
                  <g fill="#94a3b8">
                    <rect x="32" y="65" width="8" height="6" rx="1.5" />
                    <rect x="46" y="65" width="8" height="6" rx="1.5" />
                    <rect x="60" y="65" width="8" height="6" rx="1.5" />
                    <rect x="32" y="75" width="8" height="6" rx="1.5" />
                    <rect x="46" y="75" width="8" height="6" rx="1.5" />
                    <rect x="60" y="75" width="8" height="6" rx="1.5" />
                  </g>
                  {/* Card Slot */}
                  <rect x="25" y="20" width="50" height="5" rx="2" fill="#94a3b8" />
                  {/* Gold Lock */}
                  <g transform="translate(58, 52)">
                    <rect x="0" y="0" width="22" height="18" rx="4" fill="#f59e0b" />
                    <path d="M5 0 V-6 A6 6 0 0 1 17 -6 V0" fill="none" stroke="#f59e0b" strokeWidth="4" />
                    <circle cx="11" cy="9" r="2.5" fill="#fff" />
                  </g>
                </svg>
            </div>
            <h3 className="text-lg font-bold mb-0.5 tracking-tight text-[#1e293b]">Staff actions are locked</h3>
            <p className="text-[#94a3b8] text-sm font-medium">Available after start verification</p>
          </div>
        </div>
      </div>

      {/* Footer Branding - Condensed */}
      <div className="bg-white py-6 flex flex-col items-center shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-[#cbd5e1] tracking-[0.3em] uppercase mb-0.5">
            POWERED BY
          </span>
          <div className="flex items-center gap-0.5">
            <span className="text-[#005ea1] text-[24px] font-black tracking-tighter">network</span>
            <div className="flex items-center">
              <svg 
                viewBox="0 0 24 24" 
                className="w-4 h-4 text-[#ef4444] fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5l8 7-8 7V5z" />
              </svg>
            </div>
          </div>
          <span className="text-[#0ea5e9] text-sm font-bold tracking-tight -mt-1.5 opacity-90">dine</span>
        </div>
      </div>
    </div>
  );
}
