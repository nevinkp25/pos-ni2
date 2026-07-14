'use client';

import { useState } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { StaffSignInScreen } from '@/components/staff-signin-screen';
import { StaffDashboardScreen } from '@/components/staff-dashboard-screen';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'staff-signin' | 'staff-dashboard'>('welcome');

  const handleStarted = () => {
    setCurrentScreen('staff-signin');
  };

  const handleLogin = () => {
    setCurrentScreen('staff-dashboard');
  };

  const handleLogout = () => {
    setCurrentScreen('staff-signin');
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
