import { Employee } from './Employee';
import { Plant } from './Plant';
import { ShiftSchedule } from './ShiftSchedule';

export interface Ash {
  id: string;
  createdBy: Employee;
  updatedBy?: Employee;
  createdAt: string;
  updatedAt?: string;
  plant: Plant;
  shiftSchedule: ShiftSchedule;
  ashGenerated: number;
}
