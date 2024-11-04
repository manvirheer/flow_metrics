export interface InventoryRecord {
    id: string;
    shipment?: any; // Replace 'any' with the actual Shipment type if available
    createdBy: {
      id: string;
      name: string;
      email: string;
    };
    updatedBy?: {
      id: string;
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
    plant: {
      plantId: string;
      plantName: string;
    };
    shiftSchedule: {
      id: string;
      shiftTitle: string;
      date: string;
      startTime: string;
      endTime: string;
    };
    recordDate: string;
    recordTime: string;
    recordType: string;
    initialValue: number;
    consumption?: number;
    addition?: number;
    finalValue?: number;
    details?: string;
  }
  