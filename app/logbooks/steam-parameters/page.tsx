'use client';

import React, { useEffect, useState, useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import SteamParametersTable from './SteamParametersTable';
import api from '../../_utils/axios';
import { SteamParameters } from '../../_types/SteamParameters';
import { toast } from 'react-toastify';

export default function SteamParametersPage() {
  const { selectedPlant } = useContext(PlantContext);
  const [steamParameters, setSteamParameters] = useState<SteamParameters[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlant) {
      fetchSteamParameters();
    }
  }, [selectedPlant]);

  const fetchSteamParameters = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/steam-parameters`, {

      });
      setSteamParameters(response.data);
    } catch (error) {
      console.error('Error fetching steam parameters records:', error);
      toast.error('Failed to fetch steam parameters records');
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
            Steam Parameters Records at {selectedPlant?.plantName}
          </h1>
        </div>

        {/* Steam Parameters Table */}
        <SteamParametersTable steamParameters={steamParameters} loading={loading} />
      </div>
    </div>
  );
}
