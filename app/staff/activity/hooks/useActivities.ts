// app/staff/activity/hooks/useActivities.ts

'use client';

import { useState, useEffect } from 'react';
import api from '../../../_utils/axios';
import { Activity } from '../types';
import { toast } from 'react-toastify';

const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get<Activity[]>('/record/activity');
        console.log('Activities:', response.data);
        setActivities(response.data);
      } catch (error: any) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to fetch activities.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const addActivity = async (data: Partial<Activity>) => {
    try {
      const response = await api.post<Activity>('/record/activity', data);
      setActivities((prev) => [...prev, response.data]);
      toast.success('Activity added successfully.');
    } catch (error: any) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity.');
    }
  };

  const updateActivity = async (id: string, data: Partial<Activity>) => {
    try {
      const response = await api.patch<Activity>(`/record/activity/${id}`, data);
      setActivities((prev) =>
        prev.map((activity) => (activity.activityId === id ? response.data : activity))
      );
      toast.success('Activity updated successfully.');
    } catch (error: any) {
      console.error('Error updating activity:', error);
      toast.error('Failed to update activity.');
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      await api.delete(`/record/activity/${id}`);
      setActivities((prev) => prev.filter((activity) => activity.activityId !== id));
      toast.success('Activity deleted successfully.');
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity.');
    }
  };

  return { activities, loading, addActivity, updateActivity, deleteActivity };
};

export default useActivities;
