// app/_contexts/PlantContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '../_utils/axios';
import { AuthContext } from './AuthContext'; // Import AuthContext

interface Plant {
    id: string;
    name: string;
    plantId: string;
    plantName: string;
    plantAddress: string;
    plantContactPerson: string;
    createdAt: string;
    updatedAt: string;
}

interface PlantContextType {
    plants: Plant[];
    selectedPlant: Plant | null;
    setSelectedPlant: (plant: Plant) => void;
}

export const PlantContext = createContext<PlantContextType>({
    plants: [],
    selectedPlant: null,
    setSelectedPlant: () => { },
});

export const PlantProvider = ({ children }: { children: ReactNode }) => {
    const { user, loading: authLoading } = useContext(AuthContext); // Use AuthContext
    const [plants, setPlants] = useState<Plant[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

    useEffect(() => {
        const fetchPlants = async () => {
            if (user && !authLoading) { // Only fetch plants if the user is logged in
                try {
                    if (user.role === 'Staff') {
                        console.log('Fetching plants for staff');
                        const response = await api.get('/plants/staff/' + user.id)
                        console.log('Fetched plants', response.data);
                        const plant = await api.get('/plants/' + response.data);
                        console.log('Fetched plant', plant.data);
                        setPlants([plant.data]);
                        setSelectedPlant(plant.data);

                    }
                    else {
                        const response = await api.get('/plants');
                        console.log('Fetched plants', response.data);
                        setPlants(response.data);
                        // Optionally, set the first plant as the default selected plant
                        if (response.data.length > 0) {
                            setSelectedPlant(response.data[0]);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch plants', error);
                }
            }
        };

        fetchPlants();
    }, [user, authLoading]); // Fetch plants whenever the auth state changes

    return (
        <PlantContext.Provider value={{ plants, selectedPlant, setSelectedPlant }}>
            {children}
        </PlantContext.Provider>
    );
};
