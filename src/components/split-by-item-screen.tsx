'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Check, Plus } from 'lucide-react';
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
  moreCount?: number;
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

  const items: SplitItem[] = [
    {
      id: '1',
      name: 'Crispy Calamari',
      qty: 1,
      basePrice: 13.00,
      addons: [{ name: 'Spicy Mayo', price: 1.50 }]
    },
    {
      id: '2',
      name: 'Seared Scallops',
      qty: 2,
      basePrice: 24.00,
      addons: [{ name: 'Garlic Butter', price: 4.00 }] // Logical: (24*2) + (4*2) = 56
    },
    {
      id: '3',
      name: 'House Chardonnay',
      qty: 1,
      basePrice: 24.00,
      addons: []
    },
    {
      id: '4',
      name: 'Truffle Fries',
      qty: 1,
      basePrice: 9.00,
      addons: [{ name: 'Parmesan', price: 3.00 }]
    },
    {
      id: '5',
      name: 'Wagyu Beef Burger',
      qty: 1,
      basePrice: 9.00,
      addons: [{ name: 'Extra Bacon', price: 3.00 }],
      moreCount: 2
    },
    {
      id: '6',
      name: 'Lemon Tart',
      qty: 2,
      basePrice: 4.50,
      addons: [{ name: 'Vanilla Scoop', price: 1.50 }],
      moreCount: 2
    }
  ];

  const totalBill = 172.46;
  const itemCount = 7;

  const yourShare = useMemo(() => {
    return items
      .filter(item => selectedItemIds.includes(item.id))
      .reduce((sum, item) => {
        const itemTotal = (item.basePrice + item.addons.reduce((a, b) => a + b.price, 0)) * item.qty;
        return sum + itemTotal;
      }, 0);
  }, [selectedItemIds]);

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const progressPercent = (yourShare / totalBill) * 100;

  return (
    <div className="flex flex-col h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative tracking-normal">
      {/* Header */}
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
      <div className="flex-1 px-4 pt-6 overflow-y-auto pb-32 space-y-6">
        
        {/* Info Text */}
        <div className="text-center px-6">
          <p className="text-[#94a3b8] text-[15px] font-bold leading-relaxed">
            The total bill is <CurrencySymbol />{totalBill.toFixed(2)} for <span className="text-[#0066b2] font-black">{itemCount} items</span>.<br />
            Select items to pay.
          </p>
        </div>

        {/* Radial Progress */}
        <div className="flex justify-center py-4">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="absolute w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="70"
                fill="none"
                stroke="#eef2f8"
                strokeWidth="12"
              />
              <circle
                cx="96"
                cy="96"
                r="70"
                fill="none"
                stroke="#0066b2"
                strokeWidth="12"
                strokeDasharray="439.8"
                strokeDashoffset={439.8 - (439.8 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
              <span className="text-[9px] font-black text-[#94a3b8] uppercase tracking-[0.1em] mb-1">Your Share</span>
              <div className="flex items-center gap-1.5 text-[#1a1c2e] font-black text-[32px] leading-none">
                <CurrencySymbol className="text-[28px]" />
                <span>{yourShare.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className="space-y-4 pb-8">
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            const itemPrice = (item.basePrice + item.addons.reduce((a, b) => a + b.price, 0)) * item.qty;

            return (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "bg-white rounded-[24px] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border transition-all active:scale-[0.98] cursor-pointer",
                  isSelected ? "border-[#0066b2] shadow-[0_8px_30px_rgba(0,102,178,0.06)]" : "border-gray-50"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Custom Checkbox */}
                  <div className={cn(
                    "w-7 h-7 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-all mt-1",
                    isSelected ? "bg-[#0066b2] border-[#0066b2]" : "border-gray-200"
                  )}>
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[4px]" />}
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[17px] font-black text-[#1a1c2e] leading-tight pr-2">{item.name}</h3>
                      <div className="flex items-center gap-1 text-[#1a1c2e] font-black text-[17px] shrink-0">
                        <CurrencySymbol className="text-[15px]" />
                        <span>{itemPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[#94a3b8] text-[13px] font-bold">
                      <span className="text-[#1a1c2e] font-black">x{item.qty}</span>
                      <div className="flex items-center gap-1.5">
                        <span>Base:</span>
                        <div className="flex items-center gap-0.5">
                          <CurrencySymbol className="text-[11px]" />
                          <span>{item.basePrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {item.addons.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {item.addons.map((addon, idx) => (
                          <div key={idx} className="bg-[#f0f7ff] border border-[#d1e9ff] rounded-xl px-3 py-1.5 flex items-center gap-2">
                            <span className="text-[#0066b2] text-[11px] font-black tracking-tight">{addon.name}</span>
                            <div className="flex items-center gap-1 text-[#0066b2] text-[10px] font-black">
                              <span>+</span>
                              <CurrencySymbol className="text-[9px]" />
                              <span>{addon.price.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {item.moreCount && (
                      <div className="pt-1">
                        <span className="bg-[#fffbeb] text-[#f59e0b] px-3 py-1.5 rounded-xl text-[11px] font-black">
                          +{item.moreCount} More
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Button */}
      <div className="absolute bottom-0 inset-x-0 bg-white px-5 pt-4 pb-8 shadow-[0_-15px_45px_rgba(0,0,0,0.06)] z-30 flex justify-center">
        <Button 
          onClick={onPay}
          disabled={yourShare === 0}
          className={cn(
            "w-full h-[64px] rounded-[20px] text-[17px] font-black shadow-[0_10px_30px_rgba(0,102,178,0.25)] transition-all active:scale-[0.98]",
            yourShare > 0 ? "bg-[#0066b2] hover:bg-[#005596] text-white" : "bg-gray-100 text-gray-400 shadow-none pointer-events-none"
          )}
        >
          Pay Your Items (<CurrencySymbol />{yourShare.toFixed(2)})
        </Button>
      </div>
    </div>
  );
}
