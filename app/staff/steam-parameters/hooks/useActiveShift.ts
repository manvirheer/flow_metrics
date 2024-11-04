
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
  const [activeShiftLoading, setActiveShiftLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    const fetchActiveShift = async () => {
      if (user && user.role === 'Staff') {
        try {
          const currentTime = format(new Date(), 'HH:mm:ss');
          const response = await api.get<ShiftPosting[]>('/shift/schedules/active')

          if (response.data.length > 0) {
            const shiftSchedule = response.data[0];
            setActiveShift(shiftSchedule as any);
            const postings = await api.get('/shift/postings/schedule/' + shiftSchedule.id);
            if (postings.data.length > 0) {
              // check if the user has a posting for the active shift
              const userPosting = postings.data.find((posting: any) => posting.staff.id === user.id);
              if (!userPosting) {
                toast.info('No active shift found for your current time.');
                setActiveShift(null);
              } else {
                setActiveShift(shiftSchedule as any);
              }
            }
            else {
              setActiveShift(null);
              toast.info('No active shift found for your current time.');
            }

          } else {
            setActiveShift(null);
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
