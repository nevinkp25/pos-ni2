'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Minus, 
  Edit3, 
  MessageSquare,
  FileText,
  ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItem } from '@/lib/types';

interface CartScreenProps {
  tableNumber: string;
  onBack: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function CartScreen({ tableNumber, onBack, cart, setCart }: CartScreenProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(cart.map(i => i.id));
  const [slideProgress, setSlideProgress] = useState(0);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      let itemTotal = item.basePrice;
      item.addons.forEach(a => {
        itemTotal += a.price * a.quantity;
      });
      return sum + (itemTotal * item.quantity);
    }, 0);
  }, [cart]);

  const toggleItem = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleClearCart = () => {
    if (window.confirm('Clear all items from the order?')) {
      setCart([]);
      onBack();
    }
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const totalItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="flex flex-col h-screen bg-[#f3f7fb] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
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
            <h1 className="text-[20px] font-black leading-tight text-[#1a1c2e]">Your Items</h1>
            <span className="text-[#94a3b8] text-[13px] font-bold">{totalItemCount} Items · Table # {tableNumber}</span>
          </div>
        </div>
        
        <button 
          onClick={handleClearCart}
          className="w-11 h-11 flex items-center justify-center rounded-full border border-[#fee2e2] bg-white shadow-sm hover:bg-red-50 active:scale-95 transition-all group"
        >
          <Trash2 className="w-5 h-5 text-[#ef4444] group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Cart List */}
      <div className="flex-1 px-6 pt-6 overflow-y-auto pb-48 space-y-4">
        {cart.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const hasInstructions = !!item.specialRequests;

          return (
            <div 
              key={item.id} 
              className={cn(
                "bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white overflow-hidden transition-all duration-300",
                hasInstructions && "border-l-[6px] border-l-[#f59e0b]"
              )}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[17px] font-black text-[#1a1c2e] leading-tight">
                      {item.name}
                      {item.flavor && <span className="text-[#94a3b8] text-[13px] font-bold ml-2">({item.flavor})</span>}
                    </h3>
                    <p className="text-[#0066b2] text-[15px] font-black">
                      AED {(item.basePrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1.5 text-[#0066b2] text-[13px] font-black hover:opacity-80">
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className="w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#94a3b8]"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Addons Chips */}
                    {item.addons.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.addons.map((addon, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#f0f7ff] border border-[#d1e9ff] rounded-full px-3 py-1.5 flex items-center gap-2"
                          >
                            <span className="text-[#0066b2] text-[11px] font-black tracking-tight">
                              + {addon.name}
                            </span>
                            <span className="text-[#0066b2]/60 text-[10px] font-black">
                              AED {addon.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Special Instruction Section */}
                    {hasInstructions && (
                      <div className="bg-[#fffbeb] rounded-[20px] p-4 border border-[#fef3c7] space-y-2">
                        <span className="text-[#92400e] text-[10px] font-black uppercase tracking-wider block">Special Instruction</span>
                        <p className="text-[#92400e] text-[13px] font-bold leading-snug">
                          {item.specialRequests}
                        </p>
                      </div>
                    )}

                    {/* Controls Row */}
                    <div className="flex items-center justify-between pt-2">
                      <button className={cn(
                        "flex items-center gap-2 px-4 h-10 rounded-full border border-dashed transition-all active:scale-95",
                        hasInstructions 
                          ? "bg-[#fffbeb] border-[#f59e0b]/30 text-[#f59e0b]" 
                          : "bg-white border-[#d1e9ff] text-[#0066b2]"
                      )}>
                        {hasInstructions ? (
                          <>
                            <MessageSquare className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[12px] font-black">Edit Instruction</span>
                          </>
                        ) : (
                          <>
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-[12px] font-black">Instruction</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center bg-[#f8fafc] border border-[#eef2f8] rounded-full p-1 shadow-sm h-11 min-w-[110px] justify-between">
                        <button 
                          onClick={() => updateQty(item.id, -1)}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#ef4444] shadow-sm active:scale-90 transition-all"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4 stroke-[3px]" />}
                        </button>
                        <span className="text-[16px] font-black text-[#1a1c2e] px-2 tabular-nums">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-md shadow-blue-200 active:scale-90 transition-all"
                        >
                          <Plus className="w-4 h-4 stroke-[3px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Footer */}
      <div className="absolute bottom-0 inset-x-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[40px] px-6 pt-5 pb-8 flex flex-col gap-6 z-20">
        <div className="w-12 h-1.5 bg-[#e2e8f0] rounded-full mx-auto mb-1 opacity-50" />
        
        <button className="w-full h-12 rounded-[16px] border-[1.5px] border-dashed border-[#0066b2]/30 bg-[#f0f7ff] text-[#0066b2] flex items-center justify-center gap-3 active:scale-[0.98] transition-all group">
          <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-[14px] font-black">Add special instruction for the Kitchen</span>
        </button>

        <div className="flex items-center justify-between">
          <h2 className="text-[#1a1c2e] text-[22px] font-black tracking-tight">Subtotal</h2>
          <div className="flex items-baseline gap-1">
            <span className="text-[20px] font-black text-[#1a1c2e]">AED</span>
            <span className="text-[28px] font-black text-[#1a1c2e] tabular-nums">{subtotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="relative h-[68px] w-full bg-[#0066b2] rounded-[24px] p-1.5 flex items-center overflow-hidden shadow-[0_10px_30px_rgba(0,102,178,0.2)]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white text-[17px] font-black tracking-tight">Slide to Send Order</span>
          </div>
          <div 
            className="w-14 h-14 bg-white rounded-[18px] flex items-center justify-center shadow-lg cursor-pointer active:scale-95 transition-transform"
            style={{ transform: `translateX(${slideProgress}px)` }}
          >
            <ChevronsRight className="w-7 h-7 text-[#0066b2] stroke-[3px]" />
          </div>
        </div>

        <p className="text-center text-[#94a3b8] text-[11px] font-bold leading-relaxed px-4">
          Final amount may include applicable taxes and service charges depending on payment method.
        </p>
      </div>
    </div>
  );
}
