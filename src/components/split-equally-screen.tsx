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
  ArrowRight,
  Pencil,
  Landmark,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
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
import { CurrencyAmount } from './CurrencyAmount';
import { getOrderForTable, TableOrder } from '@/lib/storage';
import placeholderData from '@/app/lib/placeholder-images.json';
import { useToast } from '@/hooks/use-toast';

interface SplitEquallyScreenProps {
  tableNumber: string;
  onBack: () => void;
  onPay: (guestCount: number) => void;
}

export function SplitEquallyScreen({ tableNumber, onBack, onPay }: SplitEquallyScreenProps) {
  const [guestCount, setGuestCount] = useState(3);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paidGuests, setPaidGuests] = useState<number[]>([]);
  const [expandedGuest, setExpandedGuest] = useState<number | null>(null);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [activePayingGuest, setActivePayingGuest] = useState<number | null>(null);

  const [selectedTip, setSelectedTip] = useState<number | null>(10);
  const [isCustomTipMode, setIsCustomTipMode] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');
  const [order, setOrder] = useState<TableOrder | null>(null);
  const { toast } = useToast();

  const paymentBanner = placeholderData.placeholderImages.find(img => img.id === 'payment-banner');

  useEffect(() => {
    const tableOrder = getOrderForTable(tableNumber);
    if (tableOrder) {
      setOrder(tableOrder);
    }
  }, [tableNumber]);

  const items = useMemo(() => order?.items || [], [order]);
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      let itemTotal = item.basePrice;
      item.addons.forEach(a => {
        itemTotal += a.price * a.quantity;
      });
      return sum + (itemTotal * item.quantity);
    }, 0);
  }, [items]);

  const serviceChargeTotal = subtotal * 0.10;
  const vatTotal = subtotal * 0.05;
  const additionalChargesTotal = subtotal * 0.02;
  const totalBill = subtotal + serviceChargeTotal + vatTotal + additionalChargesTotal;
  
  const shareSubtotal = subtotal / guestCount;
  const shareServiceCharge = serviceChargeTotal / guestCount;
  const shareVat = vatTotal / guestCount;
  const shareAdditionalCharges = additionalChargesTotal / guestCount;
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
    toast({
      title: "Payment Success",
      description: "Guest payment confirmed. Please settle remaining shares.",
    });
    
    if (activePayingGuest !== null) {
      const newPaid = [...paidGuests, activePayingGuest];
      setPaidGuests(newPaid);
      setActivePayingGuest(null);

      if (newPaid.length === guestCount) {
        onPay(guestCount);
      }
    }
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

  const handleClearSplits = () => {
    setIsConfirmed(false);
    setPaidGuests([]);
    setExpandedGuest(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative tracking-normal">
      <div className="bg-white px-5 h-16 flex items-center shrink-0 z-20 shadow-sm border-b border-gray-50 rounded-b-[24px]">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-gray-100 active:scale-95 transition-all mr-4"><ChevronLeft className="w-6 h-6 text-[#1a1c2e] stroke-[3px]" /></button>
        <h1 className="text-[17px] font-black leading-none text-[#1a1c2e] uppercase">Split Equally</h1>
      </div>

      <div className="flex-1 px-4 pt-4 overflow-y-auto pb-10 space-y-4">
        <div className="text-center">
          <span className="text-[10px] font-black text-[#1a1c2e] uppercase tracking-[0.1em]">Order: {order?.timestamp.toString().slice(-6) || '---'}</span>
        </div>

        <div className="relative p-[1px] rounded-[24px] bg-gradient-to-tr from-[#6366f1]/20 via-[#3b82f6]/20 to-[#a855f7]/20 shadow-sm">
          <div className="bg-gradient-to-br from-white to-[#fcfdff] rounded-[23px] p-4 flex flex-col gap-2">
            <div className="flex items-center">
              <span className="text-[9px] font-black text-[#475569] w-[80px] shrink-0 uppercase tracking-tight">Total Bill</span>
              <div className="flex-1 flex justify-center min-w-0">
                <CurrencyAmount amount={totalBill} weight="bold" className="text-[20px] text-[#1a1c2e]" />
              </div>
              <span className="text-[14px] font-black text-[#94a3b8] w-[80px] shrink-0 text-right">
                {Math.round(progressPercent)}%
              </span>
            </div>
            
            <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#0066b2] transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <p className="text-[12px] font-bold text-[#94a3b8] text-center leading-none">
              {paidCount} of {guestCount} guest paid
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-[24px] p-3 shadow-sm border border-gray-50 transition-all">
          <button onClick={() => handleGuestCountChange(Math.max(1, guestCount - 1))} className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center active:scale-90 transition-all"><Minus className="w-5 h-5 text-[#1a1c2e] stroke-[3px]" /></button>
          <div className="flex flex-col items-center"><span className="text-[24px] font-black text-[#1a1c2e] leading-none">{guestCount}</span><span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest mt-1">Guests</span></div>
          <button onClick={() => handleGuestCountChange(guestCount + 1)} className="w-12 h-12 rounded-full bg-[#0066b2] shadow-sm flex items-center justify-center active:scale-90 transition-all"><Plus className="w-5 h-5 text-white stroke-[3px]" /></button>
        </div>

        <div className="bg-white rounded-[24px] py-6 px-4 shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black text-[#1a1c2e] uppercase tracking-[0.1em] mb-2">Each Person Pays</span>
          <CurrencyAmount amount={shareAmount} weight="bold" className="text-[32px] text-[#0066b2]" />
        </div>

        {!isConfirmed && (<div className="pt-1"><Button onClick={handleConfirmSplit} disabled={isConfirming} className="w-full h-14 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[18px] text-[16px] font-black uppercase shadow-md flex items-center justify-center gap-3 active:scale-[0.98] transition-all">{isConfirming ? (<><Loader2 className="w-5 h-5 animate-spin" />Calculating...</>) : (<>Confirm Split<ArrowRight className="w-5 h-5 stroke-[3px]" /></>)}</Button></div>)}

        {isConfirmed && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest">Select who is paying</span>
              {paidGuests.length === 0 && (
                <button 
                  onClick={handleClearSplits}
                  className="flex items-center gap-1 text-[#ef4444] active:scale-95 transition-all group"
                >
                  <X className="w-4 h-4 stroke-[3px]" />
                  <span className="text-[12px] font-black uppercase tracking-tight border-b border-dotted border-[#ef4444]/60 group-hover:border-[#ef4444]">
                    Clear Splits
                  </span>
                </button>
              )}
            </div>
            <div className="space-y-3">
              {Array.from({ length: guestCount }).map((_, i) => { 
                const guestId = i + 1; 
                const isPaid = paidGuests.includes(guestId); 
                const isOpen = expandedGuest === guestId; 
                return (
                  <Collapsible key={guestId} open={isOpen} onOpenChange={() => setExpandedGuest(isOpen ? null : guestId)} className={cn("bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden transition-all", isPaid && "opacity-80")}>
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
                          <CurrencyAmount amount={shareAmount} weight="bold" className="text-[11px] text-[#94a3b8]" />
                        </div>
                      </div>
                      {isPaid ? (
                        <div className="h-10 px-4 rounded-full bg-[#ecf7ef] text-[#26ab5f] flex items-center gap-2 text-[12px] font-black uppercase">
                          <Check className="w-3.5 h-3.5 stroke-[4px]" />Paid
                        </div>
                      ) : (
                        <Button onClick={() => handlePayClick(guestId)} className="h-10 px-6 rounded-full bg-[#0066b2] text-white text-[12px] font-black uppercase shadow-md active:scale-95">Pay</Button>
                      )}
                    </div>
                    <CollapsibleContent className="px-5 pb-5">
                      <div className="bg-[#f0f7ff]/40 rounded-[24px] p-5 border border-[#0066b2]/10 space-y-3">
                        <div className="flex justify-between items-center text-[13px] font-black text-[#94a3b8]">
                          <span className="uppercase tracking-tight">BASE PRICE</span>
                          <CurrencyAmount amount={shareSubtotal} weight="bold" className="text-inherit" />
                        </div>
                        <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                          <span className="uppercase tracking-tight">SERVICE CHARGE (10%)</span>
                          <CurrencyAmount amount={shareServiceCharge} weight="bold" className="text-inherit" />
                        </div>
                        <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                          <span className="uppercase tracking-tight">TAX (5%)</span>
                          <CurrencyAmount amount={shareVat} weight="bold" className="text-inherit" />
                        </div>
                        <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                          <span className="uppercase tracking-tight">ADDITIONAL CHARGES</span>
                          <CurrencyAmount amount={shareAdditionalCharges} weight="bold" className="text-inherit" />
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
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-visible max-h-[92vh] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Guest Payment Settlement</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col w-full h-full overflow-hidden rounded-t-[32px] bg-white">
            <div className="flex-1 overflow-y-auto pb-0">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
              <div className="px-6 flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center shadow-sm"><CreditCard className="w-6 h-6 text-[#0066b2]" /></div>
                  <div className="flex flex-col"><h2 className="text-[17px] font-black text-[#1a1c2e] leading-none uppercase">Guest {activePayingGuest} Payment</h2><span className="text-[11px] font-bold text-[#94a3b8] uppercase mt-1.5 tracking-wider">Final Review</span></div>
                </div>
              </div>

              <div className="w-full border-t border-gray-50 mb-6" />
              <div className="px-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                    <div className="w-10 h-10 bg-[#f8fbfe] rounded-full flex items-center justify-center mb-2 border border-gray-50"><User className="w-5 h-5 text-[#94a3b8]" /></div>
                    <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-1 tracking-tight">Waiter ID:</span><span className="text-[15px] font-black text-[#1a1c2e]">#123456</span>
                  </div>
                  <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                    <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-2 tracking-tight">Bill Amount</span><CurrencyAmount amount={shareAmount} weight="bold" className="text-[22px] text-[#0066b2] tabular-nums" />
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-normal">Add tips for your waiter</span>
                  <div className="grid grid-cols-4 gap-3">
                    {[5, 10, 20].map((amount) => (
                      <button key={amount} onClick={() => handleTipClick(amount)} className={cn("relative h-[90px] rounded-[24px] flex flex-col items-center justify-center transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50", (!isCustomTipMode && selectedTip === amount) ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white")}>
                        <span className="text-[22px] font-black text-[#1a1c2e] tabular-nums">{amount}</span>{(!isCustomTipMode && selectedTip === amount) && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-white"><X className="w-3 h-3 text-white stroke-[4px]" /></div>}
                      </button>
                    ))}
                    <button onClick={handleCustomTipToggle} className={cn("h-[90px] rounded-[24px] flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(102,178,0,0.03)] border border-gray-50 transition-all", isCustomTipMode ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white")}>
                      <Pencil className={cn("w-5 h-5 mb-1", isCustomTipMode ? "text-[#0066b2]" : "text-[#94a3b8]")} /><span className={cn("text-[10px] font-black uppercase", isCustomTipMode ? "text-[#0066b2]" : "text-[#94a3b8]")}>Custom</span>
                    </button>
                  </div>
                  {isCustomTipMode && (<div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200"><div className="relative"><Input type="number" placeholder="Enter tip amount" value={customTipValue} onChange={(e) => setCustomTipValue(e.target.value)} className="h-14 rounded-[18px] border-[#0066b2]/20 border-2 px-6 text-lg font-black focus-visible:ring-0 focus-visible:border-[#0066b2]" autoFocus /></div></div>)}
                </div>
                <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-50 space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Item Price (Base)</span>
                      <CurrencyAmount amount={shareSubtotal} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">TAX (5%)</span>
                      <CurrencyAmount amount={shareVat} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Service Charge (10%)</span>
                      <CurrencyAmount amount={shareServiceCharge} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Additional Charges</span>
                      <CurrencyAmount amount={shareAdditionalCharges} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                  </div>
                  <div className="w-full border-t border-dashed border-gray-100 py-1" />
                  <div className="flex justify-between items-center text-[15px] font-black"><span className="text-[#1a1c2e] uppercase">Bill Amount</span><CurrencyAmount amount={shareAmount} weight="bold" className="text-[14px] text-[#1a1c2e] tabular-nums" /></div>
                  <div className="flex justify-between items-center text-[15px] font-black"><span className="text-[#94a3b8] uppercase">Tips</span><div className="flex items-center gap-1.5 text-[#26ab5f]"><span>+</span><CurrencyAmount amount={currentTipAmount} weight="bold" className="text-[14px] text-inherit tabular-nums" /></div></div>
                  <div className="w-full border-t border-dashed border-gray-100 py-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-black text-[#94a3b8] uppercase">Grand Total</span>
                    <CurrencyAmount amount={grandTotal} weight="bold" className="text-[32px] text-[#0066b2] tabular-nums" />
                  </div>
                </div>
              </div>
              <div className="px-6 mt-10 space-y-4 pb-0">
                <Button onClick={handleFinalPayment} className="w-full h-[64px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,102,178,0.25)] active:scale-[0.98] transition-all"><CreditCard className="w-5 h-5" />PAY BY CARD</Button>
                <div className="grid grid-cols-2 gap-4"><Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black flex items-center justify-center gap-2"><Landmark className="w-4 h-4 text-[#94a3b8]" />PAY BY CASH</Button><Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black">OTHER OPTIONS</Button></div>
              </div>

              {paymentBanner && (
                <div className="w-full mt-8 flex justify-center mb-[7px]">
                  <Image 
                    src={paymentBanner.imageUrl} 
                    alt="Supported Payment Methods" 
                    width={327} 
                    height={41}
                    data-ai-hint={paymentBanner.imageHint}
                    className="w-full h-auto px-0"
                  />
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
