// app/logbooks/shift-schedule/page.tsx
'use client';

import React, { useState, useEffect, useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import ShiftPostingTable from './ShiftPostingTable';
import AddShiftPostingModal from './AddShiftPosting';
import api from '../../_utils/axios';
import { ShiftPosting } from '../../_types/ShiftPosting';
import { PlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function ShiftSchedulePage() {
  const { selectedPlant } = useContext(PlantContext);

  const [shiftPostings, setShiftPostings] = useState<ShiftPosting[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddShiftPostingModalOpen, setIsAddShiftPostingModalOpen] = useState(false);

  useEffect(() => {
    if (selectedPlant) {
      fetchShiftPostings();
    }
  }, [selectedPlant]);

  const fetchShiftPostings = async () => {
    setLoading(true);
    try {
      console.log('Fetching shift postings for plant:', selectedPlant?.plantName);
      const response = await api.get(`/shift/postings/plants/${selectedPlant?.plantId ?? ''}`);
      setShiftPostings(response.data);
    } catch (error) {
      console.error('Error fetching shift postings:', error);
      toast.error('Failed to fetch shift postings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddShiftPosting = () => {
    setIsAddShiftPostingModalOpen(true);
  };

  const handleShiftPostingsCreated = () => {
    setIsAddShiftPostingModalOpen(false);
    fetchShiftPostings();
  };

  const handleShiftPostingsUpdated = () => {
    fetchShiftPostings();
  };

  return (
    <div className="bg-gray-100 p-4 min-h-screen relative">
      {/* Add Shift Posting Modal */}
      {isAddShiftPostingModalOpen && (
        <AddShiftPostingModal
          isOpen={isAddShiftPostingModalOpen}
          onClose={() => setIsAddShiftPostingModalOpen(false)}
          onShiftPostingsCreated={handleShiftPostingsCreated}
        />
      )}

      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">
            Shift Postings at {selectedPlant?.plantName}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={handleAddShiftPosting}
              className="flex items-center p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              <span>Add Shift Posting</span>
            </button>
          </div>
        </div>

        {/* Shift Posting Table */}
        <ShiftPostingTable
          shiftPostings={shiftPostings}
          loading={loading}
          onShiftPostingsUpdated={handleShiftPostingsUpdated} // Pass the callback to refresh data after deletion
        />
      </div>
    </div>
  );
}
