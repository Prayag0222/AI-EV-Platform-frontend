// src/app/technician/workspace/[ticketId]/components/CustomerCard.tsx
"use client";

import React from "react";
import { Phone, ChevronRight, User, ShieldCheck, Zap, History } from "lucide-react";
import type { CustomerProfile } from "../types/index";

interface CustomerCardProps {
  customer: CustomerProfile;
  vehicleModel: string;
  batterySerial: string;
}

export function CustomerCard({ customer, vehicleModel, batterySerial }: CustomerCardProps) {
  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 font-sans">
      
      {/* Top Identity Block */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 grid place-items-center text-xs font-bold shadow-sm">
          {customer.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate">{customer.name}</p>
          <p className="text-[11px] font-medium text-slate-400 truncate">
            Enterprise Fleet Client · ID #C-9021
          </p>
        </div>
        
        {/* Deep Teal Quick Call Action Target */}
        <a 
          href={`tel:${customer.phone}`}
          className="h-8 w-8 rounded-xl bg-slate-50 border border-slate-200 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200/60 grid place-items-center text-slate-500 transition-all shadow-sm"
        >
          <Phone className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Clean Metadata Metric Matrix */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1 border-t border-slate-50">
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">EV Assets</span>
          <span className="text-xs font-semibold text-slate-800 mt-0.5 block">{vehicleModel}</span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Hardware ID</span>
          <span className="text-xs font-mono font-bold text-slate-700 mt-0.5 block truncate bg-slate-50 border border-slate-200/40 px-1.5 py-0.5 rounded w-max">
            {batterySerial}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Coverage</span>
          <span className="text-xs font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Active Warranty
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Lifecycle Trace</span>
          <span className="text-xs font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
            <History className="h-3.5 w-3.5 text-slate-400" /> {customer.pastRepairsCount} Past Repairs
          </span>
        </div>

      </div>

      {/* Full Record Deep Link Row */}
      <button className="w-full h-8.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all flex items-center justify-center gap-1">
        Inspect Complete Profile Matrix <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
      </button>

    </section>
  );
}