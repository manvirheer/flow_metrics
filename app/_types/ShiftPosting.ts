import { Employee } from "./Employee";
import { ShiftSchedule } from "./ShiftSchedule";

// _types/ShiftPosting.ts
export interface ShiftPosting {
  id: string;
  createdAt: string;
  updatedAt: string;
  shiftSchedule: ShiftSchedule;
  staff: Employee;
  createdBy: Employee;
  updatedBy?: Employee | null;
}
