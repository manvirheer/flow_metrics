// app/_utils/shiftUtils.ts
import { ShiftSchedule } from "../_types/ShiftSchedule";

/**
 * Determines the previous shift based on the current shift title.
 * @param currentShiftTitle - The title of the current shift (e.g., "B")
 * @returns The title of the previous shift (e.g., "A")
 */
export const getPreviousShiftTitle = (currentShiftTitle: string): string => {
  const shiftOrder = ['A', 'B', 'C']; // Define shift order as per business logic
  const currentIndex = shiftOrder.indexOf(currentShiftTitle.toUpperCase());
  if (currentIndex > 0) {
    return shiftOrder[currentIndex - 1];
  }
  // If current shift is the first, return the last shift of the previous day
  return shiftOrder[shiftOrder.length - 1];
};
