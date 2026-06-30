export interface OperationalSummary {
  active: number;
  urgentBatteryCases: number;
}

export type ActionCardType =
  | "urgent"
  | "parts"
  | "capacity"
  | "warning";

export interface PriorityActionCard {
  id: string;
  title: string;
  count: number;
  description: string;
  type: ActionCardType;
}

export interface AIBriefing {
  insight: string;
  metricIncrease: string;
  mostAffectedModel: string;
  recommendedAction: string;
}

export interface StatusColumn {
  label: string;
  count: number;
}