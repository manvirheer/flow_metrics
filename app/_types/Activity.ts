import { Employee } from "./Employee";
import { Plant } from "./Plant";
import { ShiftSchedule } from "./ShiftSchedule";

export interface Activity {
  activityId: string;
  shiftScheduleId?: string;
  activityDetails: string;
  plantId?: string;
  plant?: Plant; 
  createdBy?: Employee;
  updatedBy?: Employee;
  createdAt?: string;
  updatedAt?: string;
  shiftSchedule?: ShiftSchedule;
}
