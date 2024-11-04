'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import Layout from '@/app/_components/_layouts/admin_layout';

interface SteamParametersLayoutProps {
  children: React.ReactNode;
}

const SteamParametersLayout: React.FC<SteamParametersLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default SteamParametersLayout;
