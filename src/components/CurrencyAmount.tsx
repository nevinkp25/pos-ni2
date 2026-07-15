'use client';

import React from 'react';
import { DirhamPrice, DirhamSymbol } from 'dirham/react';
import { cn } from '@/lib/utils';

type CurrencyAmountProps = {
  amount: number;
  locale?: string;
  decimals?: number;
  weight?:
    | 'thin'
    | 'extralight'
    | 'light'
    | 'regular'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 'extrabold'
    | 'black';
  notation?: 'standard' | 'compact';
  className?: string;
};

export function CurrencyAmount({
  amount,
  locale = 'en-AE',
  decimals = 2,
  weight = 'regular',
  notation = 'standard',
  className,
}: CurrencyAmountProps) {
  return (
    <span className={cn("currency-amount", className)}>
      <DirhamPrice
        amount={amount}
        locale={locale}
        decimals={decimals}
        weight={weight}
        notation={notation}
      />
    </span>
  );
}

export function UAECurrencySymbol({ 
  size = "1em", 
  weight = "regular", 
  className 
}: { 
  size?: string; 
  weight?: 'thin' | 'extralight' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  className?: string;
}) {
  return (
    <span className={className}>
      <DirhamSymbol
        size={size}
        weight={weight}
        aria-label="UAE Dirham"
      />
    </span>
  );
}
