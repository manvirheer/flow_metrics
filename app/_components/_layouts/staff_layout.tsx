// app/_components/_layouts/staff_layout.tsx
import React from 'react';
import Header from '../_elements/staff_header';
import Sidebar from '../_elements/staff_side_nav';
import Footer from '../_elements/footer';

interface StaffLayoutProps {
  children: React.ReactNode;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ children }) => {
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

export default React.memo(StaffLayout);
