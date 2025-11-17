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
