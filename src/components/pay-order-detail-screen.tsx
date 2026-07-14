'use client';

import React from 'react';
import { 
  ChevronLeft, 
  MoreVertical, 
  User, 
  Clock, 
  ReceiptText, 
  ChevronDown, 
  CreditCard, 
  Split,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PayOrderDetailScreenProps {
  tableNumber: string;
  onBack: () => void;
  onHome: () => void;
  onSettle: () => void;
}

// Custom Currency Icon to match design
const CurrencyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("fill-current", className)} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z" opacity=".2"/>
    <path d="M7 10h10v2H7zM7 14h10v2H7z"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none"/>
  </svg>
);

export function PayOrderDetailScreen({ tableNumber, onBack, onHome, onSettle }: PayOrderDetailScreenProps) {
  const orderItems = [
    {
      qty: 1,
      name: 'Buffalo Margherita',
      price: 15.00,
      modifiers: [
        { name: 'Regular', price: 0.00 },
        { name: 'Cheese', price: 1.50 }
      ]
    },
    {
      qty: 2,
      name: 'Bruschetta Classica',
      price: 16.00,
      hasMore: true,
      modifiers: [
        { name: 'Garlic', price: 0.50 },
        { name: 'Tomato Basil', price: 1.00 }
      ]
    },
    {
      qty: 2,
      name: 'The Wagyu Signature',
      price: 16.00,
      hasMore: true,
      modifiers: [
        { name: 'Med-Rare', price: 0.00 },
        { name: 'Truffle Sauce', price: 3.00 }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#f7f9fc] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      {/* Header */}
      <div className="bg-white px-6 h-20 flex items-center justify-between shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-b-[32px] z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-7 h-7 text-[#0066b2] stroke-[2.5px]" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-black leading-tight text-[#1a1c2e]">Pay Order</h1>
            <span className="text-[#94a3b8] text-[13px] font-bold">Table # {tableNumber}</span>
          </div>
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 pt-5 overflow-y-auto pb-48 space-y-5">
        
        {/* Order Info Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <h2 className="text-[22px] font-black text-[#1a1c2e] mb-5">Order #2536</h2>
          
          <div className="w-full border-t border-gray-100 mb-5" />
          
          <div className="grid grid-cols-2 w-full gap-4">
            <div className="flex flex-col items-center border-r border-gray-100">
              <div className="w-10 h-10 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-2">
                <User className="w-5 h-5 text-[#0066b2]" />
              </div>
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Staff</span>
              <span className="text-[15px] font-black text-[#1a1c2e]">232</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-[#0066b2]" />
              </div>
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest">Date & Time</span>
              <span className="text-[15px] font-black text-[#1a1c2e]">Jul 1, 01:19 AM</span>
            </div>
          </div>
        </div>

        {/* Current Orders Section */}
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ReceiptText className="w-4 h-4 text-[#94a3b8]" />
            <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-[0.15em]">Current Orders</span>
          </div>

          <div className="space-y-8">
            {orderItems.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-7 h-7 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#0066b2] text-[12px] font-black">{item.qty}x</span>
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <h3 className="text-[15px] font-black text-[#1a1c2e]">{item.name}</h3>
                      
                      {/* Modifiers */}
                      <div className="space-y-1.5 w-full">
                        {item.modifiers.map((mod, midx) => (
                          <div key={midx} className="flex items-center justify-between group">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#0066b2] text-[10px] font-bold">+</span>
                              <span className="bg-[#f0f7ff] text-[#0066b2] px-2.5 py-0.5 rounded-md text-[11px] font-black">
                                {mod.name}
                              </span>
                            </div>
                            <div className="flex-1 border-b border-dotted border-gray-200 mx-2 mb-1" />
                            <div className="flex items-center gap-0.5 text-[#94a3b8] text-[11px] font-bold">
                              <CurrencyIcon className="w-2.5 h-2.5" />
                              <span>{mod.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {item.hasMore && (
                        <div className="inline-flex mt-1">
                          <span className="bg-[#fffbeb] text-[#f59e0b] px-2.5 py-0.5 rounded-md text-[10px] font-black">
                            +5 more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#1a1c2e] font-black text-[18px] ml-4 shrink-0">
                    <CurrencyIcon className="w-4 h-4" />
                    <span>{item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-center">
            <button className="flex items-center gap-2 bg-[#f0f7ff] px-6 h-10 rounded-full text-[#0066b2] text-[13px] font-black active:scale-95 transition-all">
              See More
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Totals Card */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border-[1.5px] border-[#0066b2]/20 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-black text-[#0066b2] uppercase tracking-widest">Subtotal</span>
            <div className="flex items-center gap-1 text-[#0066b2] font-black text-[18px]">
              <CurrencyIcon className="w-4 h-4" />
              <span>65.00</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-black text-gray-400">
              <span className="uppercase tracking-widest">Extra Charges (10%)</span>
              <div className="flex items-center gap-0.5">
                <CurrencyIcon className="w-2.5 h-2.5" />
                <span>3.58</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] font-black text-gray-400">
              <span className="uppercase tracking-widest">Vat (5%)</span>
              <div className="flex items-center gap-0.5">
                <CurrencyIcon className="w-2.5 h-2.5" />
                <span>3.58</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-widest leading-none mb-1">Total Balance Due</span>
              <span className="text-[11px] font-black text-[#0066b2] uppercase tracking-widest">Order # 2536</span>
            </div>
            <div className="flex items-center gap-1 text-[#0066b2] font-black text-[34px] leading-none tracking-tighter">
              <CurrencyIcon className="w-8 h-8" />
              <span>75.08</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 inset-x-0 bg-white px-6 pt-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex flex-col gap-4 z-20 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={onSettle}
            className="h-14 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[16px] text-[15px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_6px_20px_rgba(0,102,178,0.2)]"
          >
            <CreditCard className="w-5 h-5 text-white" />
            Pay Full
          </Button>
          <Button 
            variant="outline"
            className="h-14 bg-[#111827] border-none hover:bg-black text-white rounded-[16px] text-[15px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Split className="w-5 h-5 text-white" />
            Split Bill
          </Button>
        </div>
        
        <button 
          className="w-full h-14 bg-white border border-gray-200 text-[#1a1c2e] rounded-[16px] text-[13px] font-black uppercase tracking-[0.2em] active:bg-gray-50 transition-colors shadow-sm"
        >
          Custom Payment
        </button>
      </div>
    </div>
  );
}
