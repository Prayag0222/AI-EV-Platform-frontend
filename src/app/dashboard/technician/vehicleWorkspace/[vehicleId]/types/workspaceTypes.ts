export interface VehicleWorkspaceTimelineItem {
  id: number;
  status: string;
  ticketId: number;
  createdAt: string;
}

export interface VehicleWorkspaceStatistics {
  totalRepairs: number;
  totalRevenue: number;
  totalPartsConsumed: number;
  averageRepairCost: number;
}

export interface VehicleHealthSummary {
  healthScore: number | null;
  lastServiceDate: string | null;
  lastRepairDate: string | null;
  lastServiceDaysAgo: number | null;
  activeIssues: number;
}

export interface VehicleWorkspaceData {
  vehicle: any;
  activeTicket: any;
  timeline: VehicleWorkspaceTimelineItem[];
  statistics: VehicleWorkspaceStatistics;
  healthSummary: VehicleHealthSummary;
}