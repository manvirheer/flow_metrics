import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">Plant Dashboard</h1>
      <button className="text-red-500 hover:text-red-700">Logout</button>
    </header>
  );
};

export default Header;
