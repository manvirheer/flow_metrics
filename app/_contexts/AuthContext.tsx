// app/_contexts/AuthContext.tsx
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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

// Define the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_KEY || 'access_token';

  // Configure Axios to include the Authorization header if the token exists
  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    // Check for existing token in localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (token) {
      setAuthToken(token);
      // Fetch user data using the token
      api
        .get('/profile')
        .then((response) => {
          setUser(response.data);
          console.log('User data fetched successfully', response.data);
        })
        .catch((error) => {
          console.error('Token invalid or expired', error);
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [TOKEN_KEY]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Send POST request to the login endpoint
      const response = await api.post('/login', {
        email,
        password,
      });

      // Destructure the access_token from the response
      const { access_token } = response.data;

      if (!access_token) {
        throw new Error('Authentication token not provided');
      }

      // Store the token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, access_token);
      }

      // Set the Authorization header for subsequent requests
      setAuthToken(access_token);

      // Fetch user data from the profile endpoint
      const userResponse = await api.get('/profile');
      const fetchedUser: User = userResponse.data;

      if (!fetchedUser) {
        throw new Error('User data not found');
      }

      // Update the user state
      setUser(fetchedUser);
      console.log('Login successful', fetchedUser);

      // Redirect to the dashboard
      router.push('/dashboard/plant');
    } catch (error: any) {
      console.error('Login failed', error);

      // Handle specific error messages
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Login failed: ${error.response.data.message}`);
      } else {
        alert('Login failed: An unexpected error occurred. Please try again.');
      }

      // Remove any invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem(TOKEN_KEY);

    // Remove the Authorization header
    setAuthToken(null);

    // Clear the user state
    setUser(null);

    // Redirect to the login page
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
