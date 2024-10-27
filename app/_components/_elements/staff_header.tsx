'use client';

import React, { useContext } from 'react';
import { AuthContext } from '../../_contexts/AuthContext';
import Link from 'next/link';

export default function StaffHeader() {
  const { logout, user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center p-4 lg:px-8">
        <div className="flex lg:flex-1 items-center space-x-4">
          <span className="text-lg text-gray-800 font-semibold px-2">
            Welcome Back, {user?.name || 'Staff'}
          </span>
        </div>

        {/* Right-aligned container for logout */}
        <div className="flex items-center space-x-4 lg:flex-1 lg:justify-end z-10">
          {/* Log Out button */}
          <button
            onClick={logout}
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700"
          >
            Log Out <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
