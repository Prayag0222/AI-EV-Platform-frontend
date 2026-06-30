export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface Technician {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  specialization: string;
  status: string;
  experienceYears: string;
  address: string | null;
}

export interface RepairTicket {
  id: number;
  vehicleModel: string;
  issueCategory: string;
  description: string;
  technicianNotes: string | null;
  status: string;

  customer: CustomerInfo;

  technicianId?: string | null;

  createdAt: string;
  updatedAt?: string;

  technician?: Technician | null;
}

export interface StatusAppearance {
  bg: string;
  text: string;
  dot: string;
}