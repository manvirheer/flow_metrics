// DateSelector.tsx

import React, { useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  loading: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateChange,
  loading,
}) => {

  const handleDateChange = (date: string) => {
    onDateChange(date);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <label htmlFor="date-picker" className="text-gray-700 font-medium whitespace-nowrap">
        Select Date / दिनांक चुनें:
      </label>
      <div className="flex gap-4 w-full sm:w-auto">
        <input
          type="date"
          id="date-picker"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          disabled={loading}
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 
            focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-grow sm:flex-grow-0"
          max={new Date().toISOString().split('T')[0]} // Prevent future dates
        />
      </div>
    </div>
  );
};

export default React.memo(DateSelector);