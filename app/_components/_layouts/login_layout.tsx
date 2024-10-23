import React from 'react';
import Footer from '../_elements/footer';

export const metadata = {
  title: 'Login - Plant Dashboard',
  description: 'Login jlkjto access the plant dashboard',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
   
        <main className="flex-1 bg-slate-800">{children}</main>
  );
}
