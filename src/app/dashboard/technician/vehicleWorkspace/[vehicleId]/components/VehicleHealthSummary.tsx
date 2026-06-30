"use client";

import {
  Activity,
  AlertTriangle,
  Calendar,
  HeartPulse,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const score = healthSummary.healthScore ?? 0;

  const scoreConfig =
    score >= 85
      ? {
          color: "text-emerald-700",
          bg: "bg-emerald-50",
          label: "Excellent",
        }
      : score >= 70
      ? {
          color: "text-amber-700",
          bg: "bg-amber-50",
          label: "Moderate",
        }
      : {
          color: "text-red-700",
          bg: "bg-red-50",
          label: "Needs Attention",
        };

  const items = [
    {
      title: "Health Score",
      value:
        healthSummary.healthScore !== null
          ? `${healthSummary.healthScore}%`
          : "N/A",
      subtitle: scoreConfig.label,
      icon: HeartPulse,
      color: scoreConfig.color,
      bg: scoreConfig.bg,
    },
    {
      title: "Last Repair",
      value: formatDate(healthSummary.lastRepairDate),
      subtitle: "Recent repair record",
      icon: Calendar,
      color: "text-blue-700",
      bg: "bg-blue-50",
    },
    {
      title: "Last Service",
      value: formatTimeAgo(healthSummary.lastServiceDate),
      subtitle:
        healthSummary.lastServiceDaysAgo !== null
          ? `${healthSummary.lastServiceDaysAgo} days ago`
          : "Unknown",
      icon: Activity,
      color: "text-violet-700",
      bg: "bg-violet-50",
    },
    {
      title: "Active Issues",
      value: healthSummary.activeIssues,
      subtitle:
        healthSummary.activeIssues === 0
          ? "No active issues"
          : "Requires inspection",
      icon: AlertTriangle,
      color:
        healthSummary.activeIssues === 0
          ? "text-emerald-700"
          : "text-red-700",
      bg:
        healthSummary.activeIssues === 0
          ? "bg-emerald-50"
          : "bg-red-50",
    },
  ];

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/70">
        <CardTitle className="flex items-center gap-2 text-lg">
          <HeartPulse className="h-5 w-5 text-indigo-600" />
          Vehicle Health Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`rounded-2xl border border-slate-200 ${item.bg} p-4 transition-all hover:shadow-sm`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-white p-2 shadow-sm">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>

                <span
                  className={`text-2xl font-bold ${item.color}`}
                >
                  {item.value}
                </span>
              </div>

              <p className="text-sm font-semibold text-slate-900">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {item.subtitle}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}