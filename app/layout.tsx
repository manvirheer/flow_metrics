// app/layout.tsx

import './globals.css';
import React from 'react';
import Providers from './providers'; // We'll create this component
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: 'Plant Dashboard',
  description: 'Monitoring and managing plant metrics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          {/* <ToastContainer /> */}
          <div className="flex-1">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
