'use client';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

type Spec = 'ALL' | 'BATTERY' | 'BMS' | 'CONTROLLER' | 'MOTOR' | 'GENERAL';

interface Props {
  search: string;
  filter: Spec;
  onSearch: (v: string) => void;
  onFilter: (v: Spec) => void;
}

const FILTERS: { value: Spec; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'BATTERY', label: 'Battery' },
  { value: 'BMS', label: 'BMS' },
  { value: 'CONTROLLER', label: 'Controller' },
  { value: 'MOTOR', label: 'Motor' },
  { value: 'GENERAL', label: 'General' },
];

export default function TechnicianFilters({ search, filter, onSearch, onFilter }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="flex flex-col sm:flex-row gap-3"
    >
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name, email, phone..."
          className="w-full rounded-xl border border-volt-container bg-volt-surface pl-10 pr-10 py-2.5 text-sm text-volt-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Specialization filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:pb-0 shrink-0">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilter(f.value)}
            className={`shrink-0 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${
              filter === f.value
                ? 'bg-slate-900 text-white'
                : 'bg-volt-surface border border-volt-container text-slate-500 hover:text-volt-primary hover:border-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}