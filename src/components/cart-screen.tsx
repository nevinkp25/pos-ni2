
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
  Pencil,
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
import { CurrencyAmount } from './CurrencyAmount';

interface CartScreenProps {
  tableNumber: string;
  onBack: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSent: () => void;
  onEditItem: (item: CartItem) => void;
}

export function CartScreen({ tableNumber, onBack, cart, setCart, onOrderSent, onEditItem }: CartScreenProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(cart.map(i => i.id));
  const [isFooterExpanded, setIsFooterExpanded] = useState(true);
  const footerTouchStartY = useRef(0);
  
  const [sliderX, setSliderX] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderStartX = useRef(0);

  const [isInstructionDialogOpen, setIsInstructionDialogOpen] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [tempInstruction, setTempInstruction] = useState('');

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
    setTempInstruction(currentInstruction || '');
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

  const handleSliderStart = (clientX: number) => {
    if (isOrderSent) return;
    sliderStartX.current = clientX;
    setIsSliding(true);
  };

  const handleSliderMove = (clientX: number) => {
    if (!isSliding || !sliderContainerRef.current || isOrderSent) return;
    const deltaX = clientX - sliderStartX.current;
    const containerWidth = sliderContainerRef.current.offsetWidth;
    const handleWidth = 44;
    const maxPath = containerWidth - handleWidth - 8;

    if (deltaX > 0) {
      setSliderX(Math.min(deltaX, maxPath));
    }
  };

  const handleSliderEnd = () => {
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

  useEffect(() => {
    if (!isSliding) return;

    const onMouseMove = (e: MouseEvent) => handleSliderMove(e.clientX);
    const onMouseUp = () => handleSliderEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isSliding, sliderX]);

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
            <div className="flex items-center gap-1">
              <CurrencyAmount amount={subtotal} weight="bold" className="text-[#94a3b8] text-[11px]" />
              <span className="text-[#94a3b8] text-[11px] font-bold"> · Table #{tableNumber}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleClearCart}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#fee2e2] bg-white shadow-sm hover:bg-red-50 active:scale-95 transition-all"
        >
          <Trash2 className="w-4.5 h-4.5 text-[#ef4444]" />
        </button>
      </div>

      {/* Cart List Container */}
      <div className="flex-1 px-4 pt-4 overflow-y-auto pb-[320px]">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-40">
            <ShoppingCart className="w-12 h-12 mb-3 text-[#94a3b8]" />
            <p className="text-base font-bold">Your cart is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-[#f0f4f8] overflow-hidden mb-6">
            {cart.map((item, index) => {
              const isExpanded = expandedItems.includes(item.id);
              const hasInstructions = !!item.specialRequests;
              const singleItemPrice = item.basePrice + item.addons.reduce((acc, addon) => acc + (addon.price * addon.quantity), 0);
              const itemDisplayTotal = singleItemPrice * item.quantity;
              const hasAddons = item.addons.length > 0;

              return (
                <div 
                  key={item.id} 
                  className={cn(
                    "relative transition-all duration-300",
                    index !== cart.length - 1 && "border-b border-gray-100",
                    hasInstructions && "bg-orange-50/10"
                  )}
                >
                  <div className="p-5">
                    {/* Item Top Row: Info & Primary Actions */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="text-[16px] font-black text-[#1a1c2e] leading-tight truncate">
                            {item.name}
                          </h3>
                          {hasInstructions && (
                            <div className="w-4 h-4 bg-[#fef3c7] rounded-full flex items-center justify-center shrink-0">
                              <MessageCircle className="w-2.5 h-2.5 text-[#f59e0b] fill-current" />
                            </div>
                          )}
                        </div>
                        <CurrencyAmount amount={itemDisplayTotal} weight="bold" className="text-[14px] text-[#0066b2]" />
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          onClick={() => onEditItem(item)}
                          className="flex items-center gap-1.5 px-3 h-8 rounded-full bg-[#f0f7ff] text-[#0066b2] hover:bg-[#e1effe] active:scale-95 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-black uppercase tracking-tight">Edit</span>
                        </button>
                        {hasAddons && (
                          <button 
                            onClick={() => toggleItem(item.id)}
                            className={cn(
                              "w-8 h-8 rounded-full bg-[#f8fafc] flex items-center justify-center text-[#94a3b8] transition-transform",
                              isExpanded ? "rotate-180" : ""
                            )}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Addons List */}
                    {isExpanded && hasAddons && (
                      <div className="mt-3 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        {item.addons.map((addon, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#f8fafc] border border-gray-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5"
                          >
                            <span className="text-[#475569] text-[10px] font-black tracking-tight">
                              + {addon.name}{addon.quantity > 1 ? ` x${addon.quantity}` : ''}
                            </span>
                            <CurrencyAmount amount={addon.price * addon.quantity} weight="bold" className="text-[#94a3b8] text-[9px]" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Special Instruction Box */}
                    {hasInstructions && (
                      <div className="mt-4 bg-[#FFF9EA] rounded-[18px] p-4 border border-[#fef3c7] relative overflow-hidden animate-in fade-in duration-300">
                        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#f59e0b]" />
                        <span className="text-[#B45309] text-[10px] font-black uppercase tracking-wider block mb-1">
                          SPECIAL INSTRUCTION
                        </span>
                        <p className="text-[#948D72] text-[14px] font-semibold leading-snug">
                          {item.specialRequests}
                        </p>
                      </div>
                    )}

                    {/* Bottom Actions Row: Note & Qty */}
                    <div className="flex items-center justify-between mt-5">
                      <button 
                        onClick={() => openInstructionDialog(item.id, item.specialRequests)}
                        className={cn(
                          "flex items-center gap-2 px-3.5 h-10 rounded-full border-[1.5px] border-dotted transition-all active:scale-95",
                          hasInstructions 
                            ? "bg-[#FFF9EA] border-[#B45309]/40 text-[#B45309]" 
                            : "bg-white border-[#0066b2]/20 text-[#0066b2]"
                        )}
                      >
                        <MessageCircle className={cn("w-4 h-4", hasInstructions ? "fill-current" : "")} />
                        <span className="text-[11px] font-black">
                          {hasInstructions ? "Edit Note" : "Add Note"}
                        </span>
                      </button>

                      <div className="flex items-center bg-[#f8fbfe] rounded-full p-1 shadow-sm h-[44px] min-w-[100px] justify-between border border-gray-100">
                        <button 
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#ef4444] shadow-sm active:scale-90 transition-all"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4 stroke-[3px]" />}
                        </button>
                        <span className="text-[16px] font-black text-[#1a1c2e] px-2 tabular-nums">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-md active:scale-90 transition-all"
                        >
                          <Plus className="w-4 h-4 stroke-[3px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="h-20" />
      </div>

      {/* Cart Footer */}
      <div 
        className="absolute bottom-0 inset-x-0 bg-white shadow-[0_-8px_30px_rgba(0,102,178,0.06)] rounded-t-[24px] px-5 pt-2 pb-5 flex flex-col z-20 transition-all duration-300 ease-in-out"
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
                className="w-full bg-[#FFF9EA] rounded-[18px] p-4 text-left animate-in fade-in duration-200 border border-[#fef3c7]"
              >
                <span className="text-[#B45309] text-[11px] font-black uppercase tracking-wider block mb-1">
                  ORDER INSTRUCTIONS
                </span>
                <p className="text-[#948D72] text-[14px] font-semibold leading-snug">
                  {kitchenInstructions}
                </p>
              </button>
            ) : (
              <button 
                onClick={openKitchenDialog}
                className="w-full h-11 rounded-[16px] border-[1.5px] border-dashed border-[#0066b2]/20 bg-[#f0f7ff] text-[#0066b2] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shrink-0"
              >
                <FileText className="w-4 h-4" />
                <span className="text-[13px] font-black uppercase tracking-tight">Kitchen instructions</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between shrink-0 px-1">
            <h2 className="text-[#1a1c2e] text-[17px] font-black tracking-tight uppercase">Subtotal</h2>
            <CurrencyAmount amount={subtotal} weight="bold" className="text-[22px] text-[#1a1c2e]" />
          </div>

          <div 
            ref={sliderContainerRef}
            className="relative h-[56px] w-full bg-[#0066b2] rounded-[18px] p-1 flex items-center overflow-hidden shadow-[0_6px_20px_rgba(0,102,178,0.18)] shrink-0 select-none"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white text-[15px] font-black tracking-tight uppercase opacity-80">
                {isOrderSent ? 'Order Processing...' : 'Slide to Send Order'}
              </span>
            </div>
            
            <div 
              className={cn(
                "h-11 w-12 bg-white rounded-[14px] flex items-center justify-center shadow-lg z-10 transition-transform relative cursor-grab active:cursor-grabbing",
                !isSliding && "duration-300"
              )}
              style={{ 
                transform: `translateX(${sliderX}px)`,
                transition: isSliding ? 'none' : 'transform 0.3s ease-out'
              }}
              onTouchStart={(e) => handleSliderStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleSliderMove(e.touches[0].clientX)}
              onTouchEnd={handleSliderEnd}
              onMouseDown={(e) => handleSliderStart(e.clientX)}
            >
              {isOrderSent ? (
                <Check className="w-6 h-6 text-[#26ab5f] stroke-[4px]" />
              ) : (
                <ChevronsRight className="w-6 h-6 text-[#0066b2] stroke-[3.5px]" />
              )}
            </div>
          </div>
          <p className="text-[10px] font-bold text-[#94a3b8] text-center mt-0.5 leading-none">
            Prices may include GST and other applicable taxes.
          </p>
        </div>
      </div>

      <Dialog open={isInstructionDialogOpen} onOpenChange={setIsInstructionDialogOpen}>
        <DialogContent className="rounded-[32px] sm:max-w-[360px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-black text-[#1a1c2e] uppercase tracking-tight">Item Note</DialogTitle>
            <button 
              onClick={() => setIsInstructionDialogOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>
          <div className="px-6 py-3 space-y-3">
            <p className="text-[12px] font-bold text-[#94a3b8] leading-tight">
              Add any specific requests for this item.
            </p>
            <div className="relative">
              <Textarea 
                value={tempInstruction}
                onChange={(e) => setTempInstruction(e.target.value)}
                placeholder="e.g. Less ice please, no sugar..."
                className="h-28 rounded-2xl border-2 border-gray-100 focus:border-[#0066b2] focus:ring-0 transition-all text-sm font-bold p-4 resize-none"
                maxLength={150}
              />
              <span className="absolute bottom-3 right-3 text-[9px] font-black text-gray-300">
                {tempInstruction.length}/150
              </span>
            </div>
          </div>
          <div className="px-6 pb-6 pt-2">
            <Button 
              onClick={saveInstruction}
              className="w-full h-12 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[18px] text-sm font-black shadow-md uppercase tracking-wide"
            >
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isKitchenDialogOpen} onOpenChange={setIsKitchenDialogOpen}>
        <DialogContent className="rounded-[32px] sm:max-w-[360px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="px-6 pt-6 pb-2 flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-black text-[#1a1c2e] uppercase tracking-tight">Order Note</DialogTitle>
            <button 
              onClick={() => setIsKitchenDialogOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>
          <div className="px-6 py-3 space-y-3">
            <p className="text-[12px] font-bold text-[#94a3b8] leading-tight">
              Add general instructions for the entire kitchen staff.
            </p>
            <div className="relative">
              <Textarea 
                value={tempKitchenInstruction}
                onChange={(e) => setTempKitchenInstruction(e.target.value)}
                placeholder="e.g. Serve all items together..."
                className="h-28 rounded-2xl border-2 border-gray-100 focus:border-[#0066b2] focus:ring-0 transition-all text-sm font-bold p-4 resize-none"
                maxLength={200}
              />
              <span className="absolute bottom-3 right-3 text-[9px] font-black text-gray-300">
                {tempKitchenInstruction.length}/200
              </span>
            </div>
          </div>
          <div className="px-6 pb-6 pt-2">
            <Button 
              onClick={saveKitchenInstruction}
              className="w-full h-12 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[18px] text-sm font-black shadow-md uppercase tracking-wide"
            >
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
