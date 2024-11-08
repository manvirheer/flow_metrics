'use client';

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
import { SteamParametersBasic, SteamParametersUpdate } from '../../../_types/SteamParameters';
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce';

interface SteamParametersTableProps {
  steamParameters: SteamParametersBasic[];
  onBulkUpdate: (updates: SteamParametersUpdate[]) => Promise<void>;
  loading: boolean;
}

const TOTAL_COLUMNS = 16; // Total number of columns in the table
const FIRST_COLUMN_KEY = 'timeStart'; // The accessorKey of the first column to exclude
const TAB_COLUMNS = TOTAL_COLUMNS - 1; // Number of tabbable columns

const SteamParametersTable: React.FC<SteamParametersTableProps> = ({
  steamParameters,
  onBulkUpdate,
  loading,
}) => {
  // State Variables
  const [data, setData] = useState<SteamParametersBasic[]>([]);
  const [modifiedRows, setModifiedRows] = useState<{ [id: string]: SteamParametersUpdate }>({});
  const [cellErrors, setCellErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Ref to track if Tab was pressed
  const isTabPressed = useRef<boolean>(false);

  // Ref to store input elements based on tabIndex
  const inputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});

  // Column Order Mapping
  const columnOrder = [
    'timeStart', // First column to exclude from tab
    'steamPressure',
    'steamFlow',
    'steamTemperature',
    'elMeter',
    'stackTemperature',
    'feedWaterTemperature',
    'feedWaterMeterReading',
    'fuelPumpPr',
    'fuelPumpRtPr',
    'filterNumber',
    'feedWaterPr',
    'feedWaterPh',
    'feedWaterTds',
    'blowDownPh',
    'blowDownTds',
  ];

  const columnIndexMap: { [key: string]: number } = {};
  columnOrder.forEach((col, index) => {
    columnIndexMap[col] = index;
  });

  // Initialize data when steamParameters prop changes
  useEffect(() => {
    setData(steamParameters);
    setModifiedRows({});
    setCellErrors({});
  }, [steamParameters]);

  // Input validation
  const validateInput = useCallback((field: string, value: any): string | null => {
    if (value === '' || value === null || value === undefined) {
      return 'Field cannot be empty';
    }

    switch (field) {
      case 'timeStart':
      case 'timeEnd':
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
          return 'Invalid time format';
        }
        break;
      case 'steamPressure':
      case 'steamFlow':
      case 'steamTemperature':
        if (isNaN(value) || value < 0) {
          return 'Must be a positive number';
        }
        break;
      default:
        if (typeof value === 'number' && (isNaN(value) || value < 0)) {
          return 'Must be a positive number';
        }
    }
    return null;
  }, []);

  // Helper function to create column definitions with tabindex
  const createColumn = useCallback(
    (
      accessorKey: keyof SteamParametersBasic,
      header: string,
      type: 'text' | 'number' | 'time' = 'text',
      editable: boolean = true
    ): ColumnDef<SteamParametersBasic, any> => ({
      accessorKey,
      header,
      cell: ({ getValue, row, column }) => {
        const cellKey = `${row.original.id}-${column.id}`;
        const hasError = cellErrors[cellKey];
        
        // Determine if the current column is the first column
        const isFirstColumn = accessorKey === FIRST_COLUMN_KEY;

        // Calculate tabindex only for non-first columns
        let tabindex: number | undefined = undefined;
        if (!isFirstColumn) {
          const rowIndex = row.index; // Zero-based row index
          const colIndex = columnIndexMap[accessorKey as string]; // Zero-based column index
          // Adjust colIndex by subtracting 1 to account for excluded first column
          const adjustedColIndex = colIndex - 1;
          tabindex = rowIndex * TAB_COLUMNS + adjustedColIndex + 1; // Sequential tabindex starting from 1
        }

        const handleBlur = () => {
          // Defer state updates to allow browser to handle focus transition
          setTimeout(() => {
            const input = inputRefs.current[tabindex || 0];
            if (input) {
              const value =
                type === 'number'
                  ? input.value === ''
                    ? ''
                    : parseFloat(input.value)
                  : input.value;

              const error = validateInput(column.id as keyof SteamParametersUpdate, value);
              if (error) {
                setCellErrors((prev) => ({ ...prev, [cellKey]: error }));
              } else {
                setCellErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors[cellKey];
                  return newErrors;
                });

                // Update modifiedRows
                setModifiedRows((prev) => {
                  const existing = prev[row.original.id] || { id: row.original.id };
                  const updated = { ...existing, [column.id as keyof SteamParametersUpdate]: value };
                  return { ...prev, [row.original.id]: updated };
                });

                // Update data
                setData((prevData) =>
                  prevData.map((r) => (r.id === row.original.id ? { ...r, [column.id]: value } : r))
                );
              }

              // If Tab was pressed, move focus to the next input
              if (isTabPressed.current && tabindex) {
                const nextTabIndex = tabindex + 1;
                const nextInput = inputRefs.current[nextTabIndex];
                if (nextInput) {
                  nextInput.focus();
                }
                isTabPressed.current = false; // Reset the flag
              }
            }
          }, 0);
        };

        const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
          if (event.key === 'Tab') {
            isTabPressed.current = true;
          }
        };

        return (
          <div className="relative">
            {isFirstColumn ? (
              // For the first column, make the input non-tabbable
              <input
                type={type}
                defaultValue={getValue() as string | number}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                ref={(el) => {
                  // Optionally store ref if needed
                }}
                className={`w-full p-1 border rounded-md ${
                  hasError ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  editable ? '' : 'bg-gray-100 cursor-not-allowed'
                }`}
                aria-label={header}
                aria-invalid={hasError ? 'true' : 'false'}
                readOnly={!editable}
                tabIndex={-1} // Exclude from tab navigation
              />
            ) : (
              // For other columns, assign calculated tabindex and store ref
              <input
                type={type}
                defaultValue={getValue() as string | number}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                ref={(el) => {
                  if (tabindex) {
                    inputRefs.current[tabindex] = el;
                  }
                }}
                className={`w-full p-1 border rounded-md ${
                  hasError ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  editable ? '' : 'bg-gray-100 cursor-not-allowed'
                }`}
                aria-label={header}
                aria-invalid={hasError ? 'true' : 'false'}
                readOnly={!editable}
                tabIndex={tabindex} // Assign tabindex only for non-first columns
              />
            )}
            {hasError && (
              <div className="absolute bottom-full left-0 z-10 bg-red-100 text-red-600 text-xs p-1 rounded mb-1">
                {cellErrors[cellKey]}
              </div>
            )}
          </div>
        );
      },
    }),
    [cellErrors, validateInput, columnIndexMap, TAB_COLUMNS]
  );

  // Define all columns using the helper function
  const columns = useMemo<ColumnDef<SteamParametersBasic, any>[]>(() => [
    createColumn('timeStart', 'Time Start', 'time', false), // First column to exclude from tab
    createColumn('steamPressure', 'Steam Pressure', 'number'),
    createColumn('steamFlow', 'Steam Flow', 'number'),
    createColumn('steamTemperature', 'Steam Temperature', 'number'),
    createColumn('elMeter', 'E/L Meter', 'number'),
    createColumn('stackTemperature', 'Stack Temperature', 'number'),
    createColumn('feedWaterTemperature', 'Feed Water Temperature', 'number'),
    createColumn('feedWaterMeterReading', 'Feed Water Meter Reading', 'number'),
    createColumn('fuelPumpPr', 'Fuel Pump PR', 'number'),
    createColumn('fuelPumpRtPr', 'Fuel Pump RT PR', 'number'),
    createColumn('filterNumber', 'Filter Number', 'number'),
    createColumn('feedWaterPr', 'Feed Water PR', 'number'),
    createColumn('feedWaterPh', 'Feed Water pH', 'number'),
    createColumn('feedWaterTds', 'Feed Water TDS', 'number'),
    createColumn('blowDownPh', 'Blow Down pH', 'number'),
    createColumn('blowDownTds', 'Blow Down TDS', 'number'),
  ], [createColumn]);

  // Initialize table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: false,
  });

  // Prepare updates for bulk submission
  const prepareUpdates = useCallback((): SteamParametersUpdate[] => {
    return Object.values(modifiedRows);
  }, [modifiedRows]);

  // Handle bulk submission
  const handleSubmit = useCallback(async () => {
    if (Object.keys(cellErrors).length > 0) {
      toast.error('Please fix all errors before submitting.');
      return;
    }

    const updates = prepareUpdates();
    if (updates.length === 0) {
      toast.info('No changes to submit.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onBulkUpdate(updates);
      // Reset modified rows and cell errors upon successful submission
      setModifiedRows({});
      setCellErrors({});
      toast.success('Updates submitted successfully.');
    } catch (error) {
      console.error('Error submitting updates:', error);
      toast.error('Failed to submit updates.');
    } finally {
      setIsSubmitting(false);
    }
  }, [cellErrors, prepareUpdates, onBulkUpdate]);

  return (
    <div
      className={`bg-white shadow-md rounded-lg p-6 ${
        Object.keys(modifiedRows).length > 0 ? 'border-2 border-blue-400' : ''
      }`}
      role="region"
      aria-label="Steam Parameters Table"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="inline-block w-4">
                          {header.column.getIsSorted() === 'desc' ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 border-b border-gray-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  No Steam Parameters found for the selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            ←
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            →
          </button>
          <span className="text-sm">
            Page <strong>{pagination.pageIndex + 1}</strong> of{' '}
            <strong>{table.getPageCount()}</strong>
          </span>
        </div>
        <select
          value={pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="border p-1 rounded"
          aria-label="Rows per page"
        >
          {[5, 10, 20, 24].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            Object.keys(modifiedRows).length === 0 ||
            isSubmitting ||
            Object.keys(cellErrors).length > 0
          }
          className={`px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors
            ${
              loading ||
              Object.keys(modifiedRows).length === 0 ||
              isSubmitting ||
              Object.keys(cellErrors).length > 0
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Bulk Update'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(SteamParametersTable);
