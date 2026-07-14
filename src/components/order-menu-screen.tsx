'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Home, Search, ChevronDown, ChevronUp, Check, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  name: string;
  allergens: string[];
  price: string;
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

  useEffect(() => {
    // Show the success toast when component mounts
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const menuData: MenuCategory[] = [
    { 
      title: 'STARTERS', 
      items: [
        { name: 'Burrata con Pomodorini', allergens: ['Dairy'], price: '65.00' },
        { name: 'Calamari Fritti', allergens: ['Shellfish', 'Gluten'], price: '55.00' },
        { name: 'Bruschetta Classica', allergens: ['Gluten'], price: '42.00' },
      ] 
    },
    { 
      title: 'PIZZA', 
      items: [
        { name: 'Margherita', allergens: ['Dairy', 'Gluten'], price: '75.00' },
        { name: 'Diavola', allergens: ['Dairy', 'Gluten'], price: '85.00' },
        { name: 'Quattro Formaggi', allergens: ['Dairy', 'Gluten'], price: '90.00' },
      ] 
    },
    { 
      title: 'MAINS', 
      items: [
        { name: 'Osso Buco alla Milanese', allergens: ['Dairy', 'Gluten'], price: '145.00' },
        { name: 'Spaghetti alle Vongole', allergens: ['Shellfish', 'Gluten'], price: '98.00' },
        { name: 'Branzino al Forno', allergens: ['Fish'], price: '130.00' },
      ] 
    },
    { 
      title: 'SIDES & SAUCES', 
      items: [
        { name: 'Patatine Fritte', allergens: [], price: '25.00' },
        { name: 'Insalata Mista', allergens: [], price: '30.00' },
        { name: 'Pane all\'Aglio', allergens: ['Gluten', 'Dairy'], price: '22.00' },
      ] 
    },
    { 
      title: 'DESSERTS', 
      items: [
        { name: 'Tiramisu Classico', allergens: ['Dairy', 'Gluten', 'Eggs'], price: '48.00' },
        { name: 'Panna Cotta ai Frutti di Bosco', allergens: ['Dairy'], price: '42.00' },
        { name: 'Cannoli Siciliani', allergens: ['Dairy', 'Gluten', 'Nuts'], price: '45.00' },
      ] 
    },
  ];

  const toggleCategory = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title);
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
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0066b2] text-white shadow-[0_4px_12px_rgba(0,102,178,0.2)] active:scale-95 transition-all"
          >
            <Home className="w-5 h-5 fill-current" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 shadow-sm hover:bg-gray-50 active:scale-95 transition-all">
            <Search className="w-5 h-5 text-gray-700 stroke-[2.5px]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 pt-6 overflow-y-auto pb-24">
        <div className="bg-white rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] border border-[#f0f4f8] overflow-hidden">
          {menuData.map((category, index) => {
            const isExpanded = expandedCategory === category.title;
            return (
              <div key={index} className={cn(index !== menuData.length - 1 && "border-b border-[#f0f4f8]")}>
                {/* Category Header */}
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
                </button>

                {/* Category Content (Items) */}
                {isExpanded && category.items.length > 0 && (
                  <div className="bg-[#f8fbff] animate-in fade-in slide-in-from-top-2 duration-300">
                    {category.items.map((item, itemIndex) => (
                      <div 
                        key={itemIndex} 
                        className={cn(
                          "px-6 py-5 flex items-center justify-between",
                          itemIndex !== category.items.length - 1 && "border-b border-[#eef2f8]"
                        )}
                      >
                        <div className="flex flex-col gap-1.5">
                          <h3 className="text-[15px] font-black text-[#1a1c2e] leading-tight">
                            {item.name}
                          </h3>
                          <div className="flex gap-1.5">
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
                        <button className="w-12 h-12 bg-[#0066b2] rounded-full flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,102,178,0.3)] active:scale-90 transition-all">
                          <Plus className="w-6 h-6 stroke-[3px]" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Success Notification Bottom Sheet */}
      {showSuccess && (
        <div className="absolute bottom-6 inset-x-6 z-50 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-4 flex items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border-[1.5px] border-[#00d084]/20 overflow-hidden relative group">
            {/* Gradient Border Overlay */}
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
    </div>
  );
}
