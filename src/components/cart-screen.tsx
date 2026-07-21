'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  Trash2, 
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

  const clearItemInstruction = (id: string) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, specialRequests: '' } : item
    ));
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
              const hasInstructions = !!item.specialRequests;
              const itemBasePlusAddons = item.basePrice + item.addons.reduce((a, b) => a + (b.price * b.quantity), 0);
              const itemTotal = itemBasePlusAddons * item.quantity;

              return (
                <div 
                  key={item.id} 
                  className={cn(
                    "relative transition-all duration-300 p-5",
                    index !== cart.length - 1 && "border-b border-gray-50",
                    hasInstructions && "bg-[#eff6ff]/30"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Left: Quantity Badge */}
                    <div className="w-8 h-8 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#0066b2] text-[13px] font-black">{item.quantity}x</span>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 flex flex-col gap-3 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-[15px] font-black text-[#1a1c2e] leading-tight truncate">
                          {item.name}
                        </h3>
                        <CurrencyAmount amount={itemTotal} weight="bold" className="text-[16px] text-[#1a1c2e] shrink-0" />
                      </div>

                      {/* Addons List with Dotted Lines */}
                      {item.addons.length > 0 && (
                        <div className="space-y-2">
                          {item.addons.map((addon, idx) => (
                            <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                              <span className="text-[#94a3b8] text-[12px] font-bold shrink-0">+</span>
                              <span className="bg-[#f1f5f9] text-[#475569] px-2.5 py-0.5 rounded-lg text-[11px] font-black">{addon.name}</span>
                              <div className="flex-1 border-b border-dotted border-gray-200 mt-1" />
                              <CurrencyAmount amount={addon.price * addon.quantity} weight="bold" className="text-[#94a3b8] text-[12px]" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Special Instruction Text */}
                      {hasInstructions && (
                        <div className="bg-[#eff6ff] rounded-[18px] p-3.5 border border-[#eff6ff] animate-in fade-in zoom-in-95 duration-300 relative group/note">
                          <p className="text-[#0169b1] text-[13px] font-black leading-snug pr-6">
                            {item.specialRequests}
                          </p>
                          <button 
                            onClick={() => clearItemInstruction(item.id)}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/50 text-[#0169b1] flex items-center justify-center active:scale-90 transition-all opacity-0 group-hover/note:opacity-100"
                          >
                            <X className="w-3.5 h-3.5 stroke-[3px]" />
                          </button>
                        </div>
                      )}

                      {/* Bottom Action Row: Note, Edit, Qty */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => openInstructionDialog(item.id, item.specialRequests)}
                            className={cn(
                              "text-[12px] font-black tracking-tight flex items-center gap-1.5 transition-all active:scale-95",
                              hasInstructions ? "text-[#0169b1]" : "text-[#0066b2]"
                            )}
                          >
                            <MessageCircle className={cn("w-3.5 h-3.5", hasInstructions ? "fill-current" : "")} />
                            <span className="border-b border-dotted border-current">
                              Note
                            </span>
                          </button>
                          
                          <button 
                            onClick={() => onEditItem(item)}
                            className="w-8 h-8 rounded-full bg-[#f0f7ff] text-[#0066b2] hover:bg-[#e1effe] active:scale-95 transition-all flex items-center justify-center shadow-sm"
                            title="Edit Item"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Integrated Quantity Controls */}
                        <div className="flex items-center bg-[#f8fbfe] rounded-full p-0.5 border border-gray-100 shadow-sm h-10 min-w-[90px] justify-between">
                          <button 
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-[#ef4444] shadow-sm active:scale-90 transition-all"
                          >
                            {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5 stroke-[3px]" />}
                          </button>
                          <span className="text-[14px] font-black text-[#1a1c2e] px-1 tabular-nums">{item.quantity}</span>
                          <button 
                            onClick={() => updateQty(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-md active:scale-90 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[3px]" />
                          </button>
                        </div>
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
        <div 
          onClick={() => setIsFooterExpanded(!isFooterExpanded)}
          className="w-full flex justify-center py-2 mb-1 shrink-0 cursor-pointer active:scale-95 transition-all"
        >
          <div className={cn(
            "w-10 h-1.5 rounded-full transition-all duration-300",
            isFooterExpanded ? "bg-[#0066b2]/20" : "bg-gray-200"
          )} />
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
                className="w-full bg-[#eff6ff] rounded-[18px] p-4 text-left animate-in fade-in duration-200 border border-[#eff6ff]"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-[#0169b1] text-[15px] font-black leading-snug">
                    {kitchenInstructions}
                  </p>
                  <span className="text-[#0169b1]/50 text-[10px] italic font-medium">
                    Kitchen Instructions
                  </span>
                </div>
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
          <div className="px-6 pb-6 pt-2 flex gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                if (activeItemId) {
                  clearItemInstruction(activeItemId);
                  setIsInstructionDialogOpen(false);
                  setActiveItemId(null);
                }
              }}
              className="flex-1 h-12 border-[#fee2e2] bg-[#fff1f2]/30 text-[#ef4444] hover:bg-[#fff1f2] rounded-[18px] text-sm font-black flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
            <Button 
              onClick={saveInstruction}
              className="flex-[2] h-12 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[18px] text-sm font-black shadow-md uppercase tracking-wide"
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
          <div className="px-6 pb-6 pt-2 flex gap-3">
             <Button 
              variant="outline"
              onClick={() => {
                setKitchenInstructions('');
                setIsKitchenDialogOpen(false);
              }}
              className="flex-1 h-12 border-[#fee2e2] bg-[#fff1f2]/30 text-[#ef4444] hover:bg-[#fff1f2] rounded-[18px] text-sm font-black flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>
            <Button 
              onClick={saveKitchenInstruction}
              className="flex-[2] h-12 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[18px] text-sm font-black shadow-md uppercase tracking-wide"
            >
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
