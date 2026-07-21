'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  Check, 
  Box, 
  X, 
  CreditCard, 
  Pencil, 
  Landmark, 
  Loader2,
  User,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface SplitByItemScreenProps {
  tableNumber: string;
  onBack: () => void;
  onPay: (guestCount: number) => void;
}

export function SplitByItemScreen({ tableNumber, onBack, onPay }: SplitByItemScreenProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [paidItemIds, setPaidItemIds] = useState<string[]>([]);
  const [completedPayments, setCompletedPayments] = useState(0);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBreakdownExpanded, setIsBreakdownExpanded] = useState(false);
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

  const items = useMemo(() => {
    return (order?.items || []).filter(item => !paidItemIds.includes(item.id));
  }, [order, paidItemIds]);

  const overallTotalSubtotal = useMemo(() => {
    return (order?.items || []).reduce((sum, item) => {
      const itemBasePlusAddons = item.basePrice + item.addons.reduce((a, b) => a + (b.price * b.quantity), 0);
      return sum + (itemBasePlusAddons * item.quantity);
    }, 0);
  }, [order]);

  const totalBillSubtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const itemBasePlusAddons = item.basePrice + item.addons.reduce((a, b) => a + (b.price * b.quantity), 0);
      return sum + (itemBasePlusAddons * item.quantity);
    }, 0);
  }, [items]);

  const yourShareSubtotal = useMemo(() => {
    return items
      .filter(item => selectedItemIds.includes(item.id))
      .reduce((sum, item) => {
        const itemBasePlusAddons = item.basePrice + item.addons.reduce((a, b) => a + (b.price * b.quantity), 0);
        return sum + (itemBasePlusAddons * item.quantity);
      }, 0);
  }, [selectedItemIds, items]);

  const shareServiceCharge = yourShareSubtotal * 0.10;
  const shareTax = yourShareSubtotal * 0.05;
  const shareAdditionalCharges = yourShareSubtotal * 0.02;
  const shareConvenienceFee = yourShareSubtotal * 0.01;

  const yourShareTotal = yourShareSubtotal + shareServiceCharge + shareTax + shareAdditionalCharges + shareConvenienceFee;

  const currentTipAmount = isCustomTipMode 
    ? (parseFloat(customTipValue) || 0)
    : (selectedTip || 0);

  const grandTotal = yourShareTotal + currentTipAmount;

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => id !== i) : [...prev, id]
    );
  };

  const handlePayClick = () => {
    setIsSettlementOpen(true);
  };

  const handleFinalPayment = () => {
    setIsSettlementOpen(false);
    
    const newPaidItems = [...paidItemIds, ...selectedItemIds];
    const nextPaymentCount = completedPayments + 1;
    
    setPaidItemIds(newPaidItems);
    setSelectedItemIds([]);
    setCompletedPayments(nextPaymentCount);

    toast({
      title: "Payment Success",
      description: "Guest payment confirmed. Please settle remaining shares.",
    });

    const allPaid = (order?.items || []).every(item => newPaidItems.includes(item.id));
    if (allPaid) {
      onPay(nextPaymentCount);
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

  const progressPercent = totalBillSubtotal > 0 ? (yourShareSubtotal / totalBillSubtotal) * 100 : 0;

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white font-sans">
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-[#f1f5f9] rounded-full" />
          <Loader2 className="w-24 h-24 text-[#0066b2] animate-spin absolute" />
        </div>
        <h2 className="mt-8 text-[22px] font-black text-[#1a1c2e] tracking-tight uppercase">Processing Payment...</h2>
        <p className="mt-2 text-[#94a3b8] text-[14px] font-bold">Please tap your card on the terminal</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative tracking-normal">
      <div className="bg-white px-5 h-16 flex items-center shrink-0 z-20 shadow-sm border-b border-gray-50 rounded-b-[24px]">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-gray-100 active:scale-95 transition-all mr-4"><ChevronLeft className="w-6 h-6 text-[#1a1c2e] stroke-[3px]" /></button>
        <h1 className="text-[17px] font-black leading-none text-[#1a1c2e] uppercase">Split By Item</h1>
      </div>

      <div className="flex-1 px-4 pt-4 overflow-y-auto pb-[420px] space-y-4">
        <div className="text-center">
          <span className="text-[10px] font-black text-[#1a1c2e] uppercase tracking-[0.1em]">Order: #{order?.timestamp.toString().slice(-4) || '----'}</span>
        </div>

        <div className="relative p-[1px] rounded-[24px] bg-gradient-to-tr from-[#6366f1]/20 via-[#3b82f6]/20 to-[#a855f7]/20 shadow-sm shrink-0">
          <div className="bg-gradient-to-br from-white to-[#fcfdff] rounded-[23px] p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#475569] uppercase tracking-[0.1em]">Your Share (Base)</span>
              <span className="text-[14px] font-black text-[#94a3b8]">
                {Math.round(progressPercent)}%
              </span>
            </div>
            
            <div className="flex justify-center">
              <CurrencyAmount 
                amount={yourShareSubtotal} 
                weight="bold" 
                className="text-[26px] text-[#1a1c2e] tracking-tighter leading-none" 
                symbolSize="0.8em"
              />
            </div>
            
            <div className="w-full h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#f59e0b] to-[#0066b2] transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            <p className="text-[12px] font-bold text-[#94a3b8] text-center leading-tight">
               Total amount to be paid: <CurrencyAmount amount={overallTotalSubtotal} weight="bold" className="text-inherit" />
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pb-8">
          <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest px-1">Select items to include</span>
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            const itemBasePlusAddons = item.basePrice + item.addons.reduce((a, b) => a + (b.price * b.quantity), 0);
            const itemPrice = itemBasePlusAddons * item.quantity;

            return (
              <div key={item.id} onClick={() => toggleItem(item.id)} className={cn("bg-white rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border transition-all active:scale-[0.99] cursor-pointer", isSelected ? "border-[#0066b2] shadow-[0_6px_15px_rgba(0,102,178,0.04)]" : "border-gray-50")}>
                <div className="flex items-start gap-4">
                  <div className={cn("w-6 h-6 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-all mt-0.5", isSelected ? "bg-[#0066b2] border-[#0066b2]" : "border-gray-200")}>{isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4.5px]" />}</div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[15px] font-black text-[#1a1c2e] leading-tight pr-2">{item.name}</h3>
                      <CurrencyAmount amount={itemPrice} weight="bold" className="text-[15px] text-[#1a1c2e] shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 text-[#94a3b8] text-[12px] font-bold"><div className="bg-[#f0f7ff] text-[#0066b2] px-2 py-0.5 rounded-md font-black text-[10px]">x{item.quantity}</div></div>
                    {item.addons.length > 0 && <div className="flex flex-wrap gap-1 pt-0.5">{item.addons.map((addon, idx) => (<div key={idx} className="bg-[#f8fafc] border border-gray-100 rounded-lg px-2 py-0.5 flex items-center gap-1.5"><span className="text-[#475569] text-[10px] font-black uppercase tracking-tighter">{addon.name}</span></div>))}</div>}
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <div className="text-center py-10 opacity-40"><Box className="w-12 h-12 mx-auto mb-2 text-gray-300" /><p className="text-sm font-bold">All items have been paid!</p></div>}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-white px-5 pt-3 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] z-30 flex flex-col gap-1 border-t border-gray-50">
        {yourShareSubtotal > 0 && (
          <>
            <button 
              onClick={() => setIsBreakdownExpanded(!isBreakdownExpanded)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 mb-1 active:scale-95 transition-all group"
            >
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest group-hover:text-[#0066b2] transition-colors">
                {isBreakdownExpanded ? 'Hide Breakdown' : 'View Breakdown'}
              </span>
              {isBreakdownExpanded ? (
                <ChevronDown className="w-3 h-3 text-[#94a3b8] group-hover:text-[#0066b2]" />
              ) : (
                <ChevronUp className="w-3 h-3 text-[#94a3b8] group-hover:text-[#0066b2]" />
              )}
            </button>

            {isBreakdownExpanded && (
              <div className="bg-[#f0f7ff]/40 rounded-[24px] p-5 border border-[#0066b2]/10 space-y-3 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center text-[13px] font-black text-[#94a3b8]">
                  <span>Item Price (Base)</span>
                  <CurrencyAmount amount={yourShareSubtotal} weight="bold" className="text-inherit" />
                </div>
                <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                  <span>Service Charge (10%) (Inclusive)</span>
                  <CurrencyAmount amount={shareServiceCharge} weight="bold" className="text-inherit" />
                </div>
                <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                  <span>Tax (5%) (Inclusive)</span>
                  <CurrencyAmount amount={shareTax} weight="bold" className="text-inherit" />
                </div>
                <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                  <span>Additional Charges (Exclusive)</span>
                  <CurrencyAmount amount={shareAdditionalCharges} weight="bold" className="text-inherit" />
                </div>
                <div className="flex justify-between items-center text-[12px] font-black text-[#94a3b8]">
                  <span>Convenience Fee (Exclusive)</span>
                  <CurrencyAmount amount={shareConvenienceFee} weight="bold" className="text-inherit" />
                </div>
              </div>
            )}
          </>
        )}
        <Button onClick={handlePayClick} disabled={yourShareSubtotal === 0} className={cn("w-full h-14 rounded-[18px] text-[16px] font-black shadow-[0_8px_25px_rgba(0,102,178,0.2)] transition-all active:scale-[0.98]", yourShareSubtotal > 0 ? "bg-[#0066b2] hover:bg-[#005596] text-white" : "bg-gray-100 text-gray-400 shadow-none pointer-events-none")}>Pay Your Items (<CurrencyAmount amount={yourShareTotal} weight="bold" className="text-inherit" />)</Button>
      </div>

      <Sheet open={isSettlementOpen} onOpenChange={setIsSettlementOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-visible max-h-[92vh] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Item Share Settlement</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col w-full h-full overflow-hidden rounded-t-[32px] bg-white">
            <div className="flex-1 overflow-y-auto pb-0">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
              <div className="px-6 flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center"><CreditCard className="w-6 h-6 text-[#0066b2]" /></div>
                  <div className="flex flex-col">
                    <h2 className="text-[17px] font-black text-[#1a1c2e] leading-none uppercase">CHECK SETTLEMENT</h2>
                    <span className="text-[11px] font-bold text-[#94a3b8] uppercase mt-1.5 tracking-wider">Final Review</span>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-50 mb-6" />
              <div className="px-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                    <div className="w-10 h-10 bg-[#f8fafc] rounded-full flex items-center justify-center mb-2 border border-gray-50"><User className="w-5 h-5 text-[#94a3b8]" /></div>
                    <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-1 tracking-tight">Waiter ID:</span><span className="text-[15px] font-black text-[#1a1c2e]">#123456</span>
                  </div>
                  <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                    <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-2 tracking-tight">Item Amount</span><CurrencyAmount amount={yourShareTotal} weight="bold" className="text-[20px] text-[#0066b2]" />
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
                      <span className="text-[#94a3b8]">Item Price (Base)</span>
                      <CurrencyAmount amount={yourShareSubtotal} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8]">Service Charge (10%) (Inclusive)</span>
                      <CurrencyAmount amount={shareServiceCharge} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8]">Tax (5%) (Inclusive)</span>
                      <CurrencyAmount amount={shareTax} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8]">Additional Charges (Exclusive)</span>
                      <CurrencyAmount amount={shareAdditionalCharges} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8]">Convenience Fee (Exclusive)</span>
                      <CurrencyAmount amount={shareConvenienceFee} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                  </div>
                  <div className="w-full border-t border-dashed border-gray-100 py-1" />
                  <div className="flex justify-between items-center text-[15px] font-black"><span className="text-[#1a1c2e] uppercase">Bill Amount</span><CurrencyAmount amount={yourShareTotal} weight="bold" className="text-[14px] text-[#1a1c2e]" /></div>
                  <div className="flex justify-between items-center text-[15px] font-black"><span className="text-[#94a3b8] uppercase">Tips</span><div className="flex items-center gap-1.5 text-[#26ab5f]"><span>+</span><CurrencyAmount amount={currentTipAmount} weight="bold" className="text-[14px] text-inherit" /></div></div>
                  <div className="w-full border-t border-dashed border-gray-100 py-1" />
                  <div className="flex justify-between items-center"><span className="text-[13px] font-black text-[#94a3b8] uppercase">Grand Total</span><CurrencyAmount amount={grandTotal} weight="bold" className="text-[30px] text-[#0066b2]" /></div>
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
