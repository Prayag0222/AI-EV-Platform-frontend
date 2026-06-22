"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export function RepairQueueSkeleton() {
  return <div className="min-h-[calc(100vh-4.5rem)] bg-[#F9F6F1] px-4 py-6 md:px-8 lg:px-10"><div className="mx-auto w-full animate-pulse"><div className="h-3 w-36 rounded bg-slate-200"/><div className="mt-3 h-10 w-80 max-w-full rounded-lg bg-slate-200"/><div className="mt-7 h-20 rounded-2xl border bg-white"/><div className="mt-6 grid gap-4 xl:grid-cols-[1fr_420px]"><div className="space-y-3">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-56 rounded-2xl border border-border/50 bg-white p-5"><div className="h-5 w-28 rounded bg-slate-200"/><div className="mt-6 h-5 w-48 rounded bg-slate-200"/><div className="mt-4 h-20 rounded-xl bg-slate-100"/></div>)}</div><div className="hidden h-96 rounded-2xl border bg-white xl:block"/></div></div></div>;
}

export function RepairQueueError({ message, onRetry, sessionExpired }: { message: string; onRetry: () => void; sessionExpired: boolean }) {
  return <div className="grid min-h-[calc(100vh-4.5rem)] place-items-center bg-[#F9F6F1] p-6"><div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-7 text-center shadow-sm"><div className="mx-auto grid size-12 place-items-center rounded-xl bg-red-50 text-red-600"><AlertTriangle className="size-5"/></div><h2 className="mt-4 font-display text-lg font-bold text-primary-text">{sessionExpired ? "Session expired" : "Repair queue unavailable"}</h2><p className="mt-2 text-sm leading-6 text-sec-text">{message}</p><button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0C5C3C] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#094b32]"><RefreshCw className="size-4"/>{sessionExpired ? "Try again" : "Retry connection"}</button></div></div>;
}
