'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
      >
        <div className="flex lg:flex-1 items-center space-x-4">
          <span className="text-lg text-gray-800 font-semibold px-2">
            Welcome Back, Manvir
          </span>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            aria-label="Open main menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Log Out <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>

      <Transition show={mobileMenuOpen}>
        <Dialog
          as="div"
          className="lg:hidden"
          onClose={() => setMobileMenuOpen(false)}
        >
          <div className="fixed inset-0 z-10 bg-black bg-opacity-25" />
          <DialogPanel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">A2P Energy</span>
                <img
                  alt="A2P Energy Logo"
                  src="https://marketplace.cleanenergytrade.com/assets/img/a2p-red.png"
                  className="h-12 w-auto"
                />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link
                    key="plant_details"
                    href="#"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Plant Details
                  </Link>

                  <Link
                    key="inventory"
                    href="#"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Inventory
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </Transition>
    </header>
  )
}
