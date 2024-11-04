// app/staff/steam-parameters/components/SteamParametersTable.tsx

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
import { Plant, ShiftSchedule, SteamParameters } from '../types';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

interface SteamParametersTableProps {
  steamParameters: SteamParameters[];
  activeShift: ShiftSchedule;
  onAdd: (data: Partial<SteamParameters>) => void;
  plant: Plant;
}

const SteamParametersTable: React.FC<SteamParametersTableProps> = ({
  steamParameters,
  onAdd,
  activeShift,
  plant,
}) => {
  if (!plant || !activeShift) {
    return <div>Loading...</div>;
  }

  // State for the new steam parameters entry (last row)
  const [newEntry, setNewEntry] = useState<Partial<SteamParameters>>({
    plantId: plant.plantId,
    shiftScheduleId: activeShift.id,
    timeStart: '',
    timeEnd: '',
    steamPressure: undefined,
    steamFlow: undefined,
    steamTemperature: undefined,
    elMeter: undefined,
    stackTemperature: undefined,
    feedWaterTemperature: undefined,
    feedWaterMeterReading: undefined,
    fuelPumpPr: undefined,
    fuelPumpRtPr: undefined,
    filterNumber: undefined,
    feedWaterPr: undefined,
    feedWaterPh: undefined,
    feedWaterTds: undefined,
    blowDownPh: undefined,
    blowDownTds: undefined,
  });

  // Update newEntry when plant or activeShift changes
  useEffect(() => {
    setNewEntry((prev: Partial<SteamParameters>) => ({
      ...prev,
      shiftScheduleId: activeShift.id,
      plantId: plant.plantId,
    }));
  }, [plant, activeShift]);

  // Define table columns
  const columns = useMemo<ColumnDef<SteamParameters, any>[]>(
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
        header: 'Time Start / समय प्रारंभ',
        accessorKey: 'timeStart',
        cell: ({ getValue }) => getValue<string>() || '-',
      },
      {
        header: 'Time End / समय समाप्ति',
        accessorKey: 'timeEnd',
        cell: ({ getValue }) => getValue<string>() || '-',
      },
      {
        header: 'Steam Pressure / स्टीम प्रेशर',
        accessorKey: 'steamPressure',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Steam Flow / स्टीम फ्लो',
        accessorKey: 'steamFlow',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Steam Temperature / स्टीम तापमान',
        accessorKey: 'steamTemperature',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'E/L Meter / E/L मीटर',
        accessorKey: 'elMeter',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Stack Temperature / स्टैक तापमान',
        accessorKey: 'stackTemperature',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Feed Water Temperature / फीड वाटर तापमान',
        accessorKey: 'feedWaterTemperature',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Feed Water Meter Reading / फीड वाटर मीटर रीडिंग',
        accessorKey: 'feedWaterMeterReading',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Fuel Pump Pr / फ्यूल पंप प्रेशर',
        accessorKey: 'fuelPumpPr',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Fuel Pump RT Pr / फ्यूल पंप आरटी प्रेशर',
        accessorKey: 'fuelPumpRtPr',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Filter Number / फ़िल्टर नंबर',
        accessorKey: 'filterNumber',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Feed Water Pr / फीड वाटर प्रेशर',
        accessorKey: 'feedWaterPr',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Feed Water pH / फीड वाटर पीएच',
        accessorKey: 'feedWaterPh',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Feed Water TDS / फीड वाटर टीडीएस',
        accessorKey: 'feedWaterTds',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Blow Down pH / ब्लो डाउन पीएच',
        accessorKey: 'blowDownPh',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
      {
        header: 'Blow Down TDS / ब्लो डाउन टीडीएस',
        accessorKey: 'blowDownTds',
        cell: ({ getValue }) => (getValue<number>() ?? '-').toString(),
      },
    ],
    []
  );

  const data = useMemo(() => steamParameters, [steamParameters]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'createdAt',
      desc: false, // ascending order to have oldest entries first
    },
  ]);

  const pageSize = 5; // Adjusted page size to account for the empty form row

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  useEffect(() => {
    table.setPageIndex(Math.max(table.getPageCount() - 1, 0));
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

  // Handler for input changes in the new entry form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof SteamParameters
  ) => {
    const value = e.target.value;
    setNewEntry((prev) => ({
      ...prev,
      [field]:
        e.target.type === 'number' && value !== ''
          ? parseFloat(value)
          : value || undefined,
    }));
  };

  // Handler for submitting the new entry
  const handleSubmit = () => {
    // Validation: ensure required fields are present
    // Adjust based on which fields are required
    if (!newEntry.timeStart || newEntry.steamPressure === undefined) {
      toast.error('Please enter required fields.');
      return;
    }

    // Prepare data to send to backend
    const entryData: Partial<SteamParameters> = {
      ...newEntry,
    };

    onAdd(entryData);

    // Reset form with plantId and shiftScheduleId retained
    setNewEntry({
      plantId: plant.plantId,
      shiftScheduleId: activeShift.id,
      timeStart: '',
      timeEnd: '',
      steamPressure: undefined,
      steamFlow: undefined,
      steamTemperature: undefined,
      elMeter: undefined,
      stackTemperature: undefined,
      feedWaterTemperature: undefined,
      feedWaterMeterReading: undefined,
      fuelPumpPr: undefined,
      fuelPumpRtPr: undefined,
      filterNumber: undefined,
      feedWaterPr: undefined,
      feedWaterPh: undefined,
      feedWaterTds: undefined,
      blowDownPh: undefined,
      blowDownTds: undefined,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-slate-900">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Steam Parameters / स्टीम पैरामीटर
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-slate-900">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border-b border-gray-300 text-left text-sm font-medium text-gray-700 cursor-pointer select-none whitespace-nowrap"
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
                    className="px-4 py-2 border-b border-gray-300 whitespace-nowrap"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {/* New Entry Form Row */}
            {(table.getPageCount() === 0 ||
              table.getState().pagination.pageIndex ===
                table.getPageCount() - 1) && (
              <tr className="bg-gray-50">
                {/* Shift Title */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <span>{activeShift.shiftTitle}</span>
                </td>
                {/* Date */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <span>
                    {format(new Date(activeShift.date), 'MM/dd/yyyy')}
                  </span>
                </td>
                {/* Time Start */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="time"
                    value={newEntry.timeStart || ''}
                    onChange={(e) => handleInputChange(e, 'timeStart')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Time Start"
                  />
                </td>
                {/* Time End */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="time"
                    value={newEntry.timeEnd || ''}
                    onChange={(e) => handleInputChange(e, 'timeEnd')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Time End"
                  />
                </td>
                {/* Steam Pressure */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.steamPressure ?? ''}
                    onChange={(e) => handleInputChange(e, 'steamPressure')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Steam Pressure"
                  />
                </td>
                {/* Steam Flow */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.steamFlow ?? ''}
                    onChange={(e) => handleInputChange(e, 'steamFlow')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Steam Flow"
                  />
                </td>
                {/* Steam Temperature */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.steamTemperature ?? ''}
                    onChange={(e) => handleInputChange(e, 'steamTemperature')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Steam Temperature"
                  />
                </td>
                {/* E/L Meter */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.elMeter ?? ''}
                    onChange={(e) => handleInputChange(e, 'elMeter')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E/L Meter"
                  />
                </td>
                {/* Stack Temperature */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.stackTemperature ?? ''}
                    onChange={(e) => handleInputChange(e, 'stackTemperature')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Stack Temperature"
                  />
                </td>
                {/* Feed Water Temperature */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.feedWaterTemperature ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, 'feedWaterTemperature')
                    }
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Feed Water Temperature"
                  />
                </td>
                {/* Feed Water Meter Reading */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.feedWaterMeterReading ?? ''}
                    onChange={(e) =>
                      handleInputChange(e, 'feedWaterMeterReading')
                    }
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Feed Water Meter Reading"
                  />
                </td>
                {/* Fuel Pump Pr */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.fuelPumpPr ?? ''}
                    onChange={(e) => handleInputChange(e, 'fuelPumpPr')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Fuel Pump Pr"
                  />
                </td>
                {/* Fuel Pump RT Pr */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.fuelPumpRtPr ?? ''}
                    onChange={(e) => handleInputChange(e, 'fuelPumpRtPr')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Fuel Pump RT Pr"
                  />
                </td>
                {/* Filter Number */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.filterNumber ?? ''}
                    onChange={(e) => handleInputChange(e, 'filterNumber')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Filter Number"
                  />
                </td>
                {/* Feed Water Pr */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.feedWaterPr ?? ''}
                    onChange={(e) => handleInputChange(e, 'feedWaterPr')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Feed Water Pr"
                  />
                </td>
                {/* Feed Water pH */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.feedWaterPh ?? ''}
                    onChange={(e) => handleInputChange(e, 'feedWaterPh')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Feed Water pH"
                  />
                </td>
                {/* Feed Water TDS */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.feedWaterTds ?? ''}
                    onChange={(e) => handleInputChange(e, 'feedWaterTds')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Feed Water TDS"
                  />
                </td>
                {/* Blow Down pH */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.blowDownPh ?? ''}
                    onChange={(e) => handleInputChange(e, 'blowDownPh')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Blow Down pH"
                  />
                </td>
                {/* Blow Down TDS */}
                <td className="px-4 py-2 border-b border-gray-300">
                  <input
                    type="number"
                    value={newEntry.blowDownTds ?? ''}
                    onChange={(e) => handleInputChange(e, 'blowDownTds')}
                    className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Blow Down TDS"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
            onClick={() =>
              table.setPageIndex(table.getPageCount() - 1)
            }
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
                const page = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
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
            {[5, 10, 20, 50].map((pageSizeOption) => (
              <option key={pageSizeOption} value={pageSizeOption}>
                Show {pageSizeOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Submit / जोड़ें
        </button>
      </div>
    </div>
  );
};

export default SteamParametersTable;
