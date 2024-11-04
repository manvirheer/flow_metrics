'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import Layout from '@/app/_components/_layouts/admin_layout';

interface ShipmentLayoutProps {
  children: React.ReactNode;
}

const ShipmentLayout: React.FC<ShipmentLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default ShipmentLayout;
