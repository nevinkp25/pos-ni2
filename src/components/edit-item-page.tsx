'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Flame, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Trash2, 
  SquarePen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CartItem, CartItemAddon, MenuItem, MenuItemOption } from '@/lib/types';
import { menuData } from '@/lib/menu-data';
import { CurrencyAmount } from './CurrencyAmount';

interface EditItemPageProps {
  item: CartItem;
  onSave: (updatedItem: CartItem) => void;
  onCancel: () => void;
}

export function EditItemPage({ item, onSave, onCancel }: EditItemPageProps) {
  const menuItem = useMemo(() => {
    for (const cat of menuData) {
      const found = cat.items.find(i => i.name === item.name);
      if (found) return found;
    }
    return null;
  }, [item.name]);

  const [selectedFlavor, setSelectedFlavor] = useState<MenuItemOption | null>(null);
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});
  const [specialRequests, setSpecialRequests] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  
  const addonsSectionRef = useRef<HTMLDivElement>(null);
  const specialRequestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuItem) {
      const flavor = menuItem.variations.find(v => v.name === item.flavor) || null;
      setSelectedFlavor(flavor);
      
      const quantities: Record<string, number> = {};
      item.addons.forEach(a => {
        quantities[a.name] = a.quantity;
      });
      setAddonQuantities(quantities);
      setSpecialRequests(item.specialRequests);
      setItemQuantity(item.quantity);
    }
  }, [item, menuItem]);

  const handleFlavorSelect = (flavor: MenuItemOption) => {
    setSelectedFlavor(flavor);
    setTimeout(() => {
      if (menuItem?.addons && menuItem.addons.length > 0) {
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

  const isCustomized = menuItem ? (menuItem.variations.length === 0 || selectedFlavor !== null) : false;

  const totalPrice = useMemo(() => {
    if (!menuItem) return 0;
    let price = menuItem.basePrice;
    if (selectedFlavor) price += selectedFlavor.price;
    if (menuItem.addons) {
      menuItem.addons.forEach(addon => {
        const qty = addonQuantities[addon.name] || 0;
        price += addon.price * qty;
      });
    }
    return price * itemQuantity;
  }, [menuItem, selectedFlavor, addonQuantities, itemQuantity]);

  if (!menuItem) return null;

  return (
    <div className="flex flex-col h-screen bg-[#fcfdff] font-sans text-[#1a1c2e] safe-top safe-bottom overflow-hidden relative">
      {/* Header */}
      <div className="bg-white px-6 h-16 flex items-center justify-between shrink-0 shadow-sm rounded-b-[24px] z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-7 h-7 text-[#0066b2] stroke-[2.5px]" />
          </button>
          <h1 className="text-[18px] font-black leading-tight text-[#1a1c2e]">Edit Item</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-32 px-6 pt-8">
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-[#1a1c2e] text-[28px] font-black leading-tight tracking-tight">
              {menuItem.name}
            </h2>
            <p className="text-[#94a3b8] text-[15px] font-bold">
              {menuItem.description}
            </p>
            <div className="flex items-baseline gap-2 pt-1">
              <CurrencyAmount amount={menuItem.basePrice} weight="bold" className="text-[22px] text-[#1a1c2e]" />
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
              <span className="text-[#94a3b8] text-[11px] font-bold">Per serving</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: menuItem.nutritionalInfo.kcal, label: 'Kcal' },
                { value: menuItem.nutritionalInfo.protein, label: 'Protein' },
                { value: menuItem.nutritionalInfo.carbs, label: 'Carbs' },
                { value: menuItem.nutritionalInfo.fat, label: 'Fat' }
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
              {menuItem.allergens.length > 0 ? (
                <span className="text-[#6E6E6E] text-[12px] font-medium leading-tight">
                  Allergen: {menuItem.allergens.join(', ')}
                </span>
              ) : (
                <span className="text-[#94a3b8] text-[12px] font-bold">No common allergens</span>
              )}
            </div>
          </div>

          {menuItem.variations.length > 0 && (
            <div className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#f1f5f9]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#1a1c2e] text-[17px] font-black tracking-tight">Flavor</span>
                  <span className="bg-[#fef2f2] text-[#ef4444] text-[8px] font-black px-2 py-0.5 rounded-full border border-[#fee2e2] uppercase">Required</span>
                </div>
              </div>
              <p className="text-[#94a3b8] text-[12px] font-bold mb-5">Select one option</p>
              <div className="space-y-3">
                {menuItem.variations.map((v, i) => (
                  <div key={i}>
                    <div 
                      className="flex items-center justify-between py-1 group cursor-pointer"
                      onClick={() => handleFlavorSelect(v)}
                    >
                      <div className="flex flex-col">
                        <span className="text-[#334155] text-[14px] font-black">{v.name}</span>
                        {v.price > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-[#0066b2] text-[11px] font-bold">+</span>
                            <CurrencyAmount amount={v.price} weight="bold" className="text-[11px] text-[#0066b2]" />
                          </div>
                        )}
                      </div>
                      <div className={cn(
                        "w-5 h-5 rounded-full border-[2px] flex items-center justify-center transition-all",
                        selectedFlavor?.name === v.name ? "border-[#0066b2] bg-white" : "border-gray-200"
                      )}>
                        {selectedFlavor?.name === v.name && <div className="w-2.5 h-2.5 bg-[#0066b2] rounded-full" />}
                      </div>
                    </div>
                    {i !== menuItem.variations.length - 1 && (
                      <div className="w-full border-b border-dotted border-gray-200 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {menuItem.addons && menuItem.addons.length > 0 && (
            <div ref={addonsSectionRef} className="bg-[#f8fafc] rounded-[24px] p-5 border border-[#f1f5f9]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#1a1c2e] text-[17px] font-black tracking-tight">Add-ons</span>
                </div>
              </div>
              <p className="text-[#94a3b8] text-[12px] font-bold mb-5">Select multiple extras</p>
              <div className="space-y-3">
                {menuItem.addons.map((addon, i) => {
                  const qty = addonQuantities[addon.name] || 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between py-1 group">
                        <div className="flex flex-col">
                          <span className="text-[#334155] text-[14px] font-black">{addon.name}</span>
                          <div className="flex items-center gap-1">
                            <CurrencyAmount amount={addon.price} weight="bold" className="text-[10px] text-[#0066b2]" />
                          </div>
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
                      {i !== menuItem.addons!.length - 1 && (
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
              <SquarePen className="w-4 h-4 text-[#94a3b8]" />
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

      {/* Footer */}
      <div className="absolute bottom-0 inset-x-0 bg-white px-6 pt-4 pb-10 border-t border-[#f0f4f8] shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex items-center gap-4 z-30">
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
                price: menuItem.addons?.find(a => a.name === name)?.price || 0
              }));
            
            onSave({
              ...item,
              flavor: selectedFlavor?.name,
              addons,
              specialRequests,
              quantity: itemQuantity
            });
          }}
          className={cn(
            "flex-1 h-12 rounded-[16px] text-[16px] font-black shadow-[0_6px_20px_rgba(0,102,178,0.3)] flex items-center justify-center gap-2 active:scale-[0.98] transition-all",
            isCustomized 
              ? "bg-[#0066b2] hover:bg-[#005596] text-white" 
              : "bg-gray-100 text-gray-400 shadow-none cursor-not-allowed"
          )}
        >
          Update <span className="opacity-40 font-normal">●</span> <CurrencyAmount amount={totalPrice} weight="bold" className="text-[14px] text-inherit" />
        </button>
      </div>
    </div>
  );
}
