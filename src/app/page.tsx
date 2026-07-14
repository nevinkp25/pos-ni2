
'use client';

import { useState } from 'react';
import { WelcomeScreen } from '@/components/welcome-screen';
import { StaffSignInScreen } from '@/components/staff-signin-screen';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'staff-signin'>('welcome');

  const handleStarted = () => {
    setCurrentScreen('staff-signin');
  };

  return (
    <main>
      {currentScreen === 'welcome' ? (
        <WelcomeScreen onStarted={handleStarted} />
      ) : (
        <StaffSignInScreen />
      )}
    </main>
  );
}
