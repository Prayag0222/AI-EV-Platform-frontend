// src/app/technician/workspace/[ticketId]/components/WorkspacePanel.tsx
"use client";

import React from "react";
import { 
  FileText, Battery, Car, Package, Mic, Square, StickyNote, Plus 
} from "lucide-react";
import type { TechnicianNote } from "../types/index";

interface WorkspacePanelProps {
  notes: TechnicianNote[];
  addChip: (chipText: string) => void;
  isRecording: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
}

const QUICK_CHIPS = [
  "+BMS",
  "+Fuse",
  "+Connector",
  "+Controller",
  "+Cell",
  "+Balancing",
  "+Charging Test",
];

export function WorkspacePanel({
  notes,
  addChip,
  isRecording,
  onStartRecord,
  onStopRecord,
}: WorkspacePanelProps) {
  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6 font-sans">
      
      {/* Top Section Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold tracking-tight text-slate-900 font-display">
            Execution Workspace
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Diagnostic insights and continuous repair log entry points.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-100/60">
          Live Sync Engine
        </span>
      </div>

      {/* Modern Four-Quadrant Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Quadrant 1: Customer Complaint */}
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            <span>Customer Complaint</span>
          </div>
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            &ldquo;Range has dropped significantly from 85 km to under 40 km over the last week. The dashboard occasionally flashes a high-temperature battery warning indicator when accelerating on structural inclines.&rdquo;
          </p>
        </div>

        {/* Quadrant 2: Battery Health Layer */}
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <Battery className="h-3.5 w-3.5" />
            <span>Battery Diagnostics</span>
          </div>
          <div className="text-xs space-y-1.5 font-medium text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Pack Architecture</span>
              <span className="text-slate-800 font-semibold">BAT-90A21 · 2.9 kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">State of Health (SOH)</span>
              <span className="text-emerald-600 font-bold">78% Nominal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Charge Cycles</span>
              <span className="text-slate-800 font-mono">612 Complete</span>
            </div>
          </div>
        </div>

        {/* Quadrant 3: Vehicle Parameters */}
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <Car className="h-3.5 w-3.5" />
            <span>Vehicle Telemetry</span>
          </div>
          <div className="text-xs space-y-1.5 font-medium text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Model Line</span>
              <span className="text-slate-800 font-semibold">Ather 450X · 2023</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Odometer Readout</span>
              <span className="text-slate-800 font-mono">8,420 km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Service Cycle</span>
              <span className="text-slate-800">92 days ago</span>
            </div>
          </div>
        </div>

        {/* Quadrant 4: Component Bill of Materials */}
        <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
            <Package className="h-3.5 w-3.5" />
            <span>Parts Allocated</span>
          </div>
          <div className="text-xs space-y-1.5 font-medium text-slate-600">
            <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200/40">
              <span className="text-slate-700">BMS Module Component (v3)</span>
              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">x1</span>
            </div>
            <div className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200/40">
              <span className="text-slate-700">HV Connector Harness</span>
              <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">x2</span>
            </div>
            <button className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 pt-0.5 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Provision New Part
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Panel: Interactive Voice Logging & Rapid Tag Injection */}
      <div className="border-t border-slate-100 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Continuous Service Logs
          </h3>
          
          {/* Dynamic Voice Recording Action Target */}
          {isRecording ? (
            <button 
              onClick={onStopRecord}
              className="h-8 px-3 rounded-lg bg-red-50 text-red-600 border border-red-200 animate-pulse text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Square className="h-3.5 w-3.5 fill-red-600" /> Stop Audio Capture
            </button>
          ) : (
            <button 
              onClick={onStartRecord}
              className="h-8 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Mic className="h-3.5 w-3.5" /> Capture Audio Note
            </button>
          )}
        </div>

        {/* Minimal Typeless Chip Bank */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => addChip(chip)}
              className="h-8 px-3 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-xs font-semibold text-slate-600 border border-slate-200/60 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Dynamic Display Layer for Live Recorded Notes */}
        <div className="space-y-2 pt-1">
          {notes.slice(-2).map((note) => (
            <div
              key={note.id}
              className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200/60 px-4 py-3"
            >
              <StickyNote className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {note.structuredText}
                </p>
                {note.rawVoiceText !== note.structuredText && (
                  <p className="text-[11px] font-medium text-slate-400 italic">
                    Transcribed Audio Script: &ldquo;{note.rawVoiceText}&rdquo;
                  </p>
                )}
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200/40 px-1.5 py-0.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}