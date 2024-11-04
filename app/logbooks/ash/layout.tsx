'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import Layout from '@/app/_components/_layouts/admin_layout';

interface AshLayoutProps {
  children: React.ReactNode;
}

const AshLayout: React.FC<AshLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default AshLayout;
