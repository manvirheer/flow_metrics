// app/shipments/page.tsx

'use client';

import React, { useState, useContext, act } from 'react';
import ProtectedRoute from '../../_components/ProtectedRoute';
import useShipments from './hooks/useShipments';
import ShiftDetails from '../../staff/shift-end-entry/components/ShiftDetails'; // Adjust the import path based on your folder structure
import ShipmentTable from './components/ShipmentTable';
import ConfirmSubmitModal from './components/ConfirmSubmitModal';
import { Plant, Shipment } from './types';
import useActiveShift from './hooks/useActiveShift';
import { PlantContext } from '@/app/_contexts/PlantContext';

const ShipmentPage: React.FC = () => {
    const { shipments, loading, addShipment, updateShipment, deleteShipment } = useShipments();
    const { activeShift, activeShiftLoading } = useActiveShift();
    const { selectedPlant } = useContext(PlantContext);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('Confirm Action');
    const [currentShipmentData, setCurrentShipmentData] = useState<Partial<Shipment>>({});
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);


    const handleAdd = (data: Partial<Shipment>) => {
        setModalTitle('Confirm Add Shipment');
        setModalMessage('Are you sure you want to add this shipment?');
        setCurrentShipmentData(data);
        setIsModalOpen(true);
    };

    const confirmAction = async () => {
        await addShipment(currentShipmentData);
        setIsModalOpen(false);
        setSelectedShipment(null);
        setCurrentShipmentData({});
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl text-gray-700">Loading Shipments...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            {activeShift ? (
                <>
                    {/* Active Shift Details */}
                    <ShiftDetails activeShift={activeShift} />

                    {/* Shipments Table */}
                    <ShipmentTable
                        shipments={shipments}
                        onAdd={handleAdd}
                        onUpdate={updateShipment}
                        onDelete={deleteShipment}
                        activeShift={activeShift}
                        plant={selectedPlant ?? ({} as Plant)}
                    />

                    {/* Confirmation Modal */}
                    <ConfirmSubmitModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={confirmAction}
                        title={modalTitle}
                        message={modalMessage}
                    />
                </>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                        No Active Shift / कोई सक्रिय शिफ्ट नहीं
                    </h1>
                    <p className="text-gray-600 text-center">
                        You do not have any active shift postings at this time.
                    </p>
                </div>
            )}
        </div>
    );
    
};

const ShipmentPageWrapper = (): JSX.Element => {
    return (
        <ProtectedRoute roles={['Admin', 'Staff']}>
            <ShipmentPage />
        </ProtectedRoute>
    );
};

export default ShipmentPageWrapper;
