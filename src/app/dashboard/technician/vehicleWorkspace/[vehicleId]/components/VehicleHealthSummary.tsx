"use client";

import { Activity, AlertTriangle, Calendar, HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimeAgo } from "../utils/formatTimeAgo";

interface VehicleHealthSummaryProps {
  healthSummary: {
    healthScore: number | null;
    lastRepairDate: string | null;
    lastServiceDaysAgo: number | null;
    lastServiceDate: string | null;
    activeIssues: number;
  };
}

export function VehicleHealthSummary({
  healthSummary,
}: VehicleHealthSummaryProps) {
  const formatDate = (date: string | null) => {
    if (!date) return "Not Available";

    return new Date(date).toLocaleDateString();
  };

  console.log(healthSummary.lastServiceDaysAgo);
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Vehicle Health Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
            <span>Health Score</span>
          </div>

          <span className="font-semibold">
            {healthSummary.healthScore ?? "N/A"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Last Repair</span>
          </div>

          <span className="font-semibold">
            {formatDate(healthSummary.lastRepairDate)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span>Last Service</span>
          </div>

          <span className="font-semibold">
            {formatTimeAgo(
  healthSummary.lastServiceDate
)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <span>Active Issues</span>
          </div>

          <span className="font-semibold">
            {healthSummary.activeIssues}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}