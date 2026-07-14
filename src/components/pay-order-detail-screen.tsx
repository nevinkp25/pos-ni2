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

// Custom currency component using the requested Dirham symbol
const CurrencySymbol = ({ className }: { className?: string }) => (
  <span className={cn("font-bold text-inherit", className)}>⃃</span>
);

export function PayOrderDetailScreen({ tableNumber, onBack, onHome, onSettle }: PayOrderDetailScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-[#f7f9fc] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      {/* Header */}
      <div className="bg-white px-6 h-20 flex items-center justify-between shrink-0 z-10 border-b border-gray-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-7 h-7 text-[#0066b2] stroke-[3px]" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[22px] font-bold leading-none text-[#1a1c2e]">Pay Order</h1>
            <span className="text-[#94a3b8] text-[14px] font-bold mt-1">Table # {tableNumber || '1020'}</span>
          </div>
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-5 pt-3 overflow-y-auto pb-48 space-y-4">
        
        {/* Order # Header Card */}
        <div className="bg-white rounded-[32px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center">
          <h2 className="text-[26px] font-black text-[#1a1c2e] mb-6">Order #2536</h2>
          
          <div className="w-full border-t border-gray-100 mb-8 border-dashed" />
          
          <div className="grid grid-cols-2 w-full">
            <div className="flex flex-col items-center border-r border-gray-100">
              <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-[#0066b2]" />
              </div>
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase mb-1.5">Staff</span>
              <span className="text-[17px] font-black text-[#1a1c2e]">232</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-[#f0f7ff] rounded-full flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-[#0066b2]" />
              </div>
              <span className="text-[11px] font-bold text-[#94a3b8] uppercase mb-1.5">Date & Time</span>
              <span className="text-[17px] font-black text-[#1a1c2e]">Jul 1, 01:19 AM</span>
            </div>
          </div>
        </div>

        {/* Current Orders List */}
        <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <ReceiptText className="w-4 h-4 text-[#94a3b8]" />
            <span className="text-[12px] font-bold text-[#94a3b8] uppercase">Current Orders</span>
          </div>

          {/* Item 1 */}
          <div className="space-y-4 pb-6 border-b border-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="w-9 h-9 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[#0066b2] text-[14px] font-black">1x</span>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="text-[17px] font-black text-[#1a1c2e] leading-tight">Buffalo Margherita</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[#0066b2] font-black text-sm">+</span>
                        <span className="bg-[#f0f7ff] text-[#0066b2] px-3 py-1 rounded-lg text-[12px] font-bold">Regular</span>
                        <div className="flex-1 border-b border-dotted border-gray-200 min-w-[60px]" />
                      </div>
                      <div className="flex items-center gap-1 text-[#94a3b8] text-[13px] font-bold">
                        <CurrencySymbol className="w-3.5 h-3.5" />
                        <span>0.00</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[#0066b2] font-black text-sm">+</span>
                        <span className="bg-[#f0f7ff] text-[#0066b2] px-3 py-1 rounded-lg text-[12px] font-bold">Cheese</span>
                        <div className="flex-1 border-b border-dotted border-gray-200 min-w-[60px]" />
                      </div>
                      <div className="flex items-center gap-1 text-[#94a3b8] text-[13px] font-bold">
                        <CurrencySymbol className="w-3.5 h-3.5" />
                        <span>1.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#1a1c2e] font-black text-[22px] ml-4">
                <CurrencySymbol className="w-5 h-5" />
                <span>15.00</span>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="space-y-4 pb-6 border-b border-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="w-9 h-9 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[#0066b2] text-[14px] font-black">2x</span>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="text-[17px] font-black text-[#1a1c2e] leading-tight">Bruschetta Classica</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[#0066b2] font-black text-sm">+</span>
                        <span className="bg-[#f0f7ff] text-[#0066b2] px-3 py-1 rounded-lg text-[12px] font-bold">Garlic</span>
                        <div className="flex-1 border-b border-dotted border-gray-200 min-w-[60px]" />
                      </div>
                      <div className="flex items-center gap-1 text-[#94a3b8] text-[13px] font-bold">
                        <CurrencySymbol className="w-3.5 h-3.5" />
                        <span>0.50</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[#0066b2] font-black text-sm">+</span>
                        <span className="bg-[#f0f7ff] text-[#0066b2] px-3 py-1 rounded-lg text-[12px] font-bold">Tomato Basil</span>
                        <div className="flex-1 border-b border-dotted border-gray-200 min-w-[60px]" />
                      </div>
                      <div className="flex items-center gap-1 text-[#94a3b8] text-[13px] font-bold">
                        <CurrencySymbol className="w-3.5 h-3.5" />
                        <span>1.00</span>
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex">
                    <span className="bg-[#fffbeb] text-[#f59e0b] px-3 py-1.5 rounded-lg text-[12px] font-black shadow-sm">
                      +5 more
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#1a1c2e] font-black text-[22px] ml-4">
                <CurrencySymbol className="w-5 h-5" />
                <span>16.00</span>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="space-y-4 pb-6 border-b border-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="w-9 h-9 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[#0066b2] text-[14px] font-black">2x</span>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                  <h3 className="text-[17px] font-black text-[#1a1c2e] leading-tight">The Wagyu Signature</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[#0066b2] font-black text-sm">+</span>
                        <span className="bg-[#f0f7ff] text-[#0066b2] px-3 py-1 rounded-lg text-[12px] font-bold">Med-Rare</span>
                        <div className="flex-1 border-b border-dotted border-gray-200 min-w-[60px]" />
                      </div>
                      <div className="flex items-center gap-1 text-[#94a3b8] text-[13px] font-bold">
                        <CurrencySymbol className="w-3.5 h-3.5" />
                        <span>0.00</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[#0066b2] font-black text-sm">+</span>
                        <span className="bg-[#f0f7ff] text-[#0066b2] px-3 py-1 rounded-lg text-[12px] font-bold">Truffle Sauce</span>
                        <div className="flex-1 border-b border-dotted border-gray-200 min-w-[60px]" />
                      </div>
                      <div className="flex items-center gap-1 text-[#94a3b8] text-[13px] font-bold">
                        <CurrencySymbol className="w-3.5 h-3.5" />
                        <span>3.00</span>
                      </div>
                    </div>
                  </div>
                  <div className="inline-flex">
                    <span className="bg-[#fffbeb] text-[#f59e0b] px-3 py-1.5 rounded-lg text-[12px] font-black shadow-sm">
                      +5 more
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#1a1c2e] font-black text-[22px] ml-4">
                <CurrencySymbol className="w-5 h-5" />
                <span>16.00</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button className="flex items-center gap-2 bg-[#f0f7ff] px-10 h-14 rounded-full text-[#0066b2] text-[15px] font-black active:scale-95 transition-all shadow-sm">
              See More
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Totals Breakdown Card */}
        <div className="bg-[#f0f7ff] rounded-[32px] p-8 border-[2.5px] border-[#0066b2] space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-black text-[#0066b2] uppercase">SUBTOTAL</span>
            <div className="flex items-center gap-1 text-[#0066b2] font-black text-[24px]">
              <CurrencySymbol className="w-5 h-5" />
              <span>65.00</span>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-[13px] font-bold text-[#94a3b8]">
              <span className="uppercase">EXTRA CHARGES (10%)</span>
              <div className="flex items-center gap-1">
                <CurrencySymbol className="w-3.5 h-3.5" />
                <span>3.58</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[13px] font-bold text-[#94a3b8]">
              <span className="uppercase">VAT (5%)</span>
              <div className="flex items-center gap-1">
                <CurrencySymbol className="w-3.5 h-3.5" />
                <span>3.58</span>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-2 border-t border-[#d1e9ff] flex items-end justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-bold text-[#94a3b8] uppercase leading-none">TOTAL BALANCE DUE</span>
              <span className="text-[13px] font-bold text-[#0066b2] uppercase leading-none">ORDER # 2536</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#0066b2] font-black text-[42px] leading-none">
              <CurrencySymbol className="w-10 h-10" />
              <span>75.08</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Fixed Actions */}
      <div className="absolute bottom-0 inset-x-0 bg-white px-6 pt-5 pb-10 shadow-[0_-15px_45px_rgba(0,0,0,0.06)] flex flex-col gap-5 z-20">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={onSettle}
            className="h-16 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_8px_25px_rgba(0,102,178,0.25)]"
          >
            <CreditCard className="w-6 h-6 text-white" />
            Pay Full
          </Button>
          <Button 
            variant="outline"
            className="h-16 bg-[#0f172a] border-none hover:bg-black text-white rounded-[20px] text-[17px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
          >
            <Split className="w-6 h-6 text-white" />
            Split Bill
          </Button>
        </div>
        
        <button 
          className="w-full h-16 bg-white border-[2.5px] border-gray-100 text-[#1a1c2e] rounded-[20px] text-[15px] font-black uppercase active:bg-gray-50 transition-colors shadow-sm"
        >
          CUSTOM PAYMENT
        </button>
      </div>
    </div>
  );
}
