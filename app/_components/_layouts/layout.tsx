import React from 'react';
import Header from './header';
import Sidebar from './side_nav';
import Footer from './footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Fixed on the left side */}
      <div className="w-60 h-screen fixed bg-gray-900">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 ml-60 overflow-y-auto">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 bg-gray-100 p-4">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
