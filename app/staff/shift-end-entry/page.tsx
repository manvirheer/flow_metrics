// app/staff/shift-end-entry/page.tsx

'use client';

import React, { useState } from 'react';
import ProtectedRoute from '../../_components/ProtectedRoute';
import useActiveShift from './hooks/useActiveShift';
import usePreviousShift from './hooks/usePreviousShift';
import ShiftDetails from './components/ShiftDetails';
import ShiftEndEntryForm from './components/ShiftEndEntryForm';
import ConfirmSubmitModal from './components/ConfirmSubmitModal';
import { ShiftEndEntryData } from '@/app/_types/ShiftEndEntry';
import { format } from 'date-fns';

const ShiftEndEntryPage: React.FC = () => {
  const { activeShift, loading } = useActiveShift();
  const { previousShift, initialSteamReading, loading: loadingPreviousShift } = usePreviousShift({
    activeShift : activeShift as any,
  });

  const [formData, setFormData] = useState<ShiftEndEntryData>({
    briquetteConsumption: 0,
    ashGenerated: 0,
    steamGenerationFinalReading: 0,
    steamGenerationInitialReading: initialSteamReading || undefined,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Handle form data changes
  const handleFormChange = (data: ShiftEndEntryData) => {
    setFormData(data);
  };

  // Handle form submission (opens modal)
  const handleSubmit = () => {
    // Validate form data if necessary
    setIsModalOpen(true);
  };

  // Confirm submission (to be implemented in future iterations)
  const confirmSubmit = async () => {
    // Placeholder for future submission logic
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
  };

  // Render loading states
  if (loading || loadingPreviousShift) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {activeShift ? (
        <>
          <ShiftDetails activeShift={activeShift} />
          <ShiftEndEntryForm
                      activeShift={activeShift}
                      initialSteamReading={initialSteamReading}
                      onFormChange={handleFormChange} onSubmit={function (): void {
                          throw new Error('Function not implemented.');
                      } }          />
          {/* Confirmation Modal */}
          {console.log('activeShift', activeShift)}
          <ConfirmSubmitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmSubmit}

            shiftDate={format(new Date(activeShift.date), 'yyyy-MM-dd')}
            shiftTitle={activeShift.shiftTitle}
          />
        </>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            No Active Shift / कोई सक्रिय शिफ्ट नहीं
          </h1>
          <p className="text-gray-600 text-center">
            You do not have any active shift postings at this time.
          </p>
        </div>
      )}
    </div>
  );
};

const ShiftEndEntryPageWrapper: React.FC = () => {
  return (
    <ProtectedRoute roles={['Staff']}>
      <ShiftEndEntryPage />
    </ProtectedRoute>
  );
};

export default ShiftEndEntryPageWrapper;
