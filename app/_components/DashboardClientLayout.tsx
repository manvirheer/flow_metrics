// app/_components/DashboardClientLayout.tsx
'use client';

import React, { useContext } from 'react';
import { AuthContext } from '../_contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from './_layouts/admin_layout';
import StaffLayout from './_layouts/staff_layout';

interface DashboardClientLayoutProps {
  children: React.ReactNode;
}

const DashboardClientLayout: React.FC<DashboardClientLayoutProps> = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <ProtectedRoute roles={['Admin']}> 
        <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
};

export default DashboardClientLayout;
