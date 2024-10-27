'use client';

import React from 'react';
import Link from 'next/link';
import {
  TruckIcon,
  ClipboardDocumentListIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

const StaffDashboard: React.FC = () => {
  // Card data with English and Hindi texts
  const cards = [
    {
      title: 'New Shipment',
      titleHindi: 'नये ट्रक शिपमेंट',
      headline: 'Manage and track new shipments efficiently.',
      headlineHindi: 'नई स्टॉक के लिए प्रविष्टि जोड़ें।',
      icon: TruckIcon,
      link: '/staff/new-shipment',
    },
    {
      title: 'Shift End',
      titleHindi: 'शिफ्ट समाप्ति',
      headline: 'Record shift completions and oversee daily operations.',
      headlineHindi: 'शिफ्ट समाप्ति और दैनिक संचालन की निगरानी करें।',
      icon: ClipboardDocumentListIcon,
      link: '/staff/shift-end-entry',
    },
    {
      title: 'Add Activity',
      titleHindi: 'महत्वपूर्ण जानकारी लिखें',
      headline: 'Log activities and remarks to maintain operational transparency.',
      headlineHindi: 'संचालन पारदर्शिता बनाए रखने के लिए गतिविधियाँ और टिप्पणियाँ लॉग करें।',
      icon: PencilIcon,
      link: '/staff/add-activity',
    },
  ];

  return (
    <div className="container mx-auto p-6 h-3/4">
      {/* Main Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Staff Dashboard
      </h1>

      {/* Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-3/4">
        {cards.map((card) => (
          <Link href={card.link} key={card.title} className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Card Header */}
            <div className="flex items-center mb-4">
              <card.icon className="h-8 w-8 text-blue-500" aria-hidden="true" />
              <h2 className="ml-4 text-2xl font-semibold text-gray-700">
                {card.title} / {card.titleHindi}
              </h2>
            </div>

            {/* Card Content */}
            <p className="text-gray-600 mb-2 text-xl">
              {card.headline}
            </p>
            <p className="text-gray-600">
              {card.headlineHindi}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StaffDashboard;
