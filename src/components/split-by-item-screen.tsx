'use client';

import React, { useState, useMemo } from 'react';
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
  onPay: () => void; // Final settlement callback
}

const CurrencySymbol = ({ className }: { className?: string }) => (
  <span className={cn("font-bold text-inherit leading-none tracking-normal", className)}>⃃</span>
);

export function SplitByItemScreen({ onBack, onPay }: SplitByItemScreenProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [paidItemIds, setPaidItemIds] = useState<string[]>([]);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isPartialSuccessOpen, setIsPartialSuccessOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | null>(10);
  const [isCustomTipMode, setIsCustomTipMode] = useState(false);
  const [customTipValue, setCustomTipValue] = useState('');

  // Initial logical items matching the order flow
  const initialItems: SplitItem[] = [
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

  // Filter out items that have already been paid in previous "loops"
  const items = useMemo(() => {
    return initialItems.filter(item => !paidItemIds.includes(item.id));
  }, [paidItemIds]);

  const totalBill = useMemo(() => {
    return items.reduce((sum, item) => {
      const addonPrice = item.addons.reduce((a, b) => a + b.price, 0);
      return sum + (item.basePrice + addonPrice) * item.qty;
    }, 0);
  }, [items]);

  const yourShare = useMemo(() => {
    return items
      .filter(item => selectedItemIds.includes(item.id))
      .reduce((sum, item) => {
        const itemTotal = (item.basePrice + item.addons.reduce((a, b) => a + b.price, 0)) * item.qty;
        return sum + itemTotal;
      }, 0);
  }, [selectedItemIds, items]);

  const currentTipAmount = isCustomTipMode 
    ? (parseFloat(customTipValue) || 0)
    : (selectedTip || 0);

  const grandTotal = yourShare + currentTipAmount;

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

    // Simulate Payment Processing for 3 seconds
    setTimeout(() => {
      setIsProcessing(false);
      
      const newPaidItems = [...paidItemIds, ...selectedItemIds];
      setPaidItemIds(newPaidItems);
      setSelectedItemIds([]);

      // Check if EVERYTHING is paid
      const allPaid = initialItems.every(item => newPaidItems.includes(item.id));
      
      if (allPaid) {
        onPay(); // Navigate to the final Settled Screen
      } else {
        setIsPartialSuccessOpen(true); // Show the "Payment In Progress" loop sheet
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

  const progressPercent = totalBill > 0 ? (yourShare / totalBill) * 100 : 0;
  
  // Larger circular chart for 4 digit amounts
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
      <div className="flex-1 px-4 pt-2 overflow-y-auto pb-32 space-y-4">
        
        <div className="text-center px-4 mt-2">
          <p className="text-[#94a3b8] text-[14px] font-bold leading-tight">
            Remaining balance is <CurrencySymbol />{totalBill.toFixed(2)}.<br />
            Select items to include in your share.
          </p>
        </div>

        {/* Enlarged Radial Progress */}
        <div className="flex justify-center py-2">
          <div className="relative flex items-center justify-center" style={{ width: circleSize, height: circleSize }}>
            <svg className="absolute w-full h-full -rotate-90" viewBox={`0 0 ${circleSize} ${circleSize}`}>
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#eef2f8" strokeWidth="14" />
              <circle
                cx={center} cy={center} r={radius} fill="none" stroke="#0066b2" strokeWidth="14"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="flex flex-col items-center justify-center z-10 px-6 text-center">
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.15em] mb-2">Your Share</span>
              <div className="flex items-center gap-2 text-[#1a1c2e] font-black text-[38px] leading-none">
                <CurrencySymbol className="text-[34px]" />
                <span>{yourShare.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Item List */}
        <div className="space-y-2.5 pb-8">
          {items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            const itemPrice = (item.basePrice + item.addons.reduce((a, b) => a + b.price, 0)) * item.qty;

            return (
              <div 
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={cn(
                  "bg-white rounded-[20px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border transition-all active:scale-[0.99] cursor-pointer",
                  isSelected ? "border-[#0066b2] shadow-[0_6px_15px_rgba(0,102,178,0.04)]" : "border-gray-50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-all mt-0.5",
                    isSelected ? "bg-[#0066b2] border-[#0066b2]" : "border-gray-200"
                  )}>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[4.5px]" />}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[15px] font-black text-[#1a1c2e] leading-tight pr-2">{item.name}</h3>
                      <div className="flex items-center gap-1.5 text-[#1a1c2e] font-black text-[16px] shrink-0">
                        <CurrencySymbol className="text-[14px]" />
                        <span>{itemPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#94a3b8] text-[12px] font-bold">
                      <div className="bg-[#f0f7ff] text-[#0066b2] px-2 py-0.5 rounded-md font-black text-[10px]">x{item.qty}</div>
                    </div>

                    {item.addons.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {item.addons.map((addon, idx) => (
                          <div key={idx} className="bg-[#f8fafc] border border-gray-100 rounded-lg px-2 py-0.5 flex items-center gap-1.5">
                            <span className="text-[#475569] text-[10px] font-black uppercase tracking-tighter">{addon.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="text-center py-10 opacity-40">
              <Box className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-bold">All items have been paid!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Button */}
      <div className="absolute bottom-0 inset-x-0 bg-white px-5 pt-3 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] z-30 flex justify-center border-t border-gray-50">
        <Button 
          onClick={handlePayClick}
          disabled={yourShare === 0}
          className={cn(
            "w-full h-14 rounded-[18px] text-[16px] font-black shadow-[0_8px_25px_rgba(0,102,178,0.2)] transition-all active:scale-[0.98]",
            yourShare > 0 ? "bg-[#0066b2] hover:bg-[#005596] text-white" : "bg-gray-100 text-gray-400 shadow-none pointer-events-none"
          )}
        >
          Pay Your Items (<CurrencySymbol />{yourShare.toFixed(2)})
        </Button>
      </div>

      {/* High-Fidelity Settlement Sheet synchronized with PayOrderDetailScreen */}
      <Sheet open={isSettlementOpen} onOpenChange={setIsSettlementOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-hidden max-h-[92vh] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Check Settlement</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto pb-10">
            {/* Header Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            <div className="px-6 flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#f0f7ff] rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-[#0066b2]" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[17px] font-black text-[#1a1c2e] leading-none uppercase">CHECK SETTLEMENT</h2>
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
              {/* Waiter & Item Amount Cards aligned and centered */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                  <div className="w-10 h-10 bg-[#f8fafc] rounded-full flex items-center justify-center mb-2 border border-gray-50">
                    <User className="w-5 h-5 text-[#94a3b8]" />
                  </div>
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-1">Waiter ID:</span>
                  <span className="text-[15px] font-black text-[#1a1c2e]">#123456</span>
                </div>
                <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col items-center justify-center min-h-[120px]">
                  <span className="text-[9px] font-black text-[#94a3b8] uppercase mb-2">Item Amount</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[24px] font-black text-[#0066b2]">AED</span>
                    <span className="text-[24px] font-black text-[#0066b2]">{yourShare.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Tips Section with Toggle Logic */}
              <div className="space-y-4">
                <span className="text-[11px] font-black text-[#94a3b8] uppercase tracking-normal">Add tips for your waiter</span>
                <div className="grid grid-cols-4 gap-3">
                  {[5, 10, 20].map((amount) => (
                    <button 
                      key={amount}
                      onClick={() => handleTipClick(amount)}
                      className={cn(
                        "relative h-[90px] rounded-[24px] flex flex-col items-center justify-center transition-all shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50",
                        (!isCustomTipMode && selectedTip === amount) ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white"
                      )}
                    >
                      <span className="text-[10px] font-black text-[#94a3b8] uppercase">AED</span>
                      <span className="text-[22px] font-black text-[#1a1c2e]">{amount}</span>
                      {(!isCustomTipMode && selectedTip === amount) && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#ef4444] rounded-full flex items-center justify-center border-2 border-white">
                          <X className="w-3 h-3 text-white stroke-[4px]" />
                        </div>
                      )}
                    </button>
                  ))}
                  <button 
                    onClick={handleCustomTipToggle}
                    className={cn(
                      "h-[90px] rounded-[24px] flex flex-col items-center justify-center shadow-[0_10px_30px_rgba(0,102,178,0.03)] border border-gray-50 transition-all",
                      isCustomTipMode ? "bg-[#f0f7ff] border-[#0066b2] border-2" : "bg-white"
                    )}
                  >
                    <Pencil className={cn("w-5 h-5 mb-1", isCustomTipMode ? "text-[#0066b2]" : "text-[#94a3b8]")} />
                    <span className={cn("text-[10px] font-black uppercase", isCustomTipMode ? "text-[#0066b2]" : "text-[#94a3b8]")}>Custom</span>
                  </button>
                </div>
                
                {/* Custom Tip Input */}
                {isCustomTipMode && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <span className="text-[16px] font-black text-[#0066b2]">AED</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="Enter tip amount"
                        value={customTipValue}
                        onChange={(e) => setCustomTipValue(e.target.value)}
                        className="h-14 rounded-[18px] border-[#0066b2]/20 border-2 pl-16 text-lg font-black focus-visible:ring-0 focus-visible:border-[#0066b2]"
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Summary Card matching latest typography requests */}
              <div className="bg-white rounded-[32px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-50 space-y-4">
                <div className="flex justify-between items-center text-[15px] font-black">
                  <span className="text-[#94a3b8] uppercase">Bill Amount</span>
                  <div className="flex items-center gap-1.5 text-[#1a1c2e]">
                    <span className="text-[15px] font-black">AED</span>
                    <span>{yourShare.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[15px] font-black">
                  <span className="text-[#94a3b8] uppercase">Tips</span>
                  <div className="flex items-center gap-1.5 text-[#26ab5f]">
                    <span>+</span>
                    <span className="text-[15px] font-black">AED</span>
                    <span>{currentTipAmount.toFixed(2)}</span>
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
                onClick={handleFinalPayment}
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

            {/* Payment Logos */}
            <div className="px-6 mt-8 flex justify-center gap-3">
              {[
                { name: 'JCB', color: 'text-[#004e9c]' },
                { name: 'G Pay', color: 'text-gray-600' },
                { name: 'AMEX', color: 'text-[#006fcf]' },
                { name: ' Pay', color: 'text-black' },
                { name: 'VISA', color: 'text-[#1a1f71]' }
              ].map((logo) => (
                <div key={logo.name} className="px-3 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  <span className={cn("text-[10px] font-black uppercase tracking-normal", logo.color)}>{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Payment In Progress Loop Sheet */}
      <Sheet open={isPartialSuccessOpen} onOpenChange={setIsPartialSuccessOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] border-none p-0 outline-none overflow-hidden h-[400px] flex flex-col tracking-normal">
          <SheetHeader className="sr-only">
            <SheetTitle>Payment In Progress</SheetTitle>
          </SheetHeader>
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-8">
            <div className="w-24 h-24 bg-[#00d084] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(0,208,132,0.3)] mb-8">
              <Check className="w-12 h-12 text-white stroke-[5px]" />
            </div>
            <h2 className="text-[24px] font-black text-[#1a1c2e] uppercase mb-4 leading-tight">PAYMENT IN PROGRESS</h2>
            <p className="text-[#94a3b8] text-[16px] font-bold leading-tight mb-8">
              Some items have been paid. Please pay for remaining items.
            </p>
            <Button 
              onClick={() => setIsPartialSuccessOpen(false)}
              className="w-full h-16 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[20px] text-[16px] font-black uppercase shadow-lg active:scale-95 transition-all"
            >
              Continue
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
