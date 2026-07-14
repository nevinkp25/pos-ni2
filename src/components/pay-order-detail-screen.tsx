
'use client';

import React, { useState, useMemo } from 'react';
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
  Check,
  Pencil,
  Landmark,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface PayOrderDetailScreenProps {
  tableNumber: string;
  onBack: () => void;
  onHome: () => void;
  onSettle: () => void;
}

// Dirham symbol as requested
const CurrencySymbol = ({ className }: { className?: string }) => (
  <span className={cn("font-bold text-inherit leading-none", className)}>⃃</span>
);

export function PayOrderDetailScreen({ tableNumber, onBack, onHome, onSettle }: PayOrderDetailScreenProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(10);

  const orderItems = [
    {
      id: '1',
      qty: '1x',
      name: 'Buffalo Margherita',
      price: '15.00',
      addons: [
        { name: 'Regular', price: '0.00' },
        { name: 'Cheese', price: '1.50' }
      ]
    },
    {
      id: '2',
      qty: '2x',
      name: 'Bruschetta Classica',
      price: '16.00',
      addons: [
        { name: 'Garlic', price: '0.50' },
        { name: 'Tomato Basil', price: '1.00' }
      ],
      moreCount: 5
    },
    {
      id: '3',
      qty: '2x',
      name: 'The Wagyu Signature',
      price: '16.00',
      addons: [
        { name: 'Med-Rare', price: '0.00' },
        { name: 'Truffle Sauce', price: '3.00' }
      ],
      moreCount: 5
    },
    {
      id: '4',
      qty: '1x',
      name: 'Calamari Fritti',
      price: '55.00',
      addons: [
        { name: 'Spicy Marinara', price: '0.00' }
      ]
    },
    {
      id: '5',
      qty: '1x',
      name: 'Branzino al Forno',
      price: '130.00',
      addons: [
        { name: 'Lemon Herb', price: '0.00' }
      ]
    },
    {
      id: '6',
      qty: '1x',
      name: 'Tiramisu Classico',
      price: '48.00',
      addons: [
        { name: 'Cocoa dusting', price: '0.00' }
      ]
    }
  ];

  const displayedItems = isExpanded ? orderItems : orderItems.slice(0, 3);
  const billAmount = 75.08;
  const grandTotal = billAmount + (selectedTip || 0);

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      {/* Header */}
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
            <span className="text-[#94a3b8] text-[13px] font-bold mt-1">Table # {tableNumber || '1020'}</span>
          </div>
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-gray-100 active:scale-95 transition-all">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 pt-4 overflow-y-auto pb-52 space-y-4">
        
        {/* Order # Header Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
          <h2 className="text-[20px] font-black text-[#1a1c2e] mb-4">Order #2536</h2>
          
          <div className="w-full border-t border-gray-100 mb-6 border-dashed" />
          
          <div className="grid grid-cols-2 w-full relative">
            {/* Center Divider */}
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
              <span className="text-[15px] font-black text-[#1a1c2e]">Jul 1, 01:19 AM</span>
            </div>
          </div>
        </div>

        {/* Current Orders List */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-50 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <ReceiptText className="w-4 h-4 text-[#94a3b8]" />
            <span className="text-[11px] font-black text-[#94a3b8] uppercase">Current Orders</span>
          </div>

          {displayedItems.map((item) => (
            <div key={item.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0">
                    <span className="text-[#0066b2] text-[13px] font-black">{item.qty}</span>
                  </div>
                  <div className="flex flex-col gap-2.5 flex-1">
                    <div className="flex justify-between items-center pr-1">
                      <h3 className="text-[15px] font-black text-[#1a1c2e]">{item.name}</h3>
                      <div className="flex items-center gap-1.5 text-[#1a1c2e] font-black text-[16px]">
                        <CurrencySymbol className="text-[14px]" />
                        <span>{item.price}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {item.addons.map((addon, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-[#94a3b8] text-[12px] font-bold shrink-0">+</span>
                          <span className="bg-[#f1f5f9] text-[#475569] px-2.5 py-0.5 rounded-lg text-[11px] font-black">{addon.name}</span>
                          <div className="flex-1 border-b border-dotted border-gray-200 mt-1" />
                          <div className="flex items-center gap-1 text-[#94a3b8] text-[12px] font-bold">
                            <CurrencySymbol className="text-[10px]" />
                            <span>{addon.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {item.moreCount && (
                      <div>
                        <span className="bg-[#fffbeb] text-[#f59e0b] px-2.5 py-1 rounded-lg text-[11px] font-black">
                          +{item.moreCount} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 bg-[#f0f7ff] h-12 rounded-full text-[#0066b2] text-[14px] font-black active:scale-95 transition-all shadow-sm"
            >
              {isExpanded ? 'See Less' : 'See More'}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Totals Breakdown Card */}
        <div className="bg-[#f0f7ff] rounded-[24px] p-0 border-[2px] border-[#0066b2] overflow-hidden shadow-sm">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-black text-[#0066b2] uppercase">SUBTOTAL</span>
              <div className="flex items-center gap-1 text-[#0066b2] font-black text-[22px]">
                <CurrencySymbol className="text-[20px]" />
                <span>65.00</span>
              </div>
            </div>
            
            <div className="w-full border-t border-dotted border-[#0066b2]/20" />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[13px] font-black text-[#94a3b8]">
                <span className="uppercase tracking-tight">Extra Charges (10%)</span>
                <div className="flex items-center gap-1">
                  <CurrencySymbol className="text-[11px]" />
                  <span>3.58</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[13px] font-black text-[#94a3b8]">
                <span className="uppercase tracking-tight">VAT (5%)</span>
                <div className="flex items-center gap-1">
                  <CurrencySymbol className="text-[11px]" />
                  <span>3.58</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 flex items-end justify-between border-t border-[#0066b2]/10">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black text-[#94a3b8] uppercase leading-none tracking-tight">Total Balance Due</span>
              <span className="text-[11px] font-black text-[#0066b2] uppercase leading-none tracking-tight">Order # 2536</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#0066b2] font-black text-[38px] leading-none">
              <CurrencySymbol className="text-[34px]" />
              <span>{billAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Fixed Actions */}
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
            variant="outline"
            className="h-[60px] bg-[#0f172a] border-none hover:bg-black text-white rounded-[18px] text-[16px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Split className="w-5 h-5 text-white" />
            Split Bill
          </Button>
        </div>
        
        <button 
          className="w-full h-[60px] bg-white border-[1.5px] border-gray-200 text-[#1a1c2e] rounded-[18px] text-[15px] font-black uppercase active:bg-gray-50 transition-colors shadow-sm"
        >
          Custom Payment
        </button>
      </div>

      {/* Check Settlement Bottom Sheet */}
      <Sheet open={isSettlementOpen} onOpenChange={setIsSettlementOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-hidden max-h-[92vh] flex flex-col">
          <SheetHeader className="sr-only">
            <SheetTitle>Check Settlement</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pb-10">
            {/* Header */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="px-6 flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#0066b2]" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[17px] font-black text-[#1a1c2e] leading-none">CHECK SETTLEMENT</h2>
                  <span className="text-[11px] font-bold text-[#94a3b8] uppercase mt-1.5">Final Review</span>
                </div>
              </div>
              <button 
                onClick={() => setIsSettlementOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full border-t border-gray-50 mb-8" />

            <div className="px-6 space-y-6">
              {/* Waiter & Bill Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#f8fafc] rounded-full flex items-center justify-center mb-2 border border-gray-50">
                    <User className="w-5 h-5 text-[#94a3b8]" />
                  </div>
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-1">Waiter ID:</span>
                  <span className="text-[15px] font-black text-[#1a1c2e]">#123456</span>
                </div>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-2">Bill Amount</span>
                  <div className="flex items-baseline gap-1 text-[#0066b2] font-black">
                    <span className="text-[13px]">AED</span>
                    <span className="text-[20px]">{billAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="space-y-4">
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-wide">Add tips for your waiter</span>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 20].map((amount) => (
                    <button 
                      key={amount}
                      onClick={() => setSelectedTip(amount)}
                      className={cn(
                        "relative h-[90px] rounded-[24px] flex flex-col items-center justify-center transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50",
                        selectedTip === amount ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white"
                      )}
                    >
                      <span className="text-[10px] font-black text-[#94a3b8] uppercase">AED</span>
                      <span className="text-[22px] font-black text-[#1a1c2e]">{amount}</span>
                      {selectedTip === amount && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-white">
                          <X className="w-3 h-3 text-white stroke-[4px]" />
                        </div>
                      )}
                    </button>
                  ))}
                  <button className="h-[90px] bg-white rounded-[24px] flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50">
                    <Pencil className="w-5 h-5 text-[#94a3b8] mb-1" />
                    <span className="text-[10px] font-black text-[#94a3b8] uppercase">Custom</span>
                  </button>
                </div>
              </div>

              {/* Bill Summary Card */}
              <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-50 space-y-4">
                <div className="flex justify-between items-center text-[15px] font-black">
                  <span className="text-[#94a3b8] uppercase">Bill Amount</span>
                  <div className="flex items-center gap-1.5 text-[#1a1c2e]">
                    <span className="text-[12px]">AED</span>
                    <span>{billAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[15px] font-black">
                  <span className="text-[#94a3b8] uppercase">Tips</span>
                  <div className="flex items-center gap-1.5 text-[#26ab5f]">
                    <span>+</span>
                    <span className="text-[12px]">AED</span>
                    <span>{(selectedTip || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-full border-t border-dashed border-gray-100 py-1" />
                <div className="flex justify-between items-center">
                  <span className="text-[13px] font-black text-[#94a3b8] uppercase">Grand Total</span>
                  <div className="flex items-center gap-2 text-[#0066b2] font-black">
                    <CurrencySymbol className="text-[28px]" />
                    <span className="text-[34px]">{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 mt-10 space-y-4">
              <Button 
                onClick={() => {
                  setIsSettlementOpen(false);
                  onSettle();
                }}
                className="w-full h-[64px] bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,102,178,0.25)]"
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

            {/* Payment Logos Footer */}
            <div className="px-6 mt-8 flex justify-center gap-3">
              {[
                { name: 'JCB', color: 'text-[#004e9c]' },
                { name: 'G Pay', color: 'text-gray-600' },
                { name: 'AMEX', color: 'text-[#006fcf]' },
                { name: ' Pay', color: 'text-black' },
                { name: 'VISA', color: 'text-[#1a1f71]' }
              ].map((logo) => (
                <div key={logo.name} className="px-3 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <span className={cn("text-[10px] font-black uppercase tracking-tight", logo.color)}>{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
