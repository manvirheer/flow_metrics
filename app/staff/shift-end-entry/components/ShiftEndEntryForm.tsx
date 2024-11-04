// app/staff/shift-end-entry/components/ShiftEndEntryForm.tsx

'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { ShiftEndEntryData } from '../../../_types/ShiftEndEntry';
import useShiftEndEntries from '../hooks/useShiftEndEntries';
import { toast } from 'react-toastify';

interface ShiftEndEntryFormProps {
  activeShift: any; // Replace with actual type if available
  initialSteamReading: number | null;
  onSubmit: () => void;
  onFormChange: (data: ShiftEndEntryData) => void; // Ensure this prop is used
}

const ShiftEndEntryForm: React.FC<ShiftEndEntryFormProps> = ({
  activeShift,
  initialSteamReading,
  onSubmit,
  onFormChange, // Destructure onFormChange
}) => {
  const { shiftEndEntries, loading } = useShiftEndEntries();

  // State for the new entry (last row)
  const [newEntry, setNewEntry] = useState<Partial<ShiftEndEntryData>>({
    briquetteConsumption: 0,
    ashGenerated: 0,
    steamGenerationFinalReading: 0,
    steamGenerationInitialReading: initialSteamReading || 0,
    remarks: '',
  });

  // Update newEntry when initialSteamReading changes
  useEffect(() => {
    if (initialSteamReading !== undefined) {
    setNewEntry((prev) => ({
      ...prev,
      steamGenerationInitialReading: initialSteamReading || 0,
    }));
    }
  }, [initialSteamReading]);

  // Define table columns
  const columns = useMemo<ColumnDef<ShiftEndEntryData, any>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => format(new Date(getValue<string>()), 'yyyy-MM-dd'),
      },
      {
        accessorKey: 'shiftTitle',
        header: 'Shift',
      },
      {
        accessorKey: 'briquetteConsumption',
        header: 'Briquette Consumption (Kgs)',
      },
      {
        accessorKey: 'ashGenerated',
        header: 'Ash Generated (Kgs)',
      },
      {
        accessorKey: 'steamGenerationInitialReading',
        header: 'Steam Generation Initial Reading (Kgs)',
      },
      {
        accessorKey: 'steamGenerationFinalReading',
        header: 'Steam Generation Final Reading (Kgs)',
      },
      {
        accessorKey: 'remarks',
        header: 'Remarks',
      },
    ],
    []
  );

  // Combine existing entries with the new empty row
  const data = useMemo(() => {
    // Clone the existing entries
    const existingEntries = shiftEndEntries.map((entry) => ({ ...entry }));

    // Add an empty object for the new entry
    const newRow: ShiftEndEntryData = {
      shiftScheduleId: activeShift.id,
      briquetteConsumption: newEntry.briquetteConsumption || 0,
      ashGenerated: newEntry.ashGenerated || 0,
      steamGenerationInitialReading: newEntry.steamGenerationInitialReading || 0,
      steamGenerationFinalReading: newEntry.steamGenerationFinalReading || 0,
      remarks: newEntry.remarks || '',
      plantId: activeShift.plant, // Ensure activeShift has 'plant' property
      date: activeShift.date, // Ensure activeShift has 'date' property
      shiftTitle: activeShift.shiftTitle, // Ensure activeShift has 'shiftTitle' property
    };

    return [...existingEntries, newRow];
  }, [shiftEndEntries, newEntry, activeShift]);

  // Initialize the table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ShiftEndEntryData
  ) => {
    let value: string | number;

    if (e.target.type === 'number') {
      value = e.target.value ? parseFloat(e.target.value) : 0;
    } else {
      value = e.target.value;
    }

    setNewEntry((prev) => {
      const updatedEntry = {
        ...prev,
        [field]: value,
      };

      // Pass the updated data to the parent component
      onFormChange({
        briquetteConsumption: updatedEntry.briquetteConsumption || 0,
        ashGenerated: updatedEntry.ashGenerated || 0,
        steamGenerationInitialReading: updatedEntry.steamGenerationInitialReading || 0,
        steamGenerationFinalReading: updatedEntry.steamGenerationFinalReading || 0,
        remarks: updatedEntry.remarks || '',
      });

      return updatedEntry;
    });
  };

  // Handler for submitting the new entry
  const handleSubmit = async () => {
    try {
      // Validate required fields
      const {
        briquetteConsumption,
        ashGenerated,
        steamGenerationFinalReading,
        steamGenerationInitialReading,
        remarks,
      } = newEntry;

      if (
        briquetteConsumption === undefined ||
        ashGenerated === undefined ||
        steamGenerationFinalReading === undefined ||
        steamGenerationInitialReading === undefined
      ) {
        toast.error('Please fill in all required fields.');
        return;
      }

      // Additional validation can be added here if necessary

      // Pass the latest data to the parent before submitting
      onFormChange({
        briquetteConsumption: briquetteConsumption || 0,
        ashGenerated: ashGenerated || 0,
        steamGenerationInitialReading: steamGenerationInitialReading || 0,
        steamGenerationFinalReading: steamGenerationFinalReading || 0,
        remarks: remarks || '',
      });

      onSubmit(); // Trigger the parent to open the confirmation modal
    } catch (error: any) {
      console.error('Error submitting shift end entry:', error);
      toast.error('Failed to submit shift end entry.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-xl text-gray-700">Loading Shift End Records...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Shift End Logbook
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-slate-900">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => {
              const isNewRow = index === table.getRowModel().rows.length - 1;

              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = cell.getValue();
                    const accessorKey = cell.column.id as keyof ShiftEndEntryData;
                    if (isNewRow) {
                      // Render input fields for the new row
                      if (accessorKey === 'date') {
                        return (
                          <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                            {format(new Date(activeShift.date), 'yyyy-MM-dd')}
                          </td>
                        );
                      }

                      if (accessorKey === 'shiftTitle') {
                        return (
                          <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                            {activeShift.shiftTitle}
                          </td>
                        );
                      }

                      if (
                        accessorKey === 'briquetteConsumption' ||
                        accessorKey === 'ashGenerated' ||
                        accessorKey === 'steamGenerationFinalReading'
                      ) {
                        return (
                          <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                            <input
                              type="number"
                              value={
                                newEntry[accessorKey] !== undefined
                                  ? newEntry[accessorKey]
                                  : ''
                              }
                              onChange={(e) => handleInputChange(e, accessorKey)}
                              className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0"
                              required
                            />
                          </td>
                        );
                      }

                      if (accessorKey === 'steamGenerationInitialReading') {
                        return (
                          <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                            <input
                              type="number"
                              value={
                                newEntry[accessorKey] !== undefined
                                  ? newEntry[accessorKey]
                                  : ''
                              }
                              onChange={(e) => handleInputChange(e, accessorKey)}
                              className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              min="0"
                              disabled={false} // Ensure input is enabled
                              required
                            />
                          </td>
                        );
                      }

                      if (accessorKey === 'remarks') {
                        return (
                          <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                            <input
                              type="text"
                              value={newEntry[accessorKey] || ''}
                              onChange={(e) => handleInputChange(e, accessorKey)}
                              className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter remarks"
                            />
                          </td>
                        );
                      }

                      return (
                        <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                          {cellValue as React.ReactNode}
                        </td>
                      );
                    } else {
                      // Render read-only cells for existing rows
                      return (
                        <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                          {cellValue as React.ReactNode}
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ShiftEndEntryForm;
