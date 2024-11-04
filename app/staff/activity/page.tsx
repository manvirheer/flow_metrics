// app/staff/activity/page.tsx

'use client';
import React, { useState, useContext } from 'react';
import ProtectedRoute from '../../_components/ProtectedRoute';
import useActivities from './hooks/useActivities';
import ShiftDetails from './components/ShiftDetails';
import ActivityTable from './components/ActivityTable';
import ConfirmSubmitModal from './components/ConfirmSubmitModal';
import { Plant, Activity } from './types';
import useActiveShift from './hooks/useActiveShift';
import { PlantContext } from '@/app/_contexts/PlantContext';

const ActivityPage: React.FC = () => {
  const { activities, loading, addActivity, updateActivity, deleteActivity } = useActivities();
  const { activeShift, activeShiftLoading } = useActiveShift();
  const { selectedPlant } = useContext(PlantContext);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Confirm Action');
  const [currentActivityData, setCurrentActivityData] = useState<Partial<Activity>>({});
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleAdd = (data: Partial<Activity>) => {
    setModalTitle('Confirm Add Activity');
    setModalMessage('Are you sure you want to add this activity?');
    setCurrentActivityData(data);
    setIsModalOpen(true);
  };

  const confirmAction = async () => {
    await addActivity(currentActivityData);
    setIsModalOpen(false);
    setSelectedActivity(null);
    setCurrentActivityData({});
  };

  if (loading || activeShiftLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-700">Loading Activities...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {activeShift ? (
        <>
          {/* Active Shift Details */}
          <ShiftDetails activeShift={activeShift} />

          {/* Activities Table */}
          <ActivityTable
            activities={activities}
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

const ActivityPageWrapper = (): JSX.Element => {
  return (
    <ProtectedRoute roles={['Admin', 'Staff']}>
      <ActivityPage />
    </ProtectedRoute>
  );
};

export default ActivityPageWrapper;
