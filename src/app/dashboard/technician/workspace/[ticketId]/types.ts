// Define the nested structures first
interface CustomerInfo {
  name: string;
  phone: string;
  vehicleModel: string;
}

interface TimelineEvent {
  id: number;
  status: string;
  createdAt: string;
}

interface TechnicianNote {
  id: number;
  structuredText: string;
  quickTags: string[];
  createdAt: string;
}

interface UsedPart {
  id: number;
  quantity: number;
  inventoryItem: {
    partName: string;
    sku: string;
  };
}

export interface RepairTicketData {
  id: number;
  vehicleModel: string;
  issueCategory: string;
  status: string;
  customer: {
    name: string;
    phone: string;
  };
  timeline: Array<{
    id: number;
    status: string;
    createdAt: string;
  }>;
  notes: Array<{
    id: number;
    structuredText: string;
    createdAt: string;
  }>;
  parts: Array<{
    id: number;
    inventoryItem: {
      partName: string;
    };
  }>;
}