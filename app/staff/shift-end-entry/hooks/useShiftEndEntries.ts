// app/staff/shift-end-entry/hooks/useShiftEndEntries.ts

'use client';

import { useState, useEffect } from 'react';
import api from '../../../_utils/axios';
import { ShiftEndEntryData } from '../types';
import { toast } from 'react-toastify';

const useShiftEndEntries = () => {
  const [shiftEndEntries, setShiftEndEntries] = useState<ShiftEndEntryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShiftEndEntries = async () => {
      try {
        const response = await api.get<any>('/shift/end-entry');
        console.log('Received shift end entries:', response.data);
        setShiftEndEntries(response.data);
      } catch (error: any) {
        console.error('Error fetching shift end entries:', error);
        toast.error('Failed to fetch shift end entries.');
      } finally {
        setLoading(false);
      }
    };

    fetchShiftEndEntries();
  }, []);

  return { shiftEndEntries, loading };
};

export default useShiftEndEntries;
