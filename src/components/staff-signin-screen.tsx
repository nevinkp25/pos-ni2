
'use client';

import React from 'react';
import { Menu, User, ArrowRight, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function StaffSignInScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] overflow-hidden">
      {/* Blue Header Section */}
      <div className="bg-gradient-to-b from-[#0e8ad9] to-[#066bb1] h-[220px] pt-12 px-6 flex flex-col shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[#066bb1] font-bold text-lg">BC</span>
            </div>
            <h2 className="text-white text-2xl font-bold tracking-tight">Bella Cuchina</h2>
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm">
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Card Section */}
      <div className="flex-1 -mt-16 bg-white rounded-t-[40px] px-8 pt-10 flex flex-col shadow-[0_-12px_30px_rgba(0,0,0,0.04)]">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-[26px] font-bold mb-1 tracking-tight">Staff Sign In</h1>
          <p className="text-[#6b7280] text-[16px] mb-8 font-medium">Enter your Staff ID to unlock actions</p>

          <div className="space-y-4 mb-10">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Staff ID (e.g. ABC1)"
                className="h-14 rounded-xl border-[#e5e7eb] pl-12 text-[17px] placeholder:text-gray-300 focus-visible:ring-0 focus-visible:border-[#0e8ad9] transition-all font-medium"
              />
            </div>

            <Button className="w-full h-14 bg-[#b8d2e4] hover:bg-[#a5c3d9] text-white rounded-xl text-[17px] font-bold flex items-center justify-center gap-2 shadow-none transition-all">
              Sign in
              <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
            </Button>

            <Button className="w-full h-14 bg-[#ebf7ef] hover:bg-[#def0e5] text-[#27ae60] rounded-xl text-[17px] font-bold flex items-center justify-center gap-2 shadow-none transition-all border-none">
              <Lock className="w-4 h-4 fill-current" />
              Sign in to enable actions
            </Button>
          </div>

          {/* Locked Status Illustration */}
          <div className="flex flex-col items-center mt-12">
            <div className="relative w-36 h-36 mb-6">
                {/* 3D-style POS Terminal SVG Illustration */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="termGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#dbeafe" />
                      <stop offset="100%" stopColor="#bfdbfe" />
                    </linearGradient>
                  </defs>
                  {/* Terminal Body */}
                  <rect x="25" y="20" width="50" height="70" rx="6" fill="url(#termGrad)" />
                  <rect x="25" y="20" width="50" height="35" rx="6" fill="#eff6ff" />
                  {/* Screen */}
                  <rect x="30" y="25" width="40" height="25" rx="2" fill="#dbeafe" />
                  {/* Buttons */}
                  <rect x="32" y="58" width="8" height="6" rx="1" fill="#93c5fd" />
                  <rect x="46" y="58" width="8" height="6" rx="1" fill="#93c5fd" />
                  <rect x="60" y="58" width="8" height="6" rx="1" fill="#93c5fd" />
                  <rect x="32" y="70" width="8" height="6" rx="1" fill="#93c5fd" />
                  <rect x="46" y="70" width="8" height="6" rx="1" fill="#93c5fd" />
                  <rect x="60" y="70" width="8" height="6" rx="1" fill="#93c5fd" />
                  {/* Card Slot */}
                  <rect x="25" y="15" width="50" height="5" rx="1" fill="#93c5fd" />
                  
                  {/* Floating Lock */}
                  <g transform="translate(55, 45)">
                    <rect x="0" y="0" width="24" height="20" rx="4" fill="#f59e0b" />
                    <path d="M6 0 V-6 A6 6 0 0 1 18 -6 V0" fill="none" stroke="#f59e0b" strokeWidth="3" />
                    <circle cx="12" cy="10" r="2" fill="#fff" />
                  </g>
                </svg>
            </div>
            <h3 className="text-xl font-bold mb-1 tracking-tight">Staff actions are locked</h3>
            <p className="text-gray-400 text-[15px] font-medium">Available after start verification</p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="bg-white py-10 flex flex-col items-center shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-300 tracking-[0.25em] uppercase mb-1">
            POWERED BY
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[#0066b2] text-[28px] font-black tracking-tighter">network</span>
            <div className="flex items-center -ml-0.5">
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-[#ed1c24] fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5l8 7-8 7V5z" />
              </svg>
            </div>
          </div>
          <span className="text-[#0088cc] text-[16px] font-bold tracking-tight -mt-1.5 opacity-80">dine</span>
        </div>
      </div>
    </div>
  );
}
