'use client'

import React from 'react'
import { MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-2 py-4 sm:py-4 lg:px-2">
        <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
          {/* Company Info */}
          <div className="text-center sm:text-left">
            {/* <Link href="/">
                <img
                  src="https://marketplace.cleanenergytrade.com/assets/img/a2p-red.png"
                  alt="A2P Energy"
                  className="h-14 w-auto mx-auto sm:mx-0"
                />
            </Link> */}
            <div className="flex items-center justify-center px-2 sm:justify-start text-sm text-gray-500">
              <MapPinIcon className="h-5 w-5 text-gray-400 " />
              <span>A2P Energy LTD., SCO No 13, Airport Road, opposite Sector 82, JLPL Industrial Area, Sahibzada Ajit Singh Nagar, Punjab 140306</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-right">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} CopyRight, All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
