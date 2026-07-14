
'use client';

import React from 'react';
import { Menu, User, ArrowRight, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function StaffSignInScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] overflow-hidden">
      {/* Blue Header Section */}
      <div className="bg-gradient-to-b from-[#0088cc] to-[#0066b2] h-[220px] pt-12 px-6 flex flex-col shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#0066b2] font-bold text-lg">BC</span>
            </div>
            <h2 className="text-white text-2xl font-bold tracking-tight">Bella Cuchina</h2>
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all">
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Main Card Section */}
      <div className="flex-1 -mt-16 bg-white rounded-t-[40px] px-8 pt-10 flex flex-col shadow-[0_-8px_24px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-bold mb-1">Staff Sign In</h1>
          <p className="text-[#6b7280] text-base mb-8">Enter your Staff ID to unlock actions</p>

          <div className="space-y-4 mb-10">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Staff ID (e.g. ABC1)"
                className="h-14 rounded-xl border-[#e5e7eb] pl-12 text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-[#0066b2] transition-all font-medium"
              />
            </div>

            <Button className="w-full h-14 bg-[#b3d1e3] hover:bg-[#a1c2d6] text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2 shadow-none transition-all">
              Sign in
              <ArrowRight className="w-5 h-5" />
            </Button>

            <Button className="w-full h-14 bg-[#e9f7ef] hover:bg-[#dcf0e6] text-[#27ae60] rounded-xl text-lg font-bold flex items-center justify-center gap-2 shadow-none transition-all border-none">
              <Lock className="w-4 h-4 fill-current" />
              Sign in to enable actions
            </Button>
          </div>

          {/* Locked Status Illustration */}
          <div className="flex flex-col items-center mt-12">
            <div className="relative w-40 h-40 mb-4 opacity-80">
                {/* Simulated POS Terminal with Lock Icon */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
                    <rect x="25" y="10" width="50" height="80" rx="8" fill="currentColor" />
                    <rect x="30" y="20" width="40" height="25" rx="2" fill="#d1d5db" />
                    <rect x="32" y="55" width="8" height="8" rx="1" fill="#d1d5db" />
                    <rect x="46" y="55" width="8" height="8" rx="1" fill="#d1d5db" />
                    <rect x="60" y="55" width="8" height="8" rx="1" fill="#d1d5db" />
                    <rect x="32" y="70" width="8" height="8" rx="1" fill="#d1d5db" />
                    <rect x="46" y="70" width="8" height="8" rx="1" fill="#d1d5db" />
                    <rect x="60" y="70" width="8" height="8" rx="1" fill="#d1d5db" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-3 rounded-2xl shadow-lg transform translate-x-8 translate-y-4">
                        <Lock className="w-8 h-8 text-[#f59e0b] fill-[#f59e0b]" />
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-bold mb-1">Staff actions are locked</h3>
            <p className="text-gray-400 text-sm font-medium">Available after start verification</p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="bg-[#f8fbfe] py-8 flex flex-col items-center shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-gray-300 tracking-[0.2em] uppercase mb-1">
            Powered By
          </span>
          <div className="flex items-center gap-1 opacity-60">
            <span className="text-[#0066b2] text-2xl font-black tracking-tighter">network</span>
            <div className="flex items-center">
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-[#ed1c24] fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5l8 7-8 7V5z" />
              </svg>
            </div>
          </div>
          <span className="text-[#0088cc] text-base font-bold tracking-tight -mt-1 opacity-60">dine</span>
        </div>
      </div>
    </div>
  );
}
