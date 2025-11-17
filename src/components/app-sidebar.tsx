'use client';

import {
  CalendarDays,
  LayoutGrid,
  Table,
  BarChart,
  Settings,
  Building,
  LifeBuoy,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-white">
          eMenu<span className="text-primary">.</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-6">
        <div>
          <h2 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Dining Management
          </h2>
          <ul className="space-y-1">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground/80 hover:text-white"
              >
                <CalendarDays className="mr-3 h-5 w-5" />
                Daily Reservations
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground/80 hover:text-white"
              >
                <LayoutGrid className="mr-3 h-5 w-5" />
                Floor Plan
              </Button>
            </li>
            <li>
              <Button
                variant="secondary"
                className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
              >
                <Table className="mr-3 h-5 w-5" />
                Table Availability
              </Button>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Analytics
          </h2>
          <ul className="space-y-1">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground/80 hover:text-white"
              >
                <BarChart className="mr-3 h-5 w-5" />
                Reports
              </Button>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Configuration
          </h2>
          <ul className="space-y-1">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground/80 hover:text-white"
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground/80 hover:text-white"
              >
                <Building className="mr-3 h-5 w-5" />
                Manage Restaurants
              </Button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="mt-auto p-4">
        <div className="p-4 rounded-lg bg-gray-800">
           <div className="flex items-center gap-3">
             <Avatar className="h-10 w-10">
                <AvatarImage src="https://picsum.photos/seed/leo/100/100" />
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-semibold text-white">Leo</p>
                 <Button variant="link" className="p-0 h-auto text-xs text-sidebar-foreground/60 hover:text-primary">
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    Help & Support
                 </Button>
              </div>
           </div>
        </div>
      </div>
    </aside>
  );
}
