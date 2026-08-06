// src/app/technician/workspace/[ticketId]/page.tsx
"use client";

import React from "react";
import { useRepairWorkspace } from "./hooks/useRepairWorkspace";

// 🧩 Presentational Component Layout Matrix
import { TicketHeader } from "./components/TicketHeader";
import { StatusPipeline } from "./components/statusPipeline";
import { RepairSummary } from "./components/RepairSummary";
import { WorkspacePanel } from "./components/WorkspacePanel";
import { InspectionGallery } from "./components/InspectionGallery";
import { TimelineFeed } from "./components/TimelineFeed";
import { CustomerCard } from "./components/CustomerCard";
import { AICopilot } from "./components/AICopilot";
import { PartsAllocation } from "./components/PartsAllocation";
import { RepairCostPanel } from "./components/RepairCostPanel";

// Quick Actions Icons for Mobile Sticky Bar
import { Activity, StickyNote, Mic, Camera, Package, CircleCheck } from "lucide-react";

export default function WorkspacePage() {
  // 🔌 CONNECT HOOK ENGINE: Streams live database mutations effortlessly
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

  // A. Dynamic Loading State Mask
  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-[#FAFAF8] text-slate-900 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full" />
          <span className="text-xs font-semibold text-slate-400 tracking-wide animate-pulse">
            Hydrating Industrial Asset Layer...
          </span>
        </div>
      </div>
    );
  }

  // B. Error Boundaries Validation
  if (!ticket) {
    return (
      <div className="min-h-[60vh] bg-[#FAFAF8] text-slate-900 flex items-center justify-center font-sans p-6">
        <div className="text-center space-y-2 max-w-sm border border-slate-200/80 bg-white p-6 rounded-2xl shadow-sm">
          <p className="text-sm font-bold text-slate-800">Operational Record Unreachable</p>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Verify database engine status, Express API gateways on Port 3001, and URL routing parameters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 pb-32 lg:pb-12 font-sans selection:bg-teal-100 ">
      <div className="mx-auto max-w-360 px-4 sm:px-6 lg:px-10 pt-4 space-y-6">
        
        {/* 🟢 SERVER RUNTIME FEEDBACK STRIP */}
        <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl w-max shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <span className="h-1.5 w-1.5 wrap-normal rounded-full bg-emerald-500 animate-pulse" />
          <span>VoltOps OS 2026 Engine Connected </span>
        </div>

        {/* 1. Master Context Header */}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <TicketHeader ticket={ticket} onComplete={() => {
          if (window.confirm("Mark this repair as resolved?")) void changeStatus("RESOLVED");
        }} />

        {/* 2. Horizontal Milestone Slider */}
        <StatusPipeline currentStatus={ticket.status} onStatusChange={changeStatus} isSaving={isSavingStatus} />

        {/* 3. Splitted Column Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Execution Flow Rail (Left 8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
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

            <PartsAllocation inventory={inventory} parts={ticket.parts} total={partsTotal} saving={isSavingPart} onAdd={addPart} onRemove={removePart} />
            
            <InspectionGallery />
          </div>

          {/* Side Intelligence Panel Rail (Right 4 Columns) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
            <CustomerCard 
              customer={ticket.customer} 
              vehicleModel={ticket.vehicleModel} 
              batterySerial={ticket.batteryPackSerial} 
            />
            <AICopilot />
            <TimelineFeed events={ticket.timeline} />
          </aside>

        </div>
      </div>

      {/* 4. Tablet/Mobile Responsive Quick Action Bar */}
     
    </div>
  );
}

/* =========================================================================
   LOCAL ASSY COMPONENT: MOBILE STICKY FOOTER
   ========================================================================= */

