import React from 'react';
import LoginLayout from '../_components/_layouts/login_layout';

export const metadata = {
  title: 'Login - Flow Metrics',
};

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LoginLayout>
      {children}
    </LoginLayout>
  );
}