"use client";

import { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

import { useRepairsManager } from "./hooks/useRepairsManager";

import RepairsLayout from "./components/RepairsLayout";
import RepairsToolbar from "./components/RepairsToolbar";
import RepairListGrid from "./components/RepairListGrid";
import {
  RepairQueueError,
  RepairQueueSkeleton,
} from "./components/RepairQueueStates";

const DiagnosticConsole = dynamic(
  () => import("./components/DiagnosticConsole")
);

const AiCoPilotPanel = dynamic(
  () => import("./components/AiCoPilotPanel"),
  {
    loading: () => (
      <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
    ),
  }
);

export default function TechnicianRepairsPage() {
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

  const handleRefresh = useCallback(() => {
    void refresh();
  }, [refresh]);

  const toolbarBlock = useMemo(
    () => (
      <RepairsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onFilterChange={setStatusFilter}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    ),
    [
      searchQuery,
      statusFilter,
      isRefreshing,
      handleRefresh,
      setSearchQuery,
      setStatusFilter,
    ]
  );

  if (isLoading) {
    return <RepairQueueSkeleton />;
  }

  if (error && rawTickets.length === 0) {
    return (
      <RepairQueueError
        message={error}
        onRetry={handleRefresh}
        sessionExpired={isSessionExpired}
      />
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <RepairsLayout
        toolbar={toolbarBlock}
        listGrid={
          <RepairListGrid
            tickets={tickets}
            selectedTicketId={selectedTicket?.id ?? null}
            onTicketSelect={setSelectedTicketId}
            pagination={pagination}
            onPageChange={setPage}
            isFiltered={
              Boolean(searchQuery.trim()) ||
              statusFilter !== "All"
            }
            onClearFilters={() => {
              setSearchQuery("");
              setStatusFilter("All");
            }}
          />
        }
        diagnosticConsole={
          <DiagnosticConsole
            key={selectedTicket?.id ?? "empty"}
            ticket={selectedTicket}
            onSaveNotes={saveTechnicianNotes}
            saveSuccess={saveSuccess}
          />
        }
        aiCoPilot={
          <AiCoPilotPanel
            ticket={selectedTicket}
          />
        }
      />
    </motion.div>
  );
}