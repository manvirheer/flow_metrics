'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CalendarIcon,
  UsersIcon,
  FireIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const navItems = [
  { name: 'Dashboard', path: '/dashboard/plant', icon: HomeIcon },
  { name: 'Layout', path: '/dashboard/reports', icon: ChartBarIcon },
  {
    name: 'Log Books',
    icon: ClipboardDocumentListIcon,
    children: [
      { name: 'Employees', path: '/logbooks/employees', icon: UsersIcon },
      { name: 'Shift Schedule', path: '/logbooks/shift-schedule', icon: CalendarIcon },
      { name: 'Fuel Consumption', path: '/logbooks/fuel-consumption', icon: FireIcon },
      { name: 'Briquette Shipments', path: '/logbooks/briquette-shipments', icon: TruckIcon },
      { name: 'Inventory', path: '/logbooks/inventory', icon: CubeIcon },
    ],
  },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-full bg-gray-900 text-white flex flex-col max-sm:hidden  rounded-tr-xl rounded-br-xl ">
      {/* Sidebar Header */}
      <div className="w-full p-6 h-32 flex flex-col items-center justify-center border-b border-gray-700">
        <a href="#" className="flex items-center justify-center">
          <img
            alt="A2P Energy"
            src="https://marketplace.cleanenergytrade.com/assets/img/a2p-red.png"
            className="h-20 w-20"
          />
        </a>
        <span className="mt-2 text-xl font-sans font-medium">Flow Metrics</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          // If the item has children, render it as a Disclosure
          if (item.children) {
            return (
              <Disclosure key={item.name}>
                {({ open }) => (
                  <>
                    <DisclosureButton
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-6 w-6 text-gray-400" aria-hidden="true" />
                        {item.name}
                      </div>
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ${
                          open ? 'transform rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </DisclosureButton>
                    <DisclosurePanel className="pl-6">
                      <div className="space-y-1">
                        {item.children.map((subItem) => {
                          const isSubActive = pathname === subItem.path;
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.path}
                              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                isSubActive
                                  ? 'bg-gray-700 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              <SubIcon
                                className={`mr-3 h-6 w-6 ${
                                  isSubActive
                                    ? 'text-white'
                                    : 'text-gray-400 group-hover:text-white'
                                }`}
                                aria-hidden="true"
                              />
                              {subItem.name}
                            </Link>
                          );
                        })}
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            );
          }

          // Regular navigation items without children
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon
                className={`mr-3 h-6 w-6 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
