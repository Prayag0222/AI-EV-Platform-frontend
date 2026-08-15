// src/app/technician/workspace/[ticketId]/page.tsx
"use client";

import React from "react";
import { useRepairWorkspace } from "./hooks/useRepairWorkspace";

// Presentational Components
import { TicketHeader } from "./components/TicketHeader";
import { StatusPipeline } from "./components/statusPipeline";
import { RepairSummary } from "./components/RepairSummary";
import { WorkspacePanel } from "./components/WorkspacePanel";
import { InspectionGallery } from "./components/InspectionGallery";
import { TimelineFeed } from "./components/TimelineFeed";
import { CustomerCard } from "./components/CustomerCard";
import { PartsAllocation } from "./components/PartsAllocation";
import { VoltOpsAIChat } from "./components/ai/VoltOpsAIChat";

export default function WorkspacePage() {
  const {
    ticket,
    notes,
    isLoading,
    isRecording,
    error,
    isSavingStatus,
    isSavingPart,
    inventory,
    partsTotal,
    startRecording,
    stopRecording,
    changeStatus,
    addQuickChip,
    addManualNote,
    updateNote,
    deleteNote,
    addPart,
    removePart,
  } = useRepairWorkspace();

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#FAFAF8] font-sans text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />

          <span className="animate-pulse text-xs font-semibold tracking-wide text-slate-400">
            Hydrating Industrial Asset Layer...
          </span>
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR / MISSING TICKET
  // ============================================================

  if (!ticket) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAFAF8] p-6 font-sans text-slate-900">
        <div className="max-w-sm space-y-2 rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-bold text-slate-800">
            Operational Record Unreachable
          </p>

          <p className="text-xs font-medium leading-relaxed text-slate-400">
            Verify database engine status, Express API gateways on Port
            3001, and URL routing parameters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-32 font-sans text-slate-900 selection:bg-teal-100 lg:pb-12">
      <div className="mx-auto max-w-[1440px] space-y-6 px-4 pt-4 sm:px-6 lg:px-10">
        {/* ======================================================
            SERVER STATUS
           ====================================================== */}

        <div className="flex w-max items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 font-mono text-[11px] font-bold text-emerald-700 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />

          <span>VoltOps OS 2026 Engine Connected</span>
        </div>

        {/* ======================================================
            ERROR
           ====================================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            MASTER CONTEXT HEADER
           ====================================================== */}

        <TicketHeader
          ticket={ticket}
          onComplete={() => {
            if (window.confirm("Mark this repair as resolved?")) {
              void changeStatus("RESOLVED");
            }
          }}
        />

        {/* ======================================================
            STATUS PIPELINE
           ====================================================== */}

        <StatusPipeline
          currentStatus={ticket.status}
          onStatusChange={changeStatus}
          isSaving={isSavingStatus}
        />

        {/* ======================================================
            MAIN WORKSPACE
           ====================================================== */}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          {/* ====================================================
              MAIN EXECUTION RAIL
             ==================================================== */}

          <div className="space-y-6 lg:col-span-8">
            <RepairSummary ticket={ticket} />

            <WorkspacePanel
              notes={notes}
              addChip={addQuickChip}
              isRecording={isRecording}
              onStartRecord={startRecording}
              onStopRecord={stopRecording}
              parts={ticket.parts}
              onSubmitManualNote={addManualNote}
              onDeleteNote={deleteNote}
              onUpdateNote={updateNote}
            />

            <PartsAllocation
              inventory={inventory}
              parts={ticket.parts}
              total={partsTotal}
              saving={isSavingPart}
              onAdd={addPart}
              onRemove={removePart}
            />

            <InspectionGallery />

            {/* ==================================================
                MOBILE AI ENTRY

                On mobile this becomes the launch point for the
                fullscreen AI workspace.
               ================================================== */}

            <div className="lg:hidden">
  <VoltOpsAIChat
    ticketId={ticket.id}
    vehicleName={ticket.vehicleModel}
  />
</div>
          </div>

          {/* ====================================================
              DESKTOP SIDE RAIL
             ==================================================== */}

          <aside className="space-y-6 lg:sticky lg:top-20 lg:col-span-4">
            <CustomerCard
              customer={ticket.customer}
              vehicleModel={ticket.vehicleModel}
              batterySerial={ticket.batteryPackSerial}
            />

            {/* ==================================================
                DESKTOP AI

                The component automatically renders the persistent
                desktop AI panel here and hides its mobile launcher.
               ================================================== */}

            <div className="hidden lg:block">
              <VoltOpsAIChat
                ticketId={ticket.id}
                vehicleName={ticket.vehicleModel}
              />
            </div>

            <TimelineFeed events={ticket.timeline} />
          </aside>
        </div>
      </div>
    </div>
  );
}