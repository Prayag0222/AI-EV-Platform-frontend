// src/app/technician/workspace/[ticketId]/types/index.ts

export type TicketStatus =
  | "PENDING"
  | "DIAGNOSING"
  | "IN_SERVICE"
  | "RESOLVED"
  | "DELIVERED"

export interface CustomerProfile {
  name: string;
  phone: string;
  memberSince?: string;
  pastRepairsCount: number;
}

export interface Technician{
    fullName:string;
}

export interface InspectionImage {
  id: string;
  label: string;
  url?: string;
  capturedAt?: string;
}

export interface TechnicianNote {
  id: number;
  ticketId: number;
  rawVoiceText: string;   // Original Hinglish transcription from Groq Whisper
  structuredText: string; // Clean English engineering sentence from Llama 3.3
  quickTags: string[];
  createdAt: string;
}

export interface AICopilotInsight {
  type: "cause" | "match" | "part" | "safety" | "test";
  label: string;
  title: string;
  body: string;
  confidenceScore?: number;
}

export interface RepairTicket {
  id: number;
  vehicleModel: string;
  issueCategory: string;
  customerComplaint: string;
  batteryPackSerial: string;
  batteryCapacity: string;
  batterySoh: number;
  batteryCycles: number;
  batteryTemp: string;
  vin: string;
  odometer: string;
  lastServiceDaysAgo: number;
  priority: "Critical" | "High" | "Standard";
  status: TicketStatus;
  customer: CustomerProfile;
  technician: Technician;
  estimatedCompletionTime: string;
  repairCost: string;
  assignedAt: string;
}