// app/staff/shift-end-entry/components/ShiftDetails.tsx

'use client';

import React from 'react';
import { ShiftPosting, ShiftSchedule } from '../types';
import { format } from 'date-fns';

interface ShiftDetailsProps {
  activeShift: ShiftSchedule;
}

const ShiftDetails: React.FC<ShiftDetailsProps> = ({ activeShift }) => {


  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Shift Details / शिफ्ट विवरण
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">
            <span className="font-medium">Date / तारीख:</span>{' '}
            {format(new Date(activeShift.date), 'yyyy-MM-dd')}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Shift / शिफ्ट:</span> {activeShift.shiftTitle}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-medium">Start Time / प्रारंभ समय:</span> {activeShift.startTime}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">End Time / समाप्ति समय:</span> {activeShift.endTime}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-700 mb-2 text-center">
          Plant Details / संयंत्र विवरण:
        </h3>
        <p className="text-gray-600 text-center">
          <span className="font-medium">Plant Name / संयंत्र का नाम:</span> {activeShift.plant.plantName}
        </p>
        <p className="text-gray-600 text-center">
          <span className="font-medium">Plant Address / संयंत्र का पता:</span> {activeShift.plant.plantAddress}
        </p>
      </div>
      
    </div>
  );
};

export default ShiftDetails;
