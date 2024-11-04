// app/staff/shipments/components/EditShipmentModal.tsx

'use client';

import React, { useState } from 'react';
import { Shipment } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface EditShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Shipment>) => void;
  shipment: Shipment;
}

const EditShipmentModal: React.FC<EditShipmentModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  shipment,
}) => {
  const [formData, setFormData] = useState<Partial<Shipment>>({
    vehicleNo: shipment.vehicleNo,
    incomingBriquetteWeight: shipment.incomingBriquetteWeight,
    incomingStockGCV: shipment.incomingStockGCV,
    supplier: shipment.supplier,
    pricePerMT: shipment.pricePerMT,
    remarks: shipment.remarks,
  });

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

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    onUpdate(shipment.id, formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Shipment
          </h2>
          <button onClick={onClose} aria-label="Close modal">
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        {/* Body */}
        <div className="grid grid-cols-2 gap-4">
          {/* Record Date (non-editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date / तारीख
            </label>
            <span className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              {shipment.recordDate}
            </span>
          </div>
          {/* Record Time (non-editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time / समय
            </label>
            <span className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              {shipment.recordTime}
            </span>
          </div>
          {/* Vehicle No (editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vehicle No / वाहन संख्या
            </label>
            <input
              type="text"
              value={formData.vehicleNo || ''}
              onChange={(e) => handleInputChange(e, 'vehicleNo')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* Incoming Briquette Weight (editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Incoming Briquette Weight (MT) / इनकमिंग बृकेट वजन (MT)
            </label>
            <input
              type="number"
              value={formData.incomingBriquetteWeight || 0}
              onChange={(e) =>
                handleInputChange(e, 'incomingBriquetteWeight')
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>
          {/* Incoming Stock GCV (editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Incoming Stock GCV (Kcal/kg) / इनकमिंग स्टॉक GCV (Kcal/kg)
            </label>
            <input
              type="number"
              value={formData.incomingStockGCV || 0}
              onChange={(e) =>
                handleInputChange(e, 'incomingStockGCV')
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>
          {/* Supplier (editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier / सप्लायर
            </label>
            <input
              type="text"
              value={formData.supplier || ''}
              onChange={(e) => handleInputChange(e, 'supplier')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* Price per MT (editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price per MT (₹) / प्रति MT कीमत (₹)
            </label>
            <input
              type="number"
              value={formData.pricePerMT || 0}
              onChange={(e) => handleInputChange(e, 'pricePerMT')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              min="0"
            />
          </div>
          {/* Remarks (editable) */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Remarks / टिप्पणियाँ
            </label>
            <input
              type="text"
              value={formData.remarks || ''}
              onChange={(e) => handleInputChange(e, 'remarks')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200"
          >
            Cancel / रद्द करें
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Update / अपडेट करें
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditShipmentModal;
