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
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface MenuItem {
  name: string;
  description: string;
  allergens: string[];
  price: string;
  nutritionalInfo: {
    kcal: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  variations: string[];
  addons?: string[];
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

interface OrderMenuScreenProps {
  tableNumber: string;
  onBack?: () => void;
  onHome?: () => void;
}

export function OrderMenuScreen({ tableNumber, onBack, onHome }: OrderMenuScreenProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);
  
  // Cart state: Record<itemName, quantity>
  const [cart, setCart] = useState<Record<string, number>>({});

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
          price: '65.00',
          nutritionalInfo: { kcal: 450, protein: '15g', carbs: '10g', fat: '35g' },
          variations: ['Extra Pesto', 'With Focaccia', 'Extra Tomatoes', 'Balsamic Glaze'],
          addons: ['Extra Burrata', 'Extra Pesto', 'Focaccia Bread', 'Arugula']
        },
        { 
          name: 'Calamari Fritti', 
          description: 'Crispy fried squid with spicy marinara',
          allergens: ['Shellfish', 'Gluten'], 
          price: '55.00',
          nutritionalInfo: { kcal: 520, protein: '22g', carbs: '35g', fat: '28g' },
          variations: ['Spicy Marinara', 'Garlic Aioli', 'Lemon Wedge', 'Tartar Sauce'],
          addons: ['Extra Sauce', 'Lemon Wedges', 'Side Salad']
        },
        { 
          name: 'Bruschetta Classica', 
          description: 'Toasted bread with tomatoes, garlic, and basil',
          allergens: ['Gluten'], 
          price: '42.00',
          nutritionalInfo: { kcal: 310, protein: '8g', carbs: '45g', fat: '12g' },
          variations: ['Extra Garlic', 'Balsamic Drizzle', 'With Anchovies', 'Standard'],
          addons: ['Extra Tomatoes', 'Prosciutto', 'Buffalo Mozzarella']
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
          price: '75.00',
          nutritionalInfo: { kcal: 850, protein: '32g', carbs: '95g', fat: '34g' },
          variations: ['Buffalo Mozzarella', 'Extra Basil', 'Thin Crust', 'Thick Crust'],
          addons: ['Olives', 'Mushrooms', 'Hot Salami', 'Bell Peppers']
        },
        { 
          name: 'Diavola', 
          description: 'Tomato sauce, mozzarella, spicy salami',
          allergens: ['Dairy', 'Gluten'], 
          price: '85.00',
          nutritionalInfo: { kcal: 980, protein: '38g', carbs: '92g', fat: '45g' },
          variations: ['Extra Spicy', 'Less Cheese', 'With Olives', 'Standard'],
          addons: ['Jalapenos', 'Hot Honey', 'Extra Salami']
        },
        { 
          name: 'Quattro Formaggi', 
          description: 'Mozzarella, gorgonzola, parmesan, fontina',
          allergens: ['Dairy', 'Gluten'], 
          price: '90.00',
          nutritionalInfo: { kcal: 1100, protein: '42g', carbs: '98g', fat: '58g' },
          variations: ['Honey Drizzle', 'With Walnuts', 'Thin Crust', 'Extra Gorgonzola'],
          addons: ['Truffle Oil', 'Caramelized Onions']
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
          price: '145.00',
          nutritionalInfo: { kcal: 892, protein: '32g', carbs: '98g', fat: '38g' },
          variations: ['Classic Saffron', 'Extra Risotto', 'Less Sauce', 'Soft Veal'],
          addons: ['Bone Marrow', 'Asparagus', 'Parmesan Crisps']
        },
        { 
          name: 'Spaghetti alle Vongole', 
          description: 'Spaghetti with fresh clams and white wine',
          allergens: ['Shellfish', 'Gluten'], 
          price: '98.00',
          nutritionalInfo: { kcal: 680, protein: '28g', carbs: '85g', fat: '22g' },
          variations: ['Extra Chili', 'More Garlic', 'White Wine Sauce', 'Red Sauce'],
          addons: ['Extra Clams', 'Breadcrumbs', 'Parsley']
        },
        { 
          name: 'Branzino al Forno', 
          description: 'Roasted sea bass with herbs and vegetables',
          allergens: ['Fish'], 
          price: '130.00',
          nutritionalInfo: { kcal: 550, protein: '45g', carbs: '15g', fat: '32g' },
          variations: ['Lemon Butter', 'Olive Tapenade', 'Grilled Veggies', 'Roasted Potatoes'],
          addons: ['Spinach', 'Lemon Wedges', 'Herb Oil']
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
          price: '25.00',
          nutritionalInfo: { kcal: 400, protein: '4g', carbs: '48g', fat: '20g' },
          variations: ['Truffle Oil', 'Parmesan', 'Spicy Dip', 'Ketchup'],
          addons: ['Cheese Dip', 'Garlic Mayo']
        },
        { 
          name: 'Insalata Mista', 
          description: 'Mixed garden salad with house dressing',
          allergens: [], 
          price: '30.00',
          nutritionalInfo: { kcal: 150, protein: '2g', carbs: '12g', fat: '8g' },
          variations: ['Italian Dressing', 'Caesar Dressing', 'No Dressing', 'Lemon Vinaigrette'],
          addons: ['Croutons', 'Feta Cheese']
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
          price: '48.00',
          nutritionalInfo: { kcal: 580, protein: '8g', carbs: '55g', fat: '32g' },
          variations: ['Extra Cocoa', 'With Berries', 'Decaf Version', 'Standard'],
          addons: ['Chocolate Shavings', 'Espresso Shot']
        },
        { 
          name: 'Panna Cotta', 
          description: 'Cooked cream dessert with berry coulis',
          allergens: ['Dairy'], 
          price: '42.00',
          nutritionalInfo: { kcal: 420, protein: '4g', carbs: '38g', fat: '28g' },
          variations: ['Frutti di Bosco', 'Caramel Sauce', 'Vanilla Bean', 'Chocolate Drizzle'],
          addons: ['Mixed Berries', 'Mint Leaf']
        },
      ] 
    },
  ];

  const totalItemsInCart = useMemo(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  const getCategoryCartCount = (category: MenuCategory) => {
    return category.items.reduce((sum, item) => sum + (cart[item.name] || 0), 0);
  };

  const toggleCategory = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title);
  };

  const addToCart = (itemName: string) => {
    setCart(prev => ({
      ...prev,
      [itemName]: (prev[itemName] || 0) + 1
    }));
  };

  const removeFromCart = (itemName: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemName] > 1) {
        newCart[itemName] -= 1;
      } else {
        delete newCart[itemName];
      }
      return newCart;
    });
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDetailSheetOpen(true);
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
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
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
                      const quantity = cart[item.name] || 0;
                      return (
                        <div 
                          key={itemIndex} 
                          className={cn(
                            "px-6 py-5 flex items-center justify-between gap-4 transition-colors active:bg-blue-50/30",
                            itemIndex !== category.items.length - 1 && "border-b border-[#eef2f8]"
                          )}
                        >
                          <div 
                            className="flex flex-col gap-1.5 flex-1 min-w-0 cursor-pointer"
                            onClick={() => handleItemClick(item)}
                          >
                            <h3 className="text-[15px] font-black text-[#1a1c2e] leading-tight truncate">
                              {item.name}
                            </h3>
                            <div className="flex gap-1.5 flex-wrap">
                              {item.allergens.map((allergen) => (
                                <span 
                                  key={allergen}
                                  className="px-2.5 py-0.5 rounded-full border border-[#f59e0b]/40 text-[#f59e0b] text-[10px] font-black tracking-tight"
                                >
                                  {allergen}
                                </span>
                              ))}
                            </div>
                            <p className="text-[#0066b2] text-[15px] font-black mt-1">
                              AED {item.price}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-3 shrink-0">
                            {quantity > 0 ? (
                              <>
                                <button 
                                  className="flex items-center gap-1 text-[#0066b2] text-[11px] font-black tracking-tight mb-1 whitespace-nowrap"
                                  onClick={() => handleItemClick(item)}
                                >
                                  <FileEdit className="w-3 h-3" />
                                  <span className="border-b border-dotted border-[#0066b2]">Add Instruction</span>
                                </button>
                                <div className="flex items-center bg-white border border-[#eef2f8] rounded-full p-1 shadow-sm h-11 min-w-[100px] justify-between">
                                  <button 
                                    onClick={() => removeFromCart(item.name)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f1f5f9] text-[#ef4444] active:scale-90 transition-all"
                                  >
                                    {quantity === 1 ? (
                                      <Trash2 className="w-4 h-4" />
                                    ) : (
                                      <Minus className="w-4 h-4 stroke-[3px]" />
                                    )}
                                  </button>
                                  <span className="text-[15px] font-black text-[#1a1c2e] px-2">{quantity}</span>
                                  <button 
                                    onClick={() => addToCart(item.name)}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0066b2] text-white active:scale-90 transition-all shadow-md shadow-blue-200"
                                  >
                                    <Plus className="w-4 h-4 stroke-[3px]" />
                                  </button>
                                </div>
                              </>
                            ) : (
                              <button 
                                onClick={() => addToCart(item.name)}
                                className="w-12 h-12 bg-[#0066b2] rounded-full flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,102,178,0.3)] active:scale-90 transition-all"
                              >
                                <Plus className="w-6 h-6 stroke-[3px]" />
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
      {showSuccess && (
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
        onClose={() => setIsDetailSheetOpen(false)}
        item={selectedItem}
        onAdd={() => selectedItem && addToCart(selectedItem.name)}
      />
    </div>
  );
}

function ItemDetailSheet({ 
  isOpen, 
  onClose, 
  item, 
  onAdd,
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  item: MenuItem | null;
  onAdd: () => void;
}) {
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [specialRequests, setSpecialRequests] = useState('');
  
  const addonsSectionRef = useRef<HTMLDivElement>(null);
  const specialRequestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedFlavor(null);
      setAddonQuantities({});
      setSpecialRequests('');
    }
  }, [isOpen]);

  if (!item) return null;

  const handleFlavorSelect = (flavor: string) => {
    setSelectedFlavor(flavor);
    // Auto scroll to addons or special requests
    setTimeout(() => {
      if (item.addons && item.addons.length > 0) {
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

  const isCustomized = selectedFlavor !== null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[94vh] rounded-t-[40px] border-none p-0 flex flex-col outline-none overflow-hidden">
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

        <div className="flex-1 overflow-y-auto pt-10 pb-32 px-6">
          <div className="max-w-md mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-[#1a1c2e] text-[32px] font-black leading-tight tracking-tight">
                {item.name}
              </h2>
              <p className="text-[#94a3b8] text-[16px] font-bold">
                {item.description}
              </p>
              <div className="flex items-baseline gap-2 pt-2">
                <span className="text-[#1a1c2e] text-[28px] font-black">
                  AED {item.price}
                </span>
                <span className="text-[#94a3b8] text-[14px] font-bold">
                  (Base Price)
                </span>
              </div>
            </div>

            <div className="bg-[#f8fbff] rounded-[24px] p-6 border border-[#f0f4f8]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#f97316] fill-[#f97316]" />
                  <span className="text-[#1a1c2e] text-[15px] font-black tracking-tight">Nutritional Info</span>
                </div>
                <span className="text-[#94a3b8] text-[11px] font-bold">Per serving</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { value: item.nutritionalInfo.kcal, label: 'Kcal' },
                  { value: item.nutritionalInfo.protein, label: 'Protein' },
                  { value: item.nutritionalInfo.carbs, label: 'Carbs' },
                  { value: item.nutritionalInfo.fat, label: 'Fat' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-[16px] p-3.5 flex flex-col items-center justify-center shadow-sm border border-[#f1f5f9]">
                    <span className="text-[#1a1c2e] text-[15px] font-black leading-none">{stat.value}</span>
                    <span className="text-[#94a3b8] text-[10px] font-black mt-1 uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#fffbeb] rounded-[24px] p-6 border border-[#fef3c7]">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]/10" />
                <span className="text-[#1a1c2e] text-[15px] font-black tracking-tight">Allergen Information</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {item.allergens.map((allergen) => (
                  <div key={allergen} className="bg-white rounded-xl px-4 py-2 border border-[#fef3c7] flex items-center gap-2 shadow-sm">
                    {allergen === 'Gluten' && <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />}
                    {allergen === 'Dairy' && <Circle className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />}
                    <span className="text-[#4b5563] text-[13px] font-black">{allergen}</span>
                  </div>
                ))}
                {item.allergens.length === 0 && (
                  <span className="text-[#94a3b8] text-[13px] font-bold">No common allergens</span>
                )}
              </div>
            </div>

            {/* Flavor Section (Required) */}
            <div className="bg-[#f8fafc] rounded-[24px] p-6 border border-[#f1f5f9]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#1a1c2e] text-[18px] font-black tracking-tight">Flavor</span>
                  <span className="bg-[#fef2f2] text-[#ef4444] text-[9px] font-black px-2 py-0.5 rounded-full border border-[#fee2e2] uppercase">Required</span>
                </div>
              </div>
              <p className="text-[#94a3b8] text-[13px] font-bold mb-6">Select one option</p>
              
              <div className="space-y-4">
                {item.variations.map((v, i) => (
                  <div key={i}>
                    <div 
                      className="flex items-center justify-between py-2 group cursor-pointer"
                      onClick={() => handleFlavorSelect(v)}
                    >
                      <span className="text-[#334155] text-[15px] font-black">{v}</span>
                      <div className={cn(
                        "w-6 h-6 rounded-full border-[2px] flex items-center justify-center transition-all",
                        selectedFlavor === v ? "border-[#0066b2] bg-white" : "border-gray-200"
                      )}>
                        {selectedFlavor === v && <div className="w-3 h-3 bg-[#0066b2] rounded-full" />}
                      </div>
                    </div>
                    {i !== item.variations.length - 1 && (
                      <div className="w-full border-b border-dotted border-gray-200 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Addons Section (Multi-select with Quantity) */}
            {item.addons && item.addons.length > 0 && (
              <div ref={addonsSectionRef} className="bg-[#f8fafc] rounded-[24px] p-6 border border-[#f1f5f9]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#1a1c2e] text-[18px] font-black tracking-tight">Add-ons</span>
                  </div>
                </div>
                <p className="text-[#94a3b8] text-[13px] font-bold mb-6">Select multiple extras</p>
                
                <div className="space-y-4">
                  {item.addons.map((addon, i) => {
                    const qty = addonQuantities[addon] || 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between py-2 group">
                          <span className="text-[#334155] text-[15px] font-black">{addon}</span>
                          <div className="flex items-center gap-3">
                            {qty > 0 && (
                              <button 
                                onClick={() => updateAddonQty(addon, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[#ef4444] active:scale-90 transition-all"
                              >
                                {qty === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4 stroke-[3.5px]" />}
                              </button>
                            )}
                            {qty > 0 && <span className="text-[14px] font-black text-[#1a1c2e] min-w-[14px] text-center">{qty}</span>}
                            <button 
                              onClick={() => updateAddonQty(addon, 1)}
                              className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-full transition-all active:scale-90",
                                qty > 0 ? "bg-[#0066b2] text-white" : "bg-white border border-gray-200 text-[#0066b2]"
                              )}
                            >
                              <Plus className="w-4 h-4 stroke-[3.5px]" />
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

            <div ref={specialRequestsRef} className="bg-[#f8fafc] rounded-[24px] p-6 border border-[#f1f5f9]">
              <div className="flex items-center gap-2 mb-4">
                <Pencil className="w-5 h-5 text-[#94a3b8]" />
                <span className="text-[#1a1c2e] text-[15px] font-black tracking-tight">Special requests</span>
              </div>
              <div className="relative">
                <textarea 
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="For example: less spicy, no sugar, etc."
                  className="w-full h-32 bg-white rounded-2xl border border-[#e2e8f0] p-4 text-[14px] font-medium placeholder:text-gray-300 focus:outline-none focus:border-[#0066b2] transition-colors resize-none"
                />
                <span className="absolute bottom-4 right-4 text-[#cbd5e1] text-[11px] font-bold">
                  {specialRequests.length}/150
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-white px-6 pt-5 pb-8 border-t border-[#f0f4f8] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex items-center gap-4 z-30">
          <button 
            disabled={!isCustomized}
            onClick={() => {
              onAdd();
              onClose();
            }}
            className={cn(
              "flex-1 h-14 rounded-[18px] text-[17px] font-black shadow-[0_6px_20px_rgba(0,102,178,0.3)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all",
              isCustomized 
                ? "bg-[#0066b2] hover:bg-[#005596] text-white" 
                : "bg-gray-100 text-gray-400 shadow-none cursor-not-allowed"
            )}
          >
            Add · AED {item.price}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
