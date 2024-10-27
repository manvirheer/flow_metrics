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
import { ShiftPosting } from '../../_types/ShiftPosting';
import { format } from 'date-fns';
import { TrashIcon } from '@heroicons/react/24/outline';
import api from '../../_utils/axios';
import { toast } from 'react-toastify';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ShiftPostingTableProps {
  shiftPostings: ShiftPosting[];
  loading: boolean;
  onShiftPostingsUpdated?: () => void; // Optional callback after deletion
}

export default function ShiftPostingTable({
  shiftPostings,
  loading,
  onShiftPostingsUpdated,
}: ShiftPostingTableProps) {
  // Local state to manage shift postings for deletion
  const [data, setData] = useState<ShiftPosting[]>(shiftPostings);

  // Update local data when shiftPostings prop changes
  useEffect(() => {
    setData(shiftPostings);
  }, [shiftPostings]);

  // State for global filter and sorting
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ]);

  // State for modal control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShiftPosting, setSelectedShiftPosting] = useState<ShiftPosting | null>(null);

  // Define the columns for the table
  const columns = useMemo<ColumnDef<ShiftPosting>[]>(
    () => [
      {
        id: 'rowIndex',
        header: 'No.',
        cell: (info) => info.row.index + 1,
      },
      {
        accessorFn: (row) => row.shiftSchedule.date,
        id: 'date',
        header: 'Date',
        cell: (info) => format(new Date(info.getValue<string>()), 'yyyy-MM-dd'),
      },
      {
        accessorFn: (row) => row.shiftSchedule.shiftTitle,
        id: 'shift',
        header: 'Shift',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.shiftSchedule.startTime,
        id: 'startTime',
        header: 'Start Time',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.shiftSchedule.endTime,
        id: 'endTime',
        header: 'End Time',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.staff.name,
        id: 'staffName',
        header: 'Staff Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.staff.email,
        id: 'staffEmail',
        header: 'Staff Email',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.staff.staff?.a2pEmpId || '',
        id: 'a2pEmpId',
        header: 'A2P Emp ID',
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.staff.staff?.areaOfWork || '',
        id: 'areaOfWork',
        header: 'Area of Work',
        cell: (info) => info.getValue(),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const openConfirmModal = () => {
            setSelectedShiftPosting(row.original);
            setIsModalOpen(true);
          };

          return (
            <button
              onClick={openConfirmModal}
              className="text-red-500 hover:text-red-700"
              title="Delete Shift Posting"
              aria-label={`Delete shift posting for ${format(
                new Date(row.original.shiftSchedule.date),
                'yyyy-MM-dd'
              )} - Shift ${row.original.shiftSchedule.shiftTitle}`}
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          );
        },
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

  // Handle deletion confirmation
  const handleConfirmDelete = async () => {
    if (!selectedShiftPosting) return;

    try {
      await api.delete(`/shift/postings/${selectedShiftPosting.id}`);
      toast.success('Shift posting deleted successfully');
      // Remove the deleted shift posting from local data
      setData((prevData) =>
        prevData.filter((posting) => posting.id !== selectedShiftPosting.id)
      );
      // Optionally notify parent component
      if (onShiftPostingsUpdated) {
        onShiftPostingsUpdated();
      }
    } catch (error: any) {
      console.error('Error deleting shift posting:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to delete shift posting');
      }
    } finally {
      setIsModalOpen(false);
      setSelectedShiftPosting(null);
    }
  };

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

      {/* Shift Posting Table */}
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
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider ${canSort ? 'cursor-pointer select-none' : ''
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
                  No shift postings found.
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

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedShiftPosting(null);
        }}
        onConfirm={handleConfirmDelete}
        shiftDate={
          selectedShiftPosting
            ? format(
              new Date(selectedShiftPosting.shiftSchedule.date),
              'yyyy-MM-dd'
            )
            : ''
        }
        shiftTitle={
          selectedShiftPosting
            ? selectedShiftPosting.shiftSchedule.shiftTitle
            : ''
        }
      />
    </div>
  );
}
