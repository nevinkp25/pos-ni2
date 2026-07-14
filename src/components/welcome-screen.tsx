'use client';

import React from 'react';
import { Menu, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function WelcomeScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-[#1a1c2e]">
      {/* Top Header */}
      <div className="flex justify-end p-6">
        <button className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
          <Menu className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-8 pt-12">
        <h1 className="text-[40px] font-extrabold tracking-tight mb-4">
          Welcome
        </h1>
        <p className="text-[#6b7280] text-lg text-center font-medium leading-tight max-w-[280px] mb-12">
          Configure your restaurant to get started
        </p>

        <div className="w-full max-w-sm space-y-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="bella-cuchina"
              className="h-[72px] rounded-2xl border-[#e5e7eb] border-2 px-6 text-xl placeholder:text-gray-900 focus-visible:ring-0 focus-visible:border-primary transition-all shadow-sm"
            />
          </div>

          <Button 
            className="w-full h-[72px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-2xl text-xl font-bold shadow-[0_8px_20px_rgba(0,102,178,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              <Check className="w-4 h-4 stroke-[3px]" />
            </div>
            Get Started
          </Button>
        </div>

        <span className="mt-8 text-gray-400 font-semibold text-sm">
          V15.0
        </span>
      </div>

      {/* Footer */}
      <div className="bg-[#f8fbfe] border-t border-dashed border-gray-200 py-12 px-8 mt-auto flex flex-col items-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">
            Powered By
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[#0066b2] text-3xl font-bold tracking-tighter">network</span>
            <div className="flex items-center">
              <svg 
                viewBox="0 0 24 24" 
                className="w-6 h-6 text-[#ed1c24] fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5l8 7-8 7V5z" />
              </svg>
            </div>
          </div>
          <span className="text-[#0088cc] text-lg font-medium -mt-1">dine</span>
        </div>
      </div>
    </div>
  );
}
