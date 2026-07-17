'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  Check, 
  Plus, 
  Box, 
  X, 
  CreditCard, 
  Pencil, 
  Landmark, 
  Loader2,
  ArrowRight,
  User,
  MoreVertical,
  Equal
} from 'lucide-react';
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
import { CartItem } from '@/lib/types';

interface SplitByItemScreenProps {
  tableNumber: string;
  onBack: () => void;
  onPay: () => void;
}

export function SplitByItemScreen({ tableNumber, onBack, onPay }: SplitByItemScreenProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [paidItemIds, setPaidItemIds] = useState<string[]>([]);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isPartialSuccessOpen, setIsPartialSuccessOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(10);
  const [isCustomTipMode, setIsCustomTipMode] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');
  const [order, setOrder] = useState<TableOrder | null>(null);

  useEffect(() => {
    const tableOrder = getOrderForTable(tableNumber);
    if (tableOrder) {
      setOrder(tableOrder);
    }
  }, [tableNumber]);

  const items = useMemo(() => {
    return (order?.items || []).filter(item => !paidItemIds.includes(item.id));
  }, [order, paidItemIds]);

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

  // Breakdown Logic for Share
  const shareServiceCharge = yourShareSubtotal * 0.10;
  const shareVat = yourShareSubtotal * 0.05;
  const shareAdditionalCharges = yourShareSubtotal * 0.02;
  const yourShareTotal = yourShareSubtotal + shareServiceCharge + shareVat + shareAdditionalCharges;

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
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newPaidItems = [...paidItemIds, ...selectedItemIds];
      setPaidItemIds(newPaidItems);
      setSelectedItemIds([]);

      const allPaid = (order?.items || []).every(item => newPaidItems.includes(item.id));
      if (allPaid) {
        onPay();
      } else {
        setIsPartialSuccessOpen(true);
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

  const progressPercent = totalBillSubtotal > 0 ? (yourShareSubtotal / totalBillSubtotal) * 100 : 0;
  const circleSize = 240;
  const center = circleSize / 2;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;

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

      <div className="flex-1 px-4 pt-2 overflow-y-auto pb-64 space-y-4">
        <div className="text-center px-4 mt-2">
          <p className="text-[#94a3b8] text-[14px] font-bold leading-tight">
            Remaining balance is <CurrencyAmount amount={totalBillSubtotal} weight="bold" className="text-inherit" />.<br />Select items to include in your share.
          </p>
        </div>

        <div className="flex justify-center py-2">
          <div className="relative flex items-center justify-center" style={{ width: circleSize, height: circleSize }}>
            <svg className="absolute w-full h-full -rotate-90" viewBox={`0 0 ${circleSize} ${circleSize}`}>
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#eef2f8" strokeWidth="14" />
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#0066b2" strokeWidth="14" strokeDasharray={circumference} strokeDashoffset={circumference - (circumference * progressPercent) / 100} strokeLinecap="round" className="transition-all duration-700 ease-out" />
            </svg>
            <div className="flex flex-col items-center justify-center z-10 px-6 text-center">
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.15em] mb-2">Your Share (Base)</span>
              <CurrencyAmount amount={yourShareSubtotal} weight="bold" className="text-[34px] text-[#1a1c2e] leading-none" />
            </div>
          </div>
        </div>

        <div className="space-y-2.5 pb-8">
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            const itemBasePlusAddons = item.basePrice + item.addons.reduce((a, b) => a + (b.price * b.quantity), 0);
            const itemPrice = itemBasePlusAddons * item.quantity;

            return (
              <div key={item.id} onClick={() => toggleItem(item.id)} className={cn("bg-white rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border transition-all active:scale-[0.99] cursor-pointer", isSelected ? "border-[#0066b2] shadow-[0_6px_15px_rgba(102,178,0,0.04)]" : "border-gray-50")}>
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

      <div className="absolute bottom-0 inset-x-0 bg-white px-5 pt-3 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] z-30 flex flex-col gap-3 border-t border-gray-50">
        {yourShareSubtotal > 0 && (
          <div className="bg-[#f0f7ff] rounded-[18px] p-4 border border-[#0066b2]/10 space-y-2 mb-1">
            <div className="flex justify-between items-center text-[11px] font-black text-[#94a3b8]">
              <span className="uppercase">Base Price</span>
              <CurrencyAmount amount={yourShareSubtotal} weight="bold" className="text-inherit" />
            </div>
            <div className="flex justify-between items-center text-[11px] font-black text-[#94a3b8]">
              <span className="uppercase">S. Charge (10%) + VAT (5%) + Add.</span>
              <CurrencyAmount amount={shareServiceCharge + shareVat + shareAdditionalCharges} weight="bold" className="text-inherit" />
            </div>
          </div>
        )}
        <Button onClick={handlePayClick} disabled={yourShareSubtotal === 0} className={cn("w-full h-14 rounded-[18px] text-[16px] font-black shadow-[0_8px_25px_rgba(102,178,0,0.2)] transition-all active:scale-[0.98]", yourShareSubtotal > 0 ? "bg-[#0066b2] hover:bg-[#005596] text-white" : "bg-gray-100 text-gray-400 shadow-none pointer-events-none")}>Pay Your Items (<CurrencyAmount amount={yourShareTotal} weight="bold" className="text-inherit" />)</Button>
      </div>

      <Sheet open={isSettlementOpen} onOpenChange={setIsSettlementOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-visible max-h-[92vh] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Item Share Settlement</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col w-full h-full overflow-hidden rounded-t-[32px] bg-white">
            <div className="flex-1 overflow-y-auto pb-10">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
              <div className="px-6 flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center"><CreditCard className="w-6 h-6 text-[#0066b2]" /></div>
                  <div className="flex flex-col"><h2 className="text-[17px] font-black text-[#1a1c2e] leading-none uppercase">CHECK SETTLEMENT</h2><span className="text-[11px] font-bold text-[#94a3b8] uppercase mt-1.5">Final Review</span></div>
                </div>
              </div>
              <div className="w-full border-t border-gray-50 mb-8" />
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
                      <span className="text-[#94a3b8] uppercase">Item Price (Base)</span>
                      <CurrencyAmount amount={yourShareSubtotal} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Tax</span>
                      <CurrencyAmount amount={shareVat} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Service Charge</span>
                      <CurrencyAmount amount={shareServiceCharge} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Additional Charges</span>
                      <CurrencyAmount amount={shareAdditionalCharges} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                  </div>
                  <div className="w-full border-t border-dashed border-gray-100 py-1" />
                  <div className="flex justify-between items-center text-[15px] font-black"><span className="text-[#1a1c2e] uppercase">Bill Amount</span><CurrencyAmount amount={yourShareTotal} weight="bold" className="text-[14px] text-[#1a1c2e]" /></div>
                  <div className="flex justify-between items-center text-[15px] font-black"><span className="text-[#94a3b8] uppercase">Tips</span><div className="flex items-center gap-1.5 text-[#26ab5f]"><span>+</span><CurrencyAmount amount={currentTipAmount} weight="bold" className="text-[14px] text-inherit" /></div></div>
                  <div className="w-full border-t border-dashed border-gray-100 py-1" />
                  <div className="flex justify-between items-center"><span className="text-[13px] font-black text-[#94a3b8] uppercase">Grand Total</span><CurrencyAmount amount={grandTotal} weight="bold" className="text-[30px] text-[#0066b2]" /></div>
                </div>
              </div>
              <div className="px-6 mt-10 space-y-4"><Button onClick={handleFinalPayment} className="w-full h-[64px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(102,178,0,0.25)] active:scale-[0.98] transition-all"><CreditCard className="w-5 h-5" />PAY BY CARD</Button><div className="grid grid-cols-2 gap-4"><Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black flex items-center justify-center gap-2"><Landmark className="w-4 h-4 text-[#94a3b8]" />PAY BY CASH</Button><Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black">OTHER OPTIONS</Button></div></div>
              
              {/* Payment Methods Banner */}
              <div className="flex justify-center mt-8">
                <svg width="327" height="41" viewBox="0 0 327 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.288529" y="1.25044" width="57.1288" height="37.8935" rx="4.52029" fill="white" stroke="#DDE4EF" strokeWidth="0.577059"/>
                  <g clipPath="url(#clip0_4798_874)">
                    <path d="M18.514 9.93018C16.2058 9.93018 14.4265 11.4209 14.4265 14.0177V21.4233C14.6189 22.3369 15.5806 23.0102 16.6386 23.0102C17.8408 23.0102 18.7064 22.1446 18.7064 21.0866V17.3358H21.9764V21.0386C21.9764 23.1063 19.3315 24.1643 17.408 24.1643C16.302 24.1643 15.244 23.8277 14.4746 23.2506V31.4256H19.6681C21.4955 31.4256 23.6114 29.6944 23.6114 27.4824V9.93018H18.514Z" fill="#1174CE"/>
                    <path d="M14.4265 14.0177V21.4233C14.6189 22.3369 15.5806 23.0102 16.6386 23.0102C17.8408 23.0102 18.7064 22.1446 18.7064 21.0866V17.3358H21.9764V21.0386C21.9764 23.1063 19.3315 24.1643 17.408 24.1643C16.302 24.1643 15.244 23.8277 14.4746 23.2506V31.4256H19.6681C21.4955 31.4256 23.6114 29.6944 23.6114 27.4824V9.93018" fill="#0F549D"/>
                    <path d="M21.9283 17.3359V21.0387C21.9283 23.1065 19.2834 24.1645 17.3599 24.1645C16.2539 24.1645 15.1959 23.8278 14.4265 23.2508V31.4258H19.62C21.4474 31.4258 23.5633 29.6946 23.5633 27.4826" fill="#02375E"/>
                    <path d="M36.6914 22.9152H38.9516C39.5286 22.9152 40.0576 22.3862 40.0576 21.8092C40.0576 21.2321 39.5286 20.7031 38.9516 20.7031H36.6914V22.9152Z" fill="#146643"/>
                    <path d="M39.2401 9.93018C36.8838 9.93018 35.1526 11.4209 35.1526 13.9696V17.3358H41.2117C42.0773 17.3358 42.7986 18.0571 42.7986 18.9227C42.7986 19.7883 42.0773 20.5096 41.2117 20.5096C42.1735 20.5096 42.9429 21.1828 42.9429 22.0484C42.9429 22.914 42.2216 23.5872 41.2117 23.5872H35.1045V31.4256H40.298C42.1254 31.4256 44.2413 29.6944 44.2413 27.4824V9.93018H39.2401Z" fill="#1BCC38"/>
                    <path d="M35.1045 14.0177V17.3358H41.1636C42.0292 17.3358 42.7505 18.0571 42.7505 18.9227C42.7505 19.7883 42.0292 20.5096 41.1636 20.5096C42.1254 20.5096 42.8948 21.1828 42.8948 22.0484C42.8948 22.914 42.1735 23.5872 41.1636 23.5872H35.1045V31.4256H40.298C42.1254 31.4256 44.2413 29.6944 44.2413 27.4824V9.93018" fill="#329947"/>
                    <path d="M42.7505 18.9239C42.7505 19.7895 42.0292 20.5108 41.1636 20.5108C42.1254 20.5108 42.8948 21.1841 42.8948 22.0497C42.8948 22.9153 42.1735 23.5885 41.1636 23.5885H35.1045V31.4269H40.298C42.1254 31.4269 44.2413 29.6957 44.2413 27.4836M40.0095 19.1163C40.0095 18.5392 39.4805 18.0103 38.9035 18.0103H36.6914V20.1742H38.9516C39.5286 20.1742 40.0095 19.6933 40.0095 19.1163Z" fill="#146643"/>
                    <path d="M28.8048 9.93018C26.4485 9.93018 24.7173 11.4209 24.7173 13.9696V18.1052C25.2943 17.6243 26.0157 17.2877 26.7851 17.2877H32.2671V18.4418C30.9688 18.1533 29.7185 18.009 29.0933 18.009C27.7468 18.009 26.6408 19.115 26.6408 20.4615C26.6408 21.808 27.7468 22.914 29.0933 22.914C29.7185 22.914 30.9688 22.8178 32.2671 22.5293V23.5872H26.7851C26.0157 23.5872 25.2463 23.2987 24.7173 22.7697V31.4256H29.9108C31.7382 31.4256 33.8541 29.6944 33.8541 27.4824V9.93018H28.8048Z" fill="#E20E37"/>
                    <path d="M24.7173 14.0177V18.1533C25.2943 17.6724 26.0157 17.3358 26.7851 17.3358H32.2671V18.4899C30.9688 18.2014 29.7185 18.0571 29.0933 18.0571C27.7468 18.0571 26.6408 19.1631 26.6408 20.5096C26.6408 21.8561 27.7468 22.9621 29.0933 22.9621C29.7185 22.9621 30.9688 22.8659 32.2671 22.5774V23.5872H26.7851C26.0157 23.5872 25.2463 23.2987 24.7173 22.7697V31.4256H29.9108C31.7382 31.4256 33.8541 29.6944 33.8541 27.4824V9.93018H28.8048Z" fill="#B41F36"/>
                    <path d="M32.2671 17.3359V18.4901C30.9688 18.2015 29.7185 18.0573 29.0933 18.0573C27.7468 18.0573 26.6408 19.1633 26.6408 20.5098C26.6408 21.8562 27.7468 22.9623 29.0933 22.9623C29.7185 22.9623 30.9688 22.8661 32.2671 22.5776V23.5874H26.7851C26.0157 23.5874 25.2463 23.2989 24.7173 22.7699V31.4258H29.9108C31.7382 31.4258 33.8541 29.6946 33.8541 27.4826" fill="#720A1E"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_4798_874">
                      <rect width="29.8147" height="29.8147" fill="white" transform="translate(14.4265 5.77051)"/>
                    </clipPath>
                    <clipPath id="clip1_4798_874">
                      <rect width="40.5312" height="40.5312" fill="white" transform="translate(75.9795)"/>
                    </clipPath>
                    <clipPath id="clip2_4798_874">
                      <rect width="26.9964" height="26.9294" fill="white" transform="translate(150.035 6.73242)"/>
                    </clipPath>
                    <clipPath id="clip3_4798_874">
                      <rect width="37.5088" height="15.3991" fill="white" transform="translate(212.55 12.5034)"/>
                    </clipPath>
                    <clipPath id="clip4_4798_874">
                      <rect width="41.6042" height="13.4647" fill="white" transform="translate(276.988 13.4653)"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isPartialSuccessOpen} onOpenChange={setIsPartialSuccessOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-visible h-[400px] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Partial Payment Success</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-8 overflow-hidden rounded-t-[32px] bg-white">
            <div className="w-24 h-24 bg-[#00d084] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,208,132,0.3)] mb-8">
              <Check className="w-12 h-12 text-white stroke-[5px]" />
            </div>
            <h2 className="text-[24px] font-black text-[#1a1c2e] uppercase mb-4 leading-tight">PAYMENT IN PROGRESS</h2>
            <p className="text-[#94a3b8] text-[16px] font-bold leading-tight mb-8">Some items have been paid. Please pay for remaining items.</p>
            <Button onClick={() => setIsPartialSuccessOpen(false)} className="w-full h-16 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[16px] font-black uppercase shadow-lg active:scale-95 transition-all">Continue</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
