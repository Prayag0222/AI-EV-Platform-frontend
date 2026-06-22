// src/app/technician/workspace/[ticketId]/components/WorkspacePanel.tsx
"use client";

import React, { useState } from "react";
import { 
  FileText, Battery, Car, Package, Mic, Square, StickyNote, Plus, 
  Send, Trash2, Pencil, X, Check
} from "lucide-react";
import type { TechnicianNote, UsedPart } from "../types/index";
import { useRepairWorkspace } from "../hooks/useRepairWorkspace";

interface WorkspacePanelProps {
  notes: TechnicianNote[];
  addChip: (chipText: string) => void;
  isRecording: boolean;
  onStartRecord: () => void;
  onStopRecord: () => void;
  parts: UsedPart[];
  // 🆕 New CRUD Handlers for the Parent Component to process
  onSubmitManualNote: (text: string) => Promise<void>;
  onDeleteNote: (noteId: number) => Promise<void>;
  onUpdateNote: (noteId: number, newText: string) => Promise<void>;
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
  parts,
  onSubmitManualNote,
  onDeleteNote,
  onUpdateNote,
}: WorkspacePanelProps) {

  const { ticket , } = useRepairWorkspace();

  // Local state for the new manual typing input
  const [manualText, setManualText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state for inline editing
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editNoteText, setEditNoteText] = useState("");

  // Handlers
  const handleManualSubmit = async () => {
    if (!manualText.trim()) return;
    setIsSubmitting(true);
    await onSubmitManualNote(manualText);
    setManualText("");
    setIsSubmitting(false);
  };

  const handleStartEdit = (note: TechnicianNote) => {
    setEditingNoteId(note.id);
    setEditNoteText(note.structuredText);
  };

  const handleSaveEdit = async (noteId: number) => {
    if (!editNoteText.trim()) return;
    await onUpdateNote(noteId, editNoteText);
    setEditingNoteId(null);
  };

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
            &ldquo;{ticket?.customerComplaint || "No complaint logged."}&rdquo;
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
              <span className="text-slate-800 font-semibold">{ticket?.vehicle?.batteryCapacity || "Not Provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">State of Health (SOH)</span>
              <span className="text-emerald-600 font-bold">{ticket?.vehicle?.batterySoh || "Not Provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Charge Cycles</span>
              <span className="text-slate-800 font-mono">{ticket?.vehicle?.batteryCycles || "Not Provided"}</span>
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
              <span className="text-slate-800 font-semibold">{ticket?.vehicle?.vehicleModel || "Not Provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Odometer Readout</span>
              <span className="text-slate-800 font-mono">{ticket?.vehicle?.odometer || "Not Provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Service Cycle</span>
              <span className="text-slate-800">{ticket?.vehicle?.lastServiceDaysAgo || "Not Provided"} </span>
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
            {parts.slice(0, 3).map((part) => (
              <div key={part.id} className="flex justify-between items-center bg-white px-2 py-1 rounded border border-slate-200/40">
                <span className="truncate text-slate-700">{part.inventoryItem?.partName}</span>
                <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">x{part.quantity}</span>
              </div>
            ))}
            {!parts.length && <p className="text-[11px] text-slate-400">No parts allocated.</p>}
            <button className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center gap-0.5 pt-0.5 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Provision New Part
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Interactive Logging & Rapid Tag Injection */}
      <div className="border-t border-slate-100 pt-5 space-y-4">
        
        {/* Input Header & Voice Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Continuous Service Logs
          </h3>
          
          {isRecording ? (
            <button 
              onClick={onStopRecord}
              className="h-8 px-3 rounded-lg bg-red-50 text-red-600 border border-red-200 animate-pulse text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Square className="h-3.5 w-3.5 fill-red-600" /> Stop Audio
            </button>
          ) : (
            <button 
              onClick={onStartRecord}
              className="h-8 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Mic className="h-3.5 w-3.5" /> Capture Audio
            </button>
          )}
        </div>

        {/* 🆕 Manual Text Input Box */}
        <div className="relative">
          <input 
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
            placeholder="Type a manual diagnostic note here..."
            className="w-full h-10 pl-3 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
            disabled={isSubmitting}
          />
          <button 
            onClick={handleManualSubmit}
            disabled={!manualText.trim() || isSubmitting}
            className="absolute right-1.5 top-1.5 h-7 w-7 grid place-items-center rounded bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Minimal Typeless Chip Bank */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                addChip(chip);
                setManualText(prev => prev ? `${prev} ${chip}` : chip);
              }}
              className="h-7 px-2.5 rounded-md bg-slate-50 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-[11px] font-semibold text-slate-600 border border-slate-200/60 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Dynamic Display Layer for Live Recorded Notes */}
        <div className="space-y-2 pt-1 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200/60 px-4 py-3 transition-all hover:border-slate-300"
            >
              <StickyNote className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              
              <div className="flex-1 space-y-1 min-w-0">
                {/* Inline Edit Mode vs Display Mode */}
                {editingNoteId === note.id ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      autoFocus
                      value={editNoteText}
                      onChange={(e) => setEditNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(note.id)}
                      className="flex-1 h-7 px-2 text-xs border border-teal-500 rounded bg-white focus:outline-none"
                    />
                    <button onClick={() => handleSaveEdit(note.id)} className="text-emerald-600 hover:text-emerald-700">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingNoteId(null)} className="text-slate-400 hover:text-slate-600">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed pr-2">
                      {note.structuredText}
                    </p>
                    {note.rawVoiceText && note.rawVoiceText !== note.structuredText && (
                      <p className="text-[11px] font-medium text-slate-400 italic break-words">
                        Raw Input: &ldquo;{note.rawVoiceText}&rdquo;
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Timestamp & Hover CRUD Actions */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-white border border-slate-200/40 px-1.5 py-0.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                  {new Date(note.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
                
                {/* CRUD Controls (Visible on hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                  <button 
                    onClick={() => handleStartEdit(note)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button 
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="text-center py-4 text-xs font-medium text-slate-400">
              No service logs recorded yet.
            </div>
          )}
        </div>
      </div>

    </section>
  );
}