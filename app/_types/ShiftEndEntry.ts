export interface ShiftEndEntryData {
    briquetteConsumption: number; // In Kgs
    ashGenerated: number;         // In Kgs
    steamGenerationFinalReading: number; // In Kgs
    steamGenerationInitialReading?: number; // In Kgs, optional based on previous shift
}
