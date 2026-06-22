'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, Wrench, CheckCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import OperationJobCard from './components/OperationJobCard';

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
  const [tickets, setTickets] = useState<RepairTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<RepairTicket | null>(null);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3000/api/operation/tickets');
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to load tickets.');
        setTickets(data.tickets || []);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const handleTicketDeleted = (deletedId: number) => {
    setTickets((prev) => prev.filter((t) => t.id !== deletedId));
    if (selectedTicket?.id === deletedId) setSelectedTicket(null);
  };

  const activeTickets = tickets.filter((t) => t.status?.toLowerCase() !== 'delivered');
  const deliveredTickets = tickets.filter((t) => t.status?.toLowerCase() === 'delivered');

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 text-volt-secondary animate-spin" />
        <p className="text-sm font-medium text-sec-text">Loading operations…</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white border border-[rgba(186,26,26,0.15)] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FFDAD6] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-5 w-5 text-volt-terracotta" />
          </div>
          <h3 className="font-black text-base text-volt-primary mb-1.5">Failed to load</h3>
          <p className="text-sm text-sec-text leading-relaxed">{errorMessage}</p>
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

        {/* ACTIVE JOBS */}
        <section>
          <SectionLabel
            icon={<Wrench className="w-3.5 h-3.5" />}
            label="Active jobs"
            count={activeTickets.length}
            accent
          />

          {activeTickets.length === 0 ? (
            <div className="mt-4 flex flex-col items-center justify-center py-20 border-2 border-dashed border-[rgba(9,20,38,0.08)] rounded-2xl bg-white">
              <div className="w-12 h-12 rounded-xl bg-volt-container flex items-center justify-center mb-3">
                <CheckCircle className="w-5 h-5 text-volt-secondary" />
              </div>
              <p className="font-bold text-volt-primary text-sm">All clear</p>
              <p className="text-xs text-sec-text mt-1">No vehicles are currently in service.</p>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {activeTickets.map((ticket) => (
                <OperationJobCard
                  key={ticket.id}
                  ticket={ticket}
                  onOpenDetails={setSelectedTicket}
                  onDeleteSuccess={handleTicketDeleted}
                />
              ))}
            </div>
          )}
        </section>

        {/* DELIVERY HISTORY */}
        {deliveredTickets.length > 0 && (
          <section>
            <button
              onClick={() => setHistoryOpen((p) => !p)}
              className="w-full flex items-center gap-3 group"
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text">
                <CheckCircle className="w-3.5 h-3.5 text-volt-secondary" />
                Delivery history
              </div>
              <div className="flex-1 h-px bg-[rgba(9,20,38,0.07)]" />
              <span className="text-[11px] font-bold text-sec-text bg-volt-container px-2.5 py-0.5 rounded-full">
                {deliveredTickets.length} vehicles
              </span>
              <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-volt-container text-sec-text group-hover:text-volt-primary transition flex-shrink-0">
                {historyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>

            {historyOpen && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {deliveredTickets.map((ticket) => (
                  <OperationJobCard
                    key={ticket.id}
                    ticket={ticket}
                    onOpenDetails={setSelectedTicket}
                    onDeleteSuccess={handleTicketDeleted}
                    delivered
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(9,20,38,0.5)]"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(9,20,38,0.08)] bg-[#FAFAF8] sticky top-0 rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-volt-primary flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-widest uppercase text-sec-text">Job details</p>
                  <p className="text-lg font-black text-volt-primary leading-tight">
                    EV-{selectedTicket.id.toString().padStart(4, '0')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-volt-container text-sec-text hover:text-volt-primary transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest uppercase text-sec-text">Status</span>
                <StatusBadge status={selectedTicket.status} />
              </div>

              {/* Grid meta */}
              <div className="grid grid-cols-2 gap-3">
                <ModalMetaCell label="Customer" value={selectedTicket.customer?.name || 'Walk-in'} />
                <ModalMetaCell label="Phone" value={selectedTicket.customer?.phone || '—'} />
                <ModalMetaCell label="Vehicle model" value={selectedTicket.vehicleModel} accent />
                <ModalMetaCell label="Issue category" value={selectedTicket.issueCategory} />
              </div>

              {/* Description */}
              <div className="bg-volt-background border border-[rgba(9,20,38,0.08)] rounded-xl p-4">
                <p className="text-[10.5px] font-bold tracking-widest uppercase text-sec-text mb-2">Description</p>
                <p className="text-sm text-primary-text leading-relaxed">{selectedTicket.description || '—'}</p>
              </div>

              {/* Technician notes */}
              <div className="bg-volt-background border border-[rgba(9,20,38,0.08)] rounded-xl p-4">
                <p className="text-[10.5px] font-bold tracking-widest uppercase text-sec-text mb-2">Technician notes</p>
                <p className="text-sm text-primary-text leading-relaxed font-mono">
                  {selectedTicket.technicianNotes || 'No notes yet.'}
                </p>
              </div>

              {/* Technician + date */}
              <div className="grid grid-cols-2 gap-3">
                <ModalMetaCell
                  label="Assigned technician"
                  value={
                    selectedTicket.technician
                      ? `${selectedTicket.technician.fullName} (#${selectedTicket.technician.employeeId})`
                      : 'Unassigned'
                  }
                />
                <ModalMetaCell
                  label="Created"
                  value={new Date(selectedTicket.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                />
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-volt-primary text-white text-sm font-bold py-3 hover:bg-[#1a2d47] transition active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
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