import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner p-4 text-center">
      &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
    </footer>
  );
};

export default Footer;
