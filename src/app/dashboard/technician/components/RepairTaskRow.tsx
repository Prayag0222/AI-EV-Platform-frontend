"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RepairTicket {
  id: number;
  customer: {
    name: string;
  };
  vehicleModel: string;
  issueCategory: string;
  description: string;
  status: string;
  bay: string;
}

interface RepairTaskRowProps {
  repair: RepairTicket;
  expanded: boolean;
  onExpand: () => void;
  onAdvance: (newStatus: string) => void;
  onOpenDetails: () => void;
}

const statusStyles: Record<
  string,
  {
    badge: string;
    text: string;
  }
> = {
  PENDING: {
    badge:
      "bg-slate-100 border border-slate-200 text-slate-700",
    text: "text-slate-600",
  },
  DIAGNOSING: {
    badge:
      "bg-yellow-50 border border-yellow-200 text-yellow-700",
    text: "text-yellow-700",
  },
  IN_SERVICE: {
    badge:
      "bg-amber-50 border border-amber-200 text-amber-700",
    text: "text-amber-700",
  },
  RESOLVED: {
    badge:
      "bg-blue-50 border border-blue-200 text-blue-700",
    text: "text-blue-700",
  },
  DELIVERED: {
    badge:
      "bg-emerald-50 border border-emerald-200 text-emerald-700",
    text: "text-emerald-700",
  },
};

export default function RepairTaskRow({
  repair,
  expanded,
  onExpand,
  onAdvance,
  onOpenDetails,
}: RepairTaskRowProps) {
  const [localStatus, setLocalStatus] =
    useState(repair?.status || "PENDING");

  const [prevStatus, setPrevStatus] =
    useState(repair?.status || "PENDING");

  if (!repair) return null;

  if (repair.status !== prevStatus) {
    setPrevStatus(repair.status);
    setLocalStatus(repair.status);
  }

  const style =
    statusStyles[localStatus] ??
    statusStyles.PENDING;

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -2,
      }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-white shadow-sm transition-all",
        expanded
          ? "border-emerald-300 shadow-lg"
          : "border-slate-200 hover:border-emerald-200 hover:shadow-md"
      )}
    >
      {/* ---------- Header ---------- */}

      <div className="p-4 sm:p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Left */}

          <div className="min-w-0 flex-1">

            <div className="mb-3 flex flex-wrap items-center gap-2">

              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
                {repair.bay || "No Bay"}
              </span>

              <span
                className={cn(
                  "rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
                  style.badge
                )}
              >
                {localStatus.replace("_", " ")}
              </span>

            </div>

            <h3 className="line-clamp-1 text-lg font-bold text-slate-900 sm:text-xl">
              {repair.issueCategory ||
                "General Inspection"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-800">
                {repair.vehicleModel ||
                  "EV Vehicle"}
              </span>

              {" • "}

              {repair.customer?.name ??
                "Unknown Customer"}
            </p>

          </div>

          {/* Right */}

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

            <select
              value={localStatus}
              onChange={(e) => {
                setLocalStatus(
                  e.target.value
                );

                onAdvance(
                  e.target.value
                );
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold shadow-sm outline-none transition focus:border-emerald-500 sm:min-w-[180px]"
            >
              <option value="PENDING">
                PENDING
              </option>

              <option value="DIAGNOSING">
                DIAGNOSING
              </option>

              <option value="IN_SERVICE">
                IN SERVICE
              </option>

              <option value="RESOLVED">
                RESOLVED
              </option>

              <option value="DELIVERED">
                DELIVERED
              </option>
            </select>

            <Button
              variant="outline"
              size="icon"
              onClick={onExpand}
              className="h-10 w-10 shrink-0 rounded-xl"
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  expanded &&
                    "rotate-180"
                )}
              />
            </Button>

          </div>

        </div>

      </div>

      {/* ---------- Expand ---------- */}

      <AnimatePresence>

        {expanded && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="overflow-hidden border-t border-slate-200 bg-slate-50"
          >
            <div className="grid gap-5 p-4 sm:grid-cols-2 xl:grid-cols-4">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Latest Finding
                </p>

                <p className="mt-2 text-sm font-medium text-slate-800">
                  DTC P0AA6 Isolation Fault
                </p>

              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Safety State
                </p>

                <p className="mt-2 text-sm font-medium text-slate-800">
                  Pack Isolated
                </p>

              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Description
                </p>

                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {repair.description ||
                    "No technical description logged."}
                </p>

              </div>

              <div className="flex items-end sm:justify-end">

                <Button
                  onClick={
                    onOpenDetails
                  }
                  className="w-full rounded-xl bg-[#0C5C3C] text-white hover:bg-[#09462f] sm:w-auto"
                >
                  Open Workbench
                </Button>

              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.article>
  );
}