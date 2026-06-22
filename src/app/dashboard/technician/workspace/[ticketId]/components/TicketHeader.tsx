"use client";

import { Activity, AlertTriangle, ArrowRight, CalendarDays, ChevronRight, Clock3, ShieldCheck, UserRound } from "lucide-react";
import type { RepairTicket } from "../types/index";

const priorityStyles = {
  LOW: "bg-slate-50 text-slate-600 border-slate-200",
  STANDARD: "bg-blue-50 text-blue-700 border-blue-200",
  HIGH: "bg-amber-50 text-amber-700 border-amber-200",
  URGENT: "bg-red-50 text-red-700 border-red-200",
};

const dateTime = (value?: string | null) => value ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Not recorded";

export function TicketHeader({ ticket, onComplete }: { ticket: RepairTicket; onComplete: () => void }) {
  const repairStarted = ticket.timeline.find((event) => event.status === "IN_SERVICE")?.createdAt;
  return <section className="space-y-3 font-sans">
    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><span>Workspace</span><ChevronRight className="size-3"/><span>Active Repairs</span><ChevronRight className="size-3"/><span className="font-semibold text-slate-800">EV-{String(ticket.id).padStart(4, "0")}</span></div>
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        <div><div className="flex flex-wrap items-center gap-2"><h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">EV-{String(ticket.id).padStart(4, "0")}</h1><span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${priorityStyles[ticket.priority]}`}><AlertTriangle className="size-3"/>{ticket.priority}</span><span className="inline-flex items-center gap-1 rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700"><Activity className="size-3"/>{ticket.status.replace("_", " ")}</span></div><p className="mt-2 text-sm text-slate-500"><b className="text-slate-900">{ticket.customer.name}</b><span className="mx-2">·</span>{ticket.vehicleModel}<span className="mx-2">·</span><span className="font-mono text-xs">{ticket.vin}</span></p></div>
        <button onClick={onComplete} disabled={ticket.status === "RESOLVED" || ticket.status === "DELIVERED"} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">Complete Repair <ArrowRight className="size-4"/></button>
      </div>
      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-xs sm:grid-cols-2 xl:grid-cols-6">
        <Meta icon={<UserRound/>} label="Assigned technician" value={ticket.technician?.fullName || "Unassigned"}/>
        <Meta icon={<ShieldCheck/>} label="Warranty" value="Not recorded"/>
        <Meta icon={<CalendarDays/>} label="Created" value={dateTime(ticket.createdAt)}/>
        <Meta icon={<Clock3/>} label="Repair started" value={dateTime(repairStarted)}/>
        <Meta icon={<Clock3/>} label="Expected completion" value={ticket.estimatedCompletionTime}/>
        <Meta icon={<Clock3/>} label="Completed at" value={dateTime(ticket.closedAt)}/>
      </div>
    </div>
  </section>;
}

function Meta({ icon, label, value }: { icon: React.ReactElement<{ className?: string }>; label: string; value: string }) {
  return <div className="flex items-start gap-2 text-slate-500">{icon && <span className="mt-0.5 [&>svg]:size-3.5">{icon}</span>}<span><small className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</small><b className="mt-0.5 block text-slate-800">{value}</b></span></div>;
}
