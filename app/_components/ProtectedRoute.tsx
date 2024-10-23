// app/_components/ProtectedRoute.tsx
'use client';

import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../_contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('Admin' | 'Staff')[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (roles && !roles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, roles, router]);

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (roles && !roles.includes(user.role)) {
    return <div className="flex items-center justify-center h-screen">Unauthorized</div>;
  }
  console.log('ProtectedRoute user:', user);
  console.log('ProtectedRoute roles:', roles);
  console.log('ProtectedRoute children:', children);
  return <>{children}</>;
};

export default ProtectedRoute;
