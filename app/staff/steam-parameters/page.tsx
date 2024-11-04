// app/staff/steam-parameters/page.tsx

'use client';
import React, { useState, useContext } from 'react';
import ProtectedRoute from '../../_components/ProtectedRoute';
import useSteamParameters from './hooks/useSteamParameters';
import ShiftDetails from './components/ShiftDetails';
import SteamParametersTable from './components/SteamParametersTable';
import ConfirmSubmitModal from './components/ConfirmSubmitModal';
import { Plant, SteamParameters } from './types';
import useActiveShift from './hooks/useActiveShift';
import { PlantContext } from '@/app/_contexts/PlantContext';

const SteamParametersPage: React.FC = () => {
  const {
    steamParameters,
    loading,
    addSteamParameter,
    updateSteamParameter,
    deleteSteamParameter,
  } = useSteamParameters();
  const { activeShift, activeShiftLoading } = useActiveShift();
  const { selectedPlant } = useContext(PlantContext);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Confirm Action');
  const [currentEntryData, setCurrentEntryData] = useState<Partial<SteamParameters>>({});

  const handleAdd = (data: Partial<SteamParameters>) => {
    setModalTitle('Confirm Add Entry');
    setModalMessage('Are you sure you want to add this entry?');
    setCurrentEntryData(data);
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    await addSteamParameter(currentEntryData);
    setIsModalOpen(false);
    setCurrentEntryData({});
  };

  if (loading || activeShiftLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-700">Loading Steam Parameters...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {activeShift ? (
        <>
          {/* Active Shift Details */}
          <ShiftDetails activeShift={activeShift} />

          {/* Steam Parameters Table */}
          <SteamParametersTable
            steamParameters={steamParameters}
            onAdd={handleAdd}
            activeShift={activeShift}
            plant={selectedPlant ?? ({} as Plant)}
          />

          {/* Confirmation Modal */}
          <ConfirmSubmitModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={confirmAction}
            title={modalTitle}
            message={modalMessage}
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

const SteamParametersPageWrapper = (): JSX.Element => {
  return (
    <ProtectedRoute roles={['Admin', 'Staff']}>
      <SteamParametersPage />
    </ProtectedRoute>
  );
};

export default SteamParametersPageWrapper;
