'use client';

import React from 'react';
import { ChevronLeft, Home, Printer, CreditCard, ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface PayOrderDetailScreenProps {
  tableNumber: string;
  onBack: () => void;
  onHome: () => void;
  onSettle: () => void;
}

export function PayOrderDetailScreen({ tableNumber, onBack, onHome, onSettle }: PayOrderDetailScreenProps) {
  const billItems = [
    { name: 'Burrata con Pomodorini', qty: 1, price: 65.00 },
    { name: 'Calamari Fritti', qty: 2, price: 110.00 },
    { name: 'Margherita Pizza', qty: 1, price: 75.00 },
    { name: 'Tiramisu Classico', qty: 3, price: 144.00 },
  ];

  const subtotal = billItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.05;
  const serviceCharge = subtotal * 0.07;
  const total = subtotal + tax + serviceCharge;

  return (
    <div className="flex flex-col h-screen bg-[#fcfdff] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      {/* Header */}
      <div className="bg-white px-6 h-20 flex items-center justify-between shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-b-[32px] z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-7 h-7 text-[#0066b2] stroke-[2.5px]" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[20px] font-black leading-tight text-[#1a1c2e]">Order Detail</h1>
            <span className="text-[#94a3b8] text-[13px] font-bold">Table # {tableNumber}</span>
          </div>
        </div>
        
        <button 
          onClick={onHome}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-[#eef2f8] bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
        >
          <Home className="w-5 h-5 text-[#0066b2] stroke-[2.5px]" />
        </button>
      </div>

      {/* Bill Content */}
      <div className="flex-1 px-6 pt-6 overflow-y-auto pb-44">
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#f0f4f8]">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#f0f7ff] rounded-lg flex items-center justify-center">
              <FileText className="w-4.5 h-4.5 text-[#0066b2]" />
            </div>
            <h3 className="text-lg font-black text-[#1a1c2e]">Bill Summary</h3>
          </div>

          <div className="space-y-4 mb-8">
            {billItems.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <span className="text-[#0066b2] font-black text-sm w-6">x{item.qty}</span>
                  <span className="text-[#1a1c2e] font-bold text-sm leading-tight">{item.name}</span>
                </div>
                <span className="text-[#1a1c2e] font-black text-sm tabular-nums shrink-0">
                  AED {item.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full border-t border-dashed border-[#eef2f8] my-6" />

          <div className="space-y-3">
            <div className="flex items-center justify-between text-[13px] font-bold text-[#94a3b8]">
              <span>Subtotal</span>
              <span className="text-[#1a1c2e]">AED {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-bold text-[#94a3b8]">
              <span>VAT (5%)</span>
              <span className="text-[#1a1c2e]">AED {tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[13px] font-bold text-[#94a3b8]">
              <span>Service Charge (7%)</span>
              <span className="text-[#1a1c2e]">AED {serviceCharge.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t-[3px] border-[#f8fafc] flex items-center justify-between">
            <span className="text-[#1a1c2e] text-[20px] font-black">Total Due</span>
            <span className="text-[#0066b2] text-[24px] font-black tabular-nums">AED {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 inset-x-0 bg-white px-6 pt-4 pb-8 border-t border-[#f0f4f8] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex flex-col gap-3 z-30">
        <Button 
          variant="outline"
          className="w-full h-14 rounded-[20px] border-[#eef2f8] text-[#1a1c2e] text-[16px] font-black flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Printer className="w-5 h-5 text-[#94a3b8]" />
          Print Bill
        </Button>
        <Button 
          onClick={onSettle}
          className="w-full h-16 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[16px] font-black shadow-[0_8px_30px_rgba(0,102,178,0.25)] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <CreditCard className="w-5 h-5 text-white fill-current" />
          Settle Payment
          <ChevronRight className="w-5 h-5 ml-1 stroke-[3px]" />
        </Button>
      </div>
    </div>
  );
}
