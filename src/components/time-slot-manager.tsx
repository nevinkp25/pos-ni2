'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import type { Restaurant, Floor, Table, Booking } from '@/lib/types';
import { format, add, startOfDay, parse } from 'date-fns';
import { Calendar as CalendarIcon, Loader2, Sparkles, Plus, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { batchUpdateSlots, getAISummary } from '@/app/actions';
import { TimeSlotGrid } from './time-slot-grid';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BlockSlotsSheet } from './block-slots-sheet';


interface TimeSlotManagerProps {
  restaurants: Restaurant[];
  floors: Floor[];
  tables: Table[];
  initialBookings: Booking[];
}

const generateTimeSlots = (start: Date, end: Date, interval: number): string[] => {
  const slots = [];
  let current = start;
  while (current < end) {
    slots.push(format(current, 'HH:mm'));
    current = add(current, { minutes: interval });
  }
  return slots;
};

export function TimeSlotManager({ restaurants, floors, tables, initialBookings }: TimeSlotManagerProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | undefined>(restaurants[0]?.id);
  const [selectedFloor, setSelectedFloor] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(parse('17/11/2025', 'dd/MM/yyyy', new Date())));
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [lastSelectedSlot, setLastSelectedSlot] = useState<{ tableId: string; time: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const availableFloors = useMemo(() => floors.filter(f => f.restaurantId === selectedRestaurant), [selectedRestaurant, floors]);

  useEffect(() => {
    if (availableFloors.length > 0 && !availableFloors.find(f => f.id === selectedFloor)) {
      setSelectedFloor(availableFloors[0].id);
    } else if (availableFloors.length === 0) {
      setSelectedFloor(undefined);
    }
  }, [availableFloors, selectedFloor]);


  const tablesOnFloor = useMemo(() => {
    return tables
      .filter(t => t.floorId === selectedFloor)
      .sort((a, b) => {
        const numA = parseInt(a.name.replace(/[^0-9]/g, ''), 10);
        const numB = parseInt(b.name.replace(/[^0-9]/g, ''), 10);
        return numA - numB;
      });
  }, [selectedFloor, tables]);


  const formattedDate = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);
  const bookingsForDate = useMemo(() => bookings.filter(b => b.date === formattedDate), [formattedDate, bookings]);

  const timeSlots = useMemo(() => {
    const dayStart = new Date(formattedDate);
    dayStart.setHours(8, 0, 0, 0);
    const dayEnd = new Date(formattedDate);
    dayEnd.setHours(23, 0, 0, 0);
    return generateTimeSlots(dayStart, dayEnd, 60);
  }, [formattedDate]);

  const handleSlotClick = (e: React.MouseEvent, tableId: string, time: string) => {
    if (!editMode) return;
    const slotId = `${tableId}_${time}`;
    const isShiftClick = e.shiftKey;

    if (isShiftClick && lastSelectedSlot && lastSelectedSlot.tableId === tableId) {
      const lastIndex = timeSlots.indexOf(lastSelectedSlot.time);
      const currentIndex = timeSlots.indexOf(time);
      const [start, end] = [lastIndex, currentIndex].sort((a, b) => a - b);
      const slotsToToggle = timeSlots.slice(start, end + 1).map(t => `${tableId}_${t}`);
      
      const allSelected = slotsToToggle.every(s => selectedSlots.includes(s));
      if (allSelected) {
        setSelectedSlots(prev => prev.filter(s => !slotsToToggle.includes(s)));
      } else {
        setSelectedSlots(prev => [...new Set([...prev, ...slotsToToggle])]);
      }
    } else {
      setSelectedSlots(prev => prev.includes(slotId) ? prev.filter(s => s !== slotId) : [...prev, slotId]);
    }
    setLastSelectedSlot({ tableId, time });
  };
  
  const handleUpdate = (status: 'blocked' | 'available') => {
    if (selectedSlots.length === 0) {
      toast({
        variant: "destructive",
        title: "No slots selected",
        description: "Please select one or more slots to update.",
      });
      return;
    }
    
    startTransition(async () => {
      const slotsToUpdate = selectedSlots.map(s => {
        const [tableId, time] = s.split('_');
        return { tableId, time };
      });
      
      const result = await batchUpdateSlots(slotsToUpdate, formattedDate, status);
      if (result.success) {
        toast({
          title: "Success",
          description: `${selectedSlots.length} slots have been ${status === 'blocked' ? 'blocked' : 'unblocked'}.`,
        });
        
        // Manually update the client-side state
        if (status === 'available') {
            const slotsToUpdateSet = new Set(slotsToUpdate.map(s => `${s.tableId}-${s.time}`));
            setBookings(prev => prev.filter(
              (b) => !(b.date === formattedDate && b.status === 'blocked' && slotsToUpdateSet.has(`${b.tableId}-${b.time}`))
            ));
        } else {
            const newBookings: Booking[] = slotsToUpdate.map(slot => ({
                ...slot,
                date: formattedDate,
                status: 'blocked',
            }));
            setBookings(prev => [...prev, ...newBookings]);
        }

        setSelectedSlots([]);
        setLastSelectedSlot(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update slots.",
        });
      }
    });
  };

  const handleGetSummary = () => {
    if (!selectedRestaurant || !selectedFloor) return;
    startTransition(async () => {
      const result = await getAISummary(formattedDate, selectedRestaurant, selectedFloor);
      if (result.summary) {
        setAiSummary(result.summary);
        setIsSummaryDialogOpen(true);
      } else {
        toast({
          variant: "destructive",
          title: "AI Summary Failed",
          description: result.error,
        });
      }
    });
  };

  const handleSheetConfirm = (slotsToUpdate: { tableId: string; time: string }[], date: string, status: 'blocked' | 'available') => {
    startTransition(async () => {
      const result = await batchUpdateSlots(slotsToUpdate, date, status);
      if (result.success) {
        const statusText = status === 'blocked' ? 'blocked' : 'unblocked';
        toast({
          title: 'Success',
          description: `${slotsToUpdate.length} time slots have been ${statusText}.`,
        });
  
        if (status === 'available') {
          const slotsToUpdateSet = new Set(slotsToUpdate.map(s => `${s.tableId}-${s.time}`));
          setBookings(prev => prev.filter(
            (b) => !(b.date === date && b.status === 'blocked' && slotsToUpdateSet.has(`${b.tableId}-${b.time}`))
          ));
        } else { // blocked
          const newBookings: Booking[] = slotsToUpdate.map(slot => ({
            ...slot,
            date,
            status: 'blocked',
          }));
  
          const existingSlots = new Set(bookings.map(b => `${b.tableId}-${b.date}-${b.time}`));
          const filteredNewBookings = newBookings.filter(b => !existingSlots.has(`${b.tableId}-${b.date}-${b.time}`));
          
          setBookings(prev => [...prev, ...filteredNewBookings]);
        }
  
        setIsSheetOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: `Failed to ${status} slots.`,
        });
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm p-4 sm:p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Block Slots</h1>
              <p className="text-muted-foreground mt-1">Manage all blocked time slots across restaurants</p>
          </div>
          <Button onClick={() => setIsSheetOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Block slots
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4 bg-card">
              <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Select Restaurant" /></SelectTrigger>
                <SelectContent>
                  {restaurants.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Select value={selectedFloor} onValueChange={setSelectedFloor} disabled={!selectedRestaurant}>
                <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Select Floor" /></SelectTrigger>
                <SelectContent>
                  {availableFloors.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>)}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("w-full sm:w-48 justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} initialFocus /></PopoverContent>
              </Popover>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
                  <div className="flex items-center gap-2"><Dot className="text-green-500 w-6 h-6" /> Available</div>
                  <div className="flex items-center gap-2"><Dot className="text-red-500 w-6 h-6" /> Booked</div>
                  <div className="flex items-center gap-2"><Dot className="text-gray-400 w-6 h-6" /> Blocked</div>
              </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="flex items-center gap-2">
                  <Tabs defaultValue="view" onValueChange={(value) => setEditMode(value === 'edit')}>
                      <TabsList>
                          <TabsTrigger value="view" disabled={isPending}>View</TabsTrigger>
                          <TabsTrigger value="edit" disabled={isPending}>Edit</TabsTrigger>
                      </TabsList>
                  </Tabs>

                  {editMode && (
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => handleUpdate('blocked')} disabled={isPending || selectedSlots.length === 0}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Block selected
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUpdate('available')} disabled={isPending || selectedSlots.length === 0}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Unblock selected
                      </Button>
                    </div>
                  )}
              </div>

              <Button variant="secondary" onClick={handleGetSummary} disabled={isPending || !selectedFloor}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                AI Summary
              </Button>
          </div>
        </div>
      </div>

      <BlockSlotsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        tables={tablesOnFloor}
        timeSlots={timeSlots}
        initialDate={selectedDate}
        onConfirm={handleSheetConfirm}
       />
      
      <div className="flex-1 overflow-auto px-4 sm:px-6 md:px-8 pb-8">
        <TimeSlotGrid
          tables={tablesOnFloor}
          timeSlots={timeSlots}
          bookings={bookingsForDate}
          selectedSlots={selectedSlots}
          onSlotClick={handleSlotClick}
          isPending={isPending}
        />
      </div>
      
      <AlertDialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> AI-Generated Summary</AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-foreground/80 whitespace-pre-wrap">{aiSummary}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsSummaryDialogOpen(false)}>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
