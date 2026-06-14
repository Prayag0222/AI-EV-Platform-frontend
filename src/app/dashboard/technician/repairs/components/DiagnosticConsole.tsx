'use client';

import React, { useState } from 'react'; // ⚡ Removed useEffect entirely
import { RepairTicket } from '../types';
import { Button } from "@/components/ui/Button";
import { ClipboardCheck, FileText, Info, Save, User } from "lucide-react";

interface DiagnosticConsoleProps {
  ticket: RepairTicket | null;
  onSaveNotes: (ticketId: number, notes: string) => Promise<void>;
  saveSuccess: boolean;
}

export default function DiagnosticConsole({
  ticket,
  onSaveNotes,
  saveSuccess
}: DiagnosticConsoleProps) {
  
  // 🧠 LOCAL LAYOUT LOG BUFFER STATE
  const [localNotes, setLocalNotes] = useState<string>(ticket?.technicianNotes || "");
  
  // 🔄 1. PROP DESCRIPTOR SYNCHRONIZATION (RENDER-PHASE SYNC)
  // Replaces the useEffect loop! We track the ID of the ticket we are currently viewing.
  const [prevTicketId, setPrevTicketId] = useState<number | undefined>(ticket?.id);

  // If the mechanic clicks a new ticket, the ID changes. We update the text buffer 
  // immediately *during* the render cycle, completely preventing the cascading redraw error!
  if (ticket?.id !== prevTicketId) {
    setPrevTicketId(ticket?.id);
    setLocalNotes(ticket?.technicianNotes || "");
  }

  // 🛡️ 2. NO ACTIVE SELECTION PLACEHOLDER UNMUTE GATE
  if (!ticket) {
    return (
      <div className="w-full text-center py-10 px-4 flex flex-col items-center justify-center gap-2">
        <div className="size-10 rounded-full bg-[#F9F6F1] flex items-center justify-center text-muted-foreground">
          <Info className="size-5 text-gray-400" />
        </div>
        <p className="text-xs font-bold text-primary-text">No Ticket Selected</p>
        <p className="text-[11px] text-sec-text max-w-[240px]">
          Select an operational repair card from the queue grid to view technical schematics.
        </p>
      </div>
    );
  }

  // 🛠️ 3. COMITTING MECHANICAL LOG MUTATIONS
  const handleFormCommit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNotes(ticket.id, localNotes);
  };

  return (
    <div className="w-full flex flex-col gap-5 animate-fade-in">
      
      {/* SECTION HEADER BLOCK */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-[#0C5C3C]" />
          <h3 className="font-display text-base font-bold text-primary-text">
            Hardware Log Entry Terminal
          </h3>
        </div>
        <span className="font-mono text-[10px] font-bold text-muted-foreground bg-[#F9F6F1] border border-border/40 px-2 py-0.5 rounded">
          REF: EV-{ticket.id.toString().padStart(4, '0')}
        </span>
      </div>

      {/* 📋 HIGH-DENSITY CUSTOMER & FAILURE METADATA TILES */}
      <div className="grid grid-cols-1 gap-2.5 bg-[#F9F6F1]/60 p-3 rounded-xl border border-border/30 text-xs">
        
        <div className="flex items-start gap-2 min-w-0">
          <User className="size-3.5 text-muted-foreground/80 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Account Holder</p>
            <p className="font-semibold text-primary-text truncate mt-0.5">
              {ticket.customer?.name || "Unregistered Account"} 
              <span className="text-muted-foreground font-normal"> · {ticket.customer?.phone || "No Contact"}</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 min-w-0 pt-2.5 border-t border-border/30">
          <ClipboardCheck className="size-3.5 text-muted-foreground/80 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Reported Defect Category & Details</p>
            <p className="font-bold text-[#0C5C3C] truncate mt-0.5">{ticket.issueCategory}</p>
            <p className="text-sec-text text-[11px] font-medium leading-normal mt-1 bg-white p-2 rounded-lg border border-border/40">
              {ticket.description || "No mechanical intake descriptions logged."}
            </p>
          </div>
        </div>

      </div>

      {/* 📝 TECHNICAL INPUT PROGRESS INTERFACE FORM */}
      <form onSubmit={handleFormCommit} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="notes-area" className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center justify-between">
            <span>Workbench Technical Observations</span>
            <span className="font-mono text-[9px] text-muted-foreground/70 lowercase">Autosync standard asset rules</span>
          </label>
          <textarea
            id="notes-area"
            value={localNotes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLocalNotes(e.target.value)}
            rows={4}
            placeholder="Document live data log parameters: degradation profiles, cell voltage drop indices, safety pack balancing sequences..."
            className="w-full bg-white border border-border/50 rounded-xl p-3 text-xs font-mono text-black outline-none shadow-inner transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-border/80 focus:ring-2 focus:ring-[#0C5C3C]/10 resize-none"
          />
        </div>

        {/* FEEDBACK & COMMIT TRIGGERS */}
        <div className="flex flex-col gap-2">
          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-200/50 text-[#0C5C3C] text-[11px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200">
              <span className="size-1.5 rounded-full bg-[#0C5C3C] animate-ping" />
              Progress logs committed safely to PostgreSQL repository
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-10 text-xs font-bold rounded-xl bg-[#0C5C3C] text-white shadow-sm hover:bg-[#0C5C3C]/90 flex items-center justify-center gap-2 tracking-tight"
          >
            <Save className="size-3.5 shrink-0" />
            Commit Operational Logs
          </Button>
        </div>
      </form>

    </div>
  );
}