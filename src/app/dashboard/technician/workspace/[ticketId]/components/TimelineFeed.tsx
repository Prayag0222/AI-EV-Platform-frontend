// src/app/technician/workspace/[ticketId]/components/TimelineFeed.tsx
"use client";

import React from "react";
import { StickyNote, ShieldAlert, CheckCircle2, UserCheck, Play, Package, Ship } from "lucide-react";
import type { TechnicianNote } from "../types/index";

interface TimelineFeedProps {
  notes: TechnicianNote[];
  ticketId: number;
}

interface TimelineEvent {
  time: string;
  title: string;
  subText?: string;
  type: "system" | "note";
  icon: React.ReactNode;
  markerColor: string;
}

export function TimelineFeed({ notes, ticketId }: TimelineFeedProps) {
  // 1. Define foundational baseline system lifecycle milestones with uniform date formatting
  const automatedEvents: TimelineEvent[] = [
    {
      time: "Jun 16 · 08:54",
      title: "Ticket #RT-" + ticketId + " Created Natively",
      subText: "Inbound via Service Center · Bengaluru HSR Rail System",
      type: "system",
      icon: <ShieldAlert className="h-3 w-3" />,
      markerColor: "bg-slate-100 text-slate-500 border-slate-200",
    },
    {
      time: "Jun 16 · 09:12",
      title: "Assigned to Arjun R.",
      subText: "Automated routing optimization via technician specialization skill matrix matching",
      type: "system",
      icon: <UserCheck className="h-3 w-3" />,
      markerColor: "bg-teal-50 text-teal-700 border-teal-200/60",
    },
    {
      time: "Jun 16 · 09:31",
      title: "Diagnostic Layer Initialized",
      subText: "OBD-EV telemetry link stream connected over local CAN bus architecture",
      type: "system",
      icon: <Play className="h-3 w-3" />,
      markerColor: "bg-teal-50 text-teal-700 border-teal-200/60",
    },
    {
      time: "Jun 16 · 11:20",
      title: "Replacement Component Provision Requested",
      subText: "BMS Module component (v3) allocation verified and approved by inventory ledger",
      type: "system",
      icon: <Package className="h-3 w-3" />,
      markerColor: "bg-amber-50 text-amber-700 border-amber-200/60",
    },
    {
      time: "Pending",
      title: "Quality Check & Handshake Execution",
      subText: "Awaiting final terminal stress cycle metrics",
      type: "system",
      icon: <CheckCircle2 className="h-3 w-3" />,
      markerColor: "bg-slate-50 text-slate-400 border-slate-200/60",
    },
    {
      time: "Pending",
      title: "Vehicle Transport Outbound Release",
      subText: "Pending diagnostic clearance sign-off",
      type: "system",
      icon: <Ship className="h-3 w-3" />,
      markerColor: "bg-slate-50 text-slate-400 border-slate-200/60",
    },
  ];

  // 2. Map dynamic incoming voice/chip notes straight into date-aware timeline blocks
  const transformedUserNotes: TimelineEvent[] = notes.map((note) => {
    const dateInstance = new Date(note.createdAt);
    
    // Extracts clean text date fields (e.g., "Jun 16")
    const formattedDate = dateInstance.toLocaleDateString([], { 
      month: "short", 
      day: "numeric" 
    });
    
    // Extracts precise time configuration (e.g., "17:22")
    const formattedTime = dateInstance.toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit",
      hour12: false
    });
    
    // Combines them into a luxury industrial design string token
    const fullTimestamp = `${formattedDate} · ${formattedTime}`;
    
    return {
      time: fullTimestamp,
      title: note.structuredText,
      subText: note.rawVoiceText !== note.structuredText ? `Audio Transcribed: "${note.rawVoiceText}"` : undefined,
      type: "note",
      icon: <StickyNote className="h-3 w-3" />,
      markerColor: "bg-slate-900 text-white border-slate-900 shadow-sm",
    };
  });

  // 3. Combine and display everything
  const combinedFeed = [...automatedEvents];
  if (transformedUserNotes.length > 0) {
    combinedFeed.splice(4, 0, ...transformedUserNotes);
  }

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5 font-sans">
      
      {/* Component Title Context */}
      <div className="space-y-0.5">
        <h2 className="text-base font-bold tracking-tight text-slate-900 font-display">
          Operational Timeline
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Activity trace ledger for this repair execution stream.
        </p>
      </div>

      {/* GitHub Style Absolute Connector Rail Track Layout */}
      <div className="relative pt-2 pl-1">
        <div className="absolute left-[15px] top-4 bottom-4 w-[1px] bg-slate-200/80" />

        <ol className="space-y-6">
          {combinedFeed.map((event, idx) => (
            <li key={idx} className="relative pl-9 block group transition-all">
              
              {/* Event Circular Node Element */}
              <span className={`absolute left-0 top-0.5 h-[30px] w-[30px] rounded-full grid place-items-center border text-center z-10 ${event.markerColor}`}>
                {event.icon}
              </span>

              {/* Event Content Row Box Split */}
              <div className="flex items-start justify-between gap-4 min-w-0 border-b border-slate-50 pb-3 group-last:border-none group-last:pb-0">
                <div className="space-y-1 min-w-0">
                  <div className={`text-xs font-semibold leading-tight ${event.type === "note" ? "text-slate-900 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/40 inline-block font-medium" : "text-slate-800"}`}>
                    {event.title}
                  </div>
                  
                  {event.subText && (
                    <p className={`text-[11px] leading-relaxed block font-medium truncate max-w-xl ${event.type === "note" ? "text-slate-400 italic pl-2.5" : "text-slate-400"}`}>
                      {event.subText}
                    </p>
                  )}
                </div>

                {/* Date-Aware Clock String Metric Anchor */}
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tight shrink-0 pt-0.5 whitespace-nowrap">
                  {event.time}
                </span>
              </div>

            </li>
          ))}
        </ol>
      </div>

    </section>
  );
}