export type TicketStatus = "PENDING" | "DIAGNOSING" | "IN_SERVICE" | "RESOLVED" ;
export type TicketPriority = "LOW" | "STANDARD" | "HIGH" | "URGENT";

export interface CustomerProfile {
  name: string;
  phone: string;
  memberSince?: string;
  pastRepairsCount?: number;
}

export interface Technician { fullName: string; }
export interface TimelineEvent { id: number; status: string; createdAt: string; }

export interface TechnicianNote {
  id: number;
  ticketId: number;
  rawVoiceText?: string | null;
  structuredText: string;
  quickTags: string[];
  imageUrls?: string[];
  createdAt: string;
}

export interface TicketVehicle {
  vehicleModel: string;
  vin: string;
  batteryPackSerial?: string | null;
  batteryCapacity?: string | null;
  batterySoh?: number | null;
  batteryCycles?: number | null;
  batteryTemp?: string | null;
  odometer?: string | null;
  lastServiceDaysAgo?: number | null;
}

export interface InventoryItem {
  id: number;
  partName: string;
  sku: string;
  category: string;
  stockLevel: number;
  retailPrice: number;
}

export interface UsedPart {
  id: number;
  ticketId: number;
  inventoryId: number;
  quantity: number;
  lockedCost: number;
  createdAt: string;
  inventoryItem: Pick<InventoryItem, "partName" | "sku" | "retailPrice">;
}

export interface RepairTicket {
  id: number;
  issueCategory: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  closedAt?: string | null;
  estimatedCost?: number | null;
  finalCost?: number | null;
  laborHours: number;
  laborRate: number;
  taxRate: number;
  discount: number;
  customer: CustomerProfile;
  technician?: Technician | null;
  vehicle?: TicketVehicle | null;
  timeline: TimelineEvent[];
  notes: TechnicianNote[];
  parts: UsedPart[];
  vehicleModel: string;
  customerComplaint: string;
  batteryPackSerial: string;
  batteryCapacity: string;
  batterySoh: number;
  batteryCycles: number;
  batteryTemp: string;
  vin: string;
  odometer: string;
  lastServiceDaysAgo: number;
  estimatedCompletionTime: string;
  repairCost: string;
  assignedAt: string;
}

export interface InspectionImage { id: string; label: string; url?: string; capturedAt?: string; }
export interface AICopilotInsight { type: "cause" | "match" | "part" | "safety" | "test"; label: string; title: string; body: string; confidenceScore?: number; }

export interface RepairCostInput {
  estimatedCost: number;
  laborHours: number;
  laborRate: number;
  taxRate: number;
  discount: number;
}

export interface RepairCostTotals {
  partsTotal: number;
  laborTotal: number;
  subtotal: number;
  taxAmount: number;
  discount: number;
  grandTotal: number;
}
