'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Check, Plus, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SplitItemAddon {
  name: string;
  price: number;
}

interface SplitItem {
  id: string;
  name: string;
  qty: number;
  basePrice: number;
  addons: SplitItemAddon[];
}

interface SplitByItemScreenProps {
  onBack: () => void;
  onPay: () => void;
}

const CurrencySymbol = ({ className }: { className?: string }) => (
  <span className={cn("font-bold text-inherit leading-none tracking-normal", className)}>⃃</span>
);

export function SplitByItemScreen({ onBack, onPay }: SplitByItemScreenProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Logical items matching the Pay Order Detail screen for presentation consistency
  const items: SplitItem[] = [
    {
      id: '1',
      name: 'Buffalo Margherita',
      qty: 1,
      basePrice: 15.00,
      addons: [{ name: 'Cheese', price: 1.50 }]
    },
    {
      id: '2',
      name: 'Bruschetta Classica',
      qty: 2,
      basePrice: 16.00,
      addons: [{ name: 'Garlic', price: 0.50 }, { name: 'Tomato Basil', price: 1.00 }]
    },
    {
      id: '3',
      name: 'The Wagyu Signature',
      qty: 2,
      basePrice: 16.00,
      addons: [{ name: 'Truffle Sauce', price: 3.00 }]
    },
    {
      id: '4',
      name: 'Calamari Fritti',
      qty: 1,
      basePrice: 55.00,
      addons: []
    },
    {
      id: '5',
      name: 'Branzino al Forno',
      qty: 1,
      basePrice: 130.00,
      addons: [{ name: 'Lemon Herb', price: 0.00 }]
    },
    {
      id: '6',
      name: 'Tiramisu Classico',
      qty: 1,
      basePrice: 48.00,
      addons: []
    }
  ];

  // Logic: Calculate total based on items
  const totalBill = useMemo(() => {
    return items.reduce((sum, item) => {
      const addonPrice = item.addons.reduce((a, b) => a + b.price, 0);
      return sum + (item.basePrice + addonPrice) * item.qty;
    }, 0);
  }, [items]);

  const itemCount = items.reduce((s, i) => s + i.qty, 0);

  const yourShare = useMemo(() => {
    return items
      .filter(item => selectedItemIds.includes(item.id))
      .reduce((sum, item) => {
        const itemTotal = (item.basePrice + item.addons.reduce((a, b) => a + b.price, 0)) * item.qty;
        return sum + itemTotal;
      }, 0);
  }, [selectedItemIds, items]);

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const progressPercent = (yourShare / totalBill) * 100;
  
  // Larger circle parameters: w-52 (208px)
  const circleSize = 208;
  const center = circleSize / 2;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative tracking-normal">
      {/* Header - Compact */}
      <div className="bg-white px-5 h-16 flex items-center shrink-0 z-20 shadow-sm border-b border-gray-50 rounded-b-[24px]">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-gray-100 active:scale-95 transition-all mr-4"
        >
          <ChevronLeft className="w-6 h-6 text-[#1a1c2e] stroke-[3px]" />
        </button>
        <h1 className="text-[17px] font-black leading-none text-[#1a1c2e] uppercase">Split By Item</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-4 overflow-y-auto pb-32 space-y-4">
        
        {/* Info Text - Tighter */}
        <div className="text-center px-4">
          <p className="text-[#94a3b8] text-[14px] font-bold leading-tight">
            Total bill is <CurrencySymbol />{totalBill.toFixed(2)} for <span className="text-[#0066b2] font-black">{itemCount} items</span>.<br />
            Select items to include in your share.
          </p>
        </div>

        {/* Radial Progress - Enlarged for better spacing */}
        <div className="flex justify-center py-4">
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute w-full h-full -rotate-90" viewBox={`0 0 ${circleSize} ${circleSize}`}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#eef2f8"
                strokeWidth="12"
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#0066b2"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center justify-center z-10 px-4 text-center">
              <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.15em] mb-2">Your Share</span>
              <div className="flex items-center gap-1.5 text-[#1a1c2e] font-black text-[32px] leading-none">
                <CurrencySymbol className="text-[28px]" />
                <span>{yourShare.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Item List - Tighter Gaps */}
        <div className="space-y-3 pb-8">
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            const itemPrice = (item.basePrice + item.addons.reduce((a, b) => a + b.price, 0)) * item.qty;

            return (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "bg-white rounded-[20px] p-4 shadow-[0_4px_15px_rgba(0,0,0,0.02)] border transition-all active:scale-[0.98] cursor-pointer",
                  isSelected ? "border-[#0066b2] shadow-[0_8px_25px_rgba(0,102,178,0.06)]" : "border-gray-50"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Custom Checkbox */}
                  <div className={cn(
                    "w-6 h-6 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-all mt-0.5",
                    isSelected ? "bg-[#0066b2] border-[#0066b2]" : "border-gray-200"
                  )}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4.5px]" />}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[15px] font-black text-[#1a1c2e] leading-tight pr-2">{item.name}</h3>
                      <div className="flex items-center gap-1 text-[#1a1c2e] font-black text-[16px] shrink-0">
                        <CurrencySymbol className="text-[14px]" />
                        <span>{itemPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[#94a3b8] text-[12px] font-bold">
                      <div className="bg-[#f0f7ff] text-[#0066b2] px-2 py-0.5 rounded-md font-black text-[11px]">x{item.qty}</div>
                      <div className="flex items-center gap-1 opacity-70">
                        <span>Base:</span>
                        <div className="flex items-center gap-0.5">
                          <CurrencySymbol className="text-[10px]" />
                          <span>{item.basePrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {item.addons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {item.addons.map((addon, idx) => (
                          <div key={idx} className="bg-[#f8fafc] border border-gray-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                            <span className="text-[#475569] text-[10px] font-black uppercase tracking-tighter">{addon.name}</span>
                            {addon.price > 0 && (
                              <div className="flex items-center gap-0.5 text-[#0066b2] text-[10px] font-black">
                                <span>+</span>
                                <CurrencySymbol className="text-[9px]" />
                                <span>{addon.price.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Button - Prominent & Professional */}
      <div className="absolute bottom-0 inset-x-0 bg-white px-5 pt-3 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] z-30 flex justify-center border-t border-gray-50">
        <Button 
          onClick={onPay}
          disabled={yourShare === 0}
          className={cn(
            "w-full h-14 rounded-[18px] text-[16px] font-black shadow-[0_8px_25px_rgba(0,102,178,0.2)] transition-all active:scale-[0.98]",
            yourShare > 0 ? "bg-[#0066b2] hover:bg-[#005596] text-white" : "bg-gray-100 text-gray-400 shadow-none pointer-events-none"
          )}
        >
          Pay Your Items (<CurrencySymbol />{yourShare.toFixed(2)})
        </Button>
      </div>
    </div>
  );
}
