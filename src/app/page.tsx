import { TimeSlotManager } from '@/components/time-slot-manager';
import { getRestaurants, getFloors, getTables, getBookings } from '@/lib/data';
import { AppSidebar } from '@/components/app-sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Sun, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default async function Page() {
  const restaurants = getRestaurants();
  const floors = getFloors();
  const tables = getTables();
  const bookings = getBookings();

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><ChevronLeft className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Sun className="h-5 w-5" /></Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
               <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-4 w-4 text-muted-foreground"/>
               </div>
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          <TimeSlotManager
            restaurants={restaurants}
            floors={floors}
            tables={tables}
            initialBookings={bookings}
          />
        </div>
      </main>
    </div>
  );
}
