"use client";

import {
  IndianRupee,
  Package,
  TrendingUp,
  Wrench,
} from "lucide-react";

interface VehicleStatisticsPanelProps {
  statistics: {
    totalRepairs: number;
    totalRevenue: number;
    totalPartsConsumed: number;
    averageRepairCost: number;
  };
}

export function VehicleStatisticsPanel({
  statistics,
}: VehicleStatisticsPanelProps) {
  const cards = [
    {
      title: "Total Repairs",
      value: statistics.totalRepairs,
      icon: Wrench,
      gradient:
        "from-blue-500/10 to-indigo-500/10",
      iconBg:
        "bg-blue-100 text-blue-600",
    },
    {
      title: "Revenue Generated",
      value: `₹${statistics.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      gradient:
        "from-emerald-500/10 to-green-500/10",
      iconBg:
        "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Parts Consumed",
      value: statistics.totalPartsConsumed,
      icon: Package,
      gradient:
        "from-amber-500/10 to-orange-500/10",
      iconBg:
        "bg-amber-100 text-amber-600",
    },
    {
      title: "Avg Repair Cost",
      value: `₹${statistics.averageRepairCost.toLocaleString()}`,
      icon: TrendingUp,
      gradient:
        "from-violet-500/10 to-purple-500/10",
      iconBg:
        "bg-violet-100 text-violet-600",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${card.gradient} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 h-1 w-full rounded-full bg-slate-100">
              <div className="h-1 w-2/3 rounded-full bg-slate-300" />
            </div>
          </div>
        );
      })}
    </div>
  );
}