'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { RepairTicket } from '../types';
import { getStatusStyle } from '../utils/statusTheme';
import { ShieldCheck, User } from "lucide-react";

interface RepairSelectionCardProps {
  ticket: RepairTicket;
  isActive: boolean; // Indicates if this card is currently selected on the active workbench
  onClick: () => void;
}

export default function RepairSelectionCard({
  ticket,
  isActive,
  onClick
}: RepairSelectionCardProps) {
  
  // 🛡️ 1. TOP-LEVEL GRACEFUL SAFETY BAILOUT
  if (!ticket) return null;

  // 🎨 2. TRANSLATE RAW DATABASE STATUS STRINGS INTO TAILWIND DESIGN PACKAGES
  const styleTheme = getStatusStyle(ticket.status);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border p-4 transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col gap-3 group bg-white",
        isActive 
          ? "border-[#0C5C3C] shadow-md shadow-[#0C5C3C]/5 bg-white ring-1 ring-[#0C5C3C]/20" 
          : "border-border/70 hover:border-border hover:bg-[#FCFAF7] hover:shadow-sm"
      )}
    >
      {/* 🟢 3. ACTIVE SELECTED HIGHLIGHT INDICATOR ACCENT STRIP */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0C5C3C]" />
      )}

      {/* 🎛️ 4. CARD METADATA STRIP HEADER */}
      <div className="w-full flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Unique formatted reference identifier key string */}
          <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground bg-[#F9F6F1] px-2 py-0.5 rounded border border-border/30">
            EV-{ticket.id.toString().padStart(4, '0')}
          </span>
          <span className="text-xs font-bold text-muted-foreground">
            {ticket.bay || "No Bay"}
          </span>
        </div>
        
        {/* Dynamic State Pill Corner Badge */}
        <span className={cn("text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1.5 transition-all duration-200", styleTheme.badge)}>
          <span className={cn("size-1.5 rounded-full", styleTheme.dot)} />
          {ticket.status}
        </span>
      </div>

      {/* ⚡ 5. CORE WORKSTATION DIAGNOSTIC TARGET MESSAGES */}
      <div className="space-y-1">
        {/* Issue Summary Heading: Employs your exact global custom CSS value */}
        <h3 className="font-display text-base font-bold tracking-tight text-primary-text group-hover:text-black transition-colors">
          {ticket.issueCategory || "General Diagnostic Triage"}
        </h3>
        
        {/* Scooter Variant Variant Model Meta Target */}
        <p className="text-xs font-semibold text-sec-text tracking-tight">
          {ticket.vehicleModel || "EV Architecture Module"}
        </p>
      </div>

      {/* 🛡️ 6. FOOTER DETAILS: HIGH DENSITY REAL-DATA LINK METRICS */}
      <div className="mt-1 pt-3 border-t border-border/40 flex items-center justify-between gap-4 text-[11px] font-medium text-muted-foreground">
        
        {/* Relational Customer Registry Mapping */}
        <div className="flex items-center gap-1.5 truncate">
          <User className="size-3 text-muted-foreground/70 shrink-0" />
          <span className="truncate tracking-tight font-medium text-gray-600">
            {ticket.customer?.name || "Unknown Profile Record"}
          </span>
        </div>

        {/* Technical Safety Integrity Acknowledger */}
        <div className="flex items-center gap-1 shrink-0 text-[#0C5C3C]/80 font-semibold bg-emerald-50/50 px-2 py-0.5 rounded-md border border-emerald-100/30">
          <ShieldCheck className="size-3 shrink-0 text-[#0C5C3C]" />
          <span>VoltSec Verified</span>
        </div>

      </div>

    </button>
  );
}