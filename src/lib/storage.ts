'use client';

import { CartItem } from './types';

const ORDERS_KEY = 'emenu_table_orders';

export interface TableOrder {
  tableId: string;
  items: CartItem[];
  status: 'active' | 'settled';
  timestamp: number;
}

export const getStoredOrders = (): Record<string, TableOrder> => {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : {};
};

export const getOrderForTable = (tableId: string): TableOrder | null => {
  const orders = getStoredOrders();
  const order = orders[tableId];
  return order && order.status === 'active' ? order : null;
};

export const saveTableOrder = (tableId: string, items: CartItem[]) => {
  const orders = getStoredOrders();
  orders[tableId] = {
    tableId,
    items,
    status: 'active',
    timestamp: Date.now(),
  };
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const clearTableOrder = (tableId: string) => {
  const orders = getStoredOrders();
  delete orders[tableId];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};
