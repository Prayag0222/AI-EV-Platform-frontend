"use client";

import { ArrowUpRight, CalendarClock, Clock3, MapPin, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RepairTicket, TicketPriority } from "../types";
import { getStatusStyle } from "../utils/statusTheme";

const priorityStyle: Record<TicketPriority, string> = {
  LOW: "bg-slate-100 text-slate-600 border-slate-200",
  STANDARD: "bg-blue-50 text-blue-700 border-blue-200",
  HIGH: "bg-amber-50 text-amber-800 border-amber-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
};

const initials = (name?: string) =>
  (name || "Unassigned")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const formatDate = (value?: string) =>
  value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Not recorded";

interface RepairSelectionCardProps {
  ticket: RepairTicket;
  isActive: boolean;
}

export default function RepairSelectionCard({ ticket, isActive }: RepairSelectionCardProps) {
  const status = getStatusStyle(ticket.status);
  const vehicleModel = ticket.vehicle?.vehicleModel || ticket.vehicleModel || "Vehicle not linked";
  const technicianName = ticket.technician?.fullName || "Unassigned";

  return (
    <article className={cn(
      "relative w-full overflow-hidden rounded-2xl border bg-white p-4 text-left transition-all duration-200 sm:p-5",
      isActive ? "border-[#0C5C3C] ring-1 ring-[#0C5C3C]/20 shadow-md shadow-[#0C5C3C]/5" : "border-border/70 hover:border-[#0C5C3C]/40 hover:shadow-md",
    )}>
      {isActive && <div className="absolute inset-y-0 left-0 w-1 bg-[#0C5C3C]" />}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-border/40 bg-[#F9F6F1] px-2 py-1 font-mono text-xs font-black text-primary-text">
            EV-{ticket.id.toString().padStart(4, "0")}
          </span>
          <span className={cn("rounded-md border px-2 py-1 text-[10px] font-black tracking-wider", priorityStyle[ticket.priority || "STANDARD"])}>
            {ticket.priority || "STANDARD"}
          </span>
        </div>
        <span className={cn("flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider", status.badge)}>
          <span className={cn("size-1.5 rounded-full", status.dot)} />
          {ticket.status.replace("_", " ")}
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(230px,.65fr)]">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold text-primary-text">{ticket.customer?.name || "Unknown customer"}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-sec-text"><Phone className="size-3.5" />{ticket.customer?.phone || "No phone"}</p>
          <div className="mt-3 rounded-xl bg-[#F9F6F1] p-3">
            <p className="font-semibold text-primary-text">{vehicleModel}</p>
            <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">VIN: {ticket.vehicle?.vin || "Not recorded"}</p>
            <p className="mt-2 text-xs text-sec-text"><b className="text-primary-text">Issue:</b> {ticket.issueCategory || "General diagnostic"}</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs text-sec-text">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#0C5C3C] text-[10px] font-black text-white">{initials(technicianName)}</span>
            <span className="min-w-0"><small className="block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Technician</small><b className="block truncate text-primary-text">{technicianName}</b></span>
          </div>
          <p className="flex items-start gap-2"><CalendarClock className="mt-0.5 size-3.5 shrink-0"/><span><b>Created:</b> {formatDate(ticket.createdAt)}</span></p>
          <p className="flex items-start gap-2"><Clock3 className="mt-0.5 size-3.5 shrink-0"/><span><b>Updated:</b> {formatDate(ticket.updatedAt)}</span></p>
          {ticket.closedAt && <p className="flex items-start gap-2 text-[#0C5C3C]"><Clock3 className="mt-0.5 size-3.5 shrink-0"/><span><b>Completed:</b> {formatDate(ticket.closedAt)}</span></p>}
          {ticket.bay && <p className="flex items-center gap-2"><MapPin className="size-3.5"/><span><b>Bay:</b> {ticket.bay}</span></p>}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-3 text-xs font-black text-[#0C5C3C]">
        <span className="flex items-center gap-1.5">Quick open <ArrowUpRight className="size-3.5" /></span>
      </div>
    </article>
  );
}
