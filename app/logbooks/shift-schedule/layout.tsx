'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import Layout from '@/app/_components/_layouts/admin_layout'; 

interface ShiftScheduleProps {
  children: React.ReactNode;
}

const ShiftScheduleLayout: React.FC<ShiftScheduleProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  );
};

export default ShiftScheduleLayout;