'use client';

import React, { useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import { XMarkIcon, DocumentTextIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Employee } from '../../_types/Employee';
import { toast } from 'react-toastify';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

export default function ExportModal({
  isOpen,
  onClose,
  employees,
}: ExportModalProps) {
  const { selectedPlant } = useContext(PlantContext);

  const handleExportCSV = () => {
    // Flatten the data
    const flattenedEmployees = employees.map((employee, index) => ({
      No: index + 1,
      Name: employee.name,
      Email: employee.email,
      Mobile: employee.mobile,
      'Area of Work': employee.staff?.areaOfWork || '',
      'Nature of Work': employee.staff?.natureOfWork || '',
    }));

    const csvData = Papa.unparse(flattenedEmployees);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    if (selectedPlant) {
      link.setAttribute('download', `employees_${selectedPlant.plantName}.csv`);
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(
      `Employees at ${selectedPlant?.plantName ?? 'Unknown Plant'}`,
      14,
      15
    );

    // Prepare the data for the table
    const tableColumn = [
      'No.',
      'Name',
      'Email',
      'Mobile',
      'Area of Work',
      'Nature of Work',
    ];

    const tableRows = employees.map((employee, index) => [
      index + 1,
      employee.name,
      employee.email,
      employee.mobile,
      employee.staff?.areaOfWork || '',
      employee.staff?.natureOfWork || '',
    ]);

    // Add autoTable plugin
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    if (selectedPlant) {
      doc.save(`employees_${selectedPlant.plantName}.pdf`);
    } else {
      toast.error('Cannot export PDF: No plant selected');
    }
    onClose();
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
      <div className="relative bg-white rounded-lg shadow-lg w-80 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-700">Export</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Export as CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
