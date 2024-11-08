// logbooks/shift-schedule/AddShiftPostingModal.tsx
'use client';

import React, { useContext, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ShiftTitle } from '../../_types/ShiftTitle';
import { PlantContext } from '../../_contexts/PlantContext';
import api from '../../_utils/axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Employee } from '../../_types/Employee';
import { ShiftSchedule } from '../../_types/ShiftSchedule';
import { format } from 'date-fns';

interface AddShiftPostingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShiftPostingsCreated: () => void;
}

interface StaffAssignment {
  staffId: string;
  shiftTitle: ShiftTitle;
}

export default function AddShiftPostingModal({
  isOpen,
  onClose,
  onShiftPostingsCreated,
}: AddShiftPostingModalProps) {
  const { selectedPlant } = useContext(PlantContext);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [staffList, setStaffList] = useState<Employee[]>([]);
  const [filteredStaffList, setFilteredStaffList] = useState<Employee[]>([]);
  const [shiftSchedules, setShiftSchedules] = useState<ShiftSchedule[]>([]);
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);

  // Handle date confirmation and create shift schedules
  const handleDateConfirm = async () => {
    if (!selectedPlant) {
      toast.error('No plant selected');
      return;
    }
  
    setLoading(true);
  
    const dateString = format(selectedDate, 'yyyy-MM-dd');
  
    const payload = {
      plantId: selectedPlant.plantId,
      date: dateString,
    };
  
    try {
      // Make a single API call to the batch endpoint
      const response = await api.post('/shift/schedules/batch', payload);
      const { message, shifts: createdShifts, existingShifts } = response.data;
  
      // Optionally, you can display the message to the user
      toast.success(message);
  
      // Fetch all shift schedules for the date and plant to ensure frontend state is up-to-date
      const allShiftsResponse = await api.get('/shift/schedules', {
        params: {
          date: dateString,
          plantId: selectedPlant.plantId,
        },
      });
  
      const allShifts: ShiftSchedule[] = allShiftsResponse.data;
      setShiftSchedules(allShifts);
  
      // Fetch staff associated with the selected plant
      await fetchStaff();
  
      setStep(2); // Proceed to staff assignment step
    } catch (error: any) {
      console.error('Error handling shift schedules:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to handle shift schedules');
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff members for the selected plant
  const fetchStaff = async () => {
    if (!selectedPlant) {
      toast.error('No plant selected');
      return;
    }

    try {
      const response = await api.get(`/plants/${selectedPlant.plantId}?include=users`);
      const plantData = response.data;
      const users = plantData.users || [];
      // Filter users with role 'Staff'
      const staffUsers = users.filter((user: any) => user.role === 'Staff');
      setStaffList(staffUsers);
      setFilteredStaffList(staffUsers); // Initialize filtered list
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff');
    }
  };

  // Handle staff search
  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredStaffList(staffList);
    } else {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const filtered = staffList.filter(
        (staff) =>
          staff.name.toLowerCase().includes(lowerCaseTerm) ||
          staff.email.toLowerCase().includes(lowerCaseTerm)
      );
      setFilteredStaffList(filtered);
    }
  };

  // Handle staff assignment
  const handleAssignmentChange = (staffId: string, shiftTitle: ShiftTitle) => {
    setAssignments((prevAssignments) => {
      // Remove any existing assignment for this staff member
      const filteredAssignments = prevAssignments.filter(
        (assignment) => assignment.staffId !== staffId
      );
      // If a shift is selected, add the new assignment
      if (shiftTitle) {
        return [...filteredAssignments, { staffId, shiftTitle }];
      }
      return filteredAssignments;
    });
  };

  // Submit assignments
  const handleSubmitAssignments = async () => {
    if (assignments.length === 0) {
      toast.error('Please assign at least one staff member to a shift');
      return;
    }

    setLoading(true);
    try {
      for (const assignment of assignments) {
        // Find the shift schedule for the assigned shift
        const schedule = shiftSchedules.find(
          (s) => s.shiftTitle === assignment.shiftTitle
        );
        if (schedule) {
          const payload = {
            shiftScheduleId: schedule.id,
            staffId: assignment.staffId,
          };
          await api.post('/shift/postings', payload);
        }
      }
      toast.success('Shift postings created successfully');
      onShiftPostingsCreated();
      onClose();
    } catch (error) {
      console.error('Error assigning staff to shifts:', error);
      toast.error('Failed to assign staff to shifts');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-slate-900">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-700">
            {step === 1 && 'Select Date for Shift Postings'}
            {step === 2 && 'Assign Staff to Shifts'}
          </h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {step === 1 && (
          // Step 1: Select Date
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => date && setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full"
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDateConfirm}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                disabled={loading}
              >
                {loading ? 'Creating Shifts...' : 'Confirm Date'}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          // Step 2: Assign Staff to Shifts
          <div>
            <p className="mb-4">
              Assign staff to shifts for{' '}
              <strong>{format(selectedDate, 'yyyy-MM-dd')}</strong>
            </p>
            <div className="mb-4">
              {/* Staff Search */}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Staff
              </label>
              <input
                type="text"
                placeholder="Search by name or email"
                onChange={(e) => handleSearch(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4 max-h-96 overflow-y-auto">
              {/* Staff List */}
              {filteredStaffList.map((staff) => (
                <div key={staff.id} className="flex items-center mb-2 border-b py-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{staff.name}</p>
                    <p className="text-sm text-gray-600">{staff.email}</p>
                  </div>
                  <div className="ml-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assign to Shift
                    </label>
                    <select
                      value={
                        assignments.find((a) => a.staffId === staff.id)
                          ?.shiftTitle || ''
                      }
                      onChange={(e) => {
                        const shiftTitle = e.target.value as ShiftTitle;
                        handleAssignmentChange(staff.id, shiftTitle);
                      }}
                      className="mt-1 block w-32 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Shift</option>
                      <option value={ShiftTitle.A}>Shift A</option>
                      <option value={ShiftTitle.B}>Shift B</option>
                      <option value={ShiftTitle.C}>Shift C</option>
                    </select>
                  </div>
                </div>
              ))}
              {filteredStaffList.length === 0 && (
                <p className="text-gray-600">No staff found.</p>
              )}
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
                type="button"
                onClick={handleSubmitAssignments}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {loading ? 'Creating...' : 'Create Shift Postings'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
