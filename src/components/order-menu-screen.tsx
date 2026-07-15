'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ChevronLeft, 
  Home, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  FileEdit,
  Flame,
  AlertTriangle,
  Pencil,
  Circle,
  SquarePen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { CartItem, CartItemAddon } from '@/lib/types';

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

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

interface OrderMenuScreenProps {
  tableNumber: string;
  onBack?: () => void;
  onHome?: () => void;
  onOpenCart?: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  editingItem?: CartItem | null;
  onCancelEdit?: () => void;
}

export function OrderMenuScreen({ tableNumber, onBack, onHome, onOpenCart, cart, setCart, editingItem, onCancelEdit }: OrderMenuScreenProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  const [detailMode, setDetailMode] = useState<'full' | 'compact'>('full');

  useEffect(() => {
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const menuData: MenuCategory[] = [
    { 
      title: 'STARTERS', 
      items: [
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
      ] 
    },
    { 
      title: 'PIZZA', 
      items: [
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
      ] 
    },
    { 
      title: 'MAINS', 
      items: [
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
      ] 
    },
    { 
      title: 'SIDES & SAUCES', 
      items: [
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
      ] 
    },
    { 
      title: 'DESSERTS', 
      items: [
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
      ] 
    },
  ];

  useEffect(() => {
    if (editingItem) {
      // Find the menu item matching the name
      let found: MenuItem | null = null;
      for (const cat of menuData) {
        const item = cat.items.find(i => i.name === editingItem.name);
        if (item) {
          found = item;
          break;
        }
      }
      if (found) {
        setSelectedItem(found);
        setDetailMode('full');
        setIsDetailSheetOpen(true);
      }
    }
  }, [editingItem]);

  const totalItemsInCart = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const getCategoryCartCount = (category: MenuCategory) => {
    return category.items.reduce((sum, menuItem) => {
      const items = cart.filter(ci => ci.name === menuItem.name);
      return sum + items.reduce((s, i) => s + i.quantity, 0);
    }, 0);
  };

  const toggleCategory = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title);
  };

  const handlePlusClick = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    const hasOptions = item.variations.length > 0 || (item.addons && item.addons.length > 0);
    
    if (hasOptions) {
      setSelectedItem(item);
      setDetailMode('compact');
      setIsDetailSheetOpen(true);
    } else {
      setCart(prev => {
        const existing = prev.find(ci => ci.name === item.name && !ci.flavor && ci.addons.length === 0 && !ci.specialRequests);
        if (existing) {
          return prev.map(ci => ci.id === existing.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
        }
        return [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          name: item.name,
          basePrice: item.basePrice,
          quantity: 1,
          addons: [],
          specialRequests: ''
        }];
      });
    }
  };

  const handleMinusClick = (e: React.MouseEvent, itemName: string) => {
    e.stopPropagation();
    setCart(prev => {
      // Find the most recently added version of this item (or the simple one)
      const existing = prev.filter(ci => ci.name === itemName).pop();
      if (!existing) return prev;
      
      if (existing.quantity > 1) {
        return prev.map(ci => ci.id === existing.id ? { ...ci, quantity: ci.quantity - 1 } : ci);
      }
      return prev.filter(ci => ci.id !== existing.id);
    });
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setDetailMode('full');
    setIsDetailSheetOpen(true);
  };

  const getItemQty = (itemName: string) => {
    return cart.filter(ci => ci.name === itemName).reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAddToCart = (item: MenuItem, flavor: string | undefined, addons: CartItemAddon[], requests: string, qty: number) => {
    setCart(prev => {
      if (editingItem) {
        // If editing, replace the specific item
        return prev.map(ci => 
          ci.id === editingItem.id 
            ? { ...ci, flavor, addons, specialRequests: requests, quantity: qty }
            : ci
        );
      }

      const isIdentical = (ci: CartItem) => ci.name === item.name && ci.flavor === flavor && JSON.stringify(ci.addons) === JSON.stringify(addons) && ci.specialRequests === requests;
      const existing = prev.find(isIdentical);
      
      if (existing) {
        return prev.map(ci => ci.id === existing.id ? { ...ci, quantity: ci.quantity + qty } : ci);
      }
      
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        name: item.name,
        basePrice: item.basePrice,
        quantity: qty,
        addons,
        specialRequests: requests,
        flavor
      }];
    });
    
    if (editingItem && onCancelEdit) {
      onCancelEdit();
    }
  };

  const handleCloseSheet = () => {
    setIsDetailSheetOpen(false);
    if (editingItem && onCancelEdit) {
      onCancelEdit();
    }
  };

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
            <h1 className="text-[20px] font-black leading-tight text-[#1a1c2e]">Menu</h1>
            <span className="text-[#94a3b8] text-[13px] font-bold">Table # {tableNumber}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onHome}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-[#eef2f8] bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            <Home className="w-5 h-5 text-[#0066b2] stroke-[2.5px]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
            <Search className="w-5 h-5 text-gray-700 stroke-[2.5px]" />
          </button>
          
          {totalItemsInCart > 0 && (
            <div className="relative animate-in zoom-in duration-300">
              <button 
                onClick={onOpenCart}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 stroke-[2.5px]" />
              </button>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4444] rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-[10px] font-black">{totalItemsInCart}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pt-6 overflow-y-auto pb-24">
        <div className="bg-white rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#f0f4f8] overflow-hidden">
          {menuData.map((category, index) => {
            const isExpanded = expandedCategory === category.title;
            const categoryItemsInCart = getCategoryCartCount(category);

            return (
              <div key={index} className={cn(index !== menuData.length - 1 && "border-b border-[#f0f4f8]")}>
                <button 
                  onClick={() => toggleCategory(category.title)}
                  className={cn(
                    "w-full h-16 px-6 flex items-center justify-between transition-colors active:bg-gray-50",
                    isExpanded && "bg-[#fcfdff]"
                  )}
                >
                  <span className="text-[14px] font-black text-[#334155] tracking-wide">
                    {category.title}
                  </span>
                  <div className="flex items-center gap-3">
                    {categoryItemsInCart > 0 && (
                      <div className="w-6 h-6 bg-[#ef4444] rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-[11px] font-black">{categoryItemsInCart}</span>
                      </div>
                    )}
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                      isExpanded ? "bg-[#e8edff]" : "bg-[#f0f7ff]"
                    )}>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#0066b2] stroke-[3px]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#0066b2] stroke-[3px]" />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && category.items.length > 0 && (
                  <div className="bg-[#f8fbff] animate-in fade-in slide-in-from-top-2 duration-300">
                    {category.items.map((item, itemIndex) => {
                      const quantity = getItemQty(item.name);
                      return (
                        <div 
                          key={itemIndex} 
                          className={cn(
                            "px-6 py-5 flex items-center justify-between gap-4 transition-colors active:bg-blue-50/30 cursor-pointer",
                            itemIndex !== category.items.length - 1 && "border-b border-[#eef2f8]"
                          )}
                          onClick={() => handleItemClick(item)}
                        >
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <h3 className="text-[17px] font-black text-[#1a1c2e] leading-tight truncate">
                              {item.name}
                            </h3>
                            <div className="flex gap-1.5 flex-wrap">
                              {item.allergens.map((allergen) => (
                                <span 
                                  key={allergen}
                                  className="px-2.5 py-0.5 rounded-full border-[1.5px] border-[#f59e0b] text-[#f59e0b] text-[11px] font-black tracking-tight"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                            <p className="text-[#0066b2] text-[18px] font-black mt-1">
                              AED {item.basePrice.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {quantity > 0 ? (
                              <>
                                <button 
                                  className="flex items-center gap-1.5 text-[#0066b2] text-[12px] font-black tracking-tight mb-1 whitespace-nowrap"
                                  onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                                >
                                  <SquarePen className="w-3.5 h-3.5" />
                                  <span className="border-b border-dotted border-[#0066b2]">Instruction</span>
                                </button>
                                <div className="flex items-center bg-white border border-[#eef2f8] rounded-full p-1 shadow-[0_4px_12px_rgba(0,0,0,0.05)] h-12 min-w-[110px] justify-between mt-5">
                                  <button 
                                    onClick={(e) => handleMinusClick(e, item.name)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-900 active:scale-90 transition-all"
                                  >
                                    {quantity === 1 ? (
                                      <Trash2 className="w-4.5 h-4.5 text-[#ef4444]" />
                                    ) : (
                                      <Minus className="w-4.5 h-4.5 stroke-[3.5px] text-gray-900" />
                                    )}
                                  </button>
                                  <span className="text-[18px] font-black text-[#1a1c2e] px-2 tabular-nums">{quantity}</span>
                                  <button 
                                    onClick={(e) => handlePlusClick(e, item)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0066b2] text-white active:scale-90 transition-all shadow-md"
                                  >
                                    <Plus className="w-4.5 h-4.5 stroke-[3.5px]" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <button 
                                onClick={(e) => handlePlusClick(e, item)}
                                className="w-14 h-14 bg-[#0066b2] rounded-full flex items-center justify-center text-white shadow-[0_6px_20px_rgba(0,102,178,0.25)] active:scale-90 transition-all"
                              >
                                <Plus className="w-7 h-7 stroke-[3.5px]" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && !editingItem && (
        <div className="absolute bottom-6 inset-x-6 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-4 flex items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-[1.5px] border-[#00d084]/20 overflow-hidden relative group">
            <div className="absolute inset-0 border-[1.5px] rounded-[20px] border-transparent bg-gradient-to-r from-transparent via-[#d1e9ff]/50 to-[#dce4ff]/50 pointer-events-none" />
            <div className="w-12 h-12 bg-[#00b8e6] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,184,230,0.3)]">
              <Check className="w-6 h-6 text-white stroke-[4px]" />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="text-[#1a1c2e] text-[15px] font-black tracking-tight leading-tight">
                Table Accessed Successfully
              </h3>
              <p className="text-[#94a3b8] text-[12px] font-bold mt-0.5 leading-tight">
                You can now take orders for Table #{tableNumber}.
              </p>
            </div>
            <button 
              onClick={() => setShowSuccess(false)}
              className="w-6 h-6 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Item Detail Sheet */}
      <ItemDetailSheet 
        isOpen={isDetailSheetOpen}
        onClose={handleCloseSheet}
        item={selectedItem}
        mode={detailMode}
        onAdd={handleAddToCart}
        editingItem={editingItem}
      />
    </div>
  );
}

function ItemDetailSheet({ 
  isOpen, 
  onClose, 
  item, 
  mode,
  onAdd,
  editingItem,
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  item: MenuItem | null;
  mode: 'full' | 'compact';
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
        // Pre-fill from editingItem
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

  const isCompact = mode === 'compact';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className={cn(
        "rounded-t-[40px] border-none p-0 flex flex-col outline-none overflow-hidden h-[85vh]"
      )}>
        <SheetHeader className="sr-only">
          <SheetTitle>{item.name}</SheetTitle>
        </SheetHeader>

        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-[#f1f5f9] flex items-center justify-center rounded-full active:scale-90 transition-all"
          >
            <X className="w-5 h-5 text-[#1e293b] stroke-[2.5px]" />
          </button>
        </div>

        <div className={cn("flex-1 overflow-y-auto pb-32 px-6", isCompact ? "pt-12" : "pt-8")}>
          <div className="max-w-md mx-auto space-y-6">
            <div className={cn("space-y-1", isCompact && "text-center")}>
              <h2 className="text-[#1a1c2e] text-[28px] font-black leading-tight tracking-tight">
                {item.name}
              </h2>
              {!isCompact && (
                <>
                  <p className="text-[#94a3b8] text-[15px] font-bold">
                    {item.description}
                  </p>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-[#1a1c2e] text-[24px] font-black">
                      AED {item.basePrice.toFixed(2)}
                    </span>
                    <span className="text-[#94a3b8] text-[13px] font-bold">
                      (Base Price)
                    </span>
                  </div>
                </>
              )}
            </div>

            {!isCompact && (
              <>
                <div className="bg-[#f8fbff] rounded-[24px] p-5 border border-[#f0f4f8]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-[#f97316] fill-[#f97316]" />
                      <span className="text-[#1a1c2e] text-[15px] font-black tracking-tight">Nutritional Info</span>
                    </div>
                    <span className="text-[#94a3b8] text[] text-[11px] font-bold">Per serving</span>
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
                    {item.allergens.map((allergen) => (
                      <div key={allergen} className="bg-white rounded-xl px-3 py-1.5 border border-[#fef3c7] flex items-center gap-1.5 shadow-sm">
                        {allergen === 'Gluten' && <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />}
                        {allergen === 'Dairy' && <Circle className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />}
                        <span className="text-[#4b5563] text-[12px] font-black">{allergen}</span>
                      </div>
                    ))}
                    {item.allergens.length === 0 && (
                      <span className="text-[#94a3b8] text-[12px] font-bold">No common allergens</span>
                    )}
                  </div>
                </div>
              </>
            )}

            {item.variations.length > 0 && (
              <div className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#f1f5f9]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1a1c2e] text-[17px] font-black tracking-tight">Flavor</span>
                    <span className="bg-[#fef2f2] text-[#ef4444] text-[8px] font-black px-2 py-0.5 rounded-full border border-[#fee2e2] uppercase">Required</span>
                  </div>
                </div>
                <p className="text-[#94a3b8] text-[12px] font-bold mb-5">Select one option</p>
                
                <div className="space-y-3">
                  {item.variations.map((v, i) => (
                    <div key={i}>
                      <div 
                        className="flex items-center justify-between py-1 group cursor-pointer"
                        onClick={() => handleFlavorSelect(v)}
                      >
                        <div className="flex flex-col">
                          <span className="text-[#334155] text-[14px] font-black">{v.name}</span>
                          {v.price > 0 && <span className="text-[#0066b2] text-[11px] font-bold">+ AED {v.price.toFixed(2)}</span>}
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-[2px] flex items-center justify-center transition-all",
                          selectedFlavor?.name === v.name ? "border-[#0066b2] bg-white" : "border-gray-200"
                        )}>
                          {selectedFlavor?.name === v.name && <div className="w-2.5 h-2.5 bg-[#0066b2] rounded-full" />}
                        </div>
                      </div>
                      {i !== item.variations.length - 1 && (
                        <div className="w-full border-b border-dotted border-gray-200 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.addons && item.addons.length > 0 && (
              <div ref={addonsSectionRef} className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#f1f5f9]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1a1c2e] text-[17px] font-black tracking-tight">Add-ons</span>
                  </div>
                </div>
                <p className="text-[#94a3b8] text-[12px] font-bold mb-5">Select multiple extras</p>
                
                <div className="space-y-3">
                  {item.addons.map((addon, i) => {
                    const qty = addonQuantities[addon.name] || 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between py-1 group">
                          <div className="flex flex-col">
                            <span className="text-[#334155] text-[14px] font-black">{addon.name}</span>
                            <span className="text-[#0066b2] text-[11px] font-bold">AED {addon.price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {qty > 0 && (
                              <button 
                                onClick={() => updateAddonQty(addon.name, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[#ef4444] active:scale-90 transition-all"
                              >
                                {qty === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5 stroke-[3.5px]" />}
                              </button>
                            )}
                            {qty > 0 && <span className="text-[13px] font-black text-[#1a1c2e] min-w-[12px] text-center">{qty}</span>}
                            <button 
                              onClick={() => updateAddonQty(addon.name, 1)}
                              className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90",
                                qty > 0 ? "bg-[#0066b2] text-white" : "bg-white border border-gray-200 text-[#0066b2]"
                              )}
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[3.5px]" />
                            </button>
                          </div>
                        </div>
                        {i !== item.addons!.length - 1 && (
                          <div className="w-full border-b border-dotted border-gray-200 mt-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div ref={specialRequestsRef} className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#f1f5f9]">
              <div className="flex items-center gap-2 mb-3">
                <Pencil className="w-4 h-4 text-[#94a3b8]" />
                <span className="text-[#1a1c2e] text-[14px] font-black tracking-tight">Special requests</span>
              </div>
              <div className="relative">
                <textarea 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="For example: less spicy, no sugar, etc."
                  className="w-full h-24 bg-white rounded-2xl border border-[#e2e8f0] p-4 text-[13px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-[#0066b2] transition-colors resize-none"
                />
                <span className="absolute bottom-4 right-4 text-[#cbd5e1] text-[10px] font-bold">
                  {specialRequests.length}/150
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-white px-6 pt-4 pb-6 border-t border-[#f0f4f8] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex items-center gap-4 z-30">
          <div className="h-12 bg-white border border-[#f0f4f8] rounded-full shadow-sm flex items-center px-1 min-w-[110px] justify-between overflow-hidden">
            <button 
              onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90",
                itemQuantity === 1 ? "bg-white text-[#ef4444]" : "bg-[#f1f5f9] text-[#1a1c2e]"
              )}
            >
              {itemQuantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4 stroke-[2.5px]" />}
            </button>
            <span className="text-[18px] font-black text-[#1a1c2e] tabular-nums">{itemQuantity}</span>
            <button 
              onClick={() => setItemQuantity(itemQuantity + 1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-md active:scale-90 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5px]" />
            </button>
          </div>

          <button 
            disabled={!isCustomized}
            onClick={() => {
              const addons = Object.entries(addonQuantities)
                .filter(([_, q]) => q > 0)
                .map(([name, q]) => ({
                  name,
                  quantity: q,
                  price: item.addons?.find(a => a.name === name)?.price || 0
                }));
              
              onAdd(item, selectedFlavor?.name, addons, specialRequests, itemQuantity);
              onClose();
            }}
            className={cn(
              "flex-1 h-12 rounded-[16px] text-[16px] font-black shadow-[0_6px_20px_rgba(0,102,178,0.3)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all",
              isCustomized 
                ? "bg-[#0066b2] hover:bg-[#005596] text-white" 
                : "bg-gray-100 text-gray-400 shadow-none cursor-not-allowed"
            )}
          >
            {editingItem ? 'Update' : 'Add'} <span className="opacity-40 font-normal">●</span> AED {totalPrice.toFixed(2)}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
