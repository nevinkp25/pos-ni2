'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  Plus, 
  Minus, 
  Check, 
  User, 
  ChevronDown, 
  ChevronUp,
  CreditCard,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface SplitEquallyScreenProps {
  onBack: () => void;
  onPay: () => void;
}

const CurrencySymbol = ({ className }: { className?: string }) => (
  <span className={cn("font-bold text-inherit leading-none tracking-normal", className)}>⃃</span>
);

export function SplitEquallyScreen({ onBack, onPay }: SplitEquallyScreenProps) {
  const [guestCount, setGuestCount] = useState(3);
  const [paidGuests, setPaidGuests] = useState<number[]>([]);
  const [expandedGuest, setExpandedGuest] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isPartialSuccessOpen, setIsPartialSuccessOpen] = useState(false);
  const [activePayingGuest, setActivePayingGuest] = useState<number | null>(null);

  const totalBill = 112.62; // 37.54 * 3 approx
  const shareAmount = totalBill / guestCount;
  
  const paidCount = paidGuests.length;
  const progressPercent = (paidCount / guestCount) * 100;

  const handlePayClick = (guestId: number) => {
    setActivePayingGuest(guestId);
    setIsSettlementOpen(true);
  };

  const handleFinalPayment = () => {
    setIsSettlementOpen(false);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (activePayingGuest !== null) {
        const newPaid = [...paidGuests, activePayingGuest];
        setPaidGuests(newPaid);
        setActivePayingGuest(null);

        if (newPaid.length === guestCount) {
          onPay();
        } else {
          setIsPartialSuccessOpen(true);
        }
      }
    }, 3000);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-[#f1f5f9] rounded-full" />
          <Loader2 className="w-24 h-24 text-[#0066b2] animate-spin absolute" />
        </div>
        <h2 className="mt-8 text-[22px] font-black text-[#1a1c2e] tracking-tight uppercase">Processing Payment...</h2>
        <p className="mt-2 text-[#94a3b8] text-[14px] font-bold">Please tap card on terminal</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative tracking-normal">
      {/* Header */}
      <div className="bg-white px-5 h-16 flex items-center shrink-0 z-20 shadow-sm border-b border-gray-50 rounded-b-[24px]">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-gray-100 active:scale-95 transition-all mr-4"
        >
          <ChevronLeft className="w-6 h-6 text-[#1a1c2e] stroke-[3px]" />
        </button>
        <h1 className="text-[17px] font-black leading-none text-[#1a1c2e] uppercase">Split Equally</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-6 overflow-y-auto pb-10 space-y-6">
        
        <div className="text-center">
          <span className="text-[11px] font-black text-[#1a1c2e] uppercase tracking-[0.2em]">Order: NDAGPTW57XWM</span>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-br from-white to-[#f0f7ff] rounded-[32px] p-6 shadow-[0_15px_40px_rgba(0,102,178,0.06)] border border-[#f0f4f8] relative overflow-hidden">
          <div className="flex justify-between items-end mb-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-1">Total Amount</span>
              <h2 className="text-[24px] font-black text-[#1a1c2e]">AED {totalBill.toFixed(2)}</h2>
            </div>
            <span className="text-[13px] font-black text-[#94a3b8]">{Math.round(progressPercent)}%</span>
          </div>
          
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-[#f59e0b] via-[#0066b2] to-[#0066b2] transition-all duration-1000 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <p className="text-[12px] font-bold text-[#94a3b8] text-center">
            {paidCount} of {guestCount} guest paid
          </p>
        </div>

        {/* Guest Counter */}
        <div className="flex items-center justify-between bg-white rounded-[32px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50">
          <button 
            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            className="w-16 h-16 rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center justify-center active:scale-90 transition-all"
          >
            <Minus className="w-6 h-6 text-[#1a1c2e] stroke-[3px]" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[32px] font-black text-[#1a1c2e] leading-none">{guestCount}</span>
            <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest mt-1">Guests</span>
          </div>

          <button 
            onClick={() => setGuestCount(guestCount + 1)}
            className="w-16 h-16 rounded-full bg-[#0066b2] shadow-[0_8px_25px_rgba(0,102,178,0.3)] flex items-center justify-center active:scale-90 transition-all"
          >
            <Plus className="w-6 h-6 text-white stroke-[3px]" />
          </button>
        </div>

        {/* Amount Per Person Card */}
        <div className="bg-white rounded-[32px] py-10 px-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-black text-[#1a1c2e] uppercase tracking-[0.2em] mb-4">Each Person Pays</span>
          <div className="flex items-center gap-2 text-[#0066b2] font-black text-[42px] leading-none">
            <CurrencySymbol className="text-[38px]" />
            <span>{shareAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest mb-4 block">Select who is paying</span>
          
          <div className="space-y-3">
            {Array.from({ length: guestCount }).map((_, i) => {
              const guestId = i + 1;
              const isPaid = paidGuests.includes(guestId);
              const isOpen = expandedGuest === guestId;

              return (
                <Collapsible 
                  key={guestId} 
                  open={isOpen} 
                  onOpenChange={() => setExpandedGuest(isOpen ? null : guestId)}
                  className={cn(
                    "bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden transition-all",
                    isPaid && "opacity-80"
                  )}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#f8fbfe] flex items-center justify-center border border-gray-50">
                        <User className="w-6 h-6 text-[#0066b2]" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-black text-[#1a1c2e]">Guest {guestId}</span>
                          <CollapsibleTrigger asChild>
                            <button className="text-gray-400">
                              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </CollapsibleTrigger>
                        </div>
                        <span className="text-[11px] font-bold text-[#94a3b8]">AED {shareAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {isPaid ? (
                      <div className="h-10 px-4 rounded-full bg-[#ecf7ef] text-[#26ab5f] flex items-center gap-2 text-[12px] font-black uppercase">
                        <Check className="w-3.5 h-3.5 stroke-[4px]" />
                        Paid
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handlePayClick(guestId)}
                        className="h-10 px-6 rounded-full bg-[#0066b2] text-white text-[12px] font-black uppercase shadow-md active:scale-95"
                      >
                        Pay
                      </Button>
                    )}
                  </div>

                  <CollapsibleContent className="px-5 pb-5">
                    <div className="bg-[#f8fbfe] rounded-[18px] p-4 space-y-3 border border-gray-50/50">
                      <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                        <span className="uppercase">Service Fee</span>
                        <div className="flex items-center gap-1">
                          <CurrencySymbol className="text-[10px]" />
                          <span>3.58</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                        <span className="uppercase">VAT (5%)</span>
                        <div className="flex items-center gap-1">
                          <CurrencySymbol className="text-[10px]" />
                          <span>3.58</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
                        <span className="text-[11px] font-black text-[#1a1c2e] uppercase">Total</span>
                        <div className="flex items-center gap-1.5 text-[#0066b2] font-black text-[16px]">
                          <CurrencySymbol className="text-[14px]" />
                          <span>{shareAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </div>

      {/* Check Settlement Sheet - Reused for consistency */}
      <Sheet open={isSettlementOpen} onOpenChange={setIsSettlementOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-hidden max-h-[92vh] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Check Settlement</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pb-10">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="px-6 flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#0066b2]" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[17px] font-black text-[#1a1c2e] leading-none uppercase">CHECK SETTLEMENT</h2>
                  <span className="text-[11px] font-bold text-[#94a3b8] uppercase mt-1.5">Guest {activePayingGuest} Review</span>
                </div>
              </div>
              <button onClick={() => setIsSettlementOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full border-t border-gray-50 mb-8" />
            <div className="px-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="w-10 h-10 bg-[#f8fafc] rounded-full flex items-center justify-center mb-2 border border-gray-50">
                    <User className="w-5 h-5 text-[#94a3b8]" />
                  </div>
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-1">Waiter ID:</span>
                  <span className="text-[15px] font-black text-[#1a1c2e]">#123456</span>
                </div>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-2">Share Amount</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[24px] font-black text-[#0066b2]">AED</span>
                    <span className="text-[24px] font-black text-[#0066b2]">{shareAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-50 space-y-4">
                <div className="flex justify-between items-center text-[15px] font-black">
                  <span className="text-[#94a3b8] uppercase">Bill Amount</span>
                  <div className="flex items-center gap-1.5 text-[#1a1c2e]">
                    <span className="text-[15px] font-black">AED</span>
                    <span>{shareAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-full border-t border-dashed border-gray-100 py-1" />
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-black text-[#94a3b8] uppercase">Grand Total</span>
                  <div className="flex items-center gap-2 text-[#0066b2] font-black">
                    <CurrencySymbol className="text-[28px]" />
                    <span className="text-[34px]">{shareAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 mt-10 space-y-4">
              <Button onClick={handleFinalPayment} className="w-full h-[64px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,102,178,0.25)]">
                <CreditCard className="w-5 h-5" />
                PAY BY CARD
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Partial Payment Success Sheet */}
      <Sheet open={isPartialSuccessOpen} onOpenChange={setIsPartialSuccessOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-hidden h-[400px] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Payment In Progress</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-8">
            <div className="w-24 h-24 bg-[#00d084] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,208,132,0.3)] mb-8">
              <Check className="w-12 h-12 text-white stroke-[5px]" />
            </div>
            <h2 className="text-[24px] font-black text-[#1a1c2e] uppercase mb-4 leading-tight">PAYMENT IN PROGRESS</h2>
            <p className="text-[#94a3b8] text-[16px] font-bold leading-tight mb-8">
              Some guests have paid. Please settle remaining shares.
            </p>
            <Button onClick={() => setIsPartialSuccessOpen(false)} className="w-full h-16 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[16px] font-black uppercase shadow-lg active:scale-95 transition-all">
              Continue
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
