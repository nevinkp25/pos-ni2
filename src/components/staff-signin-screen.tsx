'use client';

import React from 'react';
import { Menu, User, ArrowRight, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function StaffSignInScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] overflow-hidden select-none">
      {/* Header Section with Deep Blue Gradient */}
      <div className="bg-gradient-to-b from-[#0081d3] to-[#005ea1] h-[160px] pt-10 px-6 shrink-0 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[#005ea1] font-bold text-lg">BC</span>
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">Bella Cuchina</h2>
          </div>
          <button className="w-11 h-11 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main White Card with Large Rounded Corners */}
      <div className="flex-1 -mt-10 bg-white rounded-t-[40px] px-8 pt-10 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.03)] overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-[24px] font-bold mb-1 tracking-tight">Staff Sign In</h1>
          <p className="text-[#94a3b8] text-[15px] mb-8 font-medium">Enter your Staff ID to unlock actions</p>

          <div className="space-y-4 mb-10">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbd5e1]">
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Staff ID (e.g. ABC1)"
                className="h-14 rounded-xl border-[#e2e8f0] border-[1.5px] pl-12 text-[16px] placeholder:text-[#cbd5e1] focus-visible:ring-0 focus-visible:border-[#0081d3] transition-all font-medium"
              />
            </div>

            <Button className="w-full h-14 bg-[#adc9e2] hover:bg-[#9cb9d2] text-white rounded-xl text-[16px] font-bold flex items-center justify-center gap-2 shadow-none transition-all active:scale-[0.98]">
              Sign in
              <ArrowRight className="w-5 h-5 stroke-[3px]" />
            </Button>

            <Button className="w-full h-14 bg-[#ecf7ef] hover:bg-[#def0e5] text-[#26ab5f] rounded-xl text-[16px] font-bold flex items-center justify-center gap-2 shadow-none transition-all border-none active:scale-[0.98]">
              <Lock className="w-4 h-4 fill-current" />
              Sign in to enable actions
            </Button>
          </div>

          {/* Locked Status Illustration Section */}
          <div className="flex flex-col items-center mt-2">
            <div className="relative w-36 h-36 mb-6">
                {/* Custom SVG mimicking the 3D POS terminal in the image */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
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
                  {/* Card Slot Top */}
                  <rect x="25" y="20" width="50" height="5" rx="2" fill="#94a3b8" />
                  {/* 3D Gold Lock Overlay */}
                  <g transform="translate(58, 52)">
                    <rect x="0" y="0" width="22" height="18" rx="4" fill="#f59e0b" />
                    <path d="M5 0 V-6 A6 6 0 0 1 17 -6 V0" fill="none" stroke="#f59e0b" strokeWidth="4" />
                    <circle cx="11" cy="9" r="2.5" fill="#fff" />
                  </g>
                </svg>
            </div>
            <h3 className="text-xl font-bold mb-1 tracking-tight text-[#1e293b]">Staff actions are locked</h3>
            <p className="text-[#94a3b8] text-[15px] font-medium">Available after start verification</p>
          </div>
        </div>
      </div>

      {/* Branding Footer with precise logo replication */}
      <div className="bg-white py-10 flex flex-col items-center shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#cbd5e1] tracking-[0.3em] uppercase mb-1">
            POWERED BY
          </span>
          <div className="flex items-center gap-0.5">
            <span className="text-[#005ea1] text-[28px] font-black tracking-tighter">network</span>
            <div className="flex items-center">
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-[#ef4444] fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5l8 7-8 7V5z" />
              </svg>
            </div>
          </div>
          <span className="text-[#0ea5e9] text-[16px] font-bold tracking-tight -mt-2 opacity-90">dine</span>
        </div>
      </div>
    </div>
  );
}
