'use client';

import React from 'react';
import { Trash2, ArrowRight, Clock, User } from 'lucide-react';

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

interface JobCardProps {
  ticket: RepairTicket;
  onOpenDetails: (ticket: RepairTicket) => void;
  onDeleteSuccess: (ticketId: number) => void;
  delivered?: boolean;
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

export default function OperationJobCard({ ticket, onOpenDetails, onDeleteSuccess, delivered = false }: JobCardProps) {
  const spec = getStatusConfig(ticket.status);

  const displayTime = ticket.updatedAt
    ? new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const displayDate = new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short',
  });

  const handleDelete = async () => {
    if (!confirm('Remove this ticket from the system?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/owner/deleteTicket/${ticket.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Could not delete ticket.');
        return;
      }
      onDeleteSuccess(ticket.id);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border flex flex-col h-full transition-all ${
      delivered
        ? 'border-[rgba(9,20,38,0.06)] opacity-80 hover:opacity-100'
        : 'border-[rgba(9,20,38,0.08)] hover:border-[rgba(9,20,38,0.16)] hover:shadow-sm'
    }`}>

      {/* Card top */}
      <div className="p-5 flex flex-col flex-1">

        {/* Header row: ticket ID + status badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-sec-text mb-0.5">
              {delivered ? 'Delivered' : 'Job'}
            </p>
            <p className="text-xl font-black text-volt-primary leading-none">
              EV-{ticket.id.toString().padStart(4, '0')}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-bold flex-shrink-0 ${spec.bg} ${spec.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${spec.dot}`} />
            {ticket.status}
          </span>
        </div>

        {/* Vehicle + issue */}
        <div className="mb-1">
          <p className="text-[11px] font-bold tracking-widest uppercase text-sec-text mb-1">
            {ticket.vehicleModel}
          </p>
          <p className="text-sm font-semibold text-volt-primary leading-snug">
            {ticket.issueCategory}
          </p>
        </div>

        {/* Description preview */}
        {ticket.description && (
          <p className="text-[12px] text-sec-text leading-relaxed mt-1.5 line-clamp-2 flex-1">
            {ticket.description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px mx-5 bg-[rgba(9,20,38,0.06)]" />

      {/* Footer meta */}
      <div className="px-5 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-volt-primary flex items-center justify-center flex-shrink-0">
            <User className="w-3 h-3 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-sec-text">Customer</p>
            <p className="text-[11.5px] font-semibold text-volt-primary truncate">
              {ticket.customer?.name || 'Walk-in'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sec-text flex-shrink-0">
          <Clock className="w-3 h-3" />
          <span className="text-[11px] font-medium">{displayDate}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-5 bg-[rgba(9,20,38,0.06)]" />

      {/* Technician row */}
      <div className="px-5 py-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-sec-text mb-0.5">Technician</p>
        <p className="text-[11.5px] font-semibold text-volt-primary">
          {ticket.technician ? ticket.technician.fullName : 'Unassigned'}
        </p>
      </div>

      {/* Divider */}
      <div className="h-px mx-5 bg-[rgba(9,20,38,0.06)]" />

      {/* Action row */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#FAFAF8] rounded-b-2xl">
        <button
          onClick={() => onOpenDetails(ticket)}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-[rgba(9,20,38,0.10)] bg-white text-volt-primary text-[11px] font-bold uppercase tracking-wide py-2 hover:bg-volt-container transition active:scale-[0.98]"
        >
          View details
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={handleDelete}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(186,26,26,0.12)] bg-[#FFF5F5] text-volt-terracotta hover:bg-volt-terracotta hover:text-white transition flex-shrink-0"
          title="Delete ticket"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}