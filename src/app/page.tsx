import { TimeSlotManager } from '@/components/time-slot-manager';
import { getRestaurants, getFloors, getTables, getBookings } from '@/lib/data';

export default async function Page() {
  const restaurants = getRestaurants();
  const floors = getFloors();
  const tables = getTables();
  const bookings = getBookings();

  return (
    <main className="p-2 sm:p-4 md:p-6 lg:p-8">
      <TimeSlotManager
        restaurants={restaurants}
        floors={floors}
        tables={tables}
        initialBookings={bookings}
      />
    </main>
  );
}
