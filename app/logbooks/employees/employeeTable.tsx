// app/logbooks/shift-schedule/EmployeeTable.tsx
'use client';

import React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { Employee } from '../../_types/Employee';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeTable({
  employees,
  onEdit = () => {},
  onDelete = () => {},
}: EmployeeTableProps) {
  // State for global filter and sorting
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Define the columns for the table
  const columns = React.useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        id: 'rowIndex',
        header: 'No.',
        cell: (info) => info.row.index + 1,
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile',
      },
      {
        id: 'a2pEmpId',
        header: 'A2P Emp ID',
        accessorFn: (row) => row.staff.a2pEmpId || '',
      },
      {
        id: 'areaOfWork',
        header: 'Area of Work',
        accessorFn: (row) => row.staff.areaOfWork || '',
      },
      {
        id: 'natureOfWork',
        header: 'Nature of Work',
        accessorFn: (row) => row.staff?.natureOfWork || '',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button onClick={() => onEdit(row.original)}>
              <PencilSquareIcon className="h-5 w-5 text-gray-500 hover:text-blue-500" />
            </button>
            <button onClick={() => onDelete(row.original)}>
              <TrashIcon className="h-5 w-5 text-gray-500 hover:text-red-500" />
            </button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  // Prepare the data
  const data = React.useMemo(() => employees, [employees]);

  // Use the useReactTable hook
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

      {/* Employee Table */}
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
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center"
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
