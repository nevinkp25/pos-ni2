'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Minus, 
  ShoppingCart,
  MessageCircle,
  X,
  FileText,
  ChevronsRight,
  Check,
  Pencil
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
import { useToast } from '@/hooks/use-toast';

interface CartScreenProps {
  tableNumber: string;
  onBack: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSent: () => void;
  onEditItem?: (item: CartItem) => void;
}

export function CartScreen({ tableNumber, onBack, cart, setCart, onOrderSent, onEditItem }: CartScreenProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(cart.map(i => i.id));
  const [isFooterExpanded, setIsFooterExpanded] = useState(true);
  const footerTouchStartY = useRef(0);
  const { toast } = useToast();
  
  // Slider State (Left to Right)
  const [sliderX, setSliderX] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderStartX = useRef(0);

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

  // Swipe for Footer (Up/Down)
  const handleFooterTouchStart = (e: React.TouchEvent) => {
    footerTouchStartY.current = e.touches[0].clientY;
  };

  const handleFooterTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = footerTouchStartY.current - touchEndY;
    if (Math.abs(diff) > 30) {
      setIsFooterExpanded(diff < 0);
    }
  };

  // Slider Logic (Left to Right)
  const handleSliderTouchStart = (e: React.TouchEvent) => {
    if (isOrderSent) return;
    sliderStartX.current = e.touches[0].clientX;
    setIsSliding(true);
  };

  const handleSliderTouchMove = (e: React.TouchEvent) => {
    if (!isSliding || !sliderContainerRef.current || isOrderSent) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - sliderStartX.current;
    const containerWidth = sliderContainerRef.current.offsetWidth;
    const handleWidth = 44; // Approx width of handle
    const maxPath = containerWidth - handleWidth - 8;

    if (deltaX > 0) {
      setSliderX(Math.min(deltaX, maxPath));
    }
  };

  const handleSliderTouchEnd = () => {
    if (!isSliding || !sliderContainerRef.current || isOrderSent) return;
    setIsSliding(false);
    
    const containerWidth = sliderContainerRef.current.offsetWidth;
    const handleWidth = 44;
    const maxPath = containerWidth - handleWidth - 8;

    if (sliderX >= maxPath * 0.9) {
      setSliderX(maxPath);
      setIsOrderSent(true);
      onOrderSent();
    } else {
      setSliderX(0);
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
      <div className="flex-1 px-3 pt-4 overflow-y-auto pb-[320px] space-y-3">
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
                "bg-white rounded-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-white overflow-hidden transition-all duration-300 relative",
                hasInstructions && "border-l-[5px] border-l-[#f59e0b]"
              )}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 min-w-0">
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
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => onEditItem?.(item)}
                      className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#f0f7ff] text-[#0066b2] hover:bg-[#e1effe] active:scale-95 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-black uppercase tracking-tight">Edit</span>
                    </button>
                    <button 
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#94a3b8] transition-transform",
                        isExpanded ? "rotate-0" : ""
                      )}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-full border-t border-dashed border-gray-100" />
                    
                    {item.addons.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.addons.map((addon, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#f0f7ff] border border-[#d1e9ff] rounded-full px-3 py-1 flex items-center gap-2"
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

                    {hasInstructions && (
                      <div className="bg-[#fffbeb] rounded-[16px] p-3 border border-dashed border-[#f59e0b] space-y-1">
                        <span className="text-[#92400e] text-[9px] font-black uppercase tracking-wider block">Special Instruction</span>
                        <p className="text-[#92400e] text-[12px] font-bold leading-tight">
                          {item.specialRequests}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button 
                        onClick={() => openInstructionDialog(item.id, item.specialRequests)}
                        className={cn(
                          "flex items-center gap-2 px-3.5 h-10 rounded-full border-[1.5px] border-dotted transition-all active:scale-95",
                          hasInstructions 
                            ? "bg-[#fffbeb] border-[#f59e0b]/40 text-[#f59e0b]" 
                            : "bg-white border-[#0066b2]/20 text-[#0066b2]"
                        )}
                      >
                        <MessageCircle className={cn("w-4 h-4", hasInstructions ? "fill-current" : "")} />
                        <span className="text-[11px] font-black">
                          {hasInstructions ? "Edit Note" : "Add Note"}
                        </span>
                      </button>

                      <div className="flex items-center bg-white rounded-full p-1 shadow-[0_4px_12px_rgba(0,0,0,0.06)] h-[44px] min-w-[100px] justify-between border border-gray-100">
                        <button 
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#ef4444] active:scale-90 transition-all"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4 stroke-[3px]" />}
                        </button>
                        <span className="text-[16px] font-black text-[#1a1c2e] px-2 tabular-nums">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-sm active:scale-90 transition-all"
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
        <div className="h-20" />
      </div>

      {/* Cart Footer - Swipable Drawer */}
      <div 
        className="absolute bottom-0 inset-x-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.06)] rounded-t-[24px] px-5 pt-2 pb-5 flex flex-col z-20 transition-all duration-300 ease-in-out"
        onTouchStart={handleFooterTouchStart}
        onTouchEnd={handleFooterTouchEnd}
      >
        <div className="w-full flex justify-center py-1.5 mb-1.5 shrink-0">
          <div className="w-8 h-1 bg-[#e2e8f0] rounded-full opacity-60" />
        </div>
        
        <div className="flex flex-col gap-3">
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out shrink-0",
              isFooterExpanded ? "max-h-[160px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            )}
            style={{ maxHeight: isFooterExpanded ? '160px' : '0' }}
          >
            {kitchenInstructions ? (
              <button 
                onClick={openKitchenDialog}
                className="w-full bg-[#fffbeb] rounded-[16px] p-3 border border-dashed border-[#f59e0b] text-left animate-in fade-in duration-200"
              >
                <span className="text-[#92400e] text-[9px] font-black uppercase tracking-wider block mb-0.5">Order Instructions</span>
                <p className="text-[#92400e] text-[12px] font-bold leading-tight">
                  {kitchenInstructions}
                </p>
              </button>
            ) : (
              <button 
                onClick={openKitchenDialog}
                className="w-full h-10 rounded-[14px] border-[1.5px] border-dashed border-[#0066b2]/20 bg-[#f0f7ff] text-[#0066b2] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span className="text-[13px] font-black">Kitchen instructions</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between shrink-0 px-1">
            <h2 className="text-[#1a1c2e] text-[17px] font-black tracking-tight">Subtotal</h2>
            <div className="flex items-baseline gap-1">
              <span className="text-[14px] font-black text-[#1a1c2e]">AED</span>
              <span className="text-[22px] font-black text-[#1a1c2e] tabular-nums tracking-tighter">{subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Swipeable Horizontal Slider */}
          <div 
            ref={sliderContainerRef}
            className="relative h-[56px] w-full bg-[#0066b2] rounded-[18px] p-1 flex items-center overflow-hidden shadow-[0_6px_20px_rgba(0,102,178,0.18)] shrink-0"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white text-[15px] font-black tracking-tight opacity-80">
                {isOrderSent ? 'Order Processing...' : 'Slide to Send Order'}
              </span>
            </div>
            
            {/* The Slidable Handle */}
            <div 
              className={cn(
                "h-11 w-12 bg-white rounded-[14px] flex items-center justify-center shadow-lg z-10 transition-transform relative",
                !isSliding && "duration-300"
              )}
              style={{ 
                transform: `translateX(${sliderX}px)`,
                transition: isSliding ? 'none' : 'transform 0.3s ease-out'
              }}
              onTouchStart={handleSliderTouchStart}
              onTouchMove={handleSliderTouchMove}
              onTouchEnd={handleSliderTouchEnd}
            >
              {isOrderSent ? (
                <Check className="w-6 h-6 text-[#26ab5f] stroke-[4px]" />
              ) : (
                <ChevronsRight className="w-6 h-6 text-[#0066b2] stroke-[3.5px]" />
              )}
            </div>
          </div>

          <div 
            className={cn(
              "transition-all duration-300 overflow-hidden shrink-0",
              isFooterExpanded ? "max-h-[30px] opacity-70" : "max-h-0 opacity-0"
            )}
            style={{ maxHeight: isFooterExpanded ? '30px' : '0' }}
          >
            <p className="text-center text-[#94a3b8] text-[10px] font-bold leading-tight px-4">
              Final amount may include applicable taxes and service charges depending on payment method.
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
