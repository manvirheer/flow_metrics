// app/staff/shift-end-entry/hooks/usePreviousShift.ts

'use client';

import { useState, useEffect } from 'react';
import api from '../../../_utils/axios';
import { ShiftSchedule } from '../types';
import { SteamGenerationRecord } from '@/app/_types/SteamGenerationRecord';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

interface UsePreviousShiftProps {
  activeShift: ShiftSchedule;
}

const usePreviousShift = ({ activeShift }: UsePreviousShiftProps) => {
  const [initialSteamReading, setInitialSteamReading] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPreviousSteamFinalReading = async () => {
      try {
        // Fetch the previous shift using the new endpoint
        const response = await api.get<ShiftSchedule[]>('/shift/schedules/previous');

        if (response.data.length > 0) {
          const previousShift = response.data[0]; // Assuming the latest previous shift

          // Fetch the steam generation records for the previous shift
          const steamResponse = await api.get<SteamGenerationRecord[]>(
            `/record/steam-generation/shift-schedule/${previousShift.id}`
          );

          const steamRecords = steamResponse.data;
          if (steamRecords.length > 0) {
            const latestSteamRecord = steamRecords[steamRecords.length - 1];

            if (latestSteamRecord.finalReading > 0) {
              setInitialSteamReading(latestSteamRecord.finalReading);
            } else {
              setInitialSteamReading(null);
              toast.info('Final reading of the previous shift is zero. Please enter the initial reading.');
            }
          } else {
            setInitialSteamReading(null);
            toast.info('No previous steam generation record found. Please enter the initial reading.');
          }
        } else {
          setInitialSteamReading(null);
          toast.info('No previous shift found. Please enter the initial steam generation reading.');
        }
      } catch (error: any) {
        console.error('Error fetching previous shift or steam record:', error);
        toast.error('Failed to fetch previous shift data.');
        setInitialSteamReading(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousSteamFinalReading();
  }, [activeShift]);

  return { initialSteamReading, loading };
};

export default usePreviousShift;
