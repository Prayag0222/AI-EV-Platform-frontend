"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarClock,
  Clock3,
  MapPin,
  Phone,
  UserCog,
} from "lucide-react";

import { cn } from "@/lib/utils";

import type {
  RepairTicket,
  TicketPriority,
} from "../types";

import { getStatusStyle } from "../utils/statusTheme";

const priorityStyle: Record<TicketPriority, string> = {
  LOW: "bg-slate-100 text-slate-700 border-slate-200",
  STANDARD: "bg-blue-50 text-blue-700 border-blue-200",
  HIGH: "bg-amber-50 text-amber-700 border-amber-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
};

const initials = (name?: string) =>
  (name || "Unassigned")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const formatDate = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not Recorded";

interface RepairSelectionCardProps {
  ticket: RepairTicket;
  isActive: boolean;
}

export default function RepairSelectionCard({
  ticket,
  isActive,
}: RepairSelectionCardProps) {
  const status = getStatusStyle(ticket.status);

  const vehicleModel =
    ticket.vehicle?.vehicleModel ??
    ticket.vehicleModel ??
    "Vehicle Not Linked";

  const technician =
    ticket.technician?.fullName ??
    "Unassigned";

  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white p-3 sm:p-4 lg:p-5 transition-all",
        isActive
          ? "border-[#0C5C3C] ring-1 ring-[#0C5C3C]/20 shadow-lg shadow-emerald-100"
          : "border-slate-200 hover:border-[#0C5C3C]/30 hover:shadow-md"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-repair-card"
          className="absolute inset-y-0 left-0 w-1 rounded-full bg-[#0C5C3C]"
        />
      )}

      {/* Header */}

      <div className="flex items-start justify-between gap-2">

        <div className="flex flex-wrap items-center gap-1.5">

          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 font-mono text-[10px] sm:text-xs font-bold text-slate-700">
            EV-{ticket.id.toString().padStart(4, "0")}
          </span>

          <span
            className={cn(
              "rounded-md border px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider",
              priorityStyle[ticket.priority ?? "STANDARD"]
            )}
          >
            {ticket.priority ?? "STANDARD"}
          </span>

        </div>

        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider",
            status.badge
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              status.dot
            )}
          />

          {ticket.status.replace("_", " ")}

        </span>

      </div>

      {/* Body */}

      <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_230px]">

        {/* Left */}

        <div className="min-w-0">

          <h3 className="truncate text-base sm:text-lg font-bold text-slate-900">
            {ticket.customer?.name ??
              "Unknown Customer"}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs sm:text-sm text-slate-500">

            <Phone className="h-3.5 w-3.5 shrink-0" />

            <span className="truncate">
              {ticket.customer?.phone ??
                "No Contact"}
            </span>

          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">

            <p className="truncate text-sm font-semibold text-slate-900">
              {vehicleModel}
            </p>

            <p className="mt-1 truncate font-mono text-[10px] sm:text-xs text-slate-500">
              VIN •{" "}
              {ticket.vehicle?.vin ??
                "Not Available"}
            </p>

            <div className="mt-3">

              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Issue
              </span>

              <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-slate-700">
                {ticket.issueCategory ??
                  "General Diagnostics"}
              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="grid gap-3 text-xs sm:text-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0C5C3C] text-xs font-bold text-white">
              {initials(technician)}
            </div>

            <div className="min-w-0">

              <span className="text-[9px] uppercase tracking-wider text-slate-500">
                Technician
              </span>

              <p className="truncate font-semibold text-slate-900">
                {technician}
              </p>

            </div>

          </div>

          <div className="grid gap-2 text-[11px] sm:text-xs text-slate-600">

            <div className="flex items-start gap-2">

              <CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0" />

              <span className="leading-5">
                <b>Created</b>
                <br />
                {formatDate(ticket.createdAt)}
              </span>

            </div>

            <div className="flex items-start gap-2">

              <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0" />

              <span className="leading-5">
                <b>Updated</b>
                <br />
                {formatDate(ticket.updatedAt)}
              </span>

            </div>

            {ticket.bay && (
              <div className="flex items-center gap-2">

                <MapPin className="h-3.5 w-3.5 shrink-0" />

                <span>
                  <b>Bay</b> • {ticket.bay}
                </span>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Footer */}

      <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">

          <UserCog className="h-3.5 w-3.5" />

          Ready for technician workspace

        </div>

        <motion.div
          whileHover={{ x: 3 }}
          className="ml-auto flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0C5C3C]"
        >
          Open

          <ArrowUpRight className="h-4 w-4" />

        </motion.div>

      </div>
    </motion.article>
  );
}