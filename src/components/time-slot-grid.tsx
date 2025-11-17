'use client';

import React from 'react';
import type { Table, Booking } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface TimeSlotGridProps {
  tables: Table[];
  timeSlots: string[];
  bookings: Booking[];
  selectedSlots: string[];
  onSlotClick: (event: React.MouseEvent, tableId: string, time: string) => void;
  isPending: boolean;
}

const formatTimeForDisplay = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${displayHour}:${minute} ${ampm}`;
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
    <div className={cn("relative rounded-lg border", isPending && "opacity-50 pointer-events-none")}>
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th scope="col" className="w-40 px-4 py-3 text-left font-semibold text-muted-foreground">
              Slot
            </th>
            {tables.map(table => (
              <th key={table.id} scope="col" className="px-2 py-3 text-center font-semibold text-muted-foreground tabular-nums">
                {table.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {timeSlots.map(time => (
            <tr key={time}>
              <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                {formatTimeForDisplay(time)}
              </td>
              {tables.map(table => {
                const slotId = `${table.id}_${time}`;
                const status = bookingsMap.get(slotId) || 'available';
                const isSelected = selectedSlots.includes(slotId);

                return (
                  <td
                    key={slotId}
                    className="p-1"
                    onClick={(e) => onSlotClick(e, table.id, time)}
                  >
                    <div
                      className={cn(
                        'h-9 w-full rounded-md flex items-center justify-center transition-all duration-150 cursor-pointer text-xs font-semibold',
                        status === 'available' && 'bg-green-100 text-green-800 hover:bg-green-200',
                        status === 'booked' && 'bg-red-100 text-red-800 cursor-not-allowed',
                        status === 'blocked' && 'bg-gray-200 text-gray-600',
                        isSelected && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                      )}
                    >
                      {status === 'available' && <Badge variant="outline" className="bg-green-200 text-green-900 border-green-300">Available</Badge>}
                      {status === 'booked' && <Badge variant="destructive">Booked</Badge>}
                      {status === 'blocked' && <Badge variant="secondary">Blocked</Badge>}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
