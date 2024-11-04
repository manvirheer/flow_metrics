import { Employee } from './Employee';
import { Plant } from './Plant';
import { ShiftSchedule } from './ShiftSchedule';

export interface Shipment {
  id: string;
  plant?: Plant;
  shiftSchedule?: ShiftSchedule;
  shiftScheduleId? : string;
  plantId?: string;
  createdBy: Employee;
  updatedBy?: Employee;
  createdAt: string;
  updatedAt?: string;
  recordDate: string;
  recordTime: string;
  vehicleNo: string;
  incomingBriquetteWeight: number;
  incomingStockGCV: number;
  supplier: string;
  pricePerMT: number;
  remarks?: string;
  serialNumber?: number;
}
