'use client';
import { Users, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  count: number;
  onAdd: () => void;
}

export default function TechnicianHeader({ count, onAdd }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-volt-surface border-b border-volt-container px-4 sm:px-8 py-5"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5">
            <Users className="w-3.5 h-3.5 text-volt-secondary" />
            <span>Workshop</span>
            <span className="text-slate-300">/</span>
            <span className="text-volt-primary">Technicians</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-volt-primary leading-tight">
            Technician Management
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage your workshop engineers and staff profiles.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Staff count pill */}
          <div className="hidden sm:flex items-center gap-2 bg-volt-background border border-volt-container rounded-xl px-4 py-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-volt-secondary" />
            </div>
            <div>
              <p className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Active staff</p>
              <p className="text-base font-black text-volt-primary leading-none">{count}</p>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={onAdd}
            className="flex items-center gap-2 rounded-xl bg-volt-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Technician</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}