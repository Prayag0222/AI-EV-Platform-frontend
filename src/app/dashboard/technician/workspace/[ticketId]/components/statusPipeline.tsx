// src/app/technician/workspace/[ticketId]/components/StatusPipeline.tsx
"use client";

import React from "react";
import { ChevronRight, Check } from "lucide-react";
import type { TicketStatus } from "../types/index";

interface StatusPipelineProps {
  currentStatus: TicketStatus;
  onStatusChange: (status: TicketStatus) => void;
}

const STATUSES: TicketStatus[] = [
  "PENDING",
  "DIAGNOSING",
  "IN_SERVICE",
  "RESOLVED",
  "DELIVERED",
];

export function StatusPipeline({ currentStatus, onStatusChange }: StatusPipelineProps) {
  const currentIdx = STATUSES.indexOf(currentStatus);

  return (
    <section className="w-full bg-white border border-slate-200/80 rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Hide scrollbar utility keeps the track look pristine on mobile/tablet screens */}
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1.5 min-w-max px-1">
          {STATUSES.map((status, i) => {
            const isActive = status === currentStatus;
            const isCompleted = i < currentIdx;

            return (
              <div key={status} className="flex items-center gap-1.5">
                <button
                  onClick={() => onStatusChange(status)}
                  className={`h-9 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm font-medium"
                      : isCompleted
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/70"
                      : "bg-slate-50 text-slate-500 border-slate-200/60 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  {/* Status Indicator circle or checkmark marker */}
                  <span className="flex items-center justify-center">
                    {isCompleted ? (
                      <Check className="h-3 w-3 text-emerald-600" strokeWidth={3} />
                    ) : (
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-white animate-pulse" : "bg-slate-400"
                        }`}
                      />
                    )}
                  </span>
                  {status}
                </button>

                {/* Draw clear, clean separators between the pipeline milestones */}
                {i < STATUSES.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" strokeWidth={2} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}