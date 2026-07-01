"use client";

import { motion } from "framer-motion";
import { ChevronRight, LucideIcon } from "lucide-react";
import React, { ReactNode } from "react";

import { Button } from "@/components/ui/button_temp";

interface BriefingCardProps {
  icon: LucideIcon;
  title: string;
  action: string;
  children: ReactNode;
}

export default function BriefingCard({
  icon: Icon,
  title,
  action,
  children,
}: BriefingCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Icon className="h-5 w-5 text-indigo-600" />
          </div>

          <div className="min-w-0">

            <h2 className="truncate text-sm font-semibold text-slate-900">
              {title}
            </h2>

            <p className="text-[11px] text-slate-500">
              Technician Briefing
            </p>

          </div>

        </div>

        <Button
          variant="ghost"
          size="sm"
          className="hidden h-9 gap-1 rounded-xl px-3 text-xs font-medium text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 sm:flex"
        >
          {action}

          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

      </div>

      <div className="space-y-3 p-4 sm:p-5">
        {children}
      </div>

      <div className="border-t border-slate-100 p-3 sm:hidden">

        <Button
          variant="ghost"
          className="w-full justify-between rounded-xl text-sm text-indigo-600 hover:bg-indigo-50"
        >
          {action}

          <ChevronRight className="h-4 w-4" />
        </Button>

      </div>

    </motion.section>
  );
}