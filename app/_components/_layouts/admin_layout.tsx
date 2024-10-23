// Layout.tsx

import React from 'react';
import Header from '../_elements/header';
import Sidebar from '../_elements/side_nav';
import Footer from '../_elements/footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Fixed on the left side */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-y-auto transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default React.memo(Layout);
