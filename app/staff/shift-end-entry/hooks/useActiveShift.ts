// app/staff/shift-end-entry/hooks/useActiveShift.ts

'use client';

import { useState, useEffect, useContext } from 'react';
import api from '../../../_utils/axios';
import { ShiftPosting, ShiftSchedule } from '../types';
import { AuthContext } from '../../../_contexts/AuthContext';
import { toast } from 'react-toastify';
import { format, set } from 'date-fns';
import { useRouter } from 'next/navigation';

const useActiveShift = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeShift, setActiveShift] = useState<ShiftSchedule | null>(null);
  const [entryExisting, setEntryExist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const fetchActiveShift = async () => {
      if (user && user.role === 'Staff') {
        try {
          const currentTime = format(new Date(), 'HH:mm:ss');
          const response = await api.get<ShiftPosting[]>('/shift/schedules/active', {

          });
          if (response.data.length > 0) {
            const shiftSchedule = response.data[0];
            api.get('/shift/end-entry/check/' + shiftSchedule?.id).then((response) => {
              if (response.data == true) {
                // show the error for 3 seconds using settimeout
                toast.error('Shift already ended for today');
                setEntryExist(false);
              }
              else {
                setEntryExist(false);
              }
            });
            setActiveShift(shiftSchedule as any);
          } else {
            setActiveShift(null);
            setEntryExist(false);
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

  return { activeShift, entryExisting, loading };
};

export default useActiveShift;
