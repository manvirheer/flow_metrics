// app/dashboard/plant/layout.tsx
'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import AdminLayout from '@/app/_components/_layouts/admin_layout';

interface PlantLayoutProps {
  children: React.ReactNode;
}

const PlantLayout: React.FC<PlantLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default PlantLayout;
