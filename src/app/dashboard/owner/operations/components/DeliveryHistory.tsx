'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

import OperationJobCard from './OperationJobCard';
import { RepairTicket } from '../types/types';

interface DeliveryHistoryProps {
  tickets: RepairTicket[];
  onOpenDetails: (ticket: RepairTicket) => void;
 
  
}

export default function DeliveryHistory({
  tickets,
  onOpenDetails,
}: DeliveryHistoryProps) {
  const [expanded, setExpanded] = useState(false);

  if (!tickets.length) return null;

  return (
    <section>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 group"
      >
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text">
          <CheckCircle className="w-3.5 h-3.5 text-volt-secondary" />
          Delivery History
        </div>

        <div className="flex-1 h-px bg-[rgba(9,20,38,0.07)]" />

        <span className="rounded-full bg-volt-container px-2.5 py-0.5 text-[11px] font-bold text-sec-text">
          {tickets.length} Vehicles
        </span>

        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt-container text-sec-text transition group-hover:text-volt-primary">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.25,
            }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tickets.map((ticket) => (
                <OperationJobCard
    key={ticket.id}
    ticket={ticket}
    onOpenDetails={onOpenDetails}
/>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}