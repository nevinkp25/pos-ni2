import type { Restaurant, Floor, Table, Booking } from './types';

// In-memory store for mock data
let restaurants: Restaurant[] = [
  { id: '1', name: 'The Gilded Spoon' },
  { id: '2', name: 'Marble Arch Steakhouse' },
];

let floors: Floor[] = [
  { id: '1', name: 'Ground Floor', restaurantId: '1' },
  { id: '2', name: 'Rooftop Terrace', restaurantId: '1' },
  { id: '3', name: 'Main Hall', restaurantId: '2' },
];

let tables: Table[] = [
  // Restaurant 1
  { id: '1', name: 'Table 1', floorId: '1', capacity: 2 },
  { id: '2', name: 'Table 2', floorId: '1', capacity: 4 },
  { id: '3', name: 'Table 3', floorId: '1', capacity: 4 },
  { id: '4', name: 'Table 4', floorId: '1', capacity: 6 },
  { id: '5', name: 'Table 5', floorId: '1', capacity: 2 },
  { id: '6', name: 'Table 6', floorId: '1', capacity: 2 },
  { id: '7', name: 'Table 7', floorId: '1', capacity: 4 },
  { id: '8', name: 'Table 8', floorId: '1', capacity: 4 },
  { id: '9', name: 'Table 9', floorId: '1', capacity: 6 },
  { id: '12', name: 'Table 10', floorId: '1', capacity: 2 },
  { id: '13', name: 'Table 11', floorId: '1', capacity: 4 },
  { id: '14', name: 'Table 12', floorId: '1', capacity: 4 },
  { id: '15', name: 'Table 13', floorId: '1', capacity: 2 },
  { id: '16', name: 'Table 14', floorId: '1', capacity: 4 },
  { id: '17', name: 'Table 15', floorId: '1', capacity: 6 },
  { id: '10', name: 'Rooftop 1', floorId: '2', capacity: 2 },
  { id: '11', name: 'Rooftop 2', floorId: '2', capacity: 4 },

  // Restaurant 2
  { id: '20', name: 'Steak 1', floorId: '3', capacity: 4 },
  { id: '21', name: 'Steak 2', floorId: '3', capacity: 4 },
  { id: '22', name: 'Steak 3', floorId: '3', capacity: 8 },
];

let bookings: Booking[] = [
  { tableId: '2', date: '2024-08-10', time: '19:00', status: 'booked' },
  { tableId: '2', date: '2024-08-10', time: '19:30', status: 'booked' },
  { tableId: '3', date: '2024-08-10', time: '20:00', status: 'blocked' },
  { tableId: '22', date: '2024-08-12', time: '18:00', status: 'booked' },
  { tableId: '22', date: '2024-08-12', time: '18:30', status: 'booked' },
  { tableId: '22', date: '2024-08-12', time: '19:00', status: 'booked' },
];

// Data access functions
export const getRestaurants = (): Restaurant[] => restaurants;
export const getFloors = (): Floor[] => floors;
export const getTables = (): Table[] => tables;
export const getBookings = (): Booking[] => bookings;

export const updateBookings = (updatedBookings: Booking[]) => {
  bookings = updatedBookings;
};
