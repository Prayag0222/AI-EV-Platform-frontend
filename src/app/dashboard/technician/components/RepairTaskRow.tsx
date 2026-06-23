'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RepairTicket {
  id: number;
  customer: { name: string };
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

export default function RepairTaskRow({ repair, expanded, onExpand, onAdvance, onOpenDetails }: RepairTaskRowProps) {
  
  // 🔒 1. SAFELY INITIALIZE STATE (Using ?. prevents the undefined property crash completely)
  const [localStatus, setLocalStatus] = useState<string>(repair?.status || "PENDING");
  const [prevPropStatus, setPrevPropStatus] = useState<string>(repair?.status || "PENDING");

  // 🛡️ 2. DEFENSIVE GUARD CLAUSE (Safely return null if the object is missing after hooks run)
  if (!repair) return null;

  // 🎯 3. RENDER-PHASE SYNC (Updates local states if parent background data shifts)
  if (repair.status !== prevPropStatus) {
    setPrevPropStatus(repair.status);
    setLocalStatus(repair.status);
  }

  // 🎨 Status Color Mapping Engine
  const statusColorMap: Record<string, { badge: string; text: string }> = {
    "PENDING": { 
      badge: "bg-slate-100 text-slate-700 border-slate-200", 
      text: "text-slate-600" 
    },
    "DIAGNOSING": { 
      badge: "bg-yelloe-50 border border-amber-200 text-amber-700 shadow-sm", 
      text: "text-amber-600" 
    },
    "IN_SERVICE": { 
      badge: "bg-amber-50 border border-orange-200 text-orange-700 shadow-sm", 
      text: "text-orange-600" 
    },
    "RESOLVED": { 
      badge: "bg-orange-50 border border-emerald-200 text-emerald-700 font-bold shadow-sm", 
      text: "text-emerald-600" 
    },
    "DELIVERED": { 
      badge: "bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-sm", 
      text: "text-emerald-600" 
    }
  };

  const currentStatusStyles = statusColorMap[localStatus] || { 
    badge: "bg-muted text-muted-foreground", 
    text: "text-muted-foreground" 
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setLocalStatus(selectedValue);
    onAdvance(selectedValue); 
  };

  return (
    <article className={cn(
      "overflow-hidden rounded-2xl border bg-card transition-all duration-200", 
      expanded ? "border-foreground/20 shadow-[0_18px_48px_-38px_var(--foreground)]" : "border-border/70 hover:border-foreground/15"
    )}>
      <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        
        {/* LEFT TEXT PANEL */}
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md">
              {repair.bay || "No Bay Assigned"}
            </span>
            <span className="text-border">·</span>
            
            <span className={cn("text-xs font-semibold px-1.5 py-0.5 rounded transition-all duration-200", currentStatusStyles.text)}>
              {localStatus}
            </span>
          </div>

          <h3 className="font-display text-xl font-semibold tracking-[-0.035em] text-primary-text">
            {repair.issueCategory || "General Inspection"}
          </h3>
          
          <p className="mt-2 text-sm text-sec-text">
            <span className="font-medium text-gray-700">{repair.vehicleModel || "EV Vehicle"}</span> · {repair.customer?.name || "Unknown Customer"}
          </p>
        </div>

        {/* RIGHT CONTROL PANEL */}
        <div className="flex items-center gap-4 md:justify-end">
          <div className="flex flex-col gap-1.5 items-end">
            <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md transition-all duration-200", currentStatusStyles.badge)}>
              ● {localStatus}
            </span>

            <select
              value={localStatus}
              onChange={handleStatusChange}
              className="h-10 text-xs font-bold rounded-xl px-3 bg-surface border border-border text-primary-text focus:outline-none focus:border-emerald-600 transition-colors cursor-pointer min-w-37.5 shadow-sm"
            >
              <option value="PENDING" className="text-slate-700 font-medium">PENDING</option>
              <option value="DIAGNOSING" className="text-yellow-700 font-medium">DIAGNOSING</option>
              <option value="IN_SERVICE" className="text-amber-700 font-medium">IN_SERVICE</option>
              <option value="RESOLVED" className="text-orange-700 font-bold">RESOLVED</option>
              <option value="DELIVERED" className="text-emerald-700 font-bold">DELIVERED</option>
            </select>
          </div>

          <Button variant="ghost" size="icon" onClick={onExpand} className="mt-5">
            <ChevronDown className={cn("transition-transform", expanded && "rotate-180")} />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="grid gap-5 border-t border-border/60 bg-surface/60 px-5 py-4 sm:grid-cols-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Latest finding</p>
            <p className="mt-1.5 text-sm font-medium text-primary-text">DTC P0AA6 isolation fault</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Safety state</p>
            <p className="mt-1.5 text-sm font-medium text-primary-text">Pack isolated</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Description</p>
            <p className="mt-1.5 text-sm font-medium text-muted-foreground line-clamp-1">
              {repair.description || "No technical description logged."}
            </p>
          </div>
          <div className="flex items-center sm:justify-end">
            <Button variant="outline" size="sm" onClick={onOpenDetails} className="text-xs rounded-lg text-primary-text border-border">
              Open Workbench
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}