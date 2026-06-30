'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertTriangle, Wrench, CheckCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import OperationJobCard from './components/OperationJobCard';
import OperationDetailDrawer from './components/OperationDetailDrawer';
import DeliveryHistory from './components/DeliveryHistory';
import useOperations from './hooks/useOperations';
import OperationSection from './components/OperationSection';
import OperationFilters from './components/OperationFilters';

interface CustomerInfo {
  name: string;
  phone: string;
}

interface Technician {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  specialization: string;
  status: string;
  experienceYears: string;
  address: string | null;
}

interface RepairTicket {
  id: number;
  vehicleModel: string;
  issueCategory: string;
  description: string;
  technicianNotes: string | null;
  status: string;
  customer: CustomerInfo;
  technicianId?: string | null;
  createdAt: string;
  updatedAt?: string;
  technician?: Technician | null;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  ready:           { bg: 'bg-emerald-green',  text: 'text-volt-secondary',  dot: 'bg-volt-secondary'  },
  delivered:       { bg: 'bg-emerald-green',  text: 'text-volt-secondary',  dot: 'bg-volt-secondary'  },
  'in service':    { bg: 'bg-[#D6EFDE]',      text: 'text-[#006F67]',       dot: 'bg-[#006F67]'       },
  working:         { bg: 'bg-[#D6EFDE]',      text: 'text-[#006F67]',       dot: 'bg-[#006F67]'       },
  'parts ordered': { bg: 'bg-[#FFDAD6]',      text: 'text-volt-terracotta', dot: 'bg-volt-terracotta' },
  waiting:         { bg: 'bg-volt-sand',       text: 'text-[#564427]',       dot: 'bg-[#564427]'       },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG['waiting'];
}

export default function OperationsDeckPage() {
const {
    loading,
    error,
    tickets,
    activeTickets,
    deliveredTickets,
} = useOperations();

  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [search, setSearch] = useState('');
const [statusFilter, setStatusFilter] = useState('All');



const filteredTickets = useMemo(() => {
  return activeTickets.filter((ticket) => {
    const searchTerm = search.toLowerCase();

    const customerName = ticket.customer?.name?.toLowerCase() ?? "";
    const vehicleModel = ticket.vehicleModel?.toLowerCase() ?? "";
    const issueCategory = ticket.issueCategory?.toLowerCase() ?? "";
    const ticketStatus = ticket.status?.toLowerCase() ?? "";
    const ticketId = ticket.id?.toString() ?? "";

    const matchesSearch =
      customerName.includes(searchTerm) ||
      vehicleModel.includes(searchTerm) ||
      issueCategory.includes(searchTerm) ||
      ticketId.includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      ticketStatus === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });
}, [activeTickets, search, statusFilter]);


 

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 text-volt-secondary animate-spin" />
        <p className="text-sm font-medium text-sec-text">Loading operations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white border border-[rgba(186,26,26,0.15)] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FFDAD6] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-5 w-5 text-volt-terracotta" />
          </div>
          <h3 className="font-black text-base text-volt-primary mb-1.5">Failed to load</h3>
          <p className="text-sm text-sec-text leading-relaxed">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-volt-background">

      {/* Page Header */}
      <div className="bg-white border-b border-[rgba(9,20,38,0.08)] px-6 lg:px-10 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text mb-2">
              <Wrench className="w-3.5 h-3.5 text-volt-secondary" />
              <span>Workshop</span>
              <span className="text-[#C5C6CD]">/</span>
              <span className="text-volt-primary">Operations</span>
            </div>
            <h1 className="text-[26px] font-black text-volt-primary tracking-tight leading-tight">
              Operations Deck
            </h1>
            <p className="text-sm text-sec-text mt-1">
              Live view of all vehicles currently in the workshop.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatPill
              icon={<Wrench className="w-3.5 h-3.5" />}
              label="Active jobs"
              value={activeTickets.length}
              accent
            />
            <StatPill
              icon={<CheckCircle className="w-3.5 h-3.5" />}
              label="Delivered"
              value={deliveredTickets.length}
              accent={false}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-10">

        <OperationFilters
    search={search}
    onSearchChange={setSearch}
    status={statusFilter}
    onStatusChange={setStatusFilter}
/>

     <OperationSection
  icon={<Wrench className="w-3.5 h-3.5" />}
  title="Active Jobs"
  count={activeTickets.length}
  accent
  tickets={filteredTickets}
  emptyTitle="All Clear"
  emptyDescription="No vehicles are currently in service."
  onOpenDetails={setSelectedTicket}
/>

     <DeliveryHistory
  tickets={deliveredTickets}
  onOpenDetails={setSelectedTicket}

/>
      </div>

      {/* DETAIL MODAL */}
      {selectedTicket && (
  <OperationDetailDrawer
    key={selectedTicket.id}
    ticket={selectedTicket}
    open
    onClose={() => setSelectedTicket(null)}
  />
)}
    </main>
  );
}

function StatPill({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-[rgba(9,20,38,0.08)] rounded-xl px-4 py-2.5">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accent ? 'bg-emerald-green text-volt-secondary' : 'bg-volt-container text-sec-text'}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-sec-text">{label}</p>
        <p className="text-base font-black text-volt-primary leading-none">{value}</p>
      </div>
    </div>
  );
}

function SectionLabel({ icon, label, count, accent }: { icon: React.ReactNode; label: string; count: number; accent: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text">
        <span className="text-volt-secondary">{icon}</span>
        {label}
      </div>
      <div className="flex-1 h-px bg-[rgba(9,20,38,0.07)]" />
      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${accent ? 'bg-emerald-green text-volt-secondary' : 'bg-volt-container text-sec-text'}`}>
        {count}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function ModalMetaCell({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-volt-background border border-[rgba(9,20,38,0.08)] rounded-xl px-3.5 py-3">
      <p className="text-[10px] font-bold tracking-widest uppercase text-sec-text mb-0.5">{label}</p>
      <p className={`text-sm font-semibold leading-snug ${accent ? 'text-volt-secondary' : 'text-volt-primary'}`}>{value}</p>
    </div>
  );
}