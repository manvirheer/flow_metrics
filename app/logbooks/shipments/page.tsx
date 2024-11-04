'use client';

import React, { useEffect, useState, useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import ShipmentTable from './ShipmentTable';
import api from '../../_utils/axios';
import { Shipment } from '../../_types/Shipment';
import { toast } from 'react-toastify';

export default function ShipmentsPage() {
  const { selectedPlant } = useContext(PlantContext);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlant) {
      fetchShipments();
    }
  }, [selectedPlant]);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      console.log('Fetching shipments for plant:', selectedPlant?.plantName);
      const response = await api.get(`/shipment`, {
        params: {
          plantId: selectedPlant?.plantId,
        },
      });
      setShipments(response.data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to fetch shipments');
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
            Shipments at {selectedPlant?.plantName}
          </h1>
        </div>

        {/* Shipment Table */}
        <ShipmentTable shipments={shipments} loading={loading} />
      </div>
    </div>
  );
}
