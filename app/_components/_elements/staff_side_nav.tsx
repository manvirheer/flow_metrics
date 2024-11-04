'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CogIcon,
  CalendarIcon,
  FireIcon,
  TruckIcon,
  CubeIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  PencilIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import path from 'path';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

const staffNavItems = [
  { name: 'Home', path: '/staff', icon: CalendarIcon },
  { name: 'Shift Entry', path: '/staff/shift-end-entry', icon: ClipboardDocumentListIcon, },
  { name: 'Shipments', path: '/staff/shipments', icon: TruckIcon },
  { name: 'Activity', path: '/staff/activity', icon: PencilIcon },
  { name:'Steam Parameters', path: '/staff/steam-parameters', icon: FireIcon },
  { name: 'Settings', path: '/settings', icon: CogIcon },
];

const StaffSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const memoizedNavItems = useMemo(() => staffNavItems, []);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const NavLink = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const Icon = item.icon;
    return (
      <Link
        href={item.path}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
      >
        <div className="flex items-center">
          <Icon className="h-6 w-6 text-gray-400 group-hover:text-white flex-shrink-0" aria-hidden="true" />
          <span
            className={`ml-3 whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
          >
            {item.name}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-64'
        } bg-gray-900 text-white flex flex-col transition-all duration-300`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-6 h-32 flex flex-col items-center justify-center border-b border-gray-700 transition-all duration-300 ${isCollapsed ? 'space-y-0' : 'space-y-2'
          }`}
      >
        <a href="#" className="flex items-center justify-center">
          <img
            alt="A2P Energy"
            src="https://marketplace.cleanenergytrade.com/assets/img/a2p-red.png"
            className={`h-20 w-20 transition-all duration-300 ${isCollapsed ? 'opacity-0 scale-1000' : 'opacity-100 scale-100'
              }`}
          />
        </a>
        <span
          className={`text-xl font-sans font-medium transition-all duration-100 ${isCollapsed ? 'opacity-0 scale-50 ' : 'opacity-100 scale-100'
            }`}
        >
          Flow Metrics
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2 space-y-1">
        {memoizedNavItems.map((item) => {
          const isActive = pathname === item.path;
          return <NavLink key={item.name} item={item} isActive={isActive} />;
        })}
      </nav>

      {/* Toggle Button at Bottom Center */}
      <div className="mt-auto mb-4 flex justify-center">
        <button
          onClick={toggleCollapse}
          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronDoubleRightIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <ChevronDoubleLeftIcon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
