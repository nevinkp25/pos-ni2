'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, 
  MoreVertical, 
  User, 
  Clock, 
  ReceiptText, 
  ChevronDown, 
  ChevronUp,
  CreditCard, 
  Split,
  X,
  Pencil,
  Landmark,
  List,
  RefreshCcw,
  Trash2
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrderForTable, TableOrder } from '@/lib/storage';
import { format } from 'date-fns';
import { CurrencyAmount } from './CurrencyAmount';
import placeholderData from '@/app/lib/placeholder-images.json';

interface PayOrderDetailScreenProps {
  tableNumber: string;
  onBack: () => void;
  onHome: () => void;
  onSettle: () => void;
  onSplitByItem?: () => void;
  onSplitEqually?: () => void;
  onOrderMenu?: () => void;
}

export function PayOrderDetailScreen({ 
  tableNumber, 
  onBack, 
  onHome, 
  onSettle, 
  onSplitByItem, 
  onSplitEqually,
  onOrderMenu 
}: PayOrderDetailScreenProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedAddonItems, setExpandedAddonItems] = useState<string[]>([]);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isSplitBillOpen, setIsSplitBillOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(10);
  const [isCustomTipMode, setIsCustomTipMode] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');
  
  const [order, setOrder] = useState<TableOrder | null>(null);

  const paymentBanner = placeholderData.placeholderImages.find(img => img.id === 'payment-banner');

  useEffect(() => {
    const tableOrder = getOrderForTable(tableNumber);
    if (tableOrder) {
      setOrder(tableOrder);
    }
  }, [tableNumber]);

  const items = useMemo(() => order?.items || [], [order]);
  const displayedItems = isExpanded ? items : items.slice(0, 3);
  
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      let itemTotal = item.basePrice;
      item.addons.forEach(a => {
        itemTotal += a.price * a.quantity;
      });
      return sum + (itemTotal * item.quantity);
    }, 0);
  }, [items]);

  const serviceCharge = subtotal * 0.10;
  const tax = subtotal * 0.05;
  const additionalCharges = subtotal * 0.02; 
  const billAmount = subtotal + serviceCharge + tax + additionalCharges;
  
  const currentTipAmount = isCustomTipMode 
    ? (parseFloat(customTipValue) || 0)
    : (selectedTip || 0);

  const grandTotal = billAmount + currentTipAmount;

  const toggleAddons = (id: string) => {
    setExpandedAddonItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative tracking-normal">
      <div className="bg-white px-5 h-16 flex items-center justify-between shrink-0 z-20 shadow-sm border-b border-gray-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-[#1a1c2e] stroke-[3px]" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[17px] font-black leading-none text-[#1a1c2e]">Pay Order</h1>
            <span className="text-[#94a3b8] text-[13px] font-bold mt-1">Table # {tableNumber}</span>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-gray-100 active:scale-95 transition-all outline-none">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px] rounded-[24px] p-4 shadow-[0_15px_35px_rgba(0,0,0,0.12)] border border-gray-50 animate-in fade-in zoom-in-95 duration-200">
            <DropdownMenuLabel className="px-1 pt-0 pb-2">
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.1em]">
                CHECK ACTIONS
              </span>
            </DropdownMenuLabel>
            
            <div className="w-full border-t border-gray-100 mb-3" />

            <div className="flex flex-col gap-0.5">
              <DropdownMenuItem 
                onClick={onOrderMenu}
                className="flex items-center gap-3 p-2 rounded-xl cursor-pointer focus:bg-gray-50 group border-none outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#0066b2] shrink-0">
                  <List className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-black text-[#1a1c2e] group-hover:text-[#0066b2] transition-colors">Order Menu</span>
              </DropdownMenuItem>

              <DropdownMenuItem 
                className="flex items-center gap-3 p-2 rounded-xl cursor-pointer focus:bg-gray-50 group border-none outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#0066b2] shrink-0">
                  <RefreshCcw className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-black text-[#1a1c2e] group-hover:text-[#0066b2] transition-colors">Sync Order</span>
              </DropdownMenuItem>
              
              <div className="w-full border-t border-dashed border-gray-100 my-2" />

              <DropdownMenuItem 
                className="flex items-center gap-3 p-2 rounded-xl cursor-pointer focus:bg-gray-50 group border-none outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-black text-[#1a1c2e] group-hover:text-red-500 transition-colors">Reset Splits</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 px-4 pt-4 overflow-y-auto pb-52 space-y-4">
        <div className="bg-white rounded-[24px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col pt-[9px] pb-[27px] px-0 items-stretch">
          <h2 className="text-[13px] font-black text-[#1a1c2e] mb-[11px] px-6 text-left">
            Order #{order?.timestamp.toString().slice(-4) || '----'}
          </h2>
          
          <div className="w-full border-t border-gray-100 mb-6 border-dashed" />
          
          <div className="grid grid-cols-2 w-full relative px-6">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-100" />
            <div className="flex flex-col items-center pr-4">
              <div className="w-11 h-11 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-2">
                <User className="w-5 h-5 text-[#0066b2]" />
              </div>
              <span className="text-[10px] font-black text-[#94a3b8] uppercase mb-1">Staff</span>
              <span className="text-[15px] font-black text-[#1a1c2e]">232</span>
            </div>
            <div className="flex flex-col items-center pl-4">
              <div className="w-11 h-11 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-[#0066b2]" />
              </div>
              <span className="text-[10px] font-black text-[#94a3b8] uppercase mb-1">Date & Time</span>
              <span className="text-[15px] font-black text-[#1a1c2e]">
                {order ? format(new Date(order.timestamp), 'MMM d, hh:mm a') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <ReceiptText className="w-4 h-4 text-[#94a3b8]" />
            <span className="text-[11px] font-black text-[#94a3b8] uppercase">Current Orders</span>
          </div>

          {displayedItems.map((item) => {
            const isAddonsExpanded = expandedAddonItems.includes(item.id);
            const addonsToShow = isAddonsExpanded ? item.addons : item.addons.slice(0, 2);
            const moreCount = item.addons.length - 2;
            const itemBasePlusAddons = item.basePrice + item.addons.reduce((a, b) => a + (b.price * b.quantity), 0);
            const itemTotal = itemBasePlusAddons * item.quantity;

            return (
              <div key={item.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0">
                      <span className="text-[#0066b2] text-[13px] font-black">{item.quantity}x</span>
                    </div>
                    <div className="flex flex-col gap-2.5 flex-1">
                      <div className="flex justify-between items-center pr-1">
                        <h3 className="text-[15px] font-black text-[#1a1c2e]">{item.name}</h3>
                        <CurrencyAmount amount={itemTotal} weight="bold" className="text-[16px] text-[#1a1c2e]" />
                      </div>
                      <div className="space-y-2">
                        {addonsToShow.map((addon, idx) => (
                          <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                            <span className="text-[#94a3b8] text-[12px] font-bold shrink-0">+</span>
                            <span className="bg-[#f1f5f9] text-[#475569] px-2.5 py-0.5 rounded-lg text-[11px] font-black">{addon.name}</span>
                            <div className="flex-1 border-b border-dotted border-gray-200 mt-1" />
                            <CurrencyAmount amount={addon.price * addon.quantity} weight="bold" className="text-[#94a3b8] text-[12px]" />
                          </div>
                        ))}
                      </div>
                      {moreCount > 0 && !isAddonsExpanded && (
                        <div>
                          <button 
                            onClick={() => toggleAddons(item.id)}
                            className="bg-[#fffbeb] text-[#f59e0b] px-2.5 py-1 rounded-lg text-[11px] font-black active:scale-95 transition-all"
                          >
                            +{moreCount} more
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {items.length > 3 && (
            <div className="pt-2">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 bg-[#f0f7ff] h-12 rounded-full text-[#0066b2] text-[14px] font-black active:scale-95 transition-all shadow-sm"
              >
                {isExpanded ? 'See Less' : 'See More'}
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>

        <div className="bg-[#f0f7ff] rounded-[24px] p-0 border-[2px] border-[#0066b2] overflow-hidden shadow-sm">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-black text-[#0066b2] uppercase">SUBTOTAL</span>
              <CurrencyAmount amount={subtotal} weight="bold" className="text-[22px] text-[#0066b2]" />
            </div>
            
            <div className="w-full border-t border-dotted border-[#0066b2]/20" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px] font-black text-[#94a3b8]">
                <span className="uppercase tracking-tight">Item Price (Base)</span>
                <CurrencyAmount amount={subtotal} weight="bold" className="text-[11px]" />
              </div>
              <div className="flex items-center justify-between text-[13px] font-black text-[#94a3b8]">
                <span className="uppercase tracking-tight">Service Charge (10%)</span>
                <CurrencyAmount amount={serviceCharge} weight="bold" className="text-[11px]" />
              </div>
              <div className="flex items-center justify-between text-[13px] font-black text-[#94a3b8]">
                <span className="uppercase tracking-tight">TAX (5%)</span>
                <CurrencyAmount amount={tax} weight="bold" className="text-[11px]" />
              </div>
              <div className="flex items-center justify-between text-[13px] font-black text-[#94a3b8]">
                <span className="uppercase tracking-tight">Additional Charges</span>
                <CurrencyAmount amount={additionalCharges} weight="bold" className="text-[11px]" />
              </div>
            </div>
          </div>

          <div className="bg-white p-5 flex items-end justify-between border-t border-[#0066b2]/10">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black text-[#94a3b8] uppercase leading-none tracking-tight">Total Balance Due</span>
              <span className="text-[11px] font-black text-[#0066b2] uppercase leading-none tracking-tight">Order #{order?.timestamp.toString().slice(-4) || '----'}</span>
            </div>
            <CurrencyAmount amount={billAmount} weight="bold" className="text-[38px] text-[#0066b2] leading-none" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-white px-5 pt-4 pb-8 shadow-[0_-15px_45px_rgba(0,0,0,0.06)] flex flex-col gap-4 z-30">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setIsSettlementOpen(true)}
            className="h-[60px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[18px] text-[16px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_25px_rgba(0,102,178,0.25)]"
          >
            <CreditCard className="w-5 h-5 text-white" />
            Pay Full
          </Button>
          <Button 
            onClick={() => setIsSplitBillOpen(true)}
            variant="outline"
            className="h-[60px] bg-[#0f172a] border-none hover:bg-black text-white rounded-[18px] text-[16px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Split className="w-5 h-5 text-white" />
            Split Bill
          </Button>
        </div>
        
        <button className="w-full h-[60px] bg-white border-[1.5px] border-gray-200 text-[#1a1c2e] rounded-[18px] text-[15px] font-black uppercase active:bg-gray-50 transition-colors shadow-sm">
          Custom Payment
        </button>
      </div>

      <Sheet open={isSettlementOpen} onOpenChange={setIsSettlementOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-visible max-h-[92vh] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Full Payment Settlement</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col w-full h-full overflow-hidden rounded-t-[32px] bg-white">
            <div className="flex-1 overflow-y-auto pb-0">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              <div className="px-6 flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#0066b2]" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-[17px] font-black text-[#1a1c2e] leading-none uppercase">CHECK SETTLEMENT</h2>
                    <span className="text-[11px] font-bold text-[#94a3b8] uppercase mt-1.5">Final Review</span>
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-50 mb-6" />

              <div className="px-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[140px]">
                    <div className="w-10 h-10 bg-[#f8fafc] rounded-full flex items-center justify-center mb-2 border border-gray-50">
                      <User className="w-5 h-5 text-[#94a3b8]" />
                    </div>
                    <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-1">Waiter ID:</span>
                    <span className="text-[15px] font-black text-[#1a1c2e]">#123456</span>
                  </div>
                  <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[140px]">
                    <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-2">Bill Amount</span>
                    <CurrencyAmount amount={billAmount} weight="bold" className="text-[24px] text-[#0066b2]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-normal">Add tips for your waiter</span>
                  <div className="grid grid-cols-4 gap-3">
                    {[5, 10, 20].map((amount) => (
                      <button key={amount} onClick={() => handleTipClick(amount)} className={cn("relative h-[90px] rounded-[24px] flex flex-col items-center justify-center transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50", (!isCustomTipMode && selectedTip === amount) ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white")}>
                        <span className="text-[22px] font-black text-[#1a1c2e] tabular-nums">{amount}</span>
                        {(!isCustomTipMode && selectedTip === amount) && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-white"><X className="w-3 h-3 text-white stroke-[4px]" /></div>}
                      </button>
                    ))}
                    <button onClick={handleCustomTipToggle} className={cn("h-[90px] rounded-[24px] flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(102,178,0,0.03)] border border-gray-50 transition-all", isCustomTipMode ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white")}>
                      <Pencil className={cn("w-5 h-5 mb-1", isCustomTipMode ? "text-[#0066b2]" : "text-[#94a3b8]")} />
                      <span className={cn("text-[10px] font-black uppercase", isCustomTipMode ? "text-[#0066b2]" : "text-[#94a3b8]")}>Custom</span>
                    </button>
                  </div>
                  
                  {isCustomTipMode && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="relative">
                        <Input type="number" placeholder="Enter tip amount" value={customTipValue} onChange={(e) => setCustomTipValue(e.target.value)} className="h-14 rounded-[18px] border-[#0066b2]/20 border-2 px-6 text-lg font-black focus-visible:ring-0 focus-visible:border-[#0066b2]" autoFocus />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-50 space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Item Price (Base)</span>
                      <CurrencyAmount amount={subtotal} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">TAX (5%)</span>
                      <CurrencyAmount amount={tax} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Service Charge (10%)</span>
                      <CurrencyAmount amount={serviceCharge} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Additional Charges</span>
                      <CurrencyAmount amount={additionalCharges} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                  </div>
                  
                  <div className="w-full border-t border-dashed border-gray-100 py-1" />
                  
                  <div className="flex justify-between items-center text-[15px] font-black">
                    <span className="text-[#1a1c2e] uppercase">Bill Amount</span>
                    <CurrencyAmount amount={billAmount} weight="bold" className="text-[15px] text-[#1a1c2e]" />
                  </div>
                  <div className="flex justify-between items-center text-[15px] font-black">
                    <span className="text-[#94a3b8] uppercase">Tips</span>
                    <div className="flex items-center gap-1.5 text-[#26ab5f]"><span>+</span><CurrencyAmount amount={currentTipAmount} weight="bold" className="text-[15px] text-inherit" /></div>
                  </div>
                  <div className="w-full border-t border-dashed border-gray-100 py-1" />
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-black text-[#94a3b8] uppercase">Grand Total</span>
                    <CurrencyAmount amount={grandTotal} weight="bold" className="text-[34px] text-[#0066b2]" />
                  </div>
                </div>
              </div>

              <div className="px-6 mt-10 space-y-4 pb-0">
                <Button onClick={() => { setIsSettlementOpen(false); onSettle(); }} className="w-full h-[64px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,102,178,0.25)]"><CreditCard className="w-5 h-5" />PAY BY CARD</Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black flex items-center justify-center gap-2"><Landmark className="w-4 h-4 text-[#94a3b8]" />PAY BY CASH</Button>
                  <Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black">OTHER OPTIONS</Button>
                </div>
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

      <Sheet open={isSplitBillOpen} onOpenChange={setIsSplitBillOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-visible h-auto max-h-[85vh] flex flex-col pb-10">
          <div className="flex flex-col w-full h-full overflow-hidden rounded-t-[32px] bg-white">
            <SheetHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between shrink-0">
              <SheetTitle className="text-[#94a3b8] text-[13px] font-black uppercase tracking-[0.15em]">
                Split Options
              </SheetTitle>
            </SheetHeader>

            <div className="px-6 space-y-4">
              <button 
                onClick={() => {
                  setIsSplitBillOpen(false);
                  onSplitEqually?.();
                }}
                className="w-full h-20 bg-[#f0f7ff] rounded-[24px] px-6 flex items-center gap-5 active:scale-[0.98] transition-all text-left"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0066b2] shadow-sm shrink-0">
                  <Split className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-[17px] font-bold text-[#1a1c2e] leading-tight text-left">Split Equally</span>
                  <span className="text-[13px] text-[#94a3b8] font-medium leading-tight text-left">Divide total amount by number of guests</span>
                </div>
              </button>

              <button 
                onClick={() => {
                  setIsSplitBillOpen(false);
                  onSplitByItem?.();
                }}
                className="w-full h-20 bg-[#f0f7ff] rounded-[24px] px-6 flex items-center gap-5 active:scale-[0.98] transition-all text-left"
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0066b2] shadow-sm shrink-0">
                  <List className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-[17px] font-bold text-[#1a1c2e] leading-tight text-left">Split by Item</span>
                  <span className="text-[13px] text-[#94a3b8] font-medium leading-tight text-left">Select specific items for each guest</span>
                </div>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
