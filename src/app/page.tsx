'use client';

import { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '@/lib/types';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'staff-signin' | 'staff-dashboard' | 'select-table' | 'order-menu' | 'cart' | 'processing' | 'order-success' | 'select-table-pay' | 'pay-order-detail' | 'settled' | 'split-by-item' | 'split-equally'>('welcome');
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

  const handlePayOrder = () => {
    setCurrentScreen('select-table-pay');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('staff-dashboard');
  };

  const handleStartOrder = (tableNumber: string) => {
    setSelectedTable(tableNumber);
    setCurrentScreen('order-menu');
  };

  const handleGoToOrderPay = (tableNumber: string) => {
    setSelectedTable(tableNumber);
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
    setCurrentScreen('processing');
    setTimeout(() => {
      setCurrentScreen('order-success');
    }, 3000);
  };

  const handleSettleOrder = () => {
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
    setCart([]);
    setSelectedTable('');
    setCurrentScreen('staff-dashboard');
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
        <StaffDashboardScreen 
          onLogout={handleLogout} 
          onOrderMenu={handleOrderMenu} 
          onPayOrder={handlePayOrder}
        />
      )}
      {currentScreen === 'select-table' && (
        <SelectTableScreen 
          mode="order"
          onBack={handleBackToDashboard} 
          onConfirmSelection={handleStartOrder} 
        />
      )}
      {currentScreen === 'select-table-pay' && (
        <SelectTableScreen 
          mode="pay"
          onBack={handleBackToDashboard} 
          onConfirmSelection={handleGoToOrderPay} 
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
          onSettle={handleSettleOrder}
          onSplitByItem={handleStartSplitByItem}
          onSplitEqually={handleStartSplitEqually}
        />
      )}
      {currentScreen === 'split-by-item' && (
        <SplitByItemScreen 
          onBack={handleBackToPayOrder}
          onPay={handleSettleOrder}
        />
      )}
      {currentScreen === 'split-equally' && (
        <SplitEquallyScreen 
          onBack={handleBackToPayOrder}
          onPay={handleSettleOrder}
        />
      )}
      {currentScreen === 'processing' && (
        <ProcessingScreen />
      )}
      {currentScreen === 'order-success' && (
        <OrderSuccessScreen onBackToHome={handleFinishOrder} />
      )}
      {currentScreen === 'settled' && (
        <SettledScreen onBackToHome={handleFinishOrder} />
      )}
    </main>
  );
}
