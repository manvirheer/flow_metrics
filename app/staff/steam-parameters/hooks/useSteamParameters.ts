// app/staff/steam-parameters/hooks/useSteamParameters.ts

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import api from '../../../_utils/axios';
import { SteamParametersBasic, SteamParametersUpdate, BulkUpdateSteamParameters } from '../../../_types/SteamParameters';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface ApiError {
  message: string;
  code: string;
  status: number;
}

const useSteamParameters = () => {
  const [steamParameters, setSteamParameters] = useState<SteamParametersBasic[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000;

  const handleError = (error: unknown): ApiError => {
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data?.message || 'An error occurred',
        code: error.code || 'UNKNOWN_ERROR',
        status: error.response?.status || 500,
      };
    }
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      status: 500,
    };
  };

  const retryOperation = useCallback(
    async (operation: () => Promise<any>, currentRetry: number = 0): Promise<any> => {
      try {
        return await operation();
      } catch (error) {
        if (currentRetry < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (currentRetry + 1)));
          return retryOperation(operation, currentRetry + 1);
        }
        throw error;
      }
    },
    []
  );

  const fetchSteamParametersByDate = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);

    try {
      const operation = async () => {
        const response = await api.get<SteamParametersBasic[]>(`/steam-parameters/date/${date}`);
        return response.data;
      };
      const data = await retryOperation(operation);
      setSteamParameters(data);
      setLastUpdated(new Date().toISOString());
      toast.success('Steam parameters fetched successfully.');
    } catch (error) {
      const apiError = handleError(error);
      
      if (apiError.status === 404) {
        toast.info('No steam parameters found for the selected date.');
        setSteamParameters([]);
      } else {
        console.error('Error fetching steam parameters:', error);
        toast.error(apiError.message);
        setError(apiError);
      }
    } finally {
      setLoading(false);
    }
  }, [retryOperation]);

  const submitBulkUpdate = useCallback(async (updates: SteamParametersUpdate[]) => {
    if (updates.length === 0) {
      toast.info('No changes to update.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const operation = async () => {
        const payload: BulkUpdateSteamParameters = { updates };
        const response = await api.patch('/steam-parameters/bulk-update', payload);
        return response.data;
      };

      const result = await retryOperation(operation);
      toast.success(result.message || 'Bulk update successful.');
      
      // Optionally, update the local state with the updated data
      if (result.data) {
        setSteamParameters(result.data);
      }

      setLastUpdated(new Date().toISOString());
    } catch (error) {
      const apiError = handleError(error);
      console.error('Error submitting bulk update:', error);
      toast.error(apiError.message);
      setError(apiError);
      throw error; // Rethrow if you need to handle it further up
    } finally {
      setLoading(false);
    }
  }, [retryOperation]);

  const resetState = useCallback(() => {
    setSteamParameters([]);
    setLoading(false);
    setError(null);
    setLastUpdated(null);
    setRetryCount(0);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    steamParameters,
    loading,
    error,
    lastUpdated,
    retryCount,
    fetchSteamParametersByDate,
    submitBulkUpdate,
    resetState,
    clearError,
  };
};

export default useSteamParameters;
