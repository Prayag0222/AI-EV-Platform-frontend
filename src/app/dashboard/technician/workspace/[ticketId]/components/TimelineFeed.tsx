"use client";

import { Activity, CheckCircle2, Package, ShieldAlert, Truck } from "lucide-react";
import type { ReactNode } from "react";
import type { TimelineEvent } from "../types/index";

interface DisplayEvent {
  id: number;
  title: string;
  detail: string;
  createdAt: string;
  icon: ReactNode;
  style: string;
}

const describeEvent = (event: TimelineEvent): DisplayEvent => {
  const [code, subject, quantity] = event.status.split(":");
  const base = { id: event.id, createdAt: event.createdAt };

  if (code === "PART_ADDED") return { ...base, title: `Part added: ${subject || "Component"}`, detail: quantity || "Inventory allocated", icon: <Package className="size-3"/>, style: "bg-amber-50 text-amber-700 border-amber-200" };
  if (code === "PART_REMOVED") return { ...base, title: `Part removed: ${subject || "Component"}`, detail: quantity || "Inventory restored", icon: <Package className="size-3"/>, style: "bg-red-50 text-red-700 border-red-200" };
  if (code === "RESOLVED") return { ...base, title: "Repair completed", detail: "Ticket status changed to Resolved", icon: <CheckCircle2 className="size-3"/>, style: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (code === "DELIVERED") return { ...base, title: "Vehicle delivered", detail: "Ticket status changed to Delivered", icon: <Truck className="size-3"/>, style: "bg-teal-50 text-teal-700 border-teal-200" };
  if (code === "PENDING") return { ...base, title: "Ticket created", detail: "Repair entered the Pending queue", icon: <ShieldAlert className="size-3"/>, style: "bg-slate-100 text-slate-600 border-slate-200" };

  return { ...base, title: `Status changed to ${code.replaceAll("_", " ")}`, detail: "Workshop status updated", icon: <Activity className="size-3"/>, style: "bg-indigo-50 text-indigo-700 border-indigo-200" };
};

const formatTimestamp = (value: string) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function TimelineFeed({ events }: { events: TimelineEvent[] }) {
  const feed = Array.from(new Map(events.map((event) => [event.id, event])).values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(describeEvent);

  return <section className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
    <div><h2 className="font-display text-base font-bold text-slate-900">Operational Timeline</h2><p className="mt-0.5 text-xs font-medium text-slate-400">Database audit records, newest first.</p></div>
    {!feed.length ? <p className="rounded-xl border border-dashed p-6 text-center text-xs text-slate-400">No timeline records are stored for this ticket.</p> : <div className="relative pl-1"><div className="absolute bottom-4 left-[15px] top-4 w-px bg-slate-200"/><ol className="space-y-5">{feed.map((event) => <li key={event.id} className="relative pl-9"><span className={`absolute left-0 top-0.5 z-10 grid size-[30px] place-items-center rounded-full border ${event.style}`}>{event.icon}</span><div className="flex items-start justify-between gap-4 border-b border-slate-50 pb-4"><div><p className="text-xs font-semibold text-slate-800">{event.title}</p><p className="mt-1 text-[11px] text-slate-400">{event.detail}</p></div><time className="shrink-0 whitespace-nowrap font-mono text-[10px] font-bold text-slate-400">{formatTimestamp(event.createdAt)}</time></div></li>)}</ol></div>}
  </section>;
}
