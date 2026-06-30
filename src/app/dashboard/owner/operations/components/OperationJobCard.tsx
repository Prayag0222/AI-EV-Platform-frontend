'use client';

import { ArrowRight, Clock, User } from 'lucide-react';

import { RepairTicket } from '../types/types';
import OperationStatusBadge from './OperationStatusBadge';

interface OperationJobCardProps {
  ticket: RepairTicket;
  onOpenDetails: (ticket: RepairTicket) => void;
  delivered?: boolean;
}

export default function OperationJobCard({
  ticket,
  delivered = false,
  onOpenDetails,
}: OperationJobCardProps) {
  const lastUpdated = ticket.updatedAt ?? ticket.createdAt;

  const displayDate = new Date(lastUpdated).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  const displayTime = new Date(lastUpdated).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article
      className={`flex h-full flex-col rounded-2xl border bg-white transition-all
      ${
        delivered
          ? 'border-[rgba(9,20,38,0.06)] opacity-80 hover:opacity-100'
          : 'border-[rgba(9,20,38,0.08)] hover:border-[rgba(9,20,38,0.16)] hover:shadow-lg'
      }`}
    >
      {/* Header */}

      <div className="flex-1 p-5">

        <div className="mb-4 flex items-start justify-between gap-3">

          <div>

            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-sec-text">
              {delivered ? 'Delivered' : 'Job'}
            </p>

            <h3 className="text-xl font-black text-volt-primary">
              EV-{ticket.id.toString().padStart(4, '0')}
            </h3>

          </div>

          <OperationStatusBadge status={ticket.status} />

        </div>

        {/* Vehicle */}

        <div className="space-y-1">

          <p className="text-[11px] font-bold uppercase tracking-widest text-sec-text">
            {ticket.vehicleModel}
          </p>

          <h4 className="text-sm font-semibold text-volt-primary leading-snug">
            {ticket.issueCategory}
          </h4>

        </div>

        {/* Description */}

        {!!ticket.description && (
          <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-sec-text">
            {ticket.description}
          </p>
        )}

      </div>

      {/* Divider */}

      <div className="mx-5 h-px bg-[rgba(9,20,38,.06)]" />

      {/* Customer */}

      <div className="flex items-center justify-between gap-4 px-5 py-3">

        <div className="flex min-w-0 items-center gap-2">

          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-volt-primary">

            <User className="h-3.5 w-3.5 text-white" />

          </div>

          <div className="min-w-0">

            <p className="text-[10px] font-bold uppercase tracking-widest text-sec-text">
              Customer
            </p>

            <p className="truncate text-[12px] font-semibold text-volt-primary">
              {ticket.customer?.name || 'Walk-in'}
            </p>

          </div>

        </div>

        <div className="flex flex-col items-end text-sec-text">

          <div className="flex items-center gap-1">

            <Clock className="h-3 w-3" />

            <span className="text-[11px] font-medium">
              {displayDate}
            </span>

          </div>

          <span className="text-[11px]">
            {displayTime}
          </span>

        </div>

      </div>

      {/* Divider */}

      <div className="mx-5 h-px bg-[rgba(9,20,38,.06)]" />

      {/* Technician */}

      <div className="px-5 py-3">

        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-sec-text">
          Technician
        </p>

        <p className="text-[12px] font-semibold text-volt-primary">

          {ticket.technician
            ? ticket.technician.fullName
            : 'Unassigned'}

        </p>

      </div>

      {/* Footer */}

      <div className="rounded-b-2xl bg-[#FAFAF8] p-4">

        <button
          onClick={() => onOpenDetails(ticket)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(9,20,38,.08)] bg-white py-2.5 text-[12px] font-bold uppercase tracking-wide text-volt-primary transition hover:bg-volt-container active:scale-[0.98]"
        >
          View Details

          <ArrowRight className="h-3.5 w-3.5" />

        </button>

      </div>

    </article>
  );
}