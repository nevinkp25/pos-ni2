'use client';

import { useState } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { StaffSignInScreen } from '@/components/staff-signin-screen';
import { StaffDashboardScreen } from '@/components/staff-dashboard-screen';
import { SelectTableScreen } from '@/components/select-table-screen';
import { OrderMenuScreen } from '@/components/order-menu-screen';
import { CartScreen } from '@/components/cart-screen';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/lib/types';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'staff-signin' | 'staff-dashboard' | 'select-table' | 'order-menu' | 'cart'>('welcome');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const handleStarted = () => {
    setCurrentScreen('staff-signin');
  };

  const handleLogin = () => {
    setCurrentScreen('staff-dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('staff-signin');
    toast({
      title: "Success",
      description: "Successfully logged out",
      duration: 3000,
    });
  };

  const handleOrderMenu = () => {
    setCurrentScreen('select-table');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('staff-dashboard');
  };

  const handleStartOrder = (tableNumber: string) => {
    setSelectedTable(tableNumber);
    setCurrentScreen('order-menu');
  };

  const handleBackToSelectTable = () => {
    setCurrentScreen('select-table');
  };

  const handleOpenCart = () => {
    setCurrentScreen('cart');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('order-menu');
  };

  return (
    <main>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStarted={handleStarted} />
      )}
      {currentScreen === 'staff-signin' && (
        <StaffSignInScreen onLogin={handleLogin} />
      )}
      {currentScreen === 'staff-dashboard' && (
        <StaffDashboardScreen onLogout={handleLogout} onOrderMenu={handleOrderMenu} />
      )}
      {currentScreen === 'select-table' && (
        <SelectTableScreen onBack={handleBackToDashboard} onStartOrder={handleStartOrder} />
      )}
      {currentScreen === 'order-menu' && (
        <OrderMenuScreen 
          tableNumber={selectedTable} 
          onBack={handleBackToSelectTable} 
          onHome={handleBackToDashboard} 
          onOpenCart={handleOpenCart}
          cart={cart}
          setCart={setCart}
        />
      )}
      {currentScreen === 'cart' && (
        <CartScreen 
          tableNumber={selectedTable} 
          onBack={handleBackToMenu} 
          cart={cart}
          setCart={setCart}
        />
      )}
    </main>
  );
}
