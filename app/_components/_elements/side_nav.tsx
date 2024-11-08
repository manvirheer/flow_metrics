'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChartBarIcon,
  CogIcon,
  CalendarIcon,
  UsersIcon,
  FireIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDownIcon,
  GlobeAsiaAustraliaIcon,
  LightBulbIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import path from 'path';

const navItems = [
  { name: 'Dashboard', path: '/dashboard/plant', icon: HomeIcon },
  {
    name: 'Log Books',
    icon: ClipboardDocumentListIcon,
    children: [
      { name: 'Employees', path: '/logbooks/employees', icon: UsersIcon },
      { name: 'Shift Schedule', path: '/logbooks/shift-schedule', icon: CalendarIcon },
      { name: 'Shipments', path: '/logbooks/shipments', icon: TruckIcon },
      { name: 'Steam Generation', path: '/logbooks/steam-generation', icon: LightBulbIcon },
      { name: 'Inventory', path: '/logbooks/inventory', icon: CubeIcon },
      { name: 'Activity', path: '/logbooks/activity', icon: PencilSquareIcon },
      { name: 'Ash', path: '/logbooks/ash', icon: FireIcon },
      {name: 'Steam Parameters', path: '/logbooks/steam-parameters', icon: ClipboardDocumentListIcon},
    ],
  },
  { name: 'Settings', path: '/settings', icon: CogIcon },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const memoizedNavItems = useMemo(() => navItems, []);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu((prev) => (prev === name ? null : name));
  };

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

  const SubNavLink = ({ subItem, isSubActive }: { subItem: any; isSubActive: boolean }) => {
    const SubIcon = subItem.icon;
    return (
      <Link
        key={subItem.name}
        href={subItem.path}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isSubActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
      >
        <div className="flex items-center">
          <SubIcon className="h-6 w-6 text-gray-400 group-hover:text-white flex-shrink-0" aria-hidden="true" />
          <span
            className={`ml-3 whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
              }`}
          >
            {subItem.name}
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

          if (item.children) {
            const isSubmenuOpen = openSubmenu === item.name;
            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleSubmenu(item.name)}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <item.icon className="h-6 w-6 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    <span
                      className={`ml-3 whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
                        }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <ChevronDownIcon
                    className={`h-6 w-6 transition-transform ${isSubmenuOpen ? 'rotate-180' : ''
                      }`}
                    aria-hidden="true"
                  />
                </button>
                {isSubmenuOpen && (
                  <div className="pl-6 space-y-1">
                    {item.children.map((subItem) => (
                      <SubNavLink
                        key={subItem.name}
                        subItem={subItem}
                        isSubActive={pathname === subItem.path}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return <NavLink key={item.name} item={item} isActive={isActive} />;
        })}
      </nav>

      {/* Toggle Button at Bottom Center */}
      <div className="mt-auto mb-4 flex justify-center">
        <button
          onClick={toggleCollapse}
          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
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

export default Sidebar;
