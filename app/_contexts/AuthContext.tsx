'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../_utils/axios';
import { useRouter } from 'next/navigation';

// Define the User interface
interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Staff';
  name: string;
  mobile: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  createdAt: string;
  updatedAt: string;
  // Add other user properties as needed
}

// Define the AuthContextType interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Error state
  const router = useRouter();
  const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'access_token';

  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (token) {
      setAuthToken(token);
      api
        .get('auth/profile')
        .then((response) => {
          setUser(response.data);
          setError(null);
        })
        .catch((error) => {
          console.error('Token invalid or expired', error);
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          setError('Session expired. Please log in again.');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [TOKEN_KEY]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous error

      const response = await api.post('auth/login', { email, password });
      const { access_token } = response.data;

      if (!access_token) throw new Error('Authentication token not provided');

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, access_token);
      }
      setAuthToken(access_token);

      const userResponse = await api.get('auth/profile');
      const fetchedUser: User = userResponse.data;
      if (!fetchedUser) throw new Error('User data not found');

      setUser(fetchedUser);
      console.log('Login successful', fetchedUser);

      router.push('/dashboard/plant');
    } catch (error: any) {
      console.error('Login failed', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
