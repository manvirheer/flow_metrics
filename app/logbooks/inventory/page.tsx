'use client';

import React, { useEffect, useState, useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import InventoryTable from './InventoryTable';
import api from '../../_utils/axios';
import { InventoryRecord } from '../../_types/InventoryRecord';
import { toast } from 'react-toastify';

export default function InventoryPage() {
  const { selectedPlant } = useContext(PlantContext);
  const [records, setRecords] = useState<InventoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlant) {
      fetchRecords();
    }
  }, [selectedPlant]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      console.log('Fetching inventory records for plant:', selectedPlant?.plantName);
      const response = await api.get(`/inventory`, {
        params: {
          plantId: selectedPlant?.plantId,
        },
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching inventory records:', error);
      toast.error('Failed to fetch inventory records');
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
            Inventory Records at {selectedPlant?.plantName}
          </h1>
        </div>

        {/* Inventory Table */}
        <InventoryTable records={records} loading={loading} />
      </div>
    </div>
  );
}
