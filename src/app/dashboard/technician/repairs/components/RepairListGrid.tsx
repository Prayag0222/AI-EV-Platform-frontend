'use client';

import React from 'react';
import { RepairTicket } from '../types';
import RepairSelectionCard from './RepairSelectionCard';
import { Wrench } from 'lucide-react';
import Link from 'next/link';

interface RepairListGridProps {
  tickets: RepairTicket[];
  selectedTicketId: number | null;
  onTicketSelect: (id: number) => void;
}

export default function RepairListGrid({
  tickets,
  selectedTicketId,
  onTicketSelect
}: RepairListGridProps) {
  
  // 🛡️ 1. EMPTY STATE CONTAINER MANAGEMENT
  // Draws an intuitive, non-crashing graphic block if filters return zero rows
  if (!tickets || tickets.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-border bg-white p-12 text-center flex flex-col items-center justify-center gap-3 transition-all duration-200 animate-fade-in">
        <div className="size-12 rounded-xl bg-[#F9F6F1] text-muted-foreground flex items-center justify-center">
          <Wrench className="size-5 text-gray-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-display text-sm font-bold text-primary-text">
            No Repair Tickets Found
          </h3>
          <p className="text-xs text-sec-text max-w-xs mx-auto">
            We couldn&apos;t find any assignments matching your current search query string or active status filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    // 🎚️ 2. SCROLLABLE COLUMN MATRIX
    // Height limits align beautifully with the screen boundaries to prevent viewport distortion
    <div className="w-full flex flex-col gap-3 max-h-[calc(100vh-15rem)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border/60">
      {tickets.map((ticket: RepairTicket) => {
        // Guard against any corrupt or empty objects leaking into the loop pass
        if (!ticket || !ticket.id) return null;
        

        const isCurrentActive = ticket.id === selectedTicketId;

        return (
          <Link
          key={ticket.id}
          href={`/dashboard/technician/workspace/${ticket.id}`}
          className="block" // Keeps the link block-level so it fills the width
          >
          <RepairSelectionCard
          
            key={ticket.id}
            ticket={ticket}
            isActive={isCurrentActive}
            onClick={() => onTicketSelect(ticket.id)}
          />
          </Link>
        );
      })}
    </div>
  );
}