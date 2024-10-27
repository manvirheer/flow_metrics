// app/staff/shift-end-entry/components/ShiftEndEntryForm.tsx

'use client';

import React from 'react';
import { ShiftSchedule } from '../types';
import { ShiftEndEntryData } from '@/app/_types/ShiftEndEntry';

interface ShiftEndEntryFormProps {
  activeShift: ShiftSchedule;
  initialSteamReading: number | null;
  onFormChange: (data: ShiftEndEntryData) => void;
  onSubmit: () => void;
}

const ShiftEndEntryForm: React.FC<ShiftEndEntryFormProps> = ({
  activeShift,
  initialSteamReading,
  onFormChange,
  onSubmit,
}) => {
  // Local state for form inputs
  const [briquetteConsumption, setBriquetteConsumption] = React.useState<number>(0);
  const [ashGenerated, setAshGenerated] = React.useState<number>(0);
  const [steamGenerationFinalReading, setSteamGenerationFinalReading] = React.useState<number>(0);
  const [steamGenerationInitialReading, setSteamGenerationInitialReading] = React.useState<number | null>(
    initialSteamReading
  );

  // Handlers to update local state and notify parent of changes
  const handleBriquetteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setBriquetteConsumption(value);
    onFormChange({
      briquetteConsumption: value,
      ashGenerated,
      steamGenerationFinalReading,
      steamGenerationInitialReading: steamGenerationInitialReading || undefined,
    });
  };

  const handleAshChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAshGenerated(value);
    onFormChange({
      briquetteConsumption,
      ashGenerated: value,
      steamGenerationFinalReading,
      steamGenerationInitialReading: steamGenerationInitialReading || undefined,
    });
  };

  const handleFinalReadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setSteamGenerationFinalReading(value);
    onFormChange({
      briquetteConsumption,
      ashGenerated,
      steamGenerationFinalReading: value,
      steamGenerationInitialReading: steamGenerationInitialReading || undefined,
    });
  };

  const handleInitialReadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setSteamGenerationInitialReading(value);
    onFormChange({
      briquetteConsumption,
      ashGenerated,
      steamGenerationFinalReading,
      steamGenerationInitialReading: value,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Enter Shift End Details / शिफ्ट समाप्ति विवरण दर्ज करें
      </h2>
      <form className='text-slate-900'>
        {/* Briquette Consumption */}
        <div className="mb-4">
          <label htmlFor="briquetteConsumption" className="block text-gray-700 mb-2">
            Briquette Consumption (In Kgs) / ब्रीकेट उपभोग (किलोग्राम में)
          </label>
          <input
            type="number"
            id="briquetteConsumption"
            name="briquetteConsumption"
            value={briquetteConsumption}
            onChange={handleBriquetteChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-600"
            required
            min="0"
            placeholder="e.g., 50"
          />
        </div>

        {/* Ash Generated */}
        <div className="mb-4">
          <label htmlFor="ashGenerated" className="block text-gray-700 mb-2">
            Ash Generated (In Kgs) / राख उत्पन्न (किलोग्राम में)
          </label>
          <input
            type="number"
            id="ashGenerated"
            name="ashGenerated"
            value={ashGenerated}
            onChange={handleAshChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-600"
            required
            min="0"
            placeholder="e.g., 10"
          />
        </div>

        {/* Steam Generation Final Reading */}
        <div className="mb-4">
          <label htmlFor="steamGenerationFinalReading" className="block text-gray-700 mb-2">
            Steam Generation Final Reading (In Kgs) / भाप उत्पादन अंतिम रीडिंग (किलोग्राम में)
          </label>
          <input
            type="number"
            id="steamGenerationFinalReading"
            name="steamGenerationFinalReading"
            value={steamGenerationFinalReading}
            onChange={handleFinalReadingChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-600"
            required
            min="0"
            placeholder="e.g., 1500"
          />
        </div>

        {/* Conditional Initial Reading */}
        {console.log(initialSteamReading)}
        {initialSteamReading !== null && initialSteamReading !== undefined ? (
          <div className="mb-4">
            <label htmlFor="steamGenerationInitialReading" className="block text-gray-700 mb-2">
              Steam Generation Initial Reading (In Kgs) / भाप उत्पादन प्रारंभिक रीडिंग (किलोग्राम में)
            </label>
            <input
              type="number"
              id="steamGenerationInitialReading"
              name="steamGenerationInitialReading"
              value={initialSteamReading !== null ? initialSteamReading.toString() : ''}
              disabled
              className="w-full p-2 border text-slate-900 border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
        ) : (
          <div className="mb-4">
            <label htmlFor="steamGenerationInitialReading" className="block text-gray-700 mb-2">
              Steam Generation Initial Reading (In Kgs) / भाप उत्पादन प्रारंभिक रीडिंग (किलोग्राम में)
            </label>
            <input
              type="number"
              id="steamGenerationInitialReading"
              name="steamGenerationInitialReading"
              value={steamGenerationInitialReading !== null ? steamGenerationInitialReading : ''}
              onChange={handleInitialReadingChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-600 focus:border-blue-600"
              required
              min="0"
              placeholder="e.g., 1000"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onSubmit}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Submit / सबमिट करें
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShiftEndEntryForm;
