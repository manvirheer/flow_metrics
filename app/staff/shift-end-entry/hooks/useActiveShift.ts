// app/staff/shift-end-entry/hooks/useActiveShift.ts

'use client';

import { useState, useEffect, useContext } from 'react';
import api from '../../../_utils/axios';
import { ShiftPosting, ShiftSchedule } from '../types';
import { AuthContext } from '../../../_contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const useActiveShift = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeShift, setActiveShift] = useState<ShiftSchedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActiveShift = async () => {
      if (user && user.role === 'Staff') {
        try {
          const currentTime = format(new Date(), 'HH:mm:ss');
          const response = await api.get<ShiftPosting[]>('/shift/schedules/active', {
          
          });
          if (response.data.length > 0) {
            const shiftSchedule = response.data[0];
            console.log('In useActiveShift.ts, response.data:', shiftSchedule);
          
            setActiveShift(shiftSchedule as any); // Assuming one active shift per staff
          } else {
            setActiveShift(null);
            toast.info('No active shift found for your current time.');
          }
        } catch (error: any) {
          console.error('Error fetching active shift:', error);
          toast.error('Failed to fetch active shift.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchActiveShift();
  }, [user]);

  return { activeShift, loading };
};

export default useActiveShift;
