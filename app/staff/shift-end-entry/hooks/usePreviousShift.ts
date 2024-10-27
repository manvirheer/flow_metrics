// app/staff/shift-end-entry/hooks/usePreviousShift.ts

'use client';

import { useState, useEffect } from 'react';
import api from '../../../_utils/axios';
import { ShiftPosting, ShiftSchedule } from '../types';
import { SteamGenerationRecord } from '@/app/_types/ShiftGenerationRecord';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getPreviousShiftTitle } from '../../../_utils/shiftUtils';

interface UsePreviousShiftProps {
  activeShift: ShiftSchedule;
}

const usePreviousShift = ({ activeShift }: UsePreviousShiftProps) => {
  const [previousShift, setPreviousShift] = useState<ShiftSchedule | null>(null);
  const [initialSteamReading, setInitialSteamReading] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPreviousShiftAndSteamRecord = async () => {
      try {
        const currentShiftTitle = activeShift.shiftTitle;
        const previousShiftTitle = getPreviousShiftTitle(currentShiftTitle);

        let previousDate = new Date(activeShift.date);
        // If current shift is the first shift of the day, previous shift is the last shift of the previous day
        if (previousShiftTitle === 'C') {
          previousDate.setDate(previousDate.getDate() - 1);
        }

        const formattedDate = format(previousDate, 'yyyy-MM-dd');


        const response = await api.get<ShiftSchedule[]>('/shift/schedules', {
          params: {
            date: formattedDate,
            shiftTitle: previousShiftTitle,
            plantId: activeShift.plant.plantId,
          },
        });

        const previousShifts = response.data;
        console.log('Previous shift:', previousShifts);
        if (previousShifts.length > 0) {
          const prevShift = previousShifts[0]; 
          setPreviousShift(prevShift);
          // Fetch steam generation record for previous shift
          await fetchPreviousSteamRecord(prevShift.id);
        } else {
          setPreviousShift(null);
          setInitialSteamReading(null);
          toast.info('No previous shift found. Please enter the initial steam generation reading.');
        }
      } catch (error: any) {
        console.error('Error fetching previous shift:', error);
        toast.error('Failed to fetch previous shift.');
      } finally {
        setLoading(false);
      }
    };

    const fetchPreviousSteamRecord = async (previousShiftScheduleId: string) => {
      try {
        const response = await api.get<SteamGenerationRecord[]>(
          `/record/steam-generation/shift-schedule/${previousShiftScheduleId}`
        );
        const steamRecords = response.data;
        if (steamRecords.length > 0) {
          const latestSteamRecord = steamRecords[steamRecords.length - 1];
          if (latestSteamRecord.finalReading > 0) {
            console.log('Latest steam record:', latestSteamRecord);
            setInitialSteamReading(latestSteamRecord.finalReading);
          } else {
            setInitialSteamReading(null);
            toast.info('Final reading of the previous shift is zero. Please enter the initial reading.');
          }
        } else {
          setInitialSteamReading(null);
          toast.info('No previous steam generation record found. Please enter the initial reading.');
        }
      } catch (error: any) {
        console.error('Error fetching previous steam generation record:', error);
        setInitialSteamReading(null);
        toast.info('No previous steam generation record found. Please enter the initial reading.');
      }
    };

    fetchPreviousShiftAndSteamRecord();
  }, [activeShift]);

  return { previousShift, initialSteamReading, loading };
};

export default usePreviousShift;
