// _types/Employee.ts
export interface StaffDetails {
    a2pEmpId?: string;
    fatherName?: string;
    areaOfWork?: string;
    natureOfWork?: string;
  }

export interface Employee {
    [x: string]: any;
    id: string;
    email: string;
    password?: string;
    name: string;
    mobile: string;
    emergencyContactName?: string;
    emergencyContactPhoneNumber?: string;
    a2pEmpId?: string;
    fatherName?: string;
    areaOfWork?: string;
    natureOfWork?: string;
  }
  
  