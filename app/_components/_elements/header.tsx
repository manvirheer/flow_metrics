'use client';

import React, { useContext, useState, Fragment } from 'react';
import { AuthContext } from '../../_contexts/AuthContext';
import { PlantContext } from '../../_contexts/PlantContext';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Header() {
  const { logout, user } = useContext(AuthContext);
  const { plants, selectedPlant, setSelectedPlant } = useContext(PlantContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
  // Updated JSX Structure
<header className="bg-white">
  <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center p-4 lg:px-8">
    <div className="flex lg:flex-1 items-center space-x-4">
      <span className="text-lg text-gray-800 font-semibold px-2">
        Welcome Back, {user?.name || 'User'}
      </span>
    </div>

    {/* Right-aligned container for plant selection and logout and always show on top of every other element*/}
    <div className="flex items-center space-x-4 lg:flex-1 lg:justify-end z-10">
      {/* Plant Selection Dropdown */}
      <div className="relative min-w-44">
        <Listbox value={selectedPlant} onChange={setSelectedPlant}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-blue-600 text-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 sm:text-sm">
              <span className="block truncate">
                {selectedPlant?.plantName || 'Select Plant'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {plants.map((plant) => (
                  <Listbox.Option
                    title={plant.plantName}
                    key={plant.plantId}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                      }`
                    }
                    value={plant}
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {plant.plantName}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>

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
