'use client';

import React, { useEffect, useState, useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import AshTable from './AshTable';
import api from '../../_utils/axios';
import { Ash } from '../../_types/Ash';
import { toast } from 'react-toastify';

export default function AshPage() {
  const { selectedPlant } = useContext(PlantContext);
  const [ashRecords, setAshRecords] = useState<Ash[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlant) {
      fetchAshRecords();
    }
  }, [selectedPlant]);

  const fetchAshRecords = async () => {
    setLoading(true);
    try {
      console.log('Fetching ash records for plant:', selectedPlant?.plantName);
      const response = await api.get(`/ash`, {
        params: {
          plantId: selectedPlant?.plantId,
        },
      });
      setAshRecords(response.data);
    } catch (error) {
      console.error('Error fetching ash records:', error);
      toast.error('Failed to fetch ash records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 min-h-screen relative">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">
            Ash Records at {selectedPlant?.plantName}
          </h1>
        </div>

        {/* Ash Table */}
        <AshTable ashRecords={ashRecords} loading={loading} />
      </div>
    </div>
  );
}
