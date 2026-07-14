'use client';

import React from 'react';
import { Menu, User, LogOut, List, CreditCard, QrCode, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StaffDashboardScreenProps {
  onLogout?: () => void;
  onOrderMenu?: () => void;
}

export function StaffDashboardScreen({ onLogout, onOrderMenu }: StaffDashboardScreenProps) {
  const actions = [
    {
      title: 'Order Menu',
      description: 'Start a new table order',
      icon: <List className="w-6 h-6 text-[#0066b2]" />,
      bgColor: 'bg-[#f0f7ff]',
      onClick: onOrderMenu,
    },
    {
      title: 'Pay Order',
      description: 'Settle an open table',
      icon: <CreditCard className="w-6 h-6 text-[#0066b2]" />,
      bgColor: 'bg-[#f0f7ff]',
    },
    {
      title: 'Scan QR',
      description: 'Scan a table QR code',
      icon: <QrCode className="w-6 h-6 text-[#0066b2]" />,
      bgColor: 'bg-[#f0f7ff]',
    },
    {
      title: 'Manual Sale',
      description: 'Quick sale, no table',
      icon: <CircleDollarSign className="w-6 h-6 text-[#0066b2]" />,
      bgColor: 'bg-[#f0f7ff]',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fbfe] font-sans text-[#1a1c2e] overflow-y-auto safe-top safe-bottom">
      {/* Blue Header Section */}
      <div className="bg-gradient-to-b from-[#0081d3] to-[#005ea1] h-[140px] pt-8 px-6 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="text-[#005ea1] font-bold text-base">BC</span>
            </div>
            <h2 className="text-white text-lg font-bold tracking-tight">Bella Cuchina</h2>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-md">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 -mt-10 px-6 pb-8 flex flex-col">
        {/* Staff Info Card */}
        <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ecf7ef] rounded-full flex items-center justify-center shrink-0">
            <User className="w-6 h-6 text-[#26ab5f]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#1a1c2e] text-[15px]">Staff Member</h3>
            <p className="text-[#94a3b8] text-sm font-medium">ID: 232</p>
          </div>
          <div className="h-10 w-[1px] border-r border-dashed border-[#e2e8f0] mx-1"></div>
          <button 
            onClick={onLogout}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#94a3b8] hover:text-[#0081d3] transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {actions.map((action, index) => (
            <div 
              key={index}
              onClick={action.onClick}
              className="group bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col hover:bg-[#0081d3] hover:shadow-[0_8px_30px_rgba(0,129,211,0.2)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors",
                action.bgColor,
                "group-hover:bg-white/20"
              )}>
                {React.cloneElement(action.icon as React.ReactElement, {
                  className: cn(
                    (action.icon as React.ReactElement).props.className,
                    "group-hover:text-white transition-colors"
                  )
                })}
              </div>
              <h4 className="font-bold text-[#1a1c2e] group-hover:text-white text-base mb-1 tracking-tight transition-all duration-200">
                {action.title}
              </h4>
              <p className="text-[#94a3b8] group-hover:text-white/90 text-[13px] leading-tight font-medium transition-all duration-200">
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="py-8 flex flex-col items-center shrink-0 bg-[#f8fbfe]">
        <div className="flex flex-col items-center">
          <span className="text-[8px] font-bold text-[#cbd5e1] tracking-[0.3em] uppercase mb-0.5">
            POWERED BY
          </span>
          <div className="flex items-center gap-0.5">
            <span className="text-[#005ea1] text-[24px] font-black tracking-tighter">network</span>
            <div className="flex items-center">
              <svg 
                viewBox="0 0 24 24" 
                className="w-4 h-4 text-[#ef4444] fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5l8 7-8 7V5z" />
              </svg>
            </div>
          </div>
          <span className="text-[#0ea5e9] text-sm font-bold tracking-tight -mt-1.5 opacity-90">dine</span>
        </div>
      </div>
    </div>
  );
}
