export interface Vehicle {
  id: string;
  vehicleModel: string;
  vin: string;
  modelYear: number;
  manufacturer: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  createdAt: string;
  vehicles: Vehicle[]; // Note: This is an array now, not a flat string
}