'use client';

import { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { StaffSignInScreen } from '@/components/staff-signin-screen';
import { StaffDashboardScreen } from '@/components/staff-dashboard-screen';
import { SelectTableScreen } from '@/components/select-table-screen';
import { OrderMenuScreen } from '@/components/order-menu-screen';
import { CartScreen } from '@/components/cart-screen';
import { ProcessingScreen } from '@/components/processing-screen';
import { OrderSuccessScreen } from '@/components/order-success-screen';
import { SettledScreen } from '@/components/settled-screen';
import { PayOrderDetailScreen } from '@/components/pay-order-detail-screen';
import { SplitByItemScreen } from '@/components/split-by-item-screen';
import { SplitEquallyScreen } from '@/components/split-equally-screen';
import { QRScanningScreen } from '@/components/qr-scanning-screen';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/lib/types';
import { getOrderForTable, saveTableOrder, clearTableOrder } from '@/lib/storage';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'staff-signin' | 'staff-dashboard' | 'select-table' | 'order-menu' | 'cart' | 'processing' | 'order-success' | 'select-table-pay' | 'pay-order-detail' | 'settled' | 'split-by-item' | 'split-equally' | 'qr-scanning'>('welcome');
  const [restaurantName, setRestaurantName] = useState<string>('Bella-cuchina');
  const [staffId, setStaffId] = useState<string>('');
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const handleStarted = (slug: string) => {
    setRestaurantName(slug);
    setCurrentScreen('staff-signin');
  };

  const handleLogin = (id: string) => {
    setStaffId(id);
    setCurrentScreen('staff-dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('staff-signin');
    setStaffId('');
    toast({
      title: "Success",
      description: "Successfully logged out",
      duration: 3000,
    });
  };

  const handleOrderMenu = () => {
    setCurrentScreen('select-table');
  };

  const handlePayOrder = () => {
    setCurrentScreen('select-table-pay');
  };

  const handleScanQR = () => {
    setCurrentScreen('qr-scanning');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('staff-dashboard');
  };

  const handleStartOrder = (tableNumber: string, count: number) => {
    setSelectedTable(tableNumber);
    setGuestCount(count);
    // Load existing order if any
    const existingOrder = getOrderForTable(tableNumber);
    if (existingOrder) {
      setCart(existingOrder.items);
    } else {
      setCart([]);
    }
    setCurrentScreen('order-menu');
  };

  const handleGoToOrderPay = (tableNumber: string, count: number) => {
    setSelectedTable(tableNumber);
    setGuestCount(count);
    setCurrentScreen('pay-order-detail');
  };

  const handleBackToSelectTable = () => {
    setCurrentScreen('select-table');
  };

  const handleBackToSelectTablePay = () => {
    setCurrentScreen('select-table-pay');
  };

  const handleOpenCart = () => {
    setCurrentScreen('cart');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('order-menu');
  };

  const handleOrderSent = () => {
    // Persist the order
    saveTableOrder(selectedTable, cart);
    setCurrentScreen('processing');
    setTimeout(() => {
      setCurrentScreen('order-success');
    }, 3000);
  };

  const handleSettleOrder = (finalGuestCount?: number) => {
    if (finalGuestCount !== undefined) {
      setGuestCount(finalGuestCount);
    }
    setCurrentScreen('processing');
    setTimeout(() => {
      setCurrentScreen('settled');
    }, 3000);
  };

  const handleStartSplitByItem = () => {
    setCurrentScreen('processing');
    setTimeout(() => {
      setCurrentScreen('split-by-item');
    }, 2000);
  };

  const handleStartSplitEqually = () => {
    setCurrentScreen('processing');
    setTimeout(() => {
      setCurrentScreen('split-equally');
    }, 2000);
  };

  const handleBackToPayOrder = () => {
    setCurrentScreen('pay-order-detail');
  };

  const handleFinishOrder = () => {
    // Clear order from storage on finish
    clearTableOrder(selectedTable);
    setCart([]);
    setSelectedTable('');
    setGuestCount(1);
    setCurrentScreen('staff-dashboard');
  };

  const handleQRDetected = (tableId: string) => {
    const existingOrder = getOrderForTable(tableId);
    if (existingOrder) {
      setSelectedTable(tableId);
      setGuestCount(2); // Default mock
      setCurrentScreen('pay-order-detail');
      toast({
        title: "Table Detected",
        description: `Accessing Table #${tableId} for Payment`,
      });
    } else {
      toast({
        title: "No Order Found",
        description: `Table #${tableId} has no active orders to settle.`,
        variant: "destructive",
      });
      // Return to dashboard since QR is ONLY for paying existing orders
      setCurrentScreen('staff-dashboard');
    }
  };

  return (
    <main>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStarted={handleStarted} />
      )}
      {currentScreen === 'staff-signin' && (
        <StaffSignInScreen 
          restaurantName={restaurantName}
          onLogin={handleLogin} 
        />
      )}
      {currentScreen === 'staff-dashboard' && (
        <StaffDashboardScreen 
          restaurantName={restaurantName}
          staffId={staffId}
          onLogout={handleLogout} 
          onOrderMenu={handleOrderMenu} 
          onPayOrder={handlePayOrder}
          onScanQR={handleScanQR}
        />
      )}
      {currentScreen === 'qr-scanning' && (
        <QRScanningScreen 
          onBack={handleBackToDashboard}
          onDetected={handleQRDetected}
        />
      )}
      {currentScreen === 'select-table' && (
        <SelectTableScreen 
          mode="order"
          onBack={handleBackToDashboard} 
          onConfirmSelection={handleStartOrder} 
          onScanQR={handleScanQR}
        />
      )}
      {currentScreen === 'select-table-pay' && (
        <SelectTableScreen 
          mode="pay"
          onBack={handleBackToDashboard} 
          onConfirmSelection={handleGoToOrderPay} 
          onNavigateToOrder={handleStartOrder}
          onScanQR={handleScanQR}
        />
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
          onOrderSent={handleOrderSent}
        />
      )}
      {currentScreen === 'pay-order-detail' && (
        <PayOrderDetailScreen 
          tableNumber={selectedTable}
          onBack={handleBackToSelectTablePay}
          onHome={handleBackToDashboard}
          onSettle={() => handleSettleOrder()}
          onSplitByItem={handleStartSplitByItem}
          onSplitEqually={handleStartSplitEqually}
          onOrderMenu={() => handleStartOrder(selectedTable, guestCount)}
        />
      )}
      {currentScreen === 'split-by-item' && (
        <SplitByItemScreen 
          tableNumber={selectedTable}
          onBack={handleBackToPayOrder}
          onPay={() => handleSettleOrder()}
        />
      )}
      {currentScreen === 'split-equally' && (
        <SplitEquallyScreen 
          tableNumber={selectedTable}
          onBack={handleBackToPayOrder}
          onPay={(count) => handleSettleOrder(count)}
        />
      )}
      {currentScreen === 'processing' && (
        <ProcessingScreen />
      )}
      {currentScreen === 'order-success' && (
        <OrderSuccessScreen onBackToHome={() => setCurrentScreen('staff-dashboard')} />
      )}
      {currentScreen === 'settled' && (
        <SettledScreen guestCount={guestCount} onBackToHome={handleFinishOrder} />
      )}
    </main>
  );
}
