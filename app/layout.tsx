import './globals.css'; // Import Tailwind CSS
import React from 'react';
import Layout from './_components/_layouts/layout';

export const metadata = {
  title: 'Plant Dashboard',
  description: 'Monitoring and managing plant metrics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
