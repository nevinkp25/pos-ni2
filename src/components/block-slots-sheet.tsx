'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, parse } from 'date-fns';
import { Table } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BlockSlotsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  tables: Table[];
  timeSlots: string[];
  initialDate: Date;
  onConfirm: (
    slotsToUpdate: { tableId: string; time: string }[],
    date: string,
    status: 'blocked' | 'available'
  ) => void;
}

export function BlockSlotsSheet({
  isOpen,
  onOpenChange,
  tables,
  timeSlots,
  initialDate,
  onConfirm,
}: BlockSlotsSheetProps) {
  const [action, setAction] = useState<'block' | 'unblock'>('block');
  const [date, setDate] = useState(initialDate);
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [applyToWholeDay, setApplyToWholeDay] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [showAllTables, setShowAllTables] = useState(false);


  useEffect(() => {
    setDate(initialDate);
    // Reset state when sheet opens or initial date changes
    if (isOpen) {
      setAction('block');
      setShowAllTables(false);
      setSelectedTables([]);
      setFromTime('');
      setToTime('');
      setApplyToWholeDay(false);
      setReason('');
    }
  }, [initialDate, isOpen]);

  const displayedTables = useMemo(() => {
    return showAllTables ? tables : tables.slice(0, 6);
  }, [tables, showAllTables]);

  const handleSelectAllTables = () => {
    if (selectedTables.length === tables.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables(tables.map((t) => t.id));
    }
  };

  const handleTableClick = (tableId: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };
  
  const handleConfirm = () => {
      const slotsToUpdate = [];
      const startTime = applyToWholeDay ? timeSlots[0] : fromTime;
      const endTime = applyToWholeDay ? timeSlots[timeSlots.length - 1] : toTime;

      // The HTML time input returns 'HH:mm'. We find the closest matching slot.
      const findSlotIndex = (time: string) => {
          if (!time || !time.includes(':')) return -1;
          const inputHour = parseInt(time.split(':')[0], 10);
          const inputMinute = parseInt(time.split(':')[1], 10);
          
          let closestIndex = -1;
          let smallestDiff = Infinity;
          
          timeSlots.forEach((slot, index) => {
              const slotHour = parseInt(slot.split(':')[0], 10);
              const slotMinute = parseInt(slot.split(':')[1], 10);
              const diff = Math.abs((inputHour * 60 + inputMinute) - (slotHour * 60 + slotMinute));
              
              if (diff < smallestDiff) {
                  smallestDiff = diff;
                  closestIndex = index;
              }
          });
          
          return closestIndex;
      };
      
      let startIndex, endIndex;
      
      if(applyToWholeDay) {
          startIndex = 0;
          endIndex = timeSlots.length - 1;
      } else {
          startIndex = findSlotIndex(startTime);
          endIndex = findSlotIndex(endTime);
      }

      if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
          console.error("Invalid time range", { fromTime, toTime, startTime, endTime, startIndex, endIndex, timeSlots });
          return;
      }

      for (const tableId of selectedTables) {
          for (let i = startIndex; i <= endIndex; i++) {
              slotsToUpdate.push({ tableId, time: timeSlots[i] });
          }
      }
      onConfirm(slotsToUpdate, format(date, 'yyyy-MM-dd'), action === 'block' ? 'blocked' : 'available');
      onOpenChange(false);
  }

  const reasonSuggestions = [
    'Private Event',
    'Maintenance',
    'Staff Shortage',
    'Deep Cleaning',
    'VIP Usage',
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md lg:max-w-lg flex flex-col p-0">
        <SheetHeader className="p-6 border-b flex-shrink-0">
          <SheetTitle className="text-xl">Block / Unblock Slots</SheetTitle>
          <SheetDescription>
            Select an action, date, time range, and the tables you want to
            manage.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="font-semibold">1. Select Action</h3>
               <Tabs
                defaultValue="block"
                value={action}
                onValueChange={(value) => setAction(value as 'block' | 'unblock')}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="block">Block</TabsTrigger>
                  <TabsTrigger value="unblock">Unblock</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">2. Select Date and Time</h3>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">From</Label>
                  <div className="relative">
                    <Input id="from" type="time" value={fromTime} onChange={(e) => setFromTime(e.target.value)} disabled={applyToWholeDay} step="3600" />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <div className="relative">
                      <Input id="to" type="time" value={toTime} onChange={(e) => setToTime(e.target.value)} disabled={applyToWholeDay} step="3600" />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                  <Checkbox id="applyToWholeDay" checked={applyToWholeDay} onCheckedChange={(checked) => setApplyToWholeDay(checked as boolean)} />
                  <Label htmlFor="applyToWholeDay" className="font-normal">Apply to whole day</Label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">3. Select Tables to {action}</h3>
                <Button variant="link" className="p-0 h-auto" onClick={handleSelectAllTables}>
                    {selectedTables.length === tables.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {displayedTables.map((table) => (
                  <Button
                    key={table.id}
                    variant={selectedTables.includes(table.id) ? 'default' : 'outline'}
                    onClick={() => handleTableClick(table.id)}
                  >
                    {table.name}
                  </Button>
                ))}
              </div>
              {tables.length > 6 && (
                <Button variant="link" className="p-0 h-auto" onClick={() => setShowAllTables(!showAllTables)}>
                  {showAllTables ? 'Show fewer tables' : 'Show all tables'}
                </Button>
              )}
            </div>
            {action === 'block' && (
              <div className="space-y-4">
                  <h3 className="font-semibold">4. Provide a Reason</h3>
                  <Textarea placeholder="e.g. Private event booking" value={reason} onChange={(e) => setReason(e.target.value)} />
                  <div className="flex flex-wrap gap-2">
                      {reasonSuggestions.map(suggestion => (
                          <Button key={suggestion} variant="outline" size="sm" onClick={() => setReason(suggestion)}>
                              {suggestion}
                          </Button>
                      ))}
                  </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <SheetFooter className="p-6 border-t flex-shrink-0 bg-background">
            <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleConfirm} disabled={selectedTables.length === 0 || (!applyToWholeDay && (!fromTime || !toTime))}>
                Confirm {action === 'block' ? 'Block' : 'Unblock'}
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
