'use client';

import { ReactNode } from 'react';

import EmptyOperationState from './EmptyOperationState';
import OperationJobCard from './OperationJobCard';
import SectionLabel from './SectionLabel';

import { RepairTicket } from '../types/types';

interface OperationSectionProps {
  icon: ReactNode;
  title: string;
  count: number;
  accent?: boolean;
  tickets: RepairTicket[];
  emptyTitle: string;
  emptyDescription: string;
  onOpenDetails: (ticket: RepairTicket) => void;
}

export default function OperationSection({
  icon,
  title,
  count,
  accent = false,
  tickets,
  emptyTitle,
  emptyDescription,
  onOpenDetails,
}: OperationSectionProps) {
  return (
    <section>

      <SectionLabel
        icon={icon}
        label={title}
        count={count}
        accent={accent}
      />

      {tickets.length === 0 ? (
        <div className="mt-5">
          <EmptyOperationState
            title={emptyTitle}
            description={emptyDescription}
          />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tickets.map(ticket => (
            <OperationJobCard
              key={ticket.id}
              ticket={ticket}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      )}

    </section>
  );
}