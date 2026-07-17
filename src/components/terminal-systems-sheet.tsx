'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  RefreshCcw, 
  History, 
  Settings, 
  CircleDollarSign, 
  LogOut, 
  ChevronRight, 
  X,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TerminalSystemsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAdminLogout?: () => void;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  isDestructive?: boolean;
  onClick?: () => void;
}

export function TerminalSystemsSheet({ isOpen, onOpenChange, onAdminLogout }: TerminalSystemsSheetProps) {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const menuItems: MenuItem[] = [
    {
      title: 'Supervisor Menu',
      icon: <ShieldCheck className="w-6 h-6" />,
      iconBg: 'bg-[#FFF4E5]',
      iconColor: 'text-[#FF8A00]',
    },
    {
      title: 'Z-Report',
      icon: <FileText className="w-6 h-6" />,
      iconBg: 'bg-[#E6F9F0]',
      iconColor: 'text-[#00BA88]',
    },
    {
      title: 'Re-sync Restaurant Data',
      icon: <RefreshCcw className="w-6 h-6" />,
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#0066FF]',
    },
    {
      title: 'History',
      icon: <History className="w-6 h-6" />,
      iconBg: 'bg-[#F5EFFF]',
      iconColor: 'text-[#9E57FF]',
    },
    {
      title: 'Settings',
      icon: <Settings className="w-6 h-6" />,
      iconBg: 'bg-[#F1F5F9]',
      iconColor: 'text-[#475569]',
    },
    {
      title: 'Manual Sale',
      icon: <CircleDollarSign className="w-6 h-6" />,
      iconBg: 'bg-[#EEF2FF]',
      iconColor: 'text-[#6366F1]',
    },
    {
      title: 'Admin Logout',
      icon: <LogOut className="w-6 h-6" />,
      iconBg: 'bg-[#FEF2F2]',
      iconColor: 'text-[#EF4444]',
      isDestructive: true,
      onClick: () => setIsPasswordDialogOpen(true),
    },
  ];

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1234') {
      setIsPasswordDialogOpen(false);
      onOpenChange(false);
      onAdminLogout?.();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-[40px] border-none p-0 outline-none overflow-visible h-auto max-h-[85vh] flex flex-col pb-10">
          <div className="flex flex-col w-full h-full overflow-hidden rounded-t-[40px]">
            <SheetHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between shrink-0">
              <SheetTitle className="text-[#94a3b8] text-[13px] font-black uppercase tracking-[0.15em]">
                Terminal Systems
              </SheetTitle>
              {/* External Close Button is handled by SheetContent for side="bottom" */}
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 pt-2">
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <button 
                      onClick={item.onClick}
                      className="w-full h-16 flex items-center justify-between px-3 rounded-2xl active:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-active:scale-95",
                          item.iconBg,
                          item.iconColor
                        )}>
                          {item.icon}
                        </div>
                        <span className={cn(
                          "text-[17px] font-bold tracking-tight",
                          item.isDestructive ? "text-[#EF4444]" : "text-[#1a1c2e]"
                        )}>
                          {item.title}
                        </span>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 stroke-[3px]",
                        item.isDestructive ? "text-[#EF4444]/30" : "text-[#e2e8f0]"
                      )} />
                    </button>
                    {index !== menuItems.length - 1 && index === menuItems.length - 2 && (
                      <div className="mx-3 my-4 border-t border-dashed border-gray-100" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="rounded-[32px] sm:max-w-[360px] p-8 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="mb-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-[#f0f7ff] rounded-2xl flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-[#0066b2]" />
            </div>
            <DialogTitle className="text-[22px] font-black text-[#1a1c2e] leading-tight">Admin Access</DialogTitle>
            <p className="text-[#94a3b8] text-sm font-medium mt-2">Enter admin password to proceed</p>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="relative">
              <Input
                autoFocus
                type="password"
                placeholder="••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "h-16 rounded-2xl border-2 text-center text-2xl tracking-[0.5em] font-black focus-visible:ring-0 transition-all",
                  error ? "border-red-500 bg-red-50" : "border-[#d1e9ff] focus-visible:border-[#0066b2]"
                )}
              />
              {error && (
                <p className="text-red-500 text-[11px] font-bold uppercase text-center mt-2 animate-in fade-in zoom-in-95">
                  Incorrect Password
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button 
                type="submit"
                className="w-full h-14 bg-[#0066b2] hover:bg-[#005596] text-white rounded-2xl text-[16px] font-bold shadow-lg"
              >
                Authenticate
              </Button>
              <Button 
                type="button"
                variant="ghost"
                onClick={() => setIsPasswordDialogOpen(false)}
                className="w-full h-12 text-[#94a3b8] font-bold hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
