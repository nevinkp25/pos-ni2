'use client';

import React, { useState, useMemo, useRef } from 'react';
import { 
  ChevronLeft, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Minus, 
  Edit3, 
  ShoppingCart,
  MessageCircle,
  X,
  FileText,
  ChevronsRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItem } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CartScreenProps {
  tableNumber: string;
  onBack: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function CartScreen({ tableNumber, onBack, cart, setCart }: CartScreenProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(cart.map(i => i.id));
  const [isFooterExpanded, setIsFooterExpanded] = useState(true);
  const touchStartY = useRef(0);
  
  // Item Instruction Dialog State
  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [tempInstruction, setTempInstruction] = useState('');

  // Global Kitchen Instructions State
  const [kitchenInstructions, setKitchenInstructions] = useState('');
  const [isKitchenDialogOpen, setIsKitchenDialogOpen] = useState(false);
  const [tempKitchenInstruction, setTempKitchenInstruction] = useState('');

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

  const openInstructionDialog = (id: string, currentInstruction: string) => {
    setActiveItemId(id);
    setTempInstruction(currentInstruction);
    setIsInstructionDialogOpen(true);
  };

  const saveInstruction = () => {
    if (activeItemId) {
      setCart(prev => prev.map(item => 
        item.id === activeItemId ? { ...item, specialRequests: tempInstruction } : item
      ));
      setIsInstructionDialogOpen(false);
      setActiveItemId(null);
    }
  };

  const openKitchenDialog = () => {
    setTempKitchenInstruction(kitchenInstructions);
    setIsKitchenDialogOpen(true);
  };

  const saveKitchenInstruction = () => {
    setKitchenInstructions(tempKitchenInstruction);
    setIsKitchenDialogOpen(false);
  };

  const totalItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setIsFooterExpanded(true); // Swiped up
      } else {
        setIsFooterExpanded(false); // Swiped down
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f3f7fb] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      {/* Header */}
      <div className="bg-white px-5 h-16 flex items-center justify-between shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-b-[24px] z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-[#0066b2] stroke-[2.5px]" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[18px] font-black leading-tight text-[#1a1c2e]">Your Items</h1>
            <span className="text-[#94a3b8] text-[11px] font-bold">{totalItemCount} Items · Table # {tableNumber}</span>
          </div>
        </div>
        
        <button 
          onClick={handleClearCart}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#fee2e2] bg-white shadow-sm hover:bg-red-50 active:scale-95 transition-all"
        >
          <Trash2 className="w-4.5 h-4.5 text-[#ef4444]" />
        </button>
      </div>

      {/* Cart List */}
      <div className="flex-1 px-3 pt-4 overflow-y-auto pb-[280px] space-y-2.5">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-40">
            <ShoppingCart className="w-12 h-12 mb-3 text-[#94a3b8]" />
            <p className="text-base font-bold">Your cart is empty</p>
          </div>
        ) : cart.map((item) => {
          const isExpanded = expandedItems.includes(item.id);
          const hasInstructions = !!item.specialRequests;
          
          const singleItemPrice = item.basePrice + item.addons.reduce((acc, addon) => acc + (addon.price * addon.quantity), 0);
          const itemDisplayTotal = singleItemPrice * item.quantity;

          return (
            <div 
              key={item.id} 
              className={cn(
                "bg-white rounded-[18px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-white overflow-hidden transition-all duration-300 relative",
                hasInstructions && "border-l-[4px] border-l-[#f59e0b]"
              )}
            >
              <div className="p-3.5">
                {/* Title Area */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="text-[15px] font-black text-[#1a1c2e] leading-tight truncate">
                        {item.name}
                      </h3>
                      {hasInstructions && (
                        <div className="w-4 h-4 bg-[#fef3c7] rounded-full flex items-center justify-center shrink-0">
                          <MessageCircle className="w-2.5 h-2.5 text-[#f59e0b] fill-current" />
                        </div>
                      )}
                    </div>
                    <p className="text-[#0066b2] text-[14px] font-black">
                      AED {itemDisplayTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className="w-7 h-7 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#94a3b8]"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-2.5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="w-full border-t border-dashed border-gray-100" />
                    
                    {/* Addons List */}
                    {item.addons.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.addons.map((addon, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#f0f7ff] border border-[#d1e9ff] rounded-full px-2 py-0.5 flex items-center gap-1.5"
                          >
                            <span className="text-[#0066b2] text-[10px] font-black tracking-tight">
                              + {addon.name}{addon.quantity > 1 ? ` x${addon.quantity}` : ''}
                            </span>
                            <span className="text-[#0066b2]/60 text-[9px] font-black">
                              AED {(addon.price * addon.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Special Instruction Box */}
                    {hasInstructions && (
                      <div className="bg-[#fffbeb] rounded-[14px] p-2.5 border border-dashed border-[#f59e0b] space-y-1">
                        <span className="text-[#92400e] text-[9px] font-black uppercase tracking-wider block">Special Instruction</span>
                        <p className="text-[#92400e] text-[12px] font-bold leading-tight">
                          {item.specialRequests}
                        </p>
                      </div>
                    )}

                    {/* Bottom Action Row */}
                    <div className="flex items-center justify-between pt-1">
                      <button 
                        onClick={() => openInstructionDialog(item.id, item.specialRequests)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 h-9 rounded-full border-[1.2px] border-dotted transition-all active:scale-95",
                          hasInstructions 
                            ? "bg-[#fffbeb] border-[#f59e0b]/40 text-[#f59e0b]" 
                            : "bg-white border-[#0066b2]/20 text-[#0066b2]"
                        )}
                      >
                        <MessageCircle className={cn("w-3.5 h-3.5", hasInstructions ? "fill-current" : "")} />
                        <span className="text-[11px] font-black">
                          {hasInstructions ? "Edit Note" : "Add Note"}
                        </span>
                      </button>

                      <div className="flex items-center bg-white rounded-full p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] h-[38px] min-w-[90px] justify-between border border-gray-100">
                        <button 
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#ef4444] active:scale-90 transition-all"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5 stroke-[2.5px]" />}
                        </button>
                        <span className="text-[14px] font-black text-[#1a1c2e] px-1 tabular-nums">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-sm active:scale-90 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {/* Scroll Spacer */}
        <div className="h-10" />
      </div>

      {/* Cart Footer - Expandable */}
      <div 
        className="absolute bottom-0 inset-x-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.06)] rounded-t-[24px] px-5 pt-2 pb-5 flex flex-col z-20 transition-all duration-300 ease-in-out"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <button 
          onClick={() => setIsFooterExpanded(!isFooterExpanded)}
          className="w-full flex justify-center py-1.5 mb-1.5 shrink-0 group"
        >
          <div className="w-8 h-0.5 bg-[#e2e8f0] rounded-full opacity-60 group-hover:bg-[#cbd5e1] transition-colors" />
        </button>
        
        <div className="flex flex-col gap-2.5">
          {/* Kitchen Instructions Button or Box - Collapsible */}
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out shrink-0",
            isFooterExpanded ? "max-height-[160px] opacity-100" : "max-height-0 opacity-0 pointer-events-none"
          )}
          style={{ maxHeight: isFooterExpanded ? '160px' : '0' }}
          >
            {kitchenInstructions ? (
              <button 
                onClick={openKitchenDialog}
                className="w-full bg-[#fffbeb] rounded-[16px] p-3 border border-dashed border-[#f59e0b] space-y-0.5 text-left animate-in fade-in slide-in-from-bottom-1 duration-200"
              >
                <span className="text-[#92400e] text-[9px] font-black uppercase tracking-wider block">Order Instructions</span>
                <p className="text-[#92400e] text-[12px] font-bold leading-tight">
                  {kitchenInstructions}
                </p>
              </button>
            ) : (
              <button 
                onClick={openKitchenDialog}
                className="w-full h-9 rounded-[12px] border-[1.2px] border-dashed border-[#0066b2]/20 bg-[#f0f7ff] text-[#0066b2] flex items-center justify-center gap-2 active:scale-[0.98] transition-all group shrink-0"
              >
                <FileText className="w-3 h-3" />
                <span className="text-[12px] font-black">Kitchen instructions</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-[#1a1c2e] text-[16px] font-black tracking-tight">Subtotal</h2>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[13px] font-black text-[#1a1c2e]">AED</span>
              <span className="text-[20px] font-black text-[#1a1c2e] tabular-nums tracking-tighter">{subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="relative h-[52px] w-full bg-[#0066b2] rounded-[16px] p-1 flex items-center overflow-hidden shadow-[0_6px_16px_rgba(0,102,178,0.15)] shrink-0">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white text-[14px] font-black tracking-tight">Slide to Send Order</span>
            </div>
            <div 
              className="w-10 h-10 bg-white rounded-[12px] flex items-center justify-center shadow-lg cursor-pointer active:scale-95 transition-transform"
            >
              <ChevronsRight className="w-5 h-5 text-[#0066b2] stroke-[3px]" />
            </div>
          </div>

          <div className={cn(
            "transition-all duration-300 overflow-hidden shrink-0",
            isFooterExpanded ? "max-height-[30px] opacity-70" : "max-height-0 opacity-0"
          )}
          style={{ maxHeight: isFooterExpanded ? '30px' : '0' }}
          >
            <p className="text-center text-[#94a3b8] text-[9px] font-bold leading-tight px-4">
              Includes applicable taxes and service charges.
            </p>
          </div>
        </div>
      </div>

      {/* Item Instruction Dialog */}
      <Dialog open={isInstructionDialogOpen} onOpenChange={setIsInstructionDialogOpen}>
        <DialogContent className="rounded-[24px] sm:max-w-[360px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-5 pt-5 pb-1.5 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-black text-[#1a1c2e]">Item Note</DialogTitle>
            <button 
              onClick={() => setIsInstructionDialogOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>
          <div className="px-5 py-3 space-y-3">
            <p className="text-[12px] font-bold text-[#94a3b8] leading-tight">
              Add any specific requests for this item.
            </p>
            <div className="relative">
              <Textarea 
                value={tempInstruction}
                onChange={(e) => setTempInstruction(e.target.value)}
                placeholder="e.g. Less ice please, no sugar..."
                className="h-28 rounded-xl border-2 border-gray-100 focus:border-[#0066b2] focus:ring-0 transition-all text-sm font-bold p-3 resize-none"
                maxLength={150}
              />
              <span className="absolute bottom-3 right-3 text-[9px] font-black text-gray-300">
                {tempInstruction.length}/150
              </span>
            </div>
          </div>
          <div className="px-5 pb-5 pt-1">
            <Button 
              onClick={saveInstruction}
              className="w-full h-12 bg-[#0066b2] hover:bg-[#005ea1] text-white rounded-[16px] text-sm font-black shadow-md"
            >
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Kitchen Instruction Dialog */}
      <Dialog open={isKitchenDialogOpen} onOpenChange={setIsKitchenDialogOpen}>
        <DialogContent className="rounded-[24px] sm:max-w-[360px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-5 pt-5 pb-1.5 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-black text-[#1a1c2e]">Order Note</DialogTitle>
            <button 
              onClick={() => setIsKitchenDialogOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-50 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>
          <div className="px-5 py-3 space-y-3">
            <p className="text-[12px] font-bold text-[#94a3b8] leading-tight">
              Add general instructions for the entire kitchen staff.
            </p>
            <div className="relative">
              <Textarea 
                value={tempKitchenInstruction}
                onChange={(e) => setTempKitchenInstruction(e.target.value)}
                placeholder="e.g. Serve all items together..."
                className="h-28 rounded-xl border-2 border-gray-100 focus:border-[#0066b2] focus:ring-0 transition-all text-sm font-bold p-3 resize-none"
                maxLength={200}
              />
              <span className="absolute bottom-3 right-3 text-[9px] font-black text-gray-300">
                {tempKitchenInstruction.length}/200
              </span>
            </div>
          </div>
          <div className="px-5 pb-5 pt-1">
            <Button 
              onClick={saveKitchenInstruction}
              className="w-full h-12 bg-[#0066b2] hover:bg-[#005ea1] text-white rounded-[16px] text-sm font-black shadow-md"
            >
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}