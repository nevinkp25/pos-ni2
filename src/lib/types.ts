export type Restaurant = {
  id: string;
  name: string;
};

export type Floor = {
  id: string;
  name: string;
  restaurantId: string;
};

export type Table = {
  id: string;
  name: string;
  floorId: string;
  capacity: number;
};

export type SlotStatus = 'available' | 'booked' | 'blocked';

export type Booking = {
  tableId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'booked' | 'blocked';
};

export interface CartItemAddon {
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  addons: CartItemAddon[];
  specialRequests: string;
  flavor?: string;
}

export interface MenuItemOption {
  name: string;
  price: number;
}

export interface MenuItem {
  name: string;
  description: string;
  allergens: string[];
  basePrice: number;
  nutritionalInfo: {
    kcal: number;
    protein: string;
    carbs: string;
    fat: string;
  };
  variations: MenuItemOption[];
  addons?: MenuItemOption[];
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}
