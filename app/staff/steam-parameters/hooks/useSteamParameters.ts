// app/staff/steam-parameters/hooks/useSteamParameters.ts

'use client';

import { useState, useEffect } from 'react';
import api from '../../../_utils/axios';
import { SteamParameters } from '../types';
import { toast } from 'react-toastify';

const useSteamParameters = () => {
  const [steamParameters, setSteamParameters] = useState<SteamParameters[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSteamParameters = async () => {
      try {
        const response = await api.get<SteamParameters[]>('/steam-parameters');
        console.log('Steam Parameters:', response.data);
        setSteamParameters(response.data);
      } catch (error: any) {
        console.error('Error fetching steam parameters:', error);
        toast.error('Failed to fetch steam parameters.');
      } finally {
        setLoading(false);
      }
    };

    fetchSteamParameters();
  }, []);

  const addSteamParameter = async (data: Partial<SteamParameters>) => {
    try {
      const response = await api.post<SteamParameters>(
        '/steam-parameters',
        data
      );
      setSteamParameters((prev) => [...prev, response.data]);
      toast.success('Steam parameter added successfully.');
    } catch (error: any) {
      console.error('Error adding steam parameter:', error);
      toast.error('Failed to add steam parameter.');
    }
  };

  const updateSteamParameter = async (id: string, data: Partial<SteamParameters>) => {
    try {
      const response = await api.patch<SteamParameters>(
        `/steam-parameters/${id}`,
        data
      );
      setSteamParameters((prev) =>
        prev.map((param) => (param.id === id ? response.data : param))
      );
      toast.success('Steam parameter updated successfully.');
    } catch (error: any) {
      console.error('Error updating steam parameter:', error);
      toast.error('Failed to update steam parameter.');
    }
  };

  const deleteSteamParameter = async (id: string) => {
    try {
      await api.delete(`/steam-parameters/${id}`);
      setSteamParameters((prev) => prev.filter((param) => param.id !== id));
      toast.success('Steam parameter deleted successfully.');
    } catch (error: any) {
      console.error('Error deleting steam parameter:', error);
      toast.error('Failed to delete steam parameter.');
    }
  };

  return {
    steamParameters,
    loading,
    addSteamParameter,
    updateSteamParameter,
    deleteSteamParameter,
  };
};

export default useSteamParameters;
