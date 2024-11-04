// app/staff/shipments/hooks/useShipments.tsx

'use client';

import { useState, useEffect } from 'react';
import api from '../../../_utils/axios';
import { Shipment } from '../types';
import { toast } from 'react-toastify';

const useShipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const assignSerialNumbers = (shipments: Shipment[]): Shipment[] => {
    return shipments.map((shipment, index) => ({
      ...shipment,
      serialNumber: index + 1, // Start numbering from 1
    }));
  };

  const fetchShipments = async () => {
    try {
      const response = await api.get<Shipment[]>('/shipment');
      const shipmentsWithSerialNumber = assignSerialNumbers(response.data);
      setShipments(shipmentsWithSerialNumber);
    } catch (error: any) {
      console.error('Error fetching shipments:', error);
      toast.error('Failed to fetch shipments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const addShipment = async (data: Partial<Shipment>) => {
    try {
      const response = await api.post<Shipment>('/shipment', data);
      const newShipment = {
        ...response.data,
        serialNumber: shipments.length + 1,
      };
      const updatedShipments = [...shipments, newShipment];
      setShipments(updatedShipments);
      toast.success('Shipment added successfully.');
    } catch (error: any) {
      console.error('Error adding shipment:', error);
      toast.error('Failed to add shipment.');
    }
  };

  const updateShipment = async (id: string, data: Partial<Shipment>) => {
    try {
      const response = await api.patch<Shipment>(`/shipment/${id}`, data);
      const updatedShipments = shipments.map((shipment) =>
        shipment.id === id
          ? { ...response.data, serialNumber: shipment.serialNumber }
          : shipment
      );
      setShipments(updatedShipments);
      toast.success('Shipment updated successfully.');
    } catch (error: any) {
      console.error('Error updating shipment:', error);
      toast.error('Failed to update shipment.');
    }
  };

  const deleteShipment = async (id: string) => {
    try {
      await api.delete(`/shipment/${id}`);
      const updatedShipments = shipments.filter(
        (shipment) => shipment.id !== id
      );
      const shipmentsWithSerialNumber = assignSerialNumbers(updatedShipments);
      setShipments(shipmentsWithSerialNumber);
      toast.success('Shipment deleted successfully.');
    } catch (error: any) {
      console.error('Error deleting shipment:', error);
      toast.error('Failed to delete shipment.');
    }
  };

  return { shipments, loading, addShipment, updateShipment, deleteShipment };
};

export default useShipments;
