'use client';

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../../_utils/axios';
import { Employee } from '../../_types/Employee';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onEmployeeUpdated: () => void;
}

export default function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  onEmployeeUpdated,
}: EditEmployeeModalProps) {
  const { register, handleSubmit, reset } = useForm<Employee>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset(employee);
  }, [employee, reset]);

  const handleUpdateEmployee = (data: Employee) => {
    setLoading(true);
    // Prepare the data to match UpdateUserDto
    const updateData = {
      email: data.email,
      name: data.name,
      mobile: data.mobile,
      emergencyContactName: data.emergencyContactName,
      emergencyContactPhoneNumber: data.emergencyContactPhoneNumber,
      a2pEmpId: data.staff.a2pEmpId,
      fatherName: data.staff.fatherName,
      areaOfWork: data.staff.areaOfWork,
      natureOfWork: data.staff.natureOfWork,
    };

    // Send PATCH request to update employee
    api
      .patch(`/auth/${employee.id}`, updateData)
      .then((response) => {
        toast.success('Employee updated successfully');
        onEmployeeUpdated();
        onClose();
      })
      .catch((error) => {
        console.error('Error updating employee:', error);
        toast.error('Failed to update employee');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-700">
            Edit Employee
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(handleUpdateEmployee)}
          className="space-y-4 text-slate-900"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                {...register('name', { required: true })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="tel"
                {...register('mobile', { required: true })}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Emergency Contact Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact Name
              </label>
              <input
                type="text"
                {...register('emergencyContactName')}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Emergency Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                {...register('emergencyContactPhoneNumber')}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* A2P Employee ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                A2P Employee ID
              </label>
              <input
                type="text"
                {...register('staff.a2pEmpId')}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Father's Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's Name
              </label>
              <input
                type="text"
                {...register('staff.fatherName')}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Area of Work */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area of Work
              </label>
              <input
                type="text"
                {...register('staff.areaOfWork')}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Nature of Work */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nature of Work
              </label>
              <input
                type="text"
                {...register('staff.natureOfWork')}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {loading ? 'Updating...' : 'Update Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
