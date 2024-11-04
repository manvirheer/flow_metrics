// app/_types/SteamParameters.ts

import { Employee } from './Employee';
import { Plant } from './Plant';
import { ShiftSchedule } from './ShiftSchedule';

export interface SteamParameters {
  id: string;
  createdBy: Employee;
  updatedBy?: Employee;
  createdAt: string;
  updatedAt?: string;
  plant?: Plant;
  shiftSchedule?: ShiftSchedule;

  // Optional attributes
    plantId?: string;
    shiftScheduleId?: string;

  timeStart?: string;
  timeEnd?: string;
  steamPressure?: number;
  steamFlow?: number;
  steamTemperature?: number;
  elMeter?: number;
  stackTemperature?: number;
  feedWaterTemperature?: number;
  feedWaterMeterReading?: number;
  fuelPumpPr?: number;
  fuelPumpRtPr?: number;
  filterNumber?: number;
  feedWaterPr?: number;
  feedWaterPh?: number;
  feedWaterTds?: number;
  blowDownPh?: number;
  blowDownTds?: number;
}
