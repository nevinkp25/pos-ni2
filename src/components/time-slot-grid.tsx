'use client';

import React from 'react';
import type { Table, Booking } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface TimeSlotGridProps {
  tables: Table[];
  timeSlots: string[];
  bookings: Booking[];
  selectedSlots: string[];
  onSlotClick: (event: React.MouseEvent, tableId: string, time: string) => void;
  isPending: boolean;
}

export const TimeSlotGrid = React.memo(function TimeSlotGrid({
  tables,
  timeSlots,
  bookings,
  selectedSlots,
  onSlotClick,
  isPending,
}: TimeSlotGridProps) {
  const bookingsMap = React.useMemo(() => {
    const map = new Map<string, 'booked' | 'blocked'>();
    bookings.forEach(b => {
      map.set(`${b.tableId}_${b.time}`, b.status);
    });
    return map;
  }, [bookings]);

  if (tables.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg border border-dashed">
        <p className="text-muted-foreground">Select a floor to see tables.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
      <div className={cn("relative", isPending && "opacity-50 pointer-events-none")}>
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="w-32 px-4 py-3 text-left font-semibold text-muted-foreground sticky left-0 z-20 bg-muted/50">
                Table
              </th>
              {timeSlots.map(time => (
                <th key={time} scope="col" className="px-2 py-3 text-center font-semibold text-muted-foreground tabular-nums">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {tables.map(table => (
              <tr key={table.id}>
                <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap sticky left-0 z-10 bg-card">
                  {table.name}
                </td>
                {timeSlots.map(time => {
                  const slotId = `${table.id}_${time}`;
                  const status = bookingsMap.get(slotId) || 'available';
                  const isSelected = selectedSlots.includes(slotId);

                  return (
                    <td
                      key={slotId}
                      className="p-0.5"
                      onClick={(e) => onSlotClick(e, table.id, time)}
                    >
                      <div
                        className={cn(
                          'h-10 w-24 rounded-md flex items-center justify-center transition-all duration-150 cursor-pointer',
                          status === 'available' && 'bg-background hover:bg-accent/50',
                          status === 'booked' && 'bg-accent text-accent-foreground/70 cursor-not-allowed',
                          status === 'blocked' && 'bg-primary text-primary-foreground',
                          isSelected && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                        )}
                      >
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
});
