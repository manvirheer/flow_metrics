// app/unauthorized/page.tsx
// 'use client';
'use client';

import React from 'react';
import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-container">
      <h1>403 - Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <Link href="/">Go to Home</Link>
      <style jsx>{`
        .unauthorized-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        p {
          margin-bottom: 2rem;
        }
        a {
          color: #0070f3;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default UnauthorizedPage;
