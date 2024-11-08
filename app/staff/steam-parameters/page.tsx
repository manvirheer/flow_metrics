// app/staff/steam-parameters/page.tsx

'use client';

import React, { useState, useContext, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/app/_components/ProtectedRoute';
import useSteamParameters from './hooks/useSteamParameters';
import SteamParametersTable from './components/SteamParametersTable';
import ConfirmSubmitModal from './components/ConfirmSubmitModal';
import DateSelector from './components/DateSelector';
import useActiveShift from './hooks/useActiveShift';
import { PlantContext } from './../../_contexts/PlantContext';
import { SteamParametersUpdate } from './../../_types/SteamParameters';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const SteamParametersPage: React.FC = () => {
  const {
    steamParameters,
    fetchSteamParametersByDate,
    submitBulkUpdate,
    loading: steamParamsLoading,
  } = useSteamParameters();

  const { activeShift, activeShiftLoading } = useActiveShift();
  const { selectedPlant } = useContext(PlantContext);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalMessage, setModalMessage] = useState<string>('');
  const [updatesToSubmit, setUpdatesToSubmit] = useState<SteamParametersUpdate[]>([]);

  // Combine loading states
  const isLoading = steamParamsLoading || activeShiftLoading;

  // Define handleFetch without isLoading as a dependency
  const handleFetch = useCallback(async () => {
    if (selectedDate) {
      await fetchSteamParametersByDate(selectedDate);
    }
  }, [selectedDate, fetchSteamParametersByDate]);

  // Remove isLoading from useEffect dependencies
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Bulk update handler
  const handleBulkUpdate = async (updates: SteamParametersUpdate[]) => {
    if (updates.length === 0) {
      toast.info('No changes to submit.');
      return;
    }

    if (isLoading) {
      toast.warn('Please wait for the current operation to complete.');
      return;
    }

    setModalTitle('Confirm Bulk Update');
    setModalMessage(`Are you sure you want to submit ${updates.length} changes?`);
    setUpdatesToSubmit(updates);
    setIsModalOpen(true);
  };

  // Confirm bulk update handler
  const confirmBulkUpdate = async () => {
    if (isLoading) {
      toast.warn('Please wait for the current operation to complete.');
      return;
    }

    try {
      await submitBulkUpdate(updatesToSubmit);
      setIsModalOpen(false);
      setUpdatesToSubmit([]);
      // Refresh data after submission
      await handleFetch();
    } catch (error) {
      console.error('Error during bulk update:', error);
      toast.error('Failed to submit updates.');
    }
  };

  return (
    <ProtectedRoute roles={['Admin', 'Staff']}>
      <div className="container mx-auto p-6 text-slate-900">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-gray-600 font-medium">Date:</span>{' '}
            {format(new Date(selectedDate), 'yyyy-MM-dd')}
          </div>
          {activeShift && (
            <div>
              <span className="text-gray-600 font-medium">Plant:</span>{' '}
              {activeShift.plant.plantName}
            </div>
          )}
        </div>

        {activeShift ? (
          <div className="bg-white shadow-md rounded-lg p-4 mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Shift {activeShift.shiftTitle}
              </h2>
              <div>
                <span className="text-gray-600 font-medium">Start Time:</span>{' '}
                {activeShift.startTime}{' '}
                <span className="text-gray-600 font-medium">End Time:</span>{' '}
                {activeShift.endTime}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <p className="text-gray-600 text-center">
              {isLoading
                ? 'Loading shift schedule...'
                : 'There is no shift schedule for the selected date yet.'}
            </p>
          </div>
        )}

        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          loading={isLoading}
        />

        {activeShift && (
          <SteamParametersTable
            steamParameters={steamParameters}
            onBulkUpdate={handleBulkUpdate}
            loading={isLoading}
          />
        )}

        <ConfirmSubmitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmBulkUpdate}
          title={modalTitle}
          message={modalMessage}
        />
      </div>
    </ProtectedRoute>
  );
};

export default SteamParametersPage;