"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp } from "lucide-react";

interface MetricProps {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "critical" | "warning" | "success";
}

const toneStyles = {
  critical: {
    icon: "text-red-600",
    bg: "bg-red-50",
    ring: "ring-red-100",
  },
  warning: {
    icon: "text-amber-600",
    bg: "bg-amber-50",
    ring: "ring-amber-100",
  },
  success: {
    icon: "text-emerald-600",
    bg: "bg-emerald-50",
    ring: "ring-emerald-100",
  },
  default: {
    icon: "text-indigo-600",
    bg: "bg-indigo-50",
    ring: "ring-indigo-100",
  },
};

export default function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: MetricProps) {
  const style =
    tone ? toneStyles[tone] : toneStyles.default;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -3,
      }}
      transition={{
        duration: 0.2,
      }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="p-4 sm:p-5">

        <div className="flex items-start justify-between">

          <div className="min-w-0">

            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {label}
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {value}
            </h2>

          </div>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.bg} ring-4 ${style.ring}`}
          >
            <Icon
              className={`h-5 w-5 ${style.icon}`}
            />
          </div>

        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">

          <p className="text-xs leading-5 text-slate-500">
            {detail}
          </p>

          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">

            <TrendingUp className="h-3 w-3 text-emerald-600" />

            <span className="text-[10px] font-semibold text-slate-600">
              Live
            </span>

          </div>

        </div>

      </div>
    </motion.article>
  );
}