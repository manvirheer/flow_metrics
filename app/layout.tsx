import './globals.css';
import React from 'react';
import AuthProviderWrapper from './_components/AuthProviderWrapper';


export const metadata = {
  title: 'Plant Dashboard',
  description: 'Monitoring and managing plant metrics',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProviderWrapper>
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Main Content */}
        <div className="flex-1">{children}</div>

    
      </body>
    </html>
    </AuthProviderWrapper>
   
  );
}
