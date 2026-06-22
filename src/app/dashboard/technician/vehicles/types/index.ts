export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface VehicleTelemetryData {
  id: number;
  vin: string;
  vehicleModel: string;
  batteryPackSerial: string | null;  // ✨ Registered cleanly
  batteryCapacity: string | null;
  batterySoh: number | null;         // Database Int
  batteryCycles: number | null;       // Database Int
  batteryTemp: string | null;
  odometer: string | null;
  lastServiceDaysAgo: number | null; // Database Int
}

export interface RepairingVehicleTicket {
  id: number;
  status: string;
  issueCategory: string;
  bay: string | null;
  createdAt: string;
  customer: CustomerInfo;
  vehicle: VehicleTelemetryData;
}