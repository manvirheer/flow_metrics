'use client';

import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-700">
            Confirm Deletion
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <p className="mb-4 text-slate-900">
          Are you sure you want to delete employee{' '}
          <span className="font-semibold">{employeeName}</span>?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
