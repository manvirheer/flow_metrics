// app/staff/shipments/components/ShipmentTable.tsx

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
import { Plant, ShiftSchedule, Shipment } from '../types/index';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

import EditShipmentModal from './EditShipmentModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';

interface ShipmentTableProps {
  shipments: Shipment[];
  activeShift: ShiftSchedule;
  onAdd: (data: Partial<Shipment>) => void;
  onUpdate: (id: string, data: Partial<Shipment>) => void;
  onDelete: (id: string) => void;
  plant: Plant;
}

const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onAdd,
  onUpdate,
  onDelete,
  activeShift,
  plant,
}) => {
  // Ensure plant and activeShift are defined
  if (!plant || !activeShift) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  // State for the new shipment (last row)
  const [newShipment, setNewShipment] = useState<Partial<Shipment>>({
    vehicleNo: '',
    recordDate: format(new Date(), 'yyyy-MM-dd'),
    shiftScheduleId: activeShift.id,
    plantId: plant.plantId,
    recordTime: '',
    incomingBriquetteWeight: 0,
    incomingStockGCV: 0,
    supplier: '',
    pricePerMT: 0,
    remarks: '',
  });

  // Update newShipment when plant or activeShift changes
  useEffect(() => {
    setNewShipment((prev) => ({
      ...prev,
      shiftScheduleId: activeShift.id,
      plantId: plant.plantId,
    }));
  }, [plant, activeShift]);

  // State for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const handleEdit = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditModalOpen(true);
  };

  const handleDelete = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedShipment) {
      onDelete(selectedShipment.id);
    }
    setSelectedShipment(null);
    setIsDeleteModalOpen(false);
  };

  // Define table columns
  const columns = useMemo<ColumnDef<Shipment, any>[]>(
    () => [
      {
        // Numbering column
        id: 'serialNumber',
        header: '#',
        accessorFn: (row) => row.serialNumber,
        cell: (info) => info.row.original.serialNumber,
      },
      {
        accessorKey: 'recordDate',
        header: 'Date / तारीख',
        cell: ({ getValue }) =>
          format(new Date(getValue<string>()), 'yyyy-MM-dd'),
      },
      {
        accessorKey: 'recordTime',
        header: 'Time / समय',
      },
      {
        accessorKey: 'vehicleNo',
        header: 'Vehicle No / वाहन संख्या',
      },
      {
        accessorKey: 'shiftSchedule.shiftTitle',
        header: 'Shift / शिफ्ट',
      },
      {
        accessorKey: 'incomingBriquetteWeight',
        header:
          'Incoming Briquette Weight (MT) / इनकमिंग बृकेट वजन (MT)',
      },
      {
        accessorKey: 'incomingStockGCV',
        header:
          'Incoming Stock GCV (Kcal/kg) / इनकमिंग स्टॉक GCV (Kcal/kg)',
      },
      {
        accessorKey: 'supplier',
        header: 'Supplier / सप्लायर',
      },
      {
        accessorKey: 'pricePerMT',
        header: 'Price per MT (₹) / प्रति MT कीमत (₹)',
      },
      {
        accessorKey: 'remarks',
        header: 'Remarks / टिप्पणियाँ',
      },
      {
        // Actions column
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo(() => shipments, [shipments]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'serialNumber', desc: false },
  ]);

  const pageSize = 9; // Adjusted page size to account for the empty form row

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // Effect to set the pageIndex to the last page when data changes or the page si reloaded
  

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
          id: 'serialNumber',
          desc: false,
        },

      ],
    },
  });

  
  useEffect(() => {
    table.lastPage();
  }, [data.length, pageSize]);


  // Handler for input changes in the new shipment form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Shipment
  ) => {
    let value: string | number;

    if (e.target.type === 'number') {
      value = e.target.value ? parseFloat(e.target.value) : 0;
    } else {
      value = e.target.value;
    }

    setNewShipment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handler for submitting the new shipment
  const handleSubmit = () => {
    // Destructure fields including plantId
    const {
      vehicleNo,
      recordDate,
      recordTime,
      incomingBriquetteWeight,
      incomingStockGCV,
      supplier,
      plantId,
      pricePerMT,
    } = newShipment;

    // Validation: include plantId
    if (
      !vehicleNo ||
      !recordDate ||
      !recordTime ||
      incomingBriquetteWeight === undefined ||
      incomingStockGCV === undefined ||
      !supplier ||
      pricePerMT === undefined ||
      !plantId // Ensure plantId is present
    ) {
      console.log('Validation Failed');
      console.log('newShipment', newShipment);
      toast.error(
        'Please fill in all required fields, including Plant ID.'
      );
      return;
    }

    console.log('Submitting newShipment', newShipment);

    onAdd(newShipment);

    // Reset form with plantId and shiftScheduleId retained
    setNewShipment({
      vehicleNo: '',
      recordDate: format(new Date(), 'yyyy-MM-dd'), // Reset to current date
      recordTime: '',
      incomingBriquetteWeight: 0,
      incomingStockGCV: 0,
      supplier: '',
      pricePerMT: 0,
      remarks: '',
      plantId: plant.plantId, // Retain plantId
      shiftScheduleId: activeShift.id,
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-slate-900">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Shipments / शिपमेंट
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

            {/* New Shipment Form Row */}
            {(table.getPageCount() === 0 ||
              table.getState().pagination.pageIndex ===
                table.getPageCount() - 1) && (
                <tr className="bg-gray-50">
                  {/* Serial Number cell */}
                  <td className="px-4 py-2 border-b border-gray-300">
                    {/* Empty cell for serial number */}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <span>{format(new Date(), 'yyyy-MM-dd')}</span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <input
                      type="time"
                      value={newShipment.recordTime || ''}
                      onChange={(e) => handleInputChange(e, 'recordTime')}
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <input
                      type="text"
                      value={newShipment.vehicleNo || ''}
                      onChange={(e) => handleInputChange(e, 'vehicleNo')}
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Vehicle No"
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <span>{activeShift.shiftTitle}</span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <input
                      type="number"
                      value={newShipment.incomingBriquetteWeight || 0}
                      onChange={(e) =>
                        handleInputChange(e, 'incomingBriquetteWeight')
                      }
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                      placeholder="Weight (MT)"
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <input
                      type="number"
                      value={newShipment.incomingStockGCV || 0}
                      onChange={(e) =>
                        handleInputChange(e, 'incomingStockGCV')
                      }
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                      placeholder="GCV (Kcal/kg)"
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <input
                      type="text"
                      value={newShipment.supplier || ''}
                      onChange={(e) => handleInputChange(e, 'supplier')}
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Supplier"
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <input
                      type="number"
                      value={newShipment.pricePerMT || 0}
                      onChange={(e) => handleInputChange(e, 'pricePerMT')}
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      required
                      placeholder="Price per MT"
                    />
                  </td>
                  <td className="px-4 py-2 border-b border-gray-300">
                    <input
                      type="text"
                      value={newShipment.remarks || ''}
                      onChange={(e) => handleInputChange(e, 'remarks')}
                      className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Remarks"
                    />
                  </td>
                  {/* Actions cell */}
                  <td className="px-4 py-2 border-b border-gray-300">
                    {/* Empty cell for actions */}
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

      {/* Modals */}
      {isEditModalOpen && selectedShipment && (
        <EditShipmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedShipment(null);
          }}
          onUpdate={onUpdate}
          shipment={selectedShipment}
        />
      )}
      {isDeleteModalOpen && selectedShipment && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedShipment(null);
          }}
          onConfirm={confirmDelete}
          title="Confirm Delete Shipment"
          message="Are you sure you want to delete this shipment?"
        />
      )}
    </div>
  );
};

export default ShipmentTable;
