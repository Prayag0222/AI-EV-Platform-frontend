// src/app/technician/workspace/[ticketId]/components/TicketHeader.tsx
"use client";

import React from "react";
import { ChevronRight, AlertTriangle, Activity, History, ArrowRight } from "lucide-react";
import type { RepairTicket } from "../types/index";
import { useRepairWorkspace } from "../hooks/useRepairWorkspace";

interface TicketHeaderProps {
  ticket: RepairTicket;
}



export function TicketHeader({ ticket }: TicketHeaderProps) {
  // Map our dynamic alert weights straight into your light theme tokens
  const priorityStyles = {
    Critical: "bg-red-50 text-red-600 border-red-200/60",
    High: "bg-amber-50 text-amber-600 border-amber-200/60",
    Standard: "bg-slate-50 text-slate-600 border-slate-200/60",
  };

const {technician} = useRepairWorkspace()



  return (
    <section className="space-y-3 font-sans">
      {/* Dynamic Sub-Breadcrumb Rail */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span>Workspace</span>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span>Active Repairs</span>
        <ChevronRight className="h-3 w-3 text-slate-300" />
        <span className="text-slate-800 font-semibold">Ticket #RT-{ticket.id}</span>
      </div>

      {/* Primary Data Row Grid */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pt-1">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              RT-{ticket.id}
            </h1>
            
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityStyles[ticket.priority]}`}>
              <AlertTriangle className="h-3 w-3" />
              {ticket.priority} Priority
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100">
              <Activity className="h-3 w-3" />
              {ticket.status}
            </span>
          </div>

          <p className="text-[14px] sm:text-[15px] text-slate-500 font-medium">
            <span className="text-slate-900 font-semibold">{ticket.customer.name}</span>
            <span className="mx-2 text-slate-300">·</span>
            {ticket.vehicleModel}
            <span className="mx-2 text-slate-300">·</span>
            Battery <span className="font-mono text-xs text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/40">{ticket.batteryPackSerial}</span>
            <span className="hidden sm:inline mx-2 text-slate-300">·</span>
            <span className="hidden sm:inline">Assigned to <span className="text-slate-800 font-semibold">{technician}</span></span>
          </p>
        </div>

        {/* Action Controls Side Matrix */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="h-10 px-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold flex items-center gap-2 text-slate-600 transition shadow-sm">
            <History className="h-4 w-4 text-slate-400" /> View Logs
          </button>
          <button className="h-10 px-4 rounded-xl bg-slate-900 text-white hover:opacity-90 text-xs font-semibold flex items-center gap-2 transition shadow-sm">
            Complete Repair <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}