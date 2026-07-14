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
  Split
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PayOrderDetailScreenProps {
  tableNumber: string;
  onBack: () => void;
  onHome: () => void;
  onSettle: () => void;
}

// Refined Currency Icon to match the stylized symbol in the design
const CurrencyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("fill-current", className)} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity=".1"/>
    <path d="M7 10h10v2H7zM7 14h10v2H7z" fill="currentColor"/>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" fill="none"/>
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
            <h1 className="text-[20px] font-bold leading-tight text-[#1a1c2e]">Pay Order</h1>
            <span className="text-[#94a3b8] text-[13px] font-medium">Table # {tableNumber}</span>
          </div>
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 pt-5 overflow-y-auto pb-52 space-y-5">
        
        {/* Order Info Card */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 flex flex-col items-center">
          <h2 className="text-[24px] font-bold text-[#1a1c2e] mb-6">Order #2536</h2>
          
          <div className="w-full border-t border-gray-100 mb-6 border-dashed" />
          
          <div className="grid grid-cols-2 w-full gap-0">
            <div className="flex flex-col items-center border-r border-gray-100 py-2">
              <div className="w-11 h-11 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-3">
                <User className="w-5 h-5 text-[#0066b2]" />
              </div>
              <span className="text-[10px] font-bold text-[#94a3b8] uppercase mb-1">Staff</span>
              <span className="text-[16px] font-bold text-[#1a1c2e]">232</span>
            </div>
            
            <div className="flex flex-col items-center py-2">
              <div className="w-11 h-11 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-[#0066b2]" />
              </div>
              <span className="text-[10px] font-bold text-[#94a3b8] uppercase mb-1">Date & Time</span>
              <span className="text-[16px] font-bold text-[#1a1c2e]">Jul 1, 01:19 AM</span>
            </div>
          </div>
        </div>

        {/* Current Orders Section */}
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100 space-y-5">
          <div className="flex items-center gap-2 px-1">
            <ReceiptText className="w-4 h-4 text-[#94a3b8]" />
            <span className="text-[11px] font-bold text-[#94a3b8] uppercase">Current Orders</span>
          </div>

          <div className="space-y-8 px-1">
            {orderItems.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <span className="text-[#0066b2] text-[13px] font-bold">{item.qty}x</span>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      <h3 className="text-[16px] font-bold text-[#1a1c2e] leading-tight">{item.name}</h3>
                      
                      {/* Modifiers */}
                      <div className="space-y-2.5 w-full">
                        {item.modifiers.map((mod, midx) => (
                          <div key={midx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-[#0066b2] text-[12px] font-bold">+</span>
                              <span className="bg-[#f0f7ff] text-[#0066b2] px-3 py-1 rounded-lg text-[11px] font-bold">
                                {mod.name}
                              </span>
                            </div>
                            <div className="flex-1 border-b border-dotted border-gray-200 mx-3 mb-1.5" />
                            <div className="flex items-center gap-0.5 text-[#94a3b8] text-[12px] font-bold">
                              <CurrencyIcon className="w-3 h-3" />
                              <span>{mod.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {item.hasMore && (
                        <div className="inline-flex">
                          <span className="bg-[#fffbeb] text-[#f59e0b] px-3 py-1 rounded-lg text-[11px] font-bold shadow-sm">
                            +5 more
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#1a1c2e] font-bold text-[19px] ml-4 shrink-0">
                    <CurrencyIcon className="w-4 h-4" />
                    <span>{item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <button className="flex items-center gap-2 bg-[#f0f7ff] px-8 h-12 rounded-full text-[#0066b2] text-[14px] font-bold active:scale-95 transition-all shadow-sm">
              See More
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Totals Card */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm border-[2px] border-[#0066b2] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#0066b2] uppercase">Subtotal</span>
            <div className="flex items-center gap-1 text-[#0066b2] font-bold text-[20px]">
              <CurrencyIcon className="w-4.5 h-4.5" />
              <span>65.00</span>
            </div>
          </div>
          
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-[12px] font-bold text-[#94a3b8]">
              <span className="uppercase">Extra Charges (10%)</span>
              <div className="flex items-center gap-0.5">
                <CurrencyIcon className="w-3 h-3" />
                <span>3.58</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[12px] font-bold text-[#94a3b8]">
              <span className="uppercase">Vat (5%)</span>
              <div className="flex items-center gap-0.5">
                <CurrencyIcon className="w-3 h-3" />
                <span>3.58</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-gray-100 flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-[#94a3b8] uppercase leading-none mb-1.5">Total Balance Due</span>
              <span className="text-[12px] font-bold text-[#0066b2] uppercase">Order # 2536</span>
            </div>
            <div className="flex items-center gap-1 text-[#0066b2] font-bold text-[36px] leading-none">
              <CurrencyIcon className="w-9 h-9" />
              <span>75.08</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 inset-x-0 bg-white px-6 pt-5 pb-8 shadow-[0_-12px_40px_rgba(0,0,0,0.04)] flex flex-col gap-4 z-20 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={onSettle}
            className="h-15 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[18px] text-[16px] font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_20px_rgba(0,102,178,0.25)]"
          >
            <CreditCard className="w-5 h-5 text-white" />
            Pay Full
          </Button>
          <Button 
            variant="outline"
            className="h-15 bg-[#0f172a] border-none hover:bg-black text-white rounded-[18px] text-[16px] font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Split className="w-5 h-5 text-white" />
            Split Bill
          </Button>
        </div>
        
        <button 
          className="w-full h-15 bg-white border-2 border-gray-100 text-[#1a1c2e] rounded-[18px] text-[14px] font-bold uppercase active:bg-gray-50 transition-colors shadow-sm"
        >
          Custom Payment
        </button>
      </div>
    </div>
  );
}
