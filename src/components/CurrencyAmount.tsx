'use client';

import React from 'react';
import { DirhamSymbol } from 'dirham/react';
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
  symbolSize?: string;
};

/**
 * Renders a formatted currency amount using the official UAE Dirham symbol.
 * Uses the 'dirham' package for the symbol and standard Inter font for numbers.
 */
export function CurrencyAmount({
  amount,
  locale = 'en-AE',
  decimals = 2,
  weight = 'regular',
  notation = 'standard',
  className,
  symbolSize = '0.9em',
}: CurrencyAmountProps) {
  // We format the number separately to ensure it uses the app's Inter font
  const formattedNumber = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: notation,
  }).format(amount);

  return (
    <span className={cn("currency-amount inline-flex items-center gap-[0.2em] whitespace-nowrap tabular-nums font-sans", className)}>
      <DirhamSymbol
        size={symbolSize}
        weight={weight}
        aria-label="UAE Dirham"
      />
      <span className="leading-none">
        {formattedNumber}
      </span>
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
