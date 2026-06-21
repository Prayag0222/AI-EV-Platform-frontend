'use client';

import React from 'react';
import { useRepairsManager } from './hooks/useRepairsManager';

// Import our custom layout shell and functional UI components
import RepairsLayout from './components/RepairsLayout';
import RepairsToolbar from './components/RepairsToolbar';
import RepairListGrid from './components/RepairListGrid';
import DiagnosticConsole from './components/DiagnosticConsole';
import AiCoPilotPanel from './components/AiCoPilotPanel';
import { RepairQueueError, RepairQueueSkeleton } from './components/RepairQueueStates';

export default function TechnicianRepairsPage() {
  // 🧠 1. MOUNT THE ENGINE
  // One single hook call brings in all the data, filters, and update functions!
  const {
    tickets,
    rawTickets,
    selectedTicket,
    searchQuery,
    statusFilter,
    isLoading,
    isRefreshing,
    error,
    isSessionExpired,
    saveSuccess,
    pagination,
    setSearchQuery,
    setStatusFilter,
    setPage,
    setSelectedTicketId,
    refresh,
    saveTechnicianNotes,
  } = useRepairsManager();

  // 🛡️ 2. HANDLE NETWORK LOADING STATE
  if (isLoading) {
    return <RepairQueueSkeleton />;
  }

  if (error && rawTickets.length === 0) {
    return <RepairQueueError message={error} onRetry={() => void refresh()} sessionExpired={isSessionExpired} />;
  }

  // 🧩 3. ASSEMBLE THE LEGO BLOCKS
  // We pass our state variables and functions directly down into the specialized components
  const toolbarBlock = (
    <RepairsToolbar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      statusFilter={statusFilter}
      onFilterChange={setStatusFilter}
      onRefresh={() => void refresh()}
      isRefreshing={isRefreshing}
    />
  );

  const gridBlock = (
    <RepairListGrid
      tickets={tickets}
      selectedTicketId={selectedTicket?.id || null}
      onTicketSelect={setSelectedTicketId}
      pagination={pagination}
      onPageChange={setPage}
      isFiltered={Boolean(searchQuery.trim()) || statusFilter !== 'All'}
      onClearFilters={() => {
        setSearchQuery('');
        setStatusFilter('All');
      }}
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
