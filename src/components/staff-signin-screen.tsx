'use client';

import React, { useMemo, useState } from 'react';
import { Menu, User, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StaffSignInScreenProps {
  onLogin?: (staffId: string) => void;
  restaurantName?: string;
}

export function StaffSignInScreen({ onLogin, restaurantName = 'Bella Cuchina' }: StaffSignInScreenProps) {
  const [staffId, setStaffId] = useState('');

  const initials = useMemo(() => {
    return restaurantName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }, [restaurantName]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] overflow-y-auto safe-top safe-bottom">
      {/* Blue Header Section */}
      <div className="bg-gradient-to-b from-[#0081d3] to-[#015f9e] h-[160px] pt-8 px-6 shrink-0 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[#005ea1] font-bold text-base">{initials}</span>
            </div>
            <h2 className="text-white text-lg font-bold tracking-tight">{restaurantName}</h2>
          </div>
          
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md active:scale-95 outline-none">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Sign In Card */}
      <div className="flex-1 -mt-12 bg-white rounded-[48px] px-8 pt-10 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.02)] max-h-[360px]">
        <div className="w-full max-w-sm mx-auto flex flex-col h-full">
          <h1 className="text-[24px] font-extrabold mb-1 tracking-tight text-[#1a1c2e]">Staff Sign In</h1>
          <p className="text-[#94a3b8] text-base mb-8 font-medium">Enter your Staff ID to unlock actions</p>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cbd5e1]">
                <User className="w-5 h-5" />
              </div>
              <Input
                type="text"
                placeholder="Staff ID (e.g. ABC1)"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="h-14 rounded-2xl border-[#d1e9ff] border-2 pl-12 text-base placeholder:text-[#cbd5e1] focus-visible:ring-0 focus-visible:border-[#0081d3] transition-all font-medium"
              />
            </div>

            <Button 
              onClick={() => onLogin?.(staffId)}
              disabled={!staffId.trim()}
              className="w-full h-14 bg-[#b3d4e8] hover:bg-[#9fc3db] text-white rounded-2xl text-base font-bold flex items-center justify-center gap-2 shadow-none transition-all active:scale-[0.98] disabled:opacity-50"
            >
              Sign in
              <ArrowRight className="w-5 h-5 stroke-[3px]" />
            </Button>
          </div>
        </div>
      </div>

      {/* Locked Illustration Section */}
      <div className="flex flex-col items-center justify-center mt-12 mb-auto">
        <div className="relative w-32 h-32 mb-6">
          {/* POS Terminal Illustration SVG */}
          <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="42" y="32" width="44" height="64" rx="6" fill="#d1e2f3" />
            <rect x="46" y="38" width="36" height="24" rx="2" fill="#a5c9f3" />
            <rect x="46" y="68" width="8" height="8" rx="1.5" fill="#94a3b8" />
            <rect x="60" y="68" width="8" height="8" rx="1.5" fill="#94a3b8" />
            <rect x="74" y="68" width="8" height="8" rx="1.5" fill="#94a3b8" />
            <rect x="46" y="80" width="8" height="8" rx="1.5" fill="#94a3b8" />
            <rect x="60" y="80" width="8" height="8" rx="1.5" fill="#94a3b8" />
            <rect x="74" y="80" width="8" height="8" rx="1.5" fill="#94a3b8" />
            <path d="M42 38H86" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Lock Overlay */}
            <circle cx="82" cy="74" r="16" fill="white" />
            <path d="M82 66C79.7909 66 78 67.7909 78 70V73H76V81H88V73H86V70C86 67.7909 84.2091 66 82 66ZM84 73H80V70C80 68.8954 80.8954 68 82 68C83.1046 68 84 68.8954 84 70V73Z" fill="#f59e0b" />
          </svg>
        </div>
        
        <h3 className="text-[20px] font-black mb-1 tracking-tight text-[#1e293b]">Staff actions are locked</h3>
        <p className="text-[#94a3b8] text-[15px] font-bold text-center leading-tight">
          Sign in to enable actions.
        </p>
      </div>

      {/* Footer Branding */}
      <div className="py-12 flex flex-col items-center shrink-0">
        <span className="text-[10px] font-black text-[#94a3b8] tracking-[0.1em] uppercase mb-1">
          POWERED BY
        </span>
        <div className="flex items-center">
          <span className="text-[#0066b2] text-[28px] font-black tracking-tighter">network</span>
          <span className="text-[#ef4444] text-[28px] font-black mx-1 tracking-tighter">&gt;</span>
        </div>
        <span className="text-[#0066b2] text-[16px] font-bold -mt-1">dine</span>
      </div>
    </div>
  );
}
