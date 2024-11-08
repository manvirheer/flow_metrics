// app/staff/activity/components/ActivityTable.tsx

'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
import { Plant, ShiftSchedule, Activity } from '../types';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface ActivityTableProps {
  activities: Activity[];
  activeShift: ShiftSchedule;
  onAdd: (data: Partial<Activity>) => void;
  plant: Plant;
}

const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  onAdd,
  activeShift,
  plant,
}) => {
  if (!plant || !activeShift) {
    return <div>Loading...</div>;
  }

  // State for the new activity (last row)
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    activityDetails: '',
    plantId: plant.plantId,
    shiftScheduleId: activeShift.id,
  });

  // Update newActivity when plant or activeShift changes
  useEffect(() => {
    setNewActivity((prev) => ({
      ...prev,
      shiftScheduleId: activeShift.id,
      plantId: plant.plantId,
    }));
  }, [plant, activeShift]);

  // Define table columns
  const columns = useMemo<ColumnDef<Activity, any>[]>(
    () => [
      {
        accessorKey: 'shiftSchedule.shiftTitle',
        header: 'Shift Title / शिफ्ट शीर्षक',
        cell: ({ getValue }) => getValue<string>(),
      },
      {
        header: 'Date / तारीख',
        accessorKey: 'createdAt',
        cell: ({ getValue }) =>
          format(new Date(getValue<string>()), 'MM/dd/yyyy'),
      },
      {
        header: 'Time / समय',
        accessorKey: 'createdAt',
        cell: ({ getValue }) =>
          format(new Date(getValue<string>()), 'hh:mm a'),
      },
      {
        accessorKey: 'activityDetails',
        header: 'Details / विवरण',
        cell: ({ getValue }) => getValue<string>(),
      },
    ],
    []
  );

  const data = useMemo(() => activities, [activities]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: false, // ascending order to have oldest entries first
    },
  ]);

  const pageSize = 9; // Adjusted page size to account for the empty form row

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  useEffect(() => {
    // const totalPages = Math.ceil(data.length / pageSize);
    // setPagination((prev) => ({
    //   ...prev,
    //   pageIndex: totalPages - 1 >= 0 ? totalPages - 1 : 0,
    // }));
    table.lastPage()
  }, [data.length, pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: [
        {
          id: 'createdAt',
          desc: false, // ascending order
        },
      ],
    },
  });

  // Handler for input changes in the new activity form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Activity
  ) => {
    const value = e.target.value;
    setNewActivity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler for submitting the new activity
  const handleSubmit = () => {
    const { activityDetails } = newActivity;

    // Validation: ensure details are present
    if (!activityDetails) {
      toast.error('Please enter the activity details.');
      return;
    }

    // Prepare data to send to backend
    const activityData: Partial<Activity> = {
      activityDetails,
      plantId: newActivity.plantId,
      shiftScheduleId: newActivity.shiftScheduleId,
    };

    onAdd(activityData);

    // Reset form with plantId and shiftScheduleId retained
    setNewActivity({
      activityDetails: '',
      plantId: plant.plantId,
      shiftScheduleId: activeShift.id,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-slate-900">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Activities / गतिविधियाँ
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-slate-900">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-2 border-b border-gray-300"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* Render the empty form row only on the last page */}
            {(table.getPageCount() === 0 ||
              table.getState().pagination.pageIndex ===
                table.getPageCount() - 1) && (
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border-b border-gray-300">
                    {/* Shift Title is prepopulated and non-editable */}
                    <span>{activeShift.shiftTitle}</span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {/* Date is prepopulated and non-editable */}
                    <span>
                      {format(new Date(activeShift.date), 'MM/dd/yyyy')}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {/* Time is prepopulated and non-editable in 12-hour format */}
                    <span>{format(new Date(), 'hh:mm a')}</span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    {/* Details input */}
                    <input
                      type="text"
                      value={newActivity.activityDetails || ''}
                      onChange={(e) => handleInputChange(e, 'activityDetails')}
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Details / विवरण"
                      required
                    />
                  </td>
                </tr>
              )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="px-2 py-1 border rounded ml-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <span className="ml-2">
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
            <button
              className="px-2 py-1 border rounded ml-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="px-2 py-1 border rounded ml-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
          </div>
          <div>
            <span>
              Go to page:{' '}
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="ml-2 border p-1 rounded"
            >
              {[5, 9, 10, 20].map((pageSizeOption) => (
                <option key={pageSizeOption} value={pageSizeOption}>
                  Show {pageSizeOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        {(table.getPageCount() === 0 ||
              table.getState().pagination.pageIndex ===
                table.getPageCount() - 1) && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
              >
                Submit / जोड़ें
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default ActivityTable;
