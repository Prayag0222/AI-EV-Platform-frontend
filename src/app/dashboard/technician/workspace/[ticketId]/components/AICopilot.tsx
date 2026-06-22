// src/app/technician/workspace/[ticketId]/components/AICopilot.tsx
"use client";

import React from "react";
import { Sparkles, ChevronRight, AlertTriangle, ShieldCheck, Zap, Info, ShieldAlert } from "lucide-react";

interface InsightCardProps {
  label: string;
  title: string;
  body: string;
  tone: "teal" | "slate" | "amber" | "red";
}

export function AICopilot() {
  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] font-sans">
      
      {/* Copilot Structural Header Row */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-slate-900 text-white grid place-items-center shadow-sm">
            <Sparkles className="h-3.5 w-3.5 fill-white/10" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 tracking-tight">AI Copilot</h2>
            <p className="text-[10px] font-semibold text-slate-400">Engineering Assistant · Active Link</p>
          </div>
        </div>

        {/* Emerald Confidence Token */}
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          94% Confidence
        </span>
      </div>

      {/* Stacked Intelligence Insights Rail */}
      <div className="p-4 space-y-2.5 bg-white">
        
        <AICard 
          tone="teal"
          label="Possible Cause"
          title="Cell Group 4 Voltage Imbalance"
          body="Voltage delta of 0.18V detected across cell blocks 12–15. Typically triggers BMS performance thresholds under sudden acceleration loads."
        />

        <AICard 
          tone="slate"
          label="Historical Match"
          title="4 Identical Regional Service Matches"
          body="Ather 450X platforms within 8,000–10,000 km range. BMS hardware replacement successfully resolved power drop symptoms in 92% of cases."
        />

        <AICard 
          tone="amber"
          label="Recommended Part"
          title="BMS Module Component (v3)"
          body="In stock at current regional service hub warehouse · ₹ 3,200 standard · 12-month platform coverage included automatically."
        />

        <AICard 
          tone="red"
          label="Critical Safety Alert"
          title="Discharge Pack Prior to Assembly Extraction"
          body="Current Pack State of Charge (SOC) reads at 62%. Ensure draw depletion reaches under 20% total before isolating high-voltage coupling arrays."
        />

        <AICard 
          tone="slate"
          label="Suggested Test Routine"
          title="Initiate Deep Automated Cell Balancing"
          body="Estimated execution window: 38 minutes. Test metrics sign-off will log program outputs directly to this service ticket."
        />

      </div>

    </section>
  );
}

/* =========================================================================
   LOCAL DESIGN ATOM: INSIGHT CARD CONTAINER
   ========================================================================= */
function AICard({ label, title, body, tone }: InsightCardProps) {
  // Map clear theme aesthetics safely without cluttering markup strings
  const toneMap = {
    teal: { badge: "bg-teal-50 text-teal-700 border-teal-100", icon: <Info className="h-3.5 w-3.5 text-teal-600" /> },
    slate: { badge: "bg-slate-50 text-slate-600 border-slate-200/60", icon: <ShieldCheck className="h-3.5 w-3.5 text-slate-500" /> },
    amber: { badge: "bg-amber-50 text-amber-700 border-amber-100", icon: <Zap className="h-3.5 w-3.5 text-amber-600" /> },
    red: { badge: "bg-red-50 text-red-600 border-red-100", icon: <ShieldAlert className="h-3.5 w-3.5 text-red-500" /> },
  };

  return (
    <div className="group rounded-xl border border-slate-200/60 p-3.5 space-y-2 bg-white hover:border-slate-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.01)] transition-all text-left block w-full cursor-pointer">
      
      {/* Top Meta Line */}
      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${toneMap[tone].badge}`}>
          {label}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* Content Space */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          {toneMap[tone].icon}
          <h3 className="text-xs font-bold text-slate-800">{title}</h3>
        </div>
        <p className="text-[11px] font-medium text-slate-400 leading-relaxed pl-5">
          {body}
        </p>
      </div>

    </div>
  );
}