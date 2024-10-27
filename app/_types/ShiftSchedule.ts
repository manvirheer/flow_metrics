// _types/ShiftSchedule.ts
import { ShiftTitle } from './ShiftTitle'; // Ensure that the file './ShiftTitle.ts' exists in the same directory
import { ShiftPosting } from './ShiftPosting';
import { Plant } from './Plant';

export interface ShiftSchedule {
  id: string;
  shiftTitle: ShiftTitle;
  date: string;
  startTime: string;
  endTime: string;
  plant: Plant;
  shiftPostings?: ShiftPosting[];
}
