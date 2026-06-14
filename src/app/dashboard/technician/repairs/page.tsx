'use client';

import React from 'react';
import { useRepairsManager } from './hooks/useRepairsManager';

// Import our custom layout shell and functional UI components
import RepairsLayout from './components/RepairsLayout';
import RepairsToolbar from './components/RepairsToolbar';
import RepairListGrid from './components/RepairListGrid';
import DiagnosticConsole from './components/DiagnosticConsole';
import AiCoPilotPanel from './components/AiCoPilotPanel';

// We import Lucide icons for our loading state
import { Loader2 } from 'lucide-react';

export default function TechnicianRepairsPage() {
  // 🧠 1. MOUNT THE ENGINE
  // One single hook call brings in all the data, filters, and update functions!
  const {
    tickets,
    selectedTicket,
    searchQuery,
    statusFilter,
    isLoading,
    saveSuccess,
    setSearchQuery,
    setStatusFilter,
    setSelectedTicketId,
    saveTechnicianNotes,
  } = useRepairsManager();

  // 🛡️ 2. HANDLE NETWORK LOADING STATE
  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F9F6F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-[#0C5C3C]" />
          <p className="text-sm font-bold text-muted-foreground animate-pulse">
            Syncing workspace data matrix...
          </p>
        </div>
      </div>
    );
  }

  // 🧩 3. ASSEMBLE THE LEGO BLOCKS
  // We pass our state variables and functions directly down into the specialized components
  const toolbarBlock = (
    <RepairsToolbar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      statusFilter={statusFilter}
      onFilterChange={setStatusFilter}
    />
  );

  const gridBlock = (
    <RepairListGrid
      tickets={tickets}
      selectedTicketId={selectedTicket?.id || null}
      onTicketSelect={setSelectedTicketId}
    />
  );

  const consoleBlock = (
    <DiagnosticConsole
      ticket={selectedTicket}
      onSaveNotes={saveTechnicianNotes}
      saveSuccess={saveSuccess}
    />
  );

  const aiBlock = (
    <AiCoPilotPanel ticket={selectedTicket} />
  );

  // 🚀 4. INJECT INTO THE LAYOUT SHELL
  return (
    <RepairsLayout
      toolbar={toolbarBlock}
      listGrid={gridBlock}
      diagnosticConsole={consoleBlock}
      aiCoPilot={aiBlock}
    />
  );
}