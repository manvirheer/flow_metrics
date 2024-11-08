import { ShiftSchedule } from "./ShiftSchedule";

export interface SteamParametersBasic {
  id: string;
  createdAt: string;
  updatedAt: string;
  timeStart: string;
  timeEnd: string;
  steamPressure: number;
  steamFlow: number;
  steamTemperature: number;
  elMeter: number;
  stackTemperature: number;
  feedWaterTemperature: number;
  feedWaterMeterReading: number;
  fuelPumpPr: number;
  fuelPumpRtPr: number;
  filterNumber: number;
  feedWaterPr: number;
  feedWaterPh: number;
  feedWaterTds: number;
  blowDownPh: number;
  blowDownTds: number;
  shiftSchedule: ShiftSchedule;
}

export interface SteamParametersUpdate {
  id: string;
  timeStart: string;
  timeEnd: string;
  steamPressure: number;
  steamFlow: number;
  steamTemperature: number;
  elMeter: number;
  stackTemperature: number;
  feedWaterTemperature: number;
  feedWaterMeterReading: number;
  fuelPumpPr: number;
  fuelPumpRtPr: number;
  filterNumber: number;
  feedWaterPr: number;
  feedWaterPh: number;
  feedWaterTds: number;
  blowDownPh: number;
  blowDownTds: number;
}

export interface BulkUpdateSteamParameters {
  updates: SteamParametersUpdate[];
}