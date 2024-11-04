// app/providers.tsx

'use client';

import React from 'react';
import { AuthProvider } from './_contexts/AuthContext';
import { PlantProvider } from './_contexts/PlantContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PlantProvider>
        {children}
      </PlantProvider>
    </AuthProvider>
  );
}
