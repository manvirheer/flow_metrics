// app/staff/shift-end-entry/page.tsx

'use client';

import React, { useState, useEffect, useContext } from 'react';
import ProtectedRoute from '../../_components/ProtectedRoute';
import useActiveShift from './hooks/useActiveShift';
import usePreviousShift from './hooks/usePreviousShift';
import ShiftDetails from './components/ShiftDetails';
import ShiftEndEntryForm from './components/ShiftEndEntryForm';
import ConfirmSubmitModal from './components/ConfirmSubmitModal';
import { ShiftEndEntryData } from '@/app/_types/ShiftEndEntry';
import { format } from 'date-fns';
import { PlantContext } from '@/app/_contexts/PlantContext';
import api from '@/app/_utils/axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const ShiftEndEntryPage: React.FC = () => {
  const { activeShift, entryExisting, loading } = useActiveShift();
  const { initialSteamReading, loading: loadingPreviousShift } = usePreviousShift({
    activeShift: activeShift!,
  });

  const router = useRouter();
  const { selectedPlant } = useContext(PlantContext);

  const [formData, setFormData] = useState<ShiftEndEntryData>({
    briquetteConsumption: 0,
    ashGenerated: 0,
    steamGenerationFinalReading: 0,
    steamGenerationInitialReading: initialSteamReading || 0,
    remarks: '',
  });



  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Update formData when initialSteamReading changes
  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      steamGenerationInitialReading: initialSteamReading || 0,
    }));
  }, [initialSteamReading]);

  // Handle form data changes
  const handleFormChange = (data: ShiftEndEntryData) => {
    setFormData(data);
  };

  // Handle form submission (opens modal)
  const handleSubmit = () => {
    // Optional: Additional validation can be added here
    setIsModalOpen(true);
  };

  // Confirm submission
  const confirmSubmit = async () => {
    try {
      // Ensure all required data is present
      if (!activeShift || !selectedPlant) {
        toast.error('Active shift or selected plant not found.');
        setIsModalOpen(false);
        return;
      }

      const response = await api.post('/shift/end-entry', {
        shiftScheduleId: activeShift.id,
        briquetteConsumption: formData.briquetteConsumption,
        ashGenerated: formData.ashGenerated,
        steamGenerationInitialReading: formData.steamGenerationInitialReading,
        steamGenerationFinalReading: formData.steamGenerationFinalReading,
        remarks: formData.remarks || 'None',
        plantId: selectedPlant.plantId,
      });

      // Handle success, perhaps redirect or show a success message
      toast.success('Shift end entry submitted successfully.');
      setIsModalOpen(false);

      // Reset form data to initial values
      setFormData({
        briquetteConsumption: 0,
        ashGenerated: 0,
        steamGenerationFinalReading: 0,
        steamGenerationInitialReading: initialSteamReading || 0,
        remarks: '',
      });

      if (response.data) {
        // Redirect to the /staff page
        router.push('/staff');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      // Handle error response
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
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
      {activeShift ? (!entryExisting ? (
        <>
          <ShiftDetails activeShift={activeShift} />
          <ShiftEndEntryForm
            activeShift={activeShift}
            initialSteamReading={initialSteamReading}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
          />
          {/* Confirmation Modal */}
          <ConfirmSubmitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmSubmit}
            shiftDate={format(new Date(activeShift.date), 'yyyy-MM-dd')}
            shiftTitle={activeShift.shiftTitle}
          />
        </>
      ) : (<div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Already Entered Shift End Entry / पहले से ही शिफ्ट समाप्ति एंट्री
        </h1>
        <p className="text-gray-600 text-center">
          You have already entered the shift end entry for today. / आपने आज के लिए पहले से ही शिफ्ट समाप्ति एंट्री दर्ज कर ली है।
        </p>
      </div>)) : (
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

const ShiftEndEntryPageWrapper = (): JSX.Element => {
  return (
    <ProtectedRoute roles={['Staff']}>
      <ShiftEndEntryPage />
    </ProtectedRoute>
  );
};


export default ShiftEndEntryPageWrapper;
