'use client';

import React, { useEffect, useState, useContext } from 'react';
import { PlantContext } from '../../_contexts/PlantContext';
import api from '../../_utils/axios';
import {
  ArrowDownTrayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
// import AddSteamGenerationModal from './AddSteamGenerationModal';
// import ExportModal from './ExportModal';
import SteamGenerationTable from './SteamGenerationTable';
// import EditSteamGenerationModal from './EditSteamGenerationModal';
import { SteamGenerationRecord } from '../../_types/SteamGenerationRecord';
// import ConfirmDeleteModal from './ConfirmDeleteModal';
import { toast } from 'react-toastify';

export default function SteamGenerationPage() {
  const { selectedPlant } = useContext(PlantContext);
  const [records, setRecords] = useState<SteamGenerationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SteamGenerationRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<SteamGenerationRecord | null>(null);

  // Fetch records when selectedPlant changes
  useEffect(() => {
    if (selectedPlant) {
      fetchRecords();
    } else {
      setRecords([]);
      setLoading(false);
    }
  }, [selectedPlant]);

  const handleEdit = (record: SteamGenerationRecord) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const fetchRecords = () => {
    setLoading(true);
    if (!selectedPlant) {
      toast.error('No plant selected');
      setLoading(false);
      return;
    }
    api
      .get(`/record/steam-generation?plantId=${selectedPlant.plantId}`)
      .then((response) => {
        setRecords(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching records:', error);
        toast.error('Failed to fetch records');
        setRecords([]);
        setLoading(false);
      });
  };

  const handleDelete = (record: SteamGenerationRecord) => {
    setRecordToDelete(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!recordToDelete) return;

    api
      .delete(`/record/steam-generation/${recordToDelete.id}`)
      .then(() => {
        toast.success('Record deleted successfully');
        fetchRecords();
        setIsDeleteModalOpen(false);
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
        toast.error('Failed to delete record');
      });
  };

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">Loading records...</h2>
      </div>
    );
  }

  if (!selectedPlant) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-semibold">
          Please select a plant to view steam generation records.
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 min-h-screen relative">
      {/* Export Modal */}
      {/* {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          records={records}
        />
      )} */}

      {/* Add Record Modal
      {isAddModalOpen && (
        <AddSteamGenerationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onRecordAdded={fetchRecords}
        />
      )}

      {/* Edit Record Modal */}
      {/* {selectedRecord && isEditModalOpen && (
        <EditSteamGenerationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          record={selectedRecord}
          onRecordUpdated={fetchRecords}
        />
      )} */} 

      {/* Confirm Delete Modal */}
      {/* {recordToDelete && isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          message={`Are you sure you want to delete the record for shift ${recordToDelete.shiftSchedule?.shiftTitle} on ${recordToDelete.shiftSchedule?.date}?`}
        />
      )} */}

      <div className="bg-white rounded-xl shadow-lg p-8 text-gray-900">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">
            Steam Generation Records at {selectedPlant.plantName}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center p-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              <span>Add Record</span>
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

        {/* Steam Generation Table */}
        <SteamGenerationTable
          records={records}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
