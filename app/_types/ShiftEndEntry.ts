export interface ShiftEndEntryData {
    briquetteConsumption: number; // In Kgs
    ashGenerated: number;         // In Kgs
    steamGenerationFinalReading: number; // In Kgs
    steamGenerationInitialReading?: number;
    shiftScheduleId?: string;     // Changed from number to string
    plantId?: string;            // Changed from number to string
    remarks?: string;
    date?: string;
    shiftTitle?: string;
}