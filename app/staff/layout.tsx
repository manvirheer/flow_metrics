// app/dashboard/layout.tsx

import React from 'react';
import DashboardClientLayout from '../_components/DashboardClientLayout';

export const metadata = {
  title: 'Dashboard - Plant Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardClientLayout>
      {children}
    </DashboardClientLayout>
  );
}
