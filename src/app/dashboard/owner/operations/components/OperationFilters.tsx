'use client';

import { Search, SlidersHorizontal } from 'lucide-react';

interface OperationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;
}

const STATUS_OPTIONS = [
  'All',
  'Waiting',
  'In Service',
  'Parts Ordered',
  'Ready',
  'Delivered',
];

export default function OperationFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: OperationFiltersProps) {
  return (
    <section className="rounded-2xl border border-[rgba(9,20,38,.08)] bg-white p-4">

      <div className="flex flex-col gap-4 lg:flex-row">

        {/* Search */}

        <div className="relative flex-1">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sec-text" />

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ticket, customer, vehicle..."
            className="w-full rounded-xl border border-[rgba(9,20,38,.08)] bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-volt-secondary"
          />

        </div>

        {/* Status */}

        <div className="relative min-w-[220px]">

          <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sec-text" />

          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[rgba(9,20,38,.08)] bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-volt-secondary"
          >
            {STATUS_OPTIONS.map(item => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

        </div>

      </div>

    </section>
  );
}