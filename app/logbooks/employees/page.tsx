'use client';

import React, { useEffect, useState, useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import api from '../../_utils/axios';
import {
  ArrowDownTrayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import AddEmployeeModal from './addEmployeeModal';
import ExportModal from './exportModal';
import EmployeeTable from './employeeTable';
import EditEmployeeModal from './editEmployeeModal';
import { Employee } from '../../_types/Employee';
import ConfirmDeleteModal from './confirmDeleteModal';
import { toast } from 'react-toastify';

export default function EmployeesPage() {
  const { selectedPlant } = useContext(PlantContext);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Fetch plant data when selectedPlant changes
  useEffect(() => {
    if (selectedPlant) {
      fetchEmployees();
    } else {
      // No plant selected
      setEmployees([]);
      setLoading(false);
    }
  }, [selectedPlant]);

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const fetchEmployees = () => {
    setLoading(true);
    if (!selectedPlant) {
      toast.error('No plant selected');
      setLoading(false);
      return;
    }
    api
      .get(`/plants/${selectedPlant.plantId}`)
      .then((response) => {
        const plant = response.data;
        const staffUsers = plant.users.filter(
          (user: { role: string }) => user.role.toLowerCase() === 'staff'
        );
        setEmployees(staffUsers);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching plant data:', error);
        toast.error('Failed to fetch employees');
        setEmployees([]);
        setLoading(false);
      });
  };

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!employeeToDelete) return;

    // Send DELETE request to delete employee
    api
      .delete(`/auth/${employeeToDelete.id}`)
      .then(() => {
        toast.success('Employee deleted successfully');
        fetchEmployees();
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      });
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Loading employees...</h2>
      </div>
    );
  }

  if (!selectedPlant) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">
          Please select a plant to view employees.
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 min-h-screen relative">
      {/* Export Modal */}
      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          employees={employees}
        />
      )}

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onEmployeeAdded={fetchEmployees}
        />
      )}

      {/* Edit Employee Modal */}
      {selectedEmployee && isEditModalOpen && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          employee={selectedEmployee}
          onEmployeeUpdated={fetchEmployees}
        />
      )}

      {/* Confirm Delete Modal */}
      {employeeToDelete && isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          employeeName={employeeToDelete.name}
        />
      )}

      <div className="bg-white rounded-xl shadow-lg p-8 text-gray-900">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">
            Employees at {selectedPlant.plantName}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              <span>Add Employee</span>
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-1" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Employee Table */}
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
