"use client";

import { motion } from "framer-motion";
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
      value: statistics.totalRepairs.toLocaleString(),
      subtitle: "Completed repair jobs",
      icon: Wrench,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      accent: "bg-blue-500",
    },
    {
      title: "Revenue Generated",
      value: `₹${statistics.totalRevenue.toLocaleString()}`,
      subtitle: "Lifetime repair revenue",
      icon: IndianRupee,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      accent: "bg-emerald-500",
    },
    {
      title: "Parts Consumed",
      value: statistics.totalPartsConsumed.toLocaleString(),
      subtitle: "Inventory utilized",
      icon: Package,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      accent: "bg-amber-500",
    },
    {
      title: "Average Repair",
      value: `₹${statistics.averageRepairCost.toLocaleString()}`,
      subtitle: "Average repair cost",
      icon: TrendingUp,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-100",
      accent: "bg-violet-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.05,
              duration: 0.25,
            }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Accent */}
            <div
              className={`absolute inset-x-0 top-0 h-1 ${card.accent}`}
            />

            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h3 className="mt-3 truncate text-3xl font-bold tracking-tight text-slate-900">
                  {card.value}
                </h3>

                <p className="mt-2 text-xs text-slate-500">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.iconBg}`}
              >
                <Icon
                  className={`h-6 w-6 ${card.iconColor}`}
                />
              </div>
            </div>

            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full w-2/3 rounded-full transition-all duration-500 group-hover:w-full ${card.accent}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}