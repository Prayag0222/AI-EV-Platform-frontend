'use client';
import { Zap, Battery, Cpu, Settings, Wrench, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Technician {
  id: string;
  specialization: 'BATTERY' | 'BMS' | 'CONTROLLER' | 'MOTOR' | 'GENERAL';
}

interface Props {
  technicians: Technician[];
}

const SPEC_ICONS = {
  BATTERY: { icon: Battery, label: 'Battery', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  BMS: { icon: Cpu, label: 'BMS', color: 'text-teal-600', bg: 'bg-teal-50' },
  CONTROLLER: { icon: Zap, label: 'Controller', color: 'text-purple-600', bg: 'bg-purple-50' },
  MOTOR: { icon: Settings, label: 'Motor', color: 'text-amber-600', bg: 'bg-amber-50' },
  GENERAL: { icon: Wrench, label: 'General', color: 'text-slate-600', bg: 'bg-slate-100' },
};

export default function TechnicianStats({ technicians }: Props) {
  const counts = technicians.reduce((acc, t) => {
    acc[t.specialization] = (acc[t.specialization] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
    >
      {/* Total */}
      <div className="col-span-2 sm:col-span-1 bg-volt-surface border border-volt-container rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-black text-volt-primary">{technicians.length}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</p>
        </div>
      </div>

      {/* Per specialization */}
      {Object.entries(SPEC_ICONS).map(([key, { icon: Icon, label, color, bg }]) => (
        <div key={key} className="bg-volt-surface border border-volt-container rounded-2xl p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          <div>
            <p className="text-xl font-black text-volt-primary">{counts[key] || 0}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}