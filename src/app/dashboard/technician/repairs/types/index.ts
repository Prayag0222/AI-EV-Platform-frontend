// 📋 1. STRICT WORKBENCH WORKFLOW TYPES
// Using a literal string union locks down the dropdown selection choices
// so it is physically impossible to save a typo status string to the database.
export type WorkbenchStatus = "PENDING" | "DIAGNOSING" | "IN_SERVICE" | "RESOLVED" | "DELIVERED";

// 👥 2. NESTED RELATIONAL CUSTOMER MODEL
export interface CustomerInfo {
  name: string;
  phone: string;
}

// 🔧 3. CORE HIGH-DENSITY REPAIR TICKET CONTRACT
// This strictly maps to your live PostgreSQL database columns streaming over the network
export interface RepairTicket {
  id: number;
  vehicleModel: string;
  issueCategory: string;
  description: string;
  technicianNotes: string | null;
  status: WorkbenchStatus; // Enforces our strict workflow type constraints!
  customer: CustomerInfo;
  bay: string;
}

// ✨ 4. PRE-BUILT STAGE 2 AI ANALYSIS STATE CONTRACT
// Having this ready ensures our future intelligence models can plug straight in later!
export interface AiDiagnosticAnalysis {
  ticketId: number;
  possibleCauses: string[];
  safetyChecklist: { task: string; required: boolean }[];
  recommendedSteps: string[];
  confidenceScore: number; // e.g., 0.92 for 92% certainty matching past historical arrays
}

// 🧠 5. STATE ENGINE COMPONENT INTERACTION MANAGERS
// Defines exactly what variables and query functions travel through our feature loop
export interface RepairsEngineState {
  tickets: RepairTicket[];
  selectedTicket: RepairTicket | null;
  searchQuery: string;
  statusFilter: string;
  isLoading: boolean;
  saveSuccess: boolean;
  notice: string;
}