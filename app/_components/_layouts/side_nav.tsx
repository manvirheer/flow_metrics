"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard/plant' },
    { name: 'Reports', path: '/dashboard/plant' },
    { name: 'Settings', path: '/settings/plant' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
      <nav className="mt-10">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.name} href={item.path} 
                className={`block py-2.5 px-4 hover:bg-gray-700 ${
                  isActive ? 'bg-gray-700' : ''
                }`}
              >
                {item.name}
              
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
