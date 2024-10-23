// app/_components/AuthProviderWrapper.tsx
'use client';

import React from 'react';
import { AuthProvider } from '../_contexts/AuthContext';

const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthProviderWrapper;
