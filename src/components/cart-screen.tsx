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
  Flame,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItem, CartItemAddon } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CurrencyAmount } from './CurrencyAmount';

interface MenuItemOption {
  name: string;
  price: number;
}

interface MenuItem {
  name: string;
  description: string;
  allergens: string[];
  basePrice: number;
  nutritionalInfo: {
    kcal: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  variations: MenuItemOption[];
  addons?: MenuItemOption[];
}

const menuData: MenuItem[] = [
  { 
    name: 'Burrata con Pomodorini', 
    description: 'Creamy burrata, cherry tomatoes, basil pesto',
    allergens: ['Dairy'], 
    basePrice: 65,
    nutritionalInfo: { kcal: 450, protein: '15g', carbs: '10g', fat: '35g' },
    variations: [
      { name: 'Standard', price: 0 },
      { name: 'Extra Pesto', price: 5 },
      { name: 'With Focaccia', price: 10 }
    ],
    addons: [
      { name: 'Extra Burrata', price: 25 },
      { name: 'Extra Pesto', price: 5 },
      { name: 'Focaccia Bread', price: 8 }
    ]
  },
  { 
    name: 'Calamari Fritti', 
    description: 'Crispy fried squid with spicy marinara',
    allergens: ['Shellfish', 'Gluten'], 
    basePrice: 55,
    nutritionalInfo: { kcal: 520, protein: '22g', carbs: '35g', fat: '28g' },
    variations: [
      { name: 'Spicy Marinara', price: 0 },
      { name: 'Garlic Aioli', price: 0 }
    ],
    addons: [
      { name: 'Extra Sauce', price: 5 },
      { name: 'Side Salad', price: 15 }
    ]
  },
  { 
    name: 'Margherita', 
    description: 'Tomato sauce, fresh mozzarella, basil',
    allergens: ['Dairy', 'Gluten'], 
    basePrice: 75,
    nutritionalInfo: { kcal: 850, protein: '32g', carbs: '95g', fat: '34g' },
    variations: [
      { name: 'Thin Crust', price: 0 },
      { name: 'Thick Crust', price: 5 },
      { name: 'Buffalo Mozzarella', price: 15 }
    ],
    addons: [
      { name: 'Olives', price: 5 },
      { name: 'Mushrooms', price: 8 },
      { name: 'Hot Salami', price: 12 }
    ]
  },
  { 
    name: 'Diavola', 
    description: 'Tomato sauce, mozzarella, spicy salami',
    allergens: ['Dairy', 'Gluten'], 
    basePrice: 85,
    nutritionalInfo: { kcal: 980, protein: '38g', carbs: '92g', fat: '45g' },
    variations: [
      { name: 'Standard', price: 0 },
      { name: 'Extra Spicy', price: 2 }
    ],
    addons: [
      { name: 'Jalapenos', price: 5 },
      { name: 'Hot Honey', price: 8 }
    ]
  },
  { 
    name: 'Osso Buco alla Milanese', 
    description: 'Veal shank · saffron risotto',
    allergens: ['Dairy', 'Gluten'], 
    basePrice: 145,
    nutritionalInfo: { kcal: 892, protein: '32g', carbs: '98g', fat: '38g' },
    variations: [
      { name: 'Classic Saffron', price: 0 },
      { name: 'Extra Risotto', price: 25 }
    ],
    addons: [
      { name: 'Bone Marrow', price: 30 },
      { name: 'Asparagus', price: 15 }
    ]
  },
  { 
    name: 'Spaghetti alle Vongole', 
    description: 'Fresh clams, garlic, white wine, parsley',
    allergens: ['Shellfish', 'Gluten'], 
    basePrice: 98,
    nutritionalInfo: { kcal: 650, protein: '28g', carbs: '85g', fat: '18g' },
    variations: [
      { name: 'Classic', price: 0 },
      { name: 'Spicy', price: 0 }
    ],
    addons: [
      { name: 'Extra Clams', price: 35 },
      { name: 'Bottarga', price: 20 }
    ]
  },
  { 
    name: 'Branzino al Forno', 
    description: 'Baked whole sea bass, herbs, lemon',
    allergens: ['Fish'], 
    basePrice: 130,
    nutritionalInfo: { kcal: 420, protein: '45g', carbs: '5g', fat: '15g' },
    variations: [
      { name: 'Grilled', price: 0 },
      { name: 'Al Forno', price: 0 }
    ],
    addons: [
      { name: 'Roasted Potatoes', price: 15 },
      { name: 'Sautéed Spinach', price: 15 }
    ]
  },
  { 
    name: 'Patatine Fritte', 
    description: 'Classic crispy fries',
    allergens: [], 
    basePrice: 25,
    nutritionalInfo: { kcal: 400, protein: '4g', carbs: '48g', fat: '20g' },
    variations: [
      { name: 'Classic', price: 0 },
      { name: 'Truffle Oil & Parmesan', price: 10 }
    ],
    addons: [
      { name: 'Cheese Dip', price: 5 },
      { name: 'Garlic Mayo', price: 3 }
    ]
  },
  { 
    name: 'Tiramisu Classico', 
    description: 'Coffee-soaked ladyfingers with mascarpone',
    allergens: ['Dairy', 'Gluten', 'Eggs'], 
    basePrice: 48,
    nutritionalInfo: { kcal: 580, protein: '8g', carbs: '55g', fat: '32g' },
    variations: [
      { name: 'Standard', price: 0 },
      { name: 'Decaf Version', price: 0 }
    ],
    addons: [
      { name: 'Chocolate Shavings', price: 5 },
      { name: 'Espresso Shot', price: 8 }
    ]
  },
];

interface CartScreenProps {
  tableNumber: string;
  onBack: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSent: () => void;
}

export function CartScreen({ tableNumber, onBack, cart, setCart, onOrderSent }: CartScreenProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(cart.map(i => i.id));
  const [isFooterExpanded, setIsFooterExpanded] = useState(true);
  const footerTouchStartY = useRef(0);
  const { toast } = useToast();
  
  const [sliderX, setSliderX] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [isOrderSent, setIsOrderSent] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderStartX = useRef(0);

  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<CartItem | null>(null);
  const [menuItemData, setMenuItemData] = useState<MenuItem | null>(null);

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

  const handleEditClick = (item: CartItem) => {
    const data = menuData.find(m => m.name === item.name);
    if (data) {
      setMenuItemData(data);
      setItemToEdit(item);
      setIsEditSheetOpen(true);
    } else {
      toast({
        title: "Error",
        description: "Menu item details not found.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateItem = (originalId: string, flavor: string | undefined, addons: CartItemAddon[], requests: string, qty: number) => {
    setCart(prev => prev.map(ci => 
      ci.id === originalId 
        ? { ...ci, flavor, addons, specialRequests: requests, quantity: qty }
        : ci
    ));
    setIsEditSheetOpen(false);
    toast({
      title: "Success",
      description: "Item updated successfully",
      duration: 3000,
    });
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
          const hasAddons = item.addons.length > 0;

          return (
            <div 
              key={item.id} 
              className={cn(
                "bg-white rounded-[24px] shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-white overflow-hidden transition-all duration-300 relative",
                hasInstructions && "border-l-[5px] border-l-[#f59e0b]"
              )}
            >
              <div className="p-4">
                {/* Header Row: Always visible */}
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
                    <CurrencyAmount amount={itemDisplayTotal} weight="black" className="text-[14px] text-[#0066b2]" />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => handleEditClick(item)}
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
                          isExpanded ? "rotate-0" : ""
                        )}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Area: Only Addons now */}
                {isExpanded && hasAddons && (
                  <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-full border-t border-dashed border-gray-100" />
                    
                    <div className="flex flex-wrap gap-2">
                      {item.addons.map((addon, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#f0f7ff] border border-[#d1e9ff] rounded-full px-3 py-1 flex items-center gap-2"
                        >
                          <span className="text-[#0066b2] text-[10px] font-black tracking-tight">
                            + {addon.name}{addon.quantity > 1 ? ` x${addon.quantity}` : ''}
                          </span>
                          <CurrencyAmount amount={addon.price * addon.quantity} weight="black" className="text-[#0066b2]/60 text-[9px]" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instruction Box: Moved outside collapse check to be ALWAYS visible */}
                {hasInstructions && (
                  <div className="mt-4 bg-[#fffbeb] rounded-[16px] p-3 border border-dashed border-[#f59e0b] space-y-1 animate-in fade-in duration-300">
                    <span className="text-[#92400e] text-[9px] font-black uppercase tracking-wider block">Special Instruction</span>
                    <p className="text-[#92400e] text-[12px] font-bold leading-tight">
                      {item.specialRequests}
                    </p>
                  </div>
                )}

                {/* Footer Controls: Always visible */}
                <div className="flex items-center justify-between pt-4 mt-2">
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
            </div>
          );
        })}
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
            <CurrencyAmount amount={subtotal} weight="black" className="text-[22px] text-[#1a1c2e]" />
          </div>

          <div 
            ref={sliderContainerRef}
            className="relative h-[56px] w-full bg-[#0066b2] rounded-[18px] p-1 flex items-center overflow-hidden shadow-[0_6px_20px_rgba(0,102,178,0.18)] shrink-0 select-none"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-white text-[15px] font-black tracking-tight opacity-80">
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
        </div>
      </div>

      {/* Dialogs and Sheets */}
      {menuItemData && itemToEdit && (
        <ItemDetailSheet 
          isOpen={isEditSheetOpen}
          onClose={() => setIsEditSheetOpen(false)}
          item={menuItemData}
          onAdd={(item, flavor, addons, requests, qty) => handleUpdateItem(itemToEdit.id, flavor, addons, requests, qty)}
          editingItem={itemToEdit}
        />
      )}

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
              className="w-full h-12 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[16px] text-sm font-black shadow-md"
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
              className="w-full h-12 bg-[#0066b2] hover:bg-[#005596] text-white rounded-[16px] text-sm font-black shadow-md"
            >
              Save Note
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemDetailSheet({ 
  isOpen, 
  onClose, 
  item, 
  onAdd,
  editingItem,
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  item: MenuItem | null;
  onAdd: (item: MenuItem, flavor: string | undefined, addons: CartItemAddon[], requests: string, qty: number) => void;
  editingItem?: CartItem | null;
}) {
  const [selectedFlavor, setSelectedFlavor] = useState<MenuItemOption | null>(null);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [specialRequests, setSpecialRequests] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  
  const addonsSectionRef = useRef<HTMLDivElement>(null);
  const specialRequestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        const flavor = item?.variations.find(v => v.name === editingItem.flavor) || null;
        setSelectedFlavor(flavor);
        const quantities: Record<string, number> = {};
        editingItem.addons.forEach(a => {
          quantities[a.name] = a.quantity;
        });
        setAddonQuantities(quantities);
        setSpecialRequests(editingItem.specialRequests);
        setItemQuantity(editingItem.quantity);
      } else {
        setSelectedFlavor(null);
        setAddonQuantities({});
        setSpecialRequests('');
        setItemQuantity(1);
      }
    }
  }, [isOpen, editingItem, item]);

  const handleFlavorSelect = (flavor: MenuItemOption) => {
    setSelectedFlavor(flavor);
    setTimeout(() => {
      if (item?.addons && item.addons.length > 0) {
        addonsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        specialRequestsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  const updateAddonQty = (addon: string, delta: number) => {
    setAddonQuantities(prev => ({
      ...prev,
      [addon]: Math.max(0, (prev[addon] || 0) + delta)
    }));
  };

  const isCustomized = item ? (item.variations.length === 0 || selectedFlavor !== null) : false;

  const totalPrice = useMemo(() => {
    if (!item) return 0;
    let price = item.basePrice;
    if (selectedFlavor) price += selectedFlavor.price;
    if (item.addons) {
      item.addons.forEach(addon => {
        const qty = addonQuantities[addon.name] || 0;
        price += addon.price * qty;
      });
    }
    return price * itemQuantity;
  }, [item, selectedFlavor, addonQuantities, itemQuantity]);

  if (!item) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-[40px] border-none p-0 flex flex-col outline-none overflow-hidden h-[85vh]">
        <SheetHeader className="sr-only">
          <SheetTitle>{item.name}</SheetTitle>
        </SheetHeader>

        <div className="absolute top-6 right-6 z-20">
          <button onClick={onClose} className="w-9 h-9 bg-[#f1f5f9] flex items-center justify-center rounded-full active:scale-90 transition-all">
            <X className="w-5 h-5 text-[#1e293b] stroke-[2.5px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-32 px-6 pt-8">
          <div className="max-w-md mx-auto space-y-6">
            <div className="space-y-1">
              <h2 className="text-[#1a1c2e] text-[28px] font-black leading-tight tracking-tight">
                {item.name}
              </h2>
              <p className="text-[#94a3b8] text-[15px] font-bold">
                {item.description}
              </p>
              <div className="flex items-baseline gap-2 pt-1">
                <CurrencyAmount amount={item.basePrice} weight="black" className="text-[24px] text-[#1a1c2e]" />
                <span className="text-[#94a3b8] text-[13px] font-bold">
                  (Base Price)
                </span>
              </div>
            </div>

            <div className="bg-[#f8fbff] rounded-[24px] p-5 border border-[#f0f4f8]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#f97316] fill-[#f97316]" />
                  <span className="text-[#1a1c2e] text-[15px] font-black tracking-tight">Nutritional Info</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: item.nutritionalInfo.kcal, label: 'Kcal' },
                  { value: item.nutritionalInfo.protein, label: 'Protein' },
                  { value: item.nutritionalInfo.carbs, label: 'Carbs' },
                  { value: item.nutritionalInfo.fat, label: 'Fat' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-[16px] p-3 flex flex-col items-center justify-center shadow-sm border border-[#f1f5f9]">
                    <span className="text-[#1a1c2e] text-[14px] font-black leading-none">{stat.value}</span>
                    <span className="text-[#94a3b8] text-[9px] font-black mt-1 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fffbeb] rounded-[24px] p-5 border border-[#fef3c7]">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]/10" />
                <span className="text-[#1a1c2e] text-[15px] font-black tracking-tight">Allergen Information</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.allergens.length > 0 ? (
                  <span className="text-[#4b5563] text-[12px] font-black uppercase tracking-tight">
                    {item.allergens.join(', ')}
                  </span>
                ) : (
                  <span className="text-[#94a3b8] text-[12px] font-bold">No common allergens</span>
                )}
              </div>
            </div>

            {item.variations.length > 0 && (
              <div className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#f1f5f9]">
                <span className="text-[#1a1c2e] text-[17px] font-black tracking-tight mb-5 block">Variation</span>
                <div className="space-y-3">
                  {item.variations.map((v, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between py-1 cursor-pointer" onClick={() => handleFlavorSelect(v)}>
                        <div className="flex flex-col">
                          <span className="text-[#334155] text-[14px] font-black">{v.name}</span>
                          {v.price > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-[#0066b2] text-[11px] font-bold">+</span>
                              <CurrencyAmount amount={v.price} weight="bold" className="text-[11px] text-[#0066b2]" />
                            </div>
                          )}
                        </div>
                        <div className={cn("w-5 h-5 rounded-full border-[2px] flex items-center justify-center", selectedFlavor?.name === v.name ? "border-[#0066b2] bg-white" : "border-gray-200")}>
                          {selectedFlavor?.name === v.name && <div className="w-2.5 h-2.5 bg-[#0066b2] rounded-full" />}
                        </div>
                      </div>
                      {i !== item.variations.length - 1 && <div className="w-full border-b border-dotted border-gray-200 mt-2" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.addons && item.addons.length > 0 && (
              <div ref={addonsSectionRef} className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#f1f5f9]">
                <span className="text-[#1a1c2e] text-[17px] font-black tracking-tight mb-5 block">Add-ons</span>
                <div className="space-y-3">
                  {item.addons.map((addon, i) => {
                    const qty = addonQuantities[addon.name] || 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between py-1">
                          <div className="flex flex-col">
                            <span className="text-[#334155] text-[14px] font-black">{addon.name}</span>
                            <CurrencyAmount amount={addon.price} weight="bold" className="text-[11px] text-[#0066b2]" />
                          </div>
                          <div className="flex items-center gap-3">
                            {qty > 0 && (
                              <button onClick={() => updateAddonQty(addon.name, -1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[#ef4444] active:scale-90 transition-all">
                                {qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5 stroke-[3.5px]" />}
                              </button>
                            )}
                            {qty > 0 && <span className="text-[13px] font-black text-[#1a1c2e] min-w-[12px] text-center">{qty}</span>}
                            <button onClick={() => updateAddonQty(addon.name, 1)} className={cn("w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90", qty > 0 ? "bg-[#0066b2] text-white" : "bg-white border border-gray-200 text-[#0066b2]")}>
                              <Plus className="w-3.5 h-3.5 stroke-[3.5px]" />
                            </button>
                          </div>
                        </div>
                        {i !== item.addons!.length - 1 && <div className="w-full border-b border-dotted border-gray-200 mt-2" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={specialRequestsRef} className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#f1f5f9]">
              <span className="text-[#1a1c2e] text-[14px] font-black tracking-tight mb-3 block">Special requests</span>
              <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} placeholder="For example: less spicy, no sugar, etc." className="w-full h-24 bg-white rounded-2xl border border-[#e2e8f0] p-4 text-[13px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-[#0066b2] transition-colors resize-none" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-white px-6 pt-4 pb-6 border-t border-[#f0f4f8] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex items-center gap-4 z-30">
          <div className="h-12 bg-white border border-[#f0f4f8] rounded-full shadow-sm flex items-center px-1 min-w-[110px] justify-between overflow-hidden">
            <button onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))} className={cn("w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90", itemQuantity === 1 ? "bg-white text-[#ef4444]" : "bg-[#f1f5f9] text-[#1a1c2e]")}>
              {itemQuantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4 stroke-[2.5px]" />}
            </button>
            <span className="text-[18px] font-black text-[#1a1c2e] tabular-nums">{itemQuantity}</span>
            <button onClick={() => setItemQuantity(itemQuantity + 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-md active:scale-90 transition-all">
              <Plus className="w-4 h-4 stroke-[2.5px]" />
            </button>
          </div>
          <button disabled={!isCustomized} onClick={() => {
            const addons = Object.entries(addonQuantities).filter(([_, q]) => q > 0).map(([name, q]) => ({
              name, quantity: q, price: item.addons?.find(a => a.name === name)?.price || 0
            }));
            onAdd(item, selectedFlavor?.name, addons, specialRequests, itemQuantity);
            onClose();
          }} className={cn("flex-1 h-12 rounded-[16px] text-[16px] font-black shadow-[0_6px_20px_rgba(0,102,178,0.3)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all", isCustomized ? "bg-[#0066b2] hover:bg-[#005596] text-white" : "bg-gray-100 text-gray-400 shadow-none cursor-not-allowed")}>
            Update <span className="opacity-40 font-normal">●</span> <CurrencyAmount amount={totalPrice} weight="black" className="text-[16px] text-inherit" />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
