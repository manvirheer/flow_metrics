'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import Layout from '@/app/_components/_layouts/admin_layout';

interface ActivityLayoutProps {
  children: React.ReactNode;
}

const ActivityLayout: React.FC<ActivityLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
};

export default ActivityLayout;
