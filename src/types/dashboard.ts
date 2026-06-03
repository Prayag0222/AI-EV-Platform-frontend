// 1. Core Top-Level Metric Summary
export interface OperationalSummary {
    active : number;
    urgentBatteryCases:number;
}
// 2. The Priority Action Center Cards
// Restricting 'type' prevents accidental layout mismatches or color breakin
export type ActionCardType = 'urgent' | 'parts' | 'capacity' | 'warning';

export interface PriorityActionCard {
id: string;
title: string;
  count: string | number; // Handles percentages like '98%' or numbers like 3
description: string;
type: ActionCardType;
}

// 3. The Isolated High-Intelligence AI Briefing Module
export interface AIBriefing {
insight: string;
  metricIncrease: string; // e.g., "17% this week."
  mostAffectedModel: string; // e.g., "XYZ Scooter V2"
recommendedAction: string;
}

// 4. The Bottom Operational Flow Status Trackers
export interface StatusColumn {
label: string; // e.g., "NEW REPAIRS", "IN DIAGNOSIS"
count: number;
}