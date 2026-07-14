'use client';

import { useState } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { StaffSignInScreen } from '@/components/staff-signin-screen';
import { StaffDashboardScreen } from '@/components/staff-dashboard-screen';
import { useToast } from '@/hooks/use-toast';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'staff-signin' | 'staff-dashboard'>('welcome');
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

  return (
    <main>
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStarted={handleStarted} />
      )}
      {currentScreen === 'staff-signin' && (
        <StaffSignInScreen onLogin={handleLogin} />
      )}
      {currentScreen === 'staff-dashboard' && (
        <StaffDashboardScreen onLogout={handleLogout} />
      )}
    </main>
  );
}
