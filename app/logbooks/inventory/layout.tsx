'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import Layout from '@/app/_components/_layouts/admin_layout';

interface InventoryLayoutProps {
  children: React.ReactNode;
}

const InventoryLayout: React.FC<InventoryLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default InventoryLayout;
