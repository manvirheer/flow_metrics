'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import Layout from '@/app/_components/_layouts/admin_layout'; 
import SteamGenerationPage from './page';
import { SteamGenerationRecord } from '@/app/_types/SteamGenerationRecord';

interface SteamGenerationLayoutProps {
  children: React.ReactNode;
}

const SteamGenerationLayout: React.FC<SteamGenerationLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  );
};

export default SteamGenerationLayout;