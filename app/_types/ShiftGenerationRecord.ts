import { Plant } from './Plant';
import { Employee } from './Employee';
import { ShiftSchedule } from './ShiftSchedule';

// _types/SteamGenerationRecord.ts
export interface SteamGenerationRecord {
  id: string;
  createdAt: Date;         // Timestamp for when the record was created
  updatedAt: Date;         // Timestamp for the last update to the record
  createdBy: Employee;         // User who created the record
  updatedBy?: Employee | null; // User who last updated the record (nullable)
  plant: Plant;            // Associated Plant for this steam generation record
  shiftSchedule: ShiftSchedule; // Associated ShiftSchedule
  initialReading: number;  // Initial meter reading
  finalReading: number;    // Final meter reading
  steamGeneration: number; // Calculated steam generation amount
  remarks?: string | null; // Optional remarks or comments on the record
}
