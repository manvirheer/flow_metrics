// app/staff/steam-parameters/hooks/useActiveShift.ts

'use client';

import { useState, useEffect, useContext } from 'react';
import api from '../../../_utils/axios';
import { ShiftSchedule } from '../types';
import { AuthContext } from '../../../_contexts/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns'; // Ensure this is imported

const useActiveShift = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeShift, setActiveShift] = useState<ShiftSchedule | null>(null);
  const [activeShiftLoading, setActiveShiftLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log('useSteamParameters Mounted');
    return () => {
      console.log('useSteamParameters Unmounted');
    };
  }, []);

  useEffect(() => {
    const fetchActiveShift = async () => {
      if (user && user.role === 'Staff') {
        setActiveShiftLoading(true);
        try {
          const response = await api.get<ShiftSchedule[]>('/shift/schedules/active');

          if (response.data.length > 0) {
            const shiftSchedule = response.data[0];
            const postings = await api.get('/shift/postings/schedule/' + shiftSchedule.id);
            if (postings.data.length > 0) {
              // Check if the user has a posting for the active shift
              const userPosting = postings.data.find((posting: any) => posting.staff.id === user.id);
              if (!userPosting) {
                toast.info('No active shift found for your current time.');
                console.log('No active shift found for your current time.');
                setActiveShift(null);
              } else {
                console.log('Active shift found for your current time.');
                setActiveShift(shiftSchedule as any);
              }
            } else {
              setActiveShift(null);
              console.log('No active shift found for your current time.');
              toast.info('No active shift found for your current time.');
            }
          } else {
            setActiveShift(null);
            console.log('No active shift found for your current time.');
            toast.info('No active shift found for your current time.');
          }
        } catch (error: any) {
          console.error('Error fetching active shift:', error);
          toast.error('Failed to fetch active shift.');
        } finally {
          setActiveShiftLoading(false);
        }
      } else {
        setActiveShiftLoading(false);
      }
    };

    fetchActiveShift();
  }, [user]);

  return { activeShift, activeShiftLoading };
};

export default useActiveShift;
