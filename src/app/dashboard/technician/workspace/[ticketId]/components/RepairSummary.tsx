// src/app/technician/workspace/[ticketId]/components/RepairSummary.tsx
"use client";

import React from "react";
import { 
  AlertTriangle, ShieldCheck, Zap, CircleDollarSign, Clock, CheckCircle2, ChevronRight 
} from "lucide-react";
import type { RepairTicket } from "../types/index";

interface RepairSummaryProps {
  ticket: RepairTicket;
}

export function RepairSummary({ ticket }: RepairSummaryProps) {
  // Define a localized structural blueprint for our info grid
  const items = [
    { 
      label: "Issue Category", 
      value: ticket.issueCategory, 
      icon: <AlertTriangle className="h-4 w-4 text-slate-400" /> 
    },
    { 
      label: "Warranty Status", 
      value: "Active · 14 mo left", // Static fallback or dynamic if mapped
      icon: <ShieldCheck className="h-4 w-4 text-emerald-500" /> 
    },
    { 
      label: "Ticket Priority", 
      value: `${ticket.priority} Weight`, 
      icon: <Zap className="h-4 w-4 text-amber-500" /> 
    },
    { 
      label: "Estimated Cost", 
      value: ticket.repairCost, 
      icon: <CircleDollarSign className="h-4 w-4 text-slate-400" /> 
    },
    { 
      label: "Assigned Timestamp", 
      value: ticket.assignedAt || "Today · 09:12", 
      icon: <Clock className="h-4 w-4 text-slate-400" /> 
    },
    { 
      label: "Est. Completion (ETC)", 
      value: ticket.estimatedCompletionTime, 
      icon: <CheckCircle2 className="h-4 w-4 text-teal-600" /> 
    },
  ];

  return (
    <section className="bg-surface rounded-2xl border border-soft shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden font-sans">
      {/* Header section with micro-action text */}
      <div className="flex flex-col gap-3 px-5 pb-4 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-primary-text font-display">
            Repair Summary
          </h2>
          <p className="text-xs text-muted-foreground">
            Core execution snapshot for this service ticket.
          </p>
        </div>
        <button className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-0.5 transition">
          Edit Snapshot <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Industrial Grid layout with explicit clean hair-line borders */}
      <div className="grid grid-cols-1 divide-y divide-soft border-t border-soft bg-white/40 sm:grid-cols-2 md:grid-cols-3 md:divide-x">
        {items.map((item, idx) => (
          <div key={idx} className="p-5 space-y-2 hover:bg-white/80 transition-colors">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
