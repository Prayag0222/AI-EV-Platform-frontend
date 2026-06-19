import { ActionCardType } from "@/types/dashboard";

export interface RevenueMetrics {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  lifetimeRevenue: number;
}

export interface QuickMetricsSummary {
  todayRepairs: number;
  activeTickets: number;
  completedTickets: number;
  criticalTickets: number;
  totalCustomers: number;
  totalVehicles: number;
  totalTechnicians: number;
  inventoryCount: number;
  totalInventoryValue: number;
}

export interface OwnerActionCard {
  id: string;
  title: string;
  count: number;
  description: string;
  type:ActionCardType;
}

export interface OwnerStatusColumn {
  label: string;
  count: number;
}

export interface TechnicianWorkloadSummary {
  id: string;
  name: string;
  specialization: string;
  activeJobs: number;
  completedToday: number;
  workload: 'AVAILABLE' | 'BUSY' | 'ON_LEAVE';
}

export interface InventoryAlertMetric {
  id: number;
  partName: string;
  stock: number;
  threshold: number;
  severity: 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK' | string;
}

export interface ConsolidatedActivityLog {
  id: string;
  type: 'TICKET' | 'INVOICE' | 'CUSTOMER' | string;
  description: string;
  timestamp: string;
}

export interface AutomatedBriefingInsight {
  insight: string;
  metricIncrease: string;
  mostAffectedModel: string;
  recommendedAction: string;
}

// Master interface representing the unified data payload structure
export interface OwnerDashboardPayload {
  metrics: {
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    lifetimeRevenue: number;
  };
  quickMetrics: QuickMetricsSummary;
  actionCards: OwnerActionCard[];
  operationsColumns: OwnerStatusColumn[];
  technicianSummary: TechnicianWorkloadSummary[];
  inventoryAlerts: Array<{
    id: number;
    partName: string;
    stock: number;
    threshold: number;
    severity: string;
  }>;
  recentActivity: ConsolidatedActivityLog[];
  aiBriefing: AutomatedBriefingInsight;
}