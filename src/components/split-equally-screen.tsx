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
  Loader2,
  ArrowRight,
  Pencil,
  Landmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { CurrencySymbol } from './pay-order-detail-screen';

interface SplitEquallyScreenProps {
  onBack: () => void;
  onPay: (guestCount: number) => void;
}

export function SplitEquallyScreen({ onBack, onPay }: SplitEquallyScreenProps) {
  const [guestCount, setGuestCount] = useState(3);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paidGuests, setPaidGuests] = useState<number[]>([]);
  const [expandedGuest, setExpandedGuest] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isPartialSuccessOpen, setIsPartialSuccessOpen] = useState(false);
  const [activePayingGuest, setActivePayingGuest] = useState<number | null>(null);

  const [selectedTip, setSelectedTip] = useState<number | null>(10);
  const [isCustomTipMode, setIsCustomTipMode] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');

  const totalBill = 112.62;
  const shareAmount = totalBill / guestCount;
  
  const currentTipAmount = isCustomTipMode 
    ? (parseFloat(customTipValue) || 0)
    : (selectedTip || 0);

  const grandTotal = shareAmount + currentTipAmount;

  const paidCount = paidGuests.length;
  const progressPercent = (paidCount / guestCount) * 100;

  const handleConfirmSplit = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setIsConfirmed(true);
    }, 1200);
  };

  const handleGuestCountChange = (newCount: number) => {
    setGuestCount(newCount);
    if (isConfirmed) {
      setIsConfirmed(false);
      setPaidGuests([]);
    }
  };

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
          onPay(guestCount);
        } else {
          setIsPartialSuccessOpen(true);
        }
      }
    }, 3000);
  };

  const handleTipClick = (amount: number) => {
    if (selectedTip === amount) {
      setSelectedTip(null);
    } else {
      setIsCustomTipMode(false);
      setSelectedTip(amount);
    }
  };

  const handleCustomTipToggle = () => {
    setIsCustomTipMode(!isCustomTipMode);
    if (!isCustomTipMode) {
      setSelectedTip(null);
    }
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

        {/* PIXEL PERFECT Progress Card */}
        <div className="relative p-[1.5px] rounded-[32px] bg-gradient-to-tr from-[#6366f1]/25 via-[#3b82f6]/25 to-[#a855f7]/25 shadow-[0_12px_40px_rgba(0,102,178,0.04)]">
          <div className="bg-gradient-to-br from-white to-[#fcfdff] rounded-[31px] p-6 flex flex-col gap-5">
            <div className="flex items-center">
              <span className="text-[9px] font-black text-[#475569] w-[100px] shrink-0 uppercase tracking-tight">Total Amount</span>
              <div className="flex-1 flex justify-center min-w-0">
                <div className="flex items-center gap-1 min-[375px]:gap-2">
                  <CurrencySymbol className="text-[20px] min-[414px]:text-[28px] text-[#1a1c2e]" />
                  <span className="text-[24px] min-[375px]:text-[28px] min-[414px]:text-[34px] font-black text-[#1a1c2e] tracking-tight leading-none whitespace-nowrap">
                    {totalBill.toFixed(2)}
                  </span>
                </div>
              </div>
              <span className="text-[18px] font-black text-[#94a3b8] w-[100px] shrink-0 text-right">
                {Math.round(progressPercent)}%
              </span>
            </div>
            
            <div className="w-full h-[14px] bg-[#f1f5f9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#0066b2] transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <p className="text-[15px] font-bold text-[#94a3b8] text-center leading-none">
              {paidCount} of {guestCount} guest paid
            </p>
          </div>
        </div>

        {/* Guest Counter */}
        <div className="flex items-center justify-between bg-white rounded-[32px] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-50 transition-all">
          <button 
            onClick={() => handleGuestCountChange(Math.max(1, guestCount - 1))}
            className="w-16 h-16 rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.05)] border border-gray-50 flex items-center justify-center active:scale-90 transition-all"
          >
            <Minus className="w-6 h-6 text-[#1a1c2e] stroke-[3px]" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[32px] font-black text-[#1a1c2e] leading-none">{guestCount}</span>
            <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest mt-1">Guests</span>
          </div>

          <button 
            onClick={() => handleGuestCountChange(guestCount + 1)}
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

        {!isConfirmed && (
          <div className="pt-2">
            <Button 
              onClick={handleConfirmSplit}
              disabled={isConfirming}
              className="w-full h-16 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[16px] font-black uppercase shadow-[0_10px_30px_rgba(0,102,178,0.25)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              {isConfirming ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  Confirm Split
                  <ArrowRight className="w-5 h-5 stroke-[3px]" />
                </>
              )}
            </Button>
          </div>
        )}

        {isConfirmed && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
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
                          <div className="flex items-center gap-1">
                            <CurrencySymbol className="text-[#94a3b8] text-[10px]" />
                            <span className="text-[11px] font-bold text-[#94a3b8]">{shareAmount.toFixed(2)}</span>
                          </div>
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
        )}
      </div>

      <Sheet open={isSettlementOpen} onOpenChange={setIsSettlementOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-hidden max-h-[92vh] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Final Review</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pb-10">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="px-6 flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center shadow-sm">
                  <CreditCard className="w-6 h-6 text-[#0066b2]" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[17px] font-black text-[#1a1c2e] leading-none uppercase">Guest {activePayingGuest} Payment</h2>
                  <span className="text-[11px] font-bold text-[#94a3b8] uppercase mt-1.5 tracking-wider">Final Review</span>
                </div>
              </div>
              <button 
                onClick={() => setIsSettlementOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 active:scale-90 transition-all"
              >
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
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-1 tracking-tight">Waiter ID:</span>
                  <span className="text-[15px] font-black text-[#1a1c2e]">#123456</span>
                </div>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-2 tracking-tight">Bill Amount</span>
                  <div className="flex items-center gap-2">
                    <CurrencySymbol className="text-[20px] text-[#0066b2]" />
                    <span className="text-[24px] font-black text-[#0066b2] tabular-nums">{shareAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-normal">Add tips for your waiter</span>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 20].map((amount) => (
                    <button 
                      key={amount}
                      onClick={() => handleTipClick(amount)}
                      className={cn(
                        "relative h-[90px] rounded-[24px] flex flex-col items-center justify-center transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50",
                        (!isCustomTipMode && selectedTip === amount) ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white"
                      )}
                    >
                      <CurrencySymbol className="text-[10px] text-[#94a3b8] uppercase" />
                      <span className="text-[22px] font-black text-[#1a1c2e] tabular-nums">{amount}</span>
                      {(!isCustomTipMode && selectedTip === amount) && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-white">
                          <X className="w-3 h-3 text-white stroke-[4px]" />
                        </div>
                      )}
                    </button>
                  ))}
                  <button 
                    onClick={handleCustomTipToggle}
                    className={cn(
                      "h-[90px] rounded-[24px] flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,102,178,0.03)] border border-gray-50 transition-all",
                      isCustomTipMode ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white"
                    )}
                  >
                    <Pencil className={cn("w-5 h-5 mb-1", isCustomTipMode ? "text-[#0066b2]" : "text-[#94a3b8]")} />
                    <span className={cn("text-[10px] font-black uppercase", isCustomTipMode ? "text-[#0066b2]" : "text-[#94a3b8]")}>Custom</span>
                  </button>
                </div>
                
                {isCustomTipMode && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <CurrencySymbol className="text-[16px] text-[#0066b2]" />
                      </div>
                      <Input
                        type="number"
                        placeholder="Enter tip amount"
                        value={customTipValue}
                        onChange={(e) => setCustomTipValue(e.target.value)}
                        className="h-14 rounded-[18px] border-[#0066b2]/20 border-2 pl-16 text-lg font-black focus-visible:ring-0 focus-visible:border-[#0066b2]"
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-50 space-y-4">
                <div className="flex justify-between items-center text-[15px] font-black">
                  <span className="text-[#94a3b8] uppercase">Bill Amount</span>
                  <div className="flex items-center gap-1.5 text-[#1a1c2e]">
                    <CurrencySymbol className="text-[15px]" />
                    <span className="tabular-nums">{shareAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[15px] font-black">
                  <span className="text-[#94a3b8] uppercase">Tips</span>
                  <div className="flex items-center gap-1.5 text-[#26ab5f]">
                    <span>+</span>
                    <CurrencySymbol className="text-[15px]" />
                    <span className="tabular-nums">{currentTipAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-full border-t border-dashed border-gray-100 py-1" />
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-black text-[#94a3b8] uppercase">Grand Total</span>
                  <div className="flex items-center gap-2 text-[#0066b2] font-black">
                    <CurrencySymbol className="text-[28px]" />
                    <span className="text-[34px] tabular-nums">{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 mt-10 space-y-4">
              <Button 
                onClick={handleFinalPayment}
                className="w-full h-[64px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,102,178,0.25)] active:scale-[0.98] transition-all"
              >
                <CreditCard className="w-5 h-5" />
                PAY BY CARD
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black flex items-center justify-center gap-2">
                  <Landmark className="w-4 h-4 text-[#94a3b8]" />
                  PAY BY CASH
                </Button>
                <Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black">
                  OTHER OPTIONS
                </Button>
              </div>
            </div>

            <div className="px-6 mt-8 flex justify-center gap-3">
              {[
                { name: 'JCB', color: 'text-[#004e9c]' },
                { name: 'G Pay', color: 'text-gray-600' },
                { name: 'AMEX', color: 'text-[#006fcf]' },
                { name: ' Pay', color: 'text-black' },
                { name: 'VISA', color: 'text-[#1a1f71]' }
              ].map((logo) => (
                <div key={logo.name} className="px-3 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <span className={cn("text-[10px] font-black uppercase tracking-normal", logo.color)}>{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isPartialSuccessOpen} onOpenChange={setIsPartialSuccessOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-hidden h-[400px] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Payment In Progress</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-8">
            <div className="w-24 h-24 bg-[#00d084] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,208,132,0.3)] mb-8">
              <Check className="w-12 h-12 text-white stroke-[5px]" />
            </div>
            <h2 className="text-[24px] font-black text-[#1a1c2e] uppercase mb-4 leading-tight tracking-tight">PAYMENT IN PROGRESS</h2>
            <p className="text-[#94a3b8] text-[16px] font-bold leading-tight mb-8">
              Some guests have paid. Please settle remaining shares.
            </p>
            <Button 
              onClick={() => setIsPartialSuccessOpen(false)} 
              className="w-full h-16 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[16px] font-black uppercase shadow-lg active:scale-95 transition-all"
            >
              Continue
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
