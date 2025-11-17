'use server';

import { revalidatePath } from 'next/cache';
import { getBookings, getTables, updateBookings } from '@/lib/data';
import type { Booking, Table } from '@/lib/types';
import { summarizeTableAvailability } from '@/ai/flows/summarize-table-availability';

export async function batchUpdateSlots(
  slotsToUpdate: { tableId: string; time: string }[],
  date: string,
  status: 'blocked' | 'available'
) {
  // In a real app, you'd perform database operations here.
  // For this demo, we'll manipulate the in-memory array.
  let currentBookings = getBookings();

  if (status === 'available') {
    // Unblock: Remove the matching blocked slots
    const slotsToUpdateSet = new Set(slotsToUpdate.map(s => `${s.tableId}-${s.time}`));
    const newBookings = currentBookings.filter(
      (b) => !(b.date === date && b.status === 'blocked' && slotsToUpdateSet.has(`${b.tableId}-${b.time}`))
    );
    updateBookings(newBookings);
  } else {
    // Block: Add new blocked slots, avoiding duplicates
    const newBookings: Booking[] = slotsToUpdate.map(slot => ({
      ...slot,
      date,
      status: 'blocked',
    }));

    const existingSlots = new Set(currentBookings.map(b => `${b.tableId}-${b.date}-${b.time}`));
    const filteredNewBookings = newBookings.filter(b => !existingSlots.has(`${b.tableId}-${b.date}-${b.time}`));

    updateBookings([...currentBookings, ...filteredNewBookings]);
  }

  // revalidatePath('/'); // No longer needed for this component, but keeping for potential other uses.
  return { success: true };
}

export async function getAISummary(
  date: string,
  restaurantId: string,
  floorId: string
) {
  try {
    const allTables = getTables();
    const tablesOnFloor = allTables.filter(t => t.floorId === floorId);
    const tableIdsOnFloor = new Set(tablesOnFloor.map(t => t.id));

    const bookingsForDate = getBookings().filter(
      (b) => b.date === date && tableIdsOnFloor.has(b.tableId)
    );

    const bookedTableIds = new Set<string>();
    const blockedTableIds = new Set<string>();

    bookingsForDate.forEach(b => {
      if (b.status === 'booked') {
        bookedTableIds.add(b.tableId);
      } else if (b.status === 'blocked') {
        blockedTableIds.add(b.tableId);
      }
    });

    // A table that is booked is not considered blocked, even if it has blocked slots.
    const purelyBlockedTableIds = new Set([...blockedTableIds].filter(id => !bookedTableIds.has(id)));

    const availableTableIds = tablesOnFloor
      .map(t => t.id)
      .filter(id => !bookedTableIds.has(id) && !purelyBlockedTableIds.has(id));

    const input = {
      date,
      restaurantId,
      floorId,
      blockedTables: Array.from(purelyBlockedTableIds),
      availableTables: availableTableIds,
      bookedTables: Array.from(bookedTableIds),
    };

    const result = await summarizeTableAvailability(input);
    return { summary: result.summary };
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return { error: 'Failed to generate summary. Please try again.' };
  }
}
