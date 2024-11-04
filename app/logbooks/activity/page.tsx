'use client';

import React, { useEffect, useState, useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import ActivityTable from './ActivityTable';
import api from '../../_utils/axios';
import { Activity } from '../../_types/Activity';
import { toast } from 'react-toastify';

export default function ActivityPage() {
  const { selectedPlant } = useContext(PlantContext);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlant) {
      fetchActivities();
    }
  }, [selectedPlant]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      console.log('Fetching activity records for plant:', selectedPlant?.plantName);
      const response = await api.get(`/record/activity`, {
        params: {
          plantId: selectedPlant?.plantId,
        },
      });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activity records:', error);
      toast.error('Failed to fetch activity records');
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
            Activity Records at {selectedPlant?.plantName}
          </h1>
        </div>

        {/* Activity Table */}
        <ActivityTable activities={activities} loading={loading} />
      </div>
    </div>
  );
}
