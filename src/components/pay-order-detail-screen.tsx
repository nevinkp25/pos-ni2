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
  Equal,
  Box,
  ArrowRight,
  List,
  RefreshCcw,
  Trash2
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
  const [selectedSplitType, setSelectedSplitType] = useState<'equal' | 'item' | null>(null);
  
  const [order, setOrder] = useState<TableOrder | null>(null);

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

  // Breakdown Logic
  const serviceCharge = subtotal * 0.10;
  const vat = subtotal * 0.05;
  const additionalCharges = subtotal * 0.02; 
  const billAmount = subtotal + serviceCharge + vat + additionalCharges;
  
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

  const handleSplitTypeSelection = (type: 'equal' | 'item') => {
    setSelectedSplitType(type);
    setIsSplitBillOpen(false);
    if (type === 'item') {
      onSplitByItem?.();
    } else {
      onSplitEqually?.();
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
                <span className="uppercase tracking-tight">VAT (5%)</span>
                <CurrencyAmount amount={vat} weight="bold" className="text-[11px]" />
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
            className="h-[60px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[18px] text-[16px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_25px_rgba(102,178,0,0.25)]"
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
            <div className="flex-1 overflow-y-auto pb-10">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              <div className="px-6 flex items-center justify-between mb-8">
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

              <div className="w-full border-t border-gray-50 mb-8" />

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
                        <span className="text-[22px] font-black text-[#1a1c2e]">{amount}</span>
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
                      <span className="text-[#94a3b8] uppercase">Tax</span>
                      <CurrencyAmount amount={vat} weight="bold" className="text-[#1a1c2e]" />
                    </div>
                    <div className="flex justify-between items-center text-[13px] font-black">
                      <span className="text-[#94a3b8] uppercase">Service Charge</span>
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

              <div className="px-6 mt-10 space-y-4">
                <Button onClick={() => { setIsSettlementOpen(false); onSettle(); }} className="w-full h-[64px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(102,178,0,0.25)]"><CreditCard className="w-5 h-5" />PAY BY CARD</Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black flex items-center justify-center gap-2"><Landmark className="w-4 h-4 text-[#94a3b8]" />PAY BY CASH</Button>
                  <Button variant="outline" className="h-[60px] rounded-[20px] border-gray-200 text-[#1a1c2e] text-[15px] font-black">OTHER OPTIONS</Button>
                </div>

                <div className="flex justify-center mt-8">
                  <svg width="327" height="41" viewBox="0 0 327 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.288529" y="1.25044" width="57.1288" height="37.8935" rx="4.52029" fill="white" stroke="#DDE4EF" strokeWidth="0.577059"/>
                    <g clipPath="url(#clip0_4798_874_pay)">
                      <path d="M18.514 9.93018C16.2058 9.93018 14.4265 11.4209 14.4265 14.0177V21.4233C14.6189 22.3369 15.5806 23.0102 16.6386 23.0102C17.8408 23.0102 18.7064 22.1446 18.7064 21.0866V17.3358H21.9764V21.0386C21.9764 23.1063 19.3315 24.1643 17.408 24.1643C16.302 24.1643 15.244 23.8277 14.4746 23.2506V31.4256H19.6681C21.4955 31.4256 23.6114 29.6944 23.6114 27.4824V9.93018H18.514Z" fill="#1174CE"/>
                      <path d="M14.4265 14.0177V21.4233C14.6189 22.3369 15.5806 23.0102 16.6386 23.0102C17.8408 23.0102 18.7064 22.1446 18.7064 21.0866V17.3358H21.9764V21.0386C21.9764 23.1063 19.3315 24.1643 17.408 24.1643C16.302 24.1643 15.244 23.8277 14.4746 23.2506V31.4256H19.6681C21.4955 31.4256 23.6114 29.6944 23.6114 27.4824V9.93018" fill="#0F549D"/>
                      <path d="M21.9283 17.3359V21.0387C21.9283 23.1065 19.2834 24.1645 17.3599 24.1645C16.2539 24.1645 15.1959 23.8278 14.4265 23.2508V31.4258H19.62C21.4474 31.4258 23.5633 29.6946 23.5633 27.4826" fill="#02375E"/>
                      <path d="M36.6914 22.9152H38.9516C39.5286 22.9152 40.0576 22.3862 40.0576 21.8092C40.0576 21.2321 39.5286 20.7031 38.9516 20.7031H36.6914V22.9152Z" fill="#146643"/>
                      <path d="M39.2401 9.93018C36.8838 9.93018 35.1526 11.4209 35.1526 13.9696V17.3358H41.2117C42.0773 17.3358 42.7986 18.0571 42.7986 18.9227C42.7986 19.7883 42.0773 20.5096 41.2117 20.5096C42.1735 20.5096 42.9429 21.1828 42.9429 22.0484C42.9429 22.914 42.2216 23.5872 41.2117 23.5872H35.1045V31.4256H40.298C42.1254 31.4256 44.2413 29.6944 44.2413 27.4824V9.93018H39.2401Z" fill="#1BCC38"/>
                      <path d="M35.1045 14.0177V17.3358H41.1636C42.0292 17.3358 42.7505 18.0571 42.7505 18.9227C42.7505 19.7883 42.0292 20.5096 41.1636 20.5096C42.1254 20.5096 42.8948 21.1828 42.8948 22.0484C42.8948 22.914 42.1735 23.5872 41.1636 23.5872H35.1045V31.4256H40.298C42.1254 31.4256 44.2413 29.6944 44.2413 27.4824V9.93018" fill="#329947"/>
                      <path d="M42.7505 18.9239C42.7505 19.7895 42.0292 20.5108 41.1636 20.5108C42.1254 20.5108 42.8948 21.1841 42.8948 22.0497C42.8948 22.9153 42.1735 23.5885 41.1636 23.5885H35.1045V31.4269H40.298C42.1254 31.4269 44.2413 29.6957 44.2413 27.4836M40.0095 19.1163C40.0095 18.5392 39.4805 18.0103 38.9035 18.0103H36.6914V20.1742H38.9516C39.5286 20.1742 40.0095 19.6933 40.0095 19.1163Z" fill="#146643"/>
                      <path d="M28.8048 9.93018C26.4485 9.93018 24.7173 11.4209 24.7173 13.9696V18.1052C25.2943 17.6243 26.0157 17.2877 26.7851 17.2877H32.2671V18.4418C30.9688 18.1533 29.7185 18.009 29.0933 18.009C27.7468 18.009 26.6408 19.115 26.6408 20.4615C26.6408 21.808 27.7468 22.914 29.0933 22.914C29.7185 22.914 30.9688 22.8178 32.2671 22.5293V23.5872H26.7851C26.0157 23.5872 25.2463 23.2987 24.7173 22.7697V31.4256H19.6681C21.4955 31.4256 23.6114 29.6944 23.6114 27.4824V9.93018H18.514Z" fill="#E20E37"/>
                      <path d="M24.7173 14.0177V18.1533C25.2943 17.6724 26.0157 17.3358 26.7851 17.3358H32.2671V18.4899C30.9688 18.2014 29.7185 18.0571 29.0933 18.0571C27.7468 18.0571 26.6408 19.1631 26.6408 20.5096C26.6408 21.8561 27.7468 22.9621 29.0933 22.9621C29.7185 22.9621 30.9688 22.8659 32.2671 22.5774V23.5872H26.7851C26.0157 23.5872 25.2463 23.2987 24.7173 22.7697V31.4256H29.9108C31.7382 31.4256 33.8541 29.6944 33.8541 27.4824V9.93018H28.8048Z" fill="#B41F36"/>
                      <path d="M32.2671 17.3359V18.4901C30.9688 18.2015 29.7185 18.0573 29.0933 18.0573C27.7468 18.0573 26.6408 19.1633 26.6408 20.5098C26.6408 21.8562 27.7468 22.9623 29.0933 22.9623C29.7185 22.9623 30.9688 22.8661 32.2671 22.5776V23.5874H26.7851C26.0157 23.5874 25.2463 23.2989 24.7173 22.7699V31.4258H29.9108C31.7382 31.4258 33.8541 29.6946 33.8541 27.4826" fill="#720A1E"/>
                    </g>
                    <rect x="67.6123" y="1.25044" width="57.1288" height="37.8935" rx="4.52029" fill="white" stroke="#DDE4EF" strokeWidth="0.577059"/>
                    <g clipPath="url(#clip1_4798_874_pay)">
                      <path d="M94.8966 20.0482V24.7368H93.4087V13.1587H97.3533C98.353 13.1587 99.2054 13.492 99.9029 14.1584C100.616 14.8249 100.972 15.6386 100.972 16.5996C100.972 17.5838 100.616 18.3975 99.9029 19.0562C99.2132 19.7149 98.3608 20.0404 97.3533 20.0404H94.8966V20.0482ZM94.8966 14.5846V18.6222H97.3843C97.9733 18.6222 98.4693 18.4208 98.8567 18.0255C99.252 17.6303 99.4535 17.1498 99.4535 16.6073C99.4535 16.0726 99.252 15.5998 98.8567 15.2046C98.4692 14.7939 97.981 14.5924 97.3843 14.5924H94.8966V14.5846ZM104.863 16.5531C105.963 16.5531 106.831 16.8476 107.467 17.4366C108.102 18.0255 108.42 18.8315 108.42 19.8545V24.7368H107.002V23.6364H106.94C106.327 24.5431 105.506 24.9926 104.483 24.9926C103.607 24.9926 102.879 24.7368 102.29 24.2176C101.701 23.6984 101.406 23.0551 101.406 22.2802C101.406 21.4587 101.716 20.8078 102.336 20.3272C102.956 19.8391 103.786 19.5988 104.816 19.5988C105.7 19.5988 106.428 19.7616 106.994 20.087V19.746C106.994 19.2268 106.793 18.7928 106.382 18.4286C105.971 18.0644 105.491 17.8861 104.94 17.8861C104.111 17.8861 103.452 18.2348 102.972 18.9401L101.662 18.1186C102.383 17.0723 103.452 16.5531 104.863 16.5531ZM102.941 22.3034C102.941 22.6909 103.104 23.0164 103.437 23.2721C103.762 23.5279 104.15 23.6596 104.592 23.6596C105.219 23.6596 105.777 23.4271 106.266 22.9621C106.754 22.4971 107.002 21.9546 107.002 21.3269C106.537 20.9627 105.894 20.7767 105.064 20.7767C104.46 20.7767 103.956 20.9239 103.553 21.2106C103.142 21.5129 102.941 21.8772 102.941 22.3034ZM116.511 16.8088L111.551 28.2164H110.016L111.861 24.2253L108.59 16.8088H110.21L112.566 22.4971H112.597L114.891 16.8088H116.511Z" fill="#383E41"/>
                      <path d="M88.8542 17.708H82.6172V20.2654L86.2092 20.2662C86.0635 21.1171 85.5946 21.8425 84.8762 22.3261V22.3266L84.877 22.3261L84.8124 23.8547L87.0152 23.9846L87.0143 23.9854C88.2628 22.8299 88.9782 21.1218 88.9782 19.1038C88.9786 18.6358 88.9371 18.1686 88.8542 17.708Z" fill="#0085F7"/>
                      <path d="M84.8766 22.3252L84.8759 22.3256C84.2808 22.7268 83.5146 22.9614 82.6184 22.9614C80.8863 22.9614 79.417 21.7943 78.8908 20.2211H78.8905L78.8908 20.2219L77.0518 19.9307L76.6855 21.9328C77.7784 24.1009 80.0241 25.5886 82.6185 25.5886C84.4112 25.5886 85.9175 24.9991 87.014 23.9843C87.0144 23.9841 87.0146 23.9838 87.0149 23.9835L84.8766 22.3252Z" fill="#00A94B"/>
                      <path d="M78.6834 18.9525C78.6834 18.5108 78.757 18.0838 78.8911 17.6824L78.3168 15.9712H76.6855C76.2337 16.8679 75.9795 17.88 75.9795 18.9525C75.9795 20.0251 76.2345 21.0372 76.6855 21.9339L76.6858 21.9336L78.8911 20.2227C78.7538 19.8133 78.6836 19.3844 78.6834 18.9525Z" fill="#FFBB00"/>
                      <path d="M82.6188 12.314C80.0249 12.314 77.7783 13.8019 76.6855 15.9703L78.8911 17.6815C79.4173 16.1083 80.8866 14.9412 82.6187 14.9412C83.5975 14.9412 84.474 15.2784 85.1661 15.9371L87.0609 14.0438C85.9101 12.9719 84.4097 12.314 82.6188 12.314Z" fill="#FF4031"/>
                    </g>
                    <rect x="134.936" y="1.25044" width="57.1288" height="37.8935" rx="4.52029" fill="white" stroke="#DDE4EF" strokeWidth="0.577059"/>
                    <g clipPath="url(#clip2_4798_874_pay)">
                      <path d="M150.035 6.73242H176.965V21.2697L175.632 23.3524L176.965 25.206V33.6618H150.035V19.9576L150.868 18.9996L150.035 18.0832V6.73242Z" fill="#016FD0"/>
                      <path d="M155.263 25.4984V21.2705H159.739L160.22 21.8966L160.716 21.2705H176.965V25.2068C176.965 25.2068 176.54 25.4942 176.048 25.4984H167.051L166.509 24.8319V25.4984H164.735V24.3607C164.735 24.3607 164.492 24.5195 163.968 24.5195H163.364V25.4984H160.678L160.198 24.8589L159.711 25.4984H155.263Z" fill="white"/>
                      <path d="M150.035 18.0839L151.045 15.7305H152.79L153.363 17.0488V15.7305H155.534L155.875 16.6833L156.205 15.7305H165.947V16.2095C165.947 16.2095 166.459 15.7305 167.301 15.7305L170.462 15.7415L171.025 17.0426V15.7305H172.841L173.341 16.4778V15.7305H175.173V19.9584H173.341L172.862 19.2086V19.9584H170.193L169.925 19.2919H169.208L168.944 19.9584H167.134C166.41 19.9584 165.947 19.4891 165.947 19.4891V19.9584H163.219L162.677 19.2919V19.9584H152.532L152.264 19.2919H151.549L151.282 19.9584H150.035V18.0839Z" fill="white"/>
                      <path d="M151.402 16.2515L150.04 19.4172H150.926L151.178 18.7833H152.638L152.888 19.4172H153.794L152.434 16.2515H151.402ZM151.905 16.9882L152.351 18.096H151.459L151.905 16.9882Z" fill="#016FD0"/>
                      <path d="M153.888 19.4162V16.2505L155.148 16.2552L155.881 18.2962L156.596 16.2505H157.845V19.4162H157.054V17.0836L156.215 19.4162H155.521L154.68 17.0836V19.4162H153.888Z" fill="#016FD0"/>
                      <path d="M158.387 19.4162V16.2505H160.969V16.9586H159.186V17.5001H160.928V18.1666H159.186V18.7289H160.969V19.4162H158.387Z" fill="#016FD0"/>
                      <path d="M161.428 16.2515V19.4172H162.219V18.2925H162.552L163.501 19.4172H164.468L163.427 18.2509C163.855 18.2148 164.295 17.848 164.295 17.2785C164.295 16.6123 163.772 16.2515 163.189 16.2515H161.428ZM162.219 16.9596H163.124C163.341 16.9596 163.499 17.1293 163.499 17.2928C163.499 17.5031 163.294 17.6261 163.136 17.6261H162.219V16.9596Z" fill="#016FD0"/>
                      <path d="M165.426 19.4162H164.618V16.2505H165.426V19.4162Z" fill="#016FD0"/>
                      <path d="M167.342 19.4162H167.168C166.324 19.4162 165.812 18.7513 165.812 17.8464C165.812 16.9191 166.318 16.2505 167.384 16.2505H168.259V17.0003H167.352C166.919 17.0003 166.613 17.3379 166.613 17.8542C166.613 18.4673 166.963 18.7247 167.467 18.7247H167.676L167.342 19.4162Z" fill="#016FD0"/>
                      <path d="M169.065 16.2515L167.703 19.4172H168.59L168.841 18.7833H170.301L170.551 19.4172H171.457L170.097 16.2515H169.065ZM169.568 16.9882L170.014 18.096H169.122L169.568 16.9882Z" fill="#016FD0"/>
                      <path d="M171.549 19.4162V16.2505H172.556L173.84 18.2395V16.2505H174.632V19.4162H173.658L172.341 17.3752V19.4162H171.549Z" fill="#016FD0"/>
                      <path d="M155.804 24.9567V21.791H158.387V22.4991H156.604V23.0406H158.345V23.7071H156.604V24.2694H158.387V24.9567H155.804Z" fill="#016FD0"/>
                      <path d="M168.458 24.9567V21.791H171.041V22.4991H169.258V23.0406H170.991V23.7071H169.258V24.2694H171.041V24.9567H168.458Z" fill="#016FD0"/>
                      <path d="M158.487 24.9567L159.744 23.3934L158.457 21.791H159.454L160.221 22.7816L160.99 21.791H161.948L160.678 23.3739L161.937 24.9567H160.941L160.196 23.9818L159.47 24.9567H158.487Z" fill="#016FD0"/>
                      <path d="M162.031 21.7915V24.9572H162.844V23.9575H163.677C164.381 23.9575 164.916 23.5836 164.916 22.8563C164.916 22.2538 164.497 21.7915 163.779 21.7915H162.031ZM162.844 22.5074H163.721C163.949 22.5074 164.111 22.647 164.111 22.8719C164.111 23.0832 163.949 23.2364 163.718 23.2364H162.844V22.5074Z" fill="#016FD0"/>
                      <path d="M165.259 21.791V24.9567H166.051V23.8321H166.384L167.333 24.9567H168.3L167.259 23.7904C167.686 23.7543 168.127 23.3875 168.127 22.8181C168.127 22.1519 167.604 21.791H167.02 21.791H165.259ZM166.051 22.4991H166.955C167.172 22.4991 167.33 22.6689 167.33 22.8324C167.33 23.0427 167.126 23.1656 166.051V22.4991Z" fill="#016FD0"/>
                      <path d="M171.408 24.9567V24.2694H172.992C173.226 24.2694 173.327 24.1428 173.327 24.0039C173.327 23.8708 173.226 23.7363 172.992 23.7363H172.276C171.654 23.7363 171.307 23.3572 171.307 22.7881C171.307 22.2805 171.624 21.791H172.549 21.791H174.09L173.757 22.5033H172.424C172.169 22.5033 172.091 22.637 172.091 22.7647C172.091 22.8959 172.188 23.0406 172.382 23.0406H173.132C173.826 23.0406 174.127 23.434 174.127 23.9492C174.127 24.5031 173.791 24.9567 173.094 24.9567H171.408Z" fill="#016FD0"/>
                      <path d="M174.312 24.9567V24.2694H175.896C176.131 24.2694 176.232 24.1428 176.232 24.0039C176.232 23.8708 176.131 23.7363 175.896 23.7363H175.181C174.558 23.7363 174.212 23.3572 174.212 22.7881C174.212 22.2805 174.529 21.791H175.454 21.791H176.995L176.662 22.5033H175.329C175.074 22.5033 174.996 22.637 174.996 22.7647C174.996 22.8959 175.092 23.0406 175.287 23.0406H176.037C176.73 23.0406 177.031 23.434 177.031 23.9492C177.031 24.5031 176.696 24.9567 175.999 24.9567H174.312Z" fill="#016FD0"/>
                    </g>
                    <rect x="202.259" y="1.25044" width="57.1288" height="37.8935" rx="4.52029" fill="white" stroke="#DDE4EF" strokeWidth="0.577059"/>
                    <g clipPath="url(#clip3_4798_874_pay)">
                      <path d="M219.407 14.4887C218.968 15.0089 218.265 15.4191 217.561 15.3605C217.473 14.6572 217.818 13.91 218.221 13.4485C218.66 12.9137 219.429 12.5327 220.052 12.5034C220.125 13.236 219.84 13.954 219.407 14.4887ZM220.045 15.4997C219.027 15.4411 218.155 16.0785 217.671 16.0785C217.18 16.0785 216.44 15.529 215.635 15.5437C214.587 15.5583 213.613 16.1517 213.078 17.0968C211.979 18.9869 212.792 21.7854 213.854 23.3238C214.375 24.0857 214.997 24.9209 215.818 24.8916C216.594 24.8623 216.902 24.3861 217.84 24.3861C218.785 24.3861 219.056 24.8916 219.876 24.8769C220.726 24.8623 221.261 24.115 221.781 23.3531C222.374 22.4887 222.616 21.6462 222.631 21.6022C222.616 21.5876 220.99 20.9649 220.975 19.0894C220.961 17.5217 222.257 16.7744 222.316 16.7305C221.583 15.6462 220.44 15.529 220.045 15.4997ZM225.928 13.3752V24.7963H227.7V20.8916H230.155C232.396 20.8916 233.971 19.3532 233.971 17.1261C233.971 14.899 232.426 13.3752H230.213 13.3752H225.928ZM227.7 14.8697H229.744C231.283 14.8697 232.162 15.6902 232.162 17.1334C232.162 18.5766 231.283 19.4045 229.737 19.4045H227.7V14.8697ZM237.21 24.8843C238.323 24.8843 239.356 24.3202 239.825 23.4264H239.861V24.7963H241.503V19.1114C241.503 17.4631 240.184 16.4008 238.155 16.4008C236.272 16.4008 234.88 17.4777 234.829 18.9576H236.426C236.557 18.2543 237.21 17.7927 238.103 17.7927C239.188 17.7927 239.796 18.2982 239.796 19.2286V19.8587L237.583 19.9905C235.525 20.1151 234.411 20.9576 234.411 22.4227C234.411 23.9026 235.561 24.8843 237.21 24.8843ZM237.686 23.529C236.741 23.529 236.14 23.0748 236.14 22.3788C236.14 21.6608 236.719 21.2433 237.825 21.1773L239.796 21.0528V21.6975C239.796 22.7671 238.887 23.529 237.686 23.529ZM243.693 27.9025C245.422 27.9025 246.235 27.2432 246.946 25.2432L250.059 16.5107H248.257L246.169 23.2579H246.133L244.045 16.5107H242.191L245.195 24.8256L245.034 25.3311C244.763 26.1883 244.323 26.5179 243.539 26.5179C243.4 26.5179 243.129 26.5033 243.019 26.4886V27.8586C243.122 27.8879 243.561 27.9025 243.693 27.9025Z" fill="black"/>
                    </g>
                    <rect x="269.582" y="1.25044" width="57.1288" height="37.8935" rx="4.52029" fill="white" stroke="#DDE4EF" strokeWidth="0.577059"/>
                    <g clipPath="url(#clip4_4798_874_pay)">
                      <path d="M295.017 26.7354H291.646L293.754 13.7012H297.125L295.017 26.7354Z" fill="#00579F"/>
                      <path d="M307.234 14.0202C306.57 13.7565 305.515 13.4653 304.211 13.4653C300.883 13.4653 298.54 15.2401 298.525 17.7775C298.498 19.6496 300.203 20.6894 301.479 21.3136C302.783 21.9515 303.226 22.3678 303.226 22.9363C303.213 23.8095 302.172 24.212 301.202 24.212C299.857 24.212 299.136 24.0045 298.04 23.5187L297.596 23.3105L297.125 26.2364C297.915 26.5965 299.371 26.916 300.883 26.93C304.42 26.93 306.722 25.1827 306.749 22.4787C306.762 20.995 305.862 19.858 303.92 18.929C302.741 18.3326 302.019 17.9305 302.019 17.3203C302.033 16.7655 302.63 16.1973 303.961 16.1973C305.056 16.1695 305.861 16.4329 306.471 16.6964L306.776 16.8348L307.234 14.0202Z" fill="#00579F"/>
                      <path d="M311.713 22.1178C311.991 21.369 313.059 18.471 313.059 18.471C313.045 18.4988 313.336 17.7083 313.502 17.2231L313.738 18.3462C313.738 18.3462 314.376 21.4661 314.515 22.1178C313.988 22.1178 312.379 22.1178 311.713 22.1178ZM315.873 13.7012H313.267C312.463 13.7012 311.852 13.9367 311.505 14.7826L306.499 26.7352H310.035C310.035 26.7352 310.617 25.1265 310.743 24.78C311.131 24.78 314.571 24.78 315.07 24.78C315.166 25.2376 315.472 26.7352 315.472 26.7352H318.592L315.873 13.7012Z" fill="#00579F"/>
                      <path d="M288.832 13.7012L285.531 22.5892L285.17 20.7866C284.56 18.7067 282.646 16.4468 280.511 15.3232L283.534 26.7215H287.098L292.395 13.7012H288.832Z" fill="#00579F"/>
                      <path d="M282.466 13.7012H277.044L276.988 13.9645C281.218 15.0462 284.019 17.6534 285.17 20.7872L283.992 14.7968C283.797 13.9643 283.201 13.7286 282.466 13.7012Z" fill="#FAA61A"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_4798_874_pay">
                        <rect width="29.8147" height="29.8147" fill="white" transform="translate(14.4265 5.77051)"/>
                      </clipPath>
                      <clipPath id="clip1_4798_874_pay">
                        <rect width="40.5312" height="40.5312" fill="white" transform="translate(75.9795)"/>
                      </clipPath>
                      <clipPath id="clip2_4798_874_pay">
                        <rect width="26.9964" height="26.9294" fill="white" transform="translate(150.035 6.73242)"/>
                      </clipPath>
                      <clipPath id="clip3_4798_874_pay">
                        <rect width="37.5088" height="15.3991" fill="white" transform="translate(212.55 12.5034)"/>
                      </clipPath>
                      <clipPath id="clip4_4798_874_pay">
                        <rect width="41.6042" height="13.4647" fill="white" transform="translate(276.988 13.4653)"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={isSplitBillOpen} onOpenChange={setIsSplitBillOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-visible flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Split Bill Options</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col w-full h-full overflow-hidden rounded-t-[32px] bg-white">
            <div className="bg-white px-6 pt-6 pb-2 shrink-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[20px] font-black text-[#1a1c2e] uppercase">SPLIT BILL</h2>
              </div>
            </div>
            <div className="flex-1 px-6 pb-10 space-y-4">
              <button onClick={() => handleSplitTypeSelection('equal')} className={cn("w-full bg-white rounded-[24px] p-6 flex items-center justify-between group active:scale-[0.98] transition-all", selectedSplitType === 'equal' ? "shadow-[0_10px_30px_rgba(102,178,0,0.05)] border-[2px] border-[#0066b2]" : "shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50")}>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-[#f0f7ff] rounded-[20px] flex items-center justify-center"><Equal className={cn("w-7 h-7 stroke-[3px]", selectedSplitType === 'equal' ? "text-[#0066b2]" : "text-[#94a3b8]")} /></div>
                  <div className="flex flex-col text-left"><h3 className={cn("text-[17px] font-black uppercase mb-1", selectedSplitType === 'equal' ? "text-[#0066b2]" : "text-[#1a1c2e]")}>SPLIT EQUALLY</h3><p className="text-[#94a3b8] text-[14px] font-bold">Divide total among guests</p></div>
                </div>
                <ArrowRight className={cn("w-6 h-6 transition-colors", selectedSplitType === 'equal' ? "text-[#0066b2]" : "text-gray-200")} />
              </button>
              <button onClick={onSplitByItem} className={cn("w-full bg-white rounded-[24px] p-6 flex items-center justify-between group active:scale-[0.98] transition-all", selectedSplitType === 'item' ? "shadow-[0_10px_30px_rgba(102,178,0,0.05)] border-[2px] border-[#0066b2]" : "shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50")}>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-[#f0f7ff] rounded-[20px] flex items-center justify-center"><Box className={cn("w-7 h-7 stroke-[2.5px]", selectedSplitType === 'item' ? "text-[#0066b2] fill-[#0066b2]/10" : "text-[#94a3b8]")} /></div>
                  <div className="flex flex-col text-left"><h3 className={cn("text-[17px] font-black uppercase mb-1", selectedSplitType === 'item' ? "text-[#0066b2]" : "text-[#1a1c2e]")}>SPLIT BY ITEM</h3><p className="text-[#94a3b8] text-[14px] font-bold">Select specific items per guest</p></div>
                </div>
                <ArrowRight className={cn("w-6 h-6 transition-colors", selectedSplitType === 'item' ? "text-[#0066b2]" : "text-gray-200")} />
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
