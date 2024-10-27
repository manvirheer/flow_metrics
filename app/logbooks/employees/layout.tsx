'use client';

import React from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import Layout from '@/app/_components/_layouts/admin_layout'; 

interface EmployeesLayoutProps {
  children: React.ReactNode;
}

const EmployeesLayout: React.FC<EmployeesLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute roles={['Admin']}>
      <Layout>
        {children}
      </Layout>
    </ProtectedRoute>
  );
};

export default EmployeesLayout;