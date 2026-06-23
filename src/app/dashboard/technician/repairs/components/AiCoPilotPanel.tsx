'use client';

import React from 'react';
import { RepairTicket } from '../types';
import { BrainCircuit, Database, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AiCoPilotPanelProps {
  ticket: RepairTicket | null;
}

export default function AiCoPilotPanel({ ticket }: AiCoPilotPanelProps) {
  return (
    <div className="w-full flex flex-col gap-5 relative overflow-hidden animate-fade-in">
      
      {/* 🔒 1. ALPHA STAGE OVERLAY LOCK */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center rounded-xl pointer-events-none">
        <div className="bg-amber-100 border border-amber-300 text-amber-800 shadow-sm px-4 py-2 rounded-2xl flex items-center gap-2">
          <Lock className="size-4" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Stage 2 Feature Locked
          </span>
        </div>
      </div>

      {/* ✨ 2. PREMIUM AI HEADER */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3 shrink-0">
        <div className="flex items-center gap-2 text-slate-800">
          <Sparkles className="size-4 text-amber-500" />
          <h3 className="font-display text-base font-bold text-primary-text">
            VoltOps AI Co-Pilot
          </h3>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider">
          <span className="size-1.5 rounded-full bg-amber-500" />
          Offline
        </span>
      </div>

      {/* 🧠 3. MOCK DIAGNOSTIC INTERFACE */}
      <div className="flex flex-col gap-3 opacity-60 grayscale-[30%]">
        
        <p className="text-xs text-sec-text font-medium leading-relaxed">
          The intelligence engine is currently warming up. In Stage 2, this terminal will analyze your mechanical logs against historical vector databases to predict failure points instantly.
        </p>

        {/* Mock Data Extraction Target */}
        <div className="bg-[#F9F6F1] border border-border/50 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-primary-text">
              Target Profile
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            {ticket ? `EV-${ticket.id.toString().padStart(4, '0')} // ${ticket.vehicleModel}` : "AWAITING TARGET"}
          </span>
        </div>

        {/* Disabled Action Triggers */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button 
            disabled 
            variant="outline" 
            className="h-9 text-[10px] uppercase font-bold tracking-wider rounded-xl border-dashed"
          >
            <BrainCircuit className="size-3 mr-1.5" />
            Run Retrieval
          </Button>
          <Button 
            disabled 
            className="h-9 text-[10px] uppercase font-bold tracking-wider rounded-xl bg-slate-800 text-white"
          >
            <Sparkles className="size-3 mr-1.5" />
            Generate Tree
          </Button>
        </div>

      </div>

    </div>
  );
}