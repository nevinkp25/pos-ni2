'use client';

import React from 'react';
import { Menu, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  onStarted?: () => void;
}

export function WelcomeScreen({ onStarted }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col min-h-screen max-h-screen bg-white font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden">
      {/* Top Header - More compact */}
      <div className="flex justify-end p-4 shrink-0">
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
          <Menu className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Main Content - Condensed gaps */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 overflow-y-auto">
        <div className="w-full max-w-sm flex flex-col items-center">
          <h1 className="text-[32px] font-extrabold tracking-tight mb-1 text-center">
            Welcome
          </h1>
          <p className="text-[#6b7280] text-base text-center font-medium leading-tight max-w-[240px] mb-8">
            Configure your restaurant to get started
          </p>

          <div className="w-full space-y-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="bella-cuchina"
                className="h-[60px] rounded-xl border-[#e5e7eb] border-2 px-5 text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-primary transition-all shadow-sm font-medium"
              />
            </div>

            <Button 
              onClick={onStarted}
              className="w-full h-[60px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-xl text-lg font-bold shadow-[0_6px_15px_rgba(0,102,178,0.25)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[3px]" />
              </div>
              Get Started
            </Button>
          </div>

          <span className="mt-6 text-gray-400 font-bold text-xs tracking-wide">
            V15.0
          </span>
        </div>
      </div>

      {/* Footer Branding - More condensed */}
      <div className="bg-[#f8fbfe] border-t border-dashed border-gray-200 py-6 px-8 shrink-0 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-0.5">
            Powered By
          </span>
          <div className="flex items-center gap-1">
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
          <span className="text-[#0088cc] text-base font-bold tracking-tight -mt-1">dine</span>
        </div>
      </div>
    </div>
  );
}
