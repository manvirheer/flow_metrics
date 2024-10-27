'use client';

import React from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  Column,
  TableInstance,
  TableState,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
} from 'react-table';
import { Employee } from '../../_types/Employee';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

type TableInstanceWithHooks<T extends object> = TableInstance<T> &
  UseGlobalFiltersInstanceProps<T>;

type TableStateWithHooks<T extends object> = TableState<T> &
  UseGlobalFiltersState<T>;

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
  // Define the columns for the table
  const columns: Column<Employee>[] = React.useMemo(
    () => [
      {
        Header: 'No.',
        id: 'rowIndex',
        Cell: ({ row }) => row.index + 1,
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Mobile',
        accessor: 'mobile',
      },
      {
        Header: 'A2P Emp ID',
        accessor: (row) => row.staff.a2pEmpId || '',
      },
      {
        Header: 'Area of Work',
        accessor: (row) => row.staff.areaOfWork || '',
      },
      {
        Header: 'Nature of Work',
        accessor: (row) => row.staff?.natureOfWork || '',
      },
      {
        Header: 'Actions',
        id: 'actions',
        Cell: ({ row }) => (
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

  // Use the useTable hook with global filter and sort features
  const tableInstance = useTable<Employee>(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: ['emergencyContactPhoneNumber', 'emergencyContactName'],
      },
    },
    useGlobalFilter, // Enable global filtering
    useSortBy // Enable sorting
  );

  // Extend the table instance and state types to include global filter properties
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance as TableInstanceWithHooks<Employee>;

  const { globalFilter } = state as TableStateWithHooks<Employee>;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value || undefined);
  };

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4">
        <input
          value={globalFilter || ''}
          onChange={handleSearch}
          placeholder="Search..."
          className="block w-full p-2 border border-gray-300 rounded-md 
                           shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-600 
                           focus:border-blue-500 sm:text-md text-slate-900"
        />
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto">
        <table
          {...getTableProps()}
          className="w-full divide-y divide-gray-200"
        >
          <thead className="bg-gray-200">
            {headerGroups.map((headerGroup) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(
                      (column as any).getSortByToggleProps()
                    )}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                    key={column.id}
                  >
                    {column.render('Header')}
                    {/* Add sorting indicator */}
                    <span>
                      {(column as any).isSorted
                        ? (column as any).isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-white divide-y divide-gray-200"
          >
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="hover:bg-gray-100"
                  key={row.id}
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                      key={cell.column.id}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
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
