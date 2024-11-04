'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { Activity } from '../../_types/Activity';
import { format } from 'date-fns';

interface ActivityTableProps {
  activities: Activity[];
  loading: boolean;
}

export default function ActivityTable({ activities, loading }: ActivityTableProps) {
  // Local state to manage activities
  const [data, setData] = useState<Activity[]>(activities);

  // Update local data when activities prop changes
  useEffect(() => {
    setData(activities);
  }, [activities]);

  // State for global filter and sorting
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ]);

  // Define the columns for the table
  const columns = useMemo<ColumnDef<Activity>[]>(
    () => [
      {
        id: 'rowIndex',
        header: 'No.',
        cell: (info) => info.row.index + 1,
      },
      {
        accessorFn: (row) => row.shiftSchedule?.date ?? '',
        id: 'date',
        header: 'Date',
        cell: (info) => format(new Date(info.getValue<string>()), 'yyyy-MM-dd'),
      },
      {
        accessorFn: (row) => row.shiftSchedule?.shiftTitle ?? '',
        id: 'shiftTitle',
        header: 'Shift Title',
      },
      {
        accessorFn: (row) => row.createdBy?.name ?? '',
        id: 'createdBy',
        header: 'Created By',
      },
      {
        accessorKey: 'activityDetails',
        header: 'Activity Details',
      },
    ],
    []
  );

  // Create the table instance using @tanstack/react-table
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="block w-full p-2 border border-gray-300 rounded-md 
                                     shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-600 
                                     focus:border-blue-500 sm:text-md text-slate-900"
        />
      </div>

      {/* Activity Table */}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortingProps = canSort
                    ? { onClick: header.column.getToggleSortingHandler() }
                    : {};
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      {...sortingProps}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider ${
                        canSort ? 'cursor-pointer select-none' : ''
                      }`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* Add sorting indicator */}
                      {isSorted ? (
                        isSorted === 'desc' ? (
                          ' 🔽'
                        ) : (
                          ' 🔼'
                        )
                      ) : (
                        ''
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-100">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {/* Handle empty and loading states */}
            {table.getRowModel().rows.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center"
                >
                  No activity records found.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center"
                >
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
