'use client';

import React from 'react';
import { Mail, Phone, MapPin, UserRoundPen, Trash2 } from 'lucide-react';

interface Technician {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  specialization: 'BATTERY' | 'BMS' | 'CONTROLLER' | 'MOTOR' | 'GENERAL';
  experienceYears: string;
  address?: string | null;
  profileImage?: string | null;
}

interface TechnicianCardProps {
  tech: Technician;
  isEditing: boolean;
  onStartEdit: (tech: Technician) => void;
  onDelete: (id: string) => void;
}

const SPEC_CONFIG: Record<
  Technician['specialization'],
  { label: string; bg: string; text: string; dot: string }
> = {
  BATTERY: {
    label: 'Battery Pack',
    bg: 'bg-emerald-green',
    text: 'text-volt-secondary',
    dot: 'bg-volt-secondary',
  },
  BMS: {
    label: 'BMS Systems',
    bg: 'bg-[#D6EFDE]',
    text: 'text-[#006F67]',
    dot: 'bg-[#006F67]',
  },
  CONTROLLER: {
    label: 'Controller',
    bg: 'bg-[#EDE9FE]',
    text: 'text-[#5B21B6]',
    dot: 'bg-[#5B21B6]',
  },
  MOTOR: {
    label: 'Powertrain Motor',
    bg: 'bg-volt-sand',
    text: 'text-[#564427]',
    dot: 'bg-[#564427]',
  },
  GENERAL: {
    label: 'General EV',
    bg: 'bg-volt-container',
    text: 'text-sec-text',
    dot: 'bg-sec-text',
  },
};

function getInitials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].substring(0, 2).toUpperCase();
}

export default function TechnicianCard({
  tech,
  isEditing,
  onStartEdit,
  onDelete,
}: TechnicianCardProps) {
  const spec = SPEC_CONFIG[tech.specialization];

  return (
    <div
      className={`bg-white rounded-2xl border flex flex-col justify-between transition-all ${
        isEditing
          ? 'border-volt-secondary ring-2 ring-volt-secondary/10'
          : 'border-[rgba(9,20,38,0.08)] hover:border-[rgba(9,20,38,0.16)]'
      }`}
    >
      {/* ── Card top ── */}
      <div className="p-5">

        {/* Identity row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-volt-primary flex items-center justify-center text-white text-sm font-black select-none flex-shrink-0">
              {getInitials(tech.fullName)}
            </div>
            <div>
              <h3 className="text-sm font-black text-volt-primary leading-tight">
                {tech.fullName}
              </h3>
              <p className="text-[11px] font-mono font-semibold text-sec-text mt-0.5 tracking-wider">
                #{tech.employeeId}
              </p>
            </div>
          </div>

          {/* Specialization badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold flex-shrink-0 ${spec.bg} ${spec.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${spec.dot}`} />
            {spec.label}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(9,20,38,0.06)] mb-4" />

        {/* Meta row — experience */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-semibold text-sec-text uppercase tracking-wide">Experience</span>
          <span className="text-sm font-black text-volt-primary">{tech.experienceYears} yrs</span>
        </div>

        {/* Contact details */}
        <div className="space-y-2.5">
          <ContactLine icon={<Mail className="w-3.5 h-3.5" />} value={tech.email} />
          <ContactLine icon={<Phone className="w-3.5 h-3.5" />} value={tech.phone} />
          {tech.address && (
            <ContactLine icon={<MapPin className="w-3.5 h-3.5" />} value={tech.address} truncate />
          )}
        </div>
      </div>

      {/* ── Card footer ── */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-t border-[rgba(9,20,38,0.06)] bg-[#FAFAF8] rounded-b-2xl">
        {isEditing && (
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-volt-secondary mr-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-volt-secondary animate-pulse" />
            Editing…
          </span>
        )}

        <button
          type="button"
          onClick={() => onStartEdit(tech)}
          disabled={isEditing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[rgba(9,20,38,0.10)] bg-white text-sec-text hover:text-volt-primary hover:border-[rgba(9,20,38,0.2)] text-[11px] font-bold uppercase tracking-wide transition disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
        >
          <UserRoundPen className="w-3.5 h-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(tech.id)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[rgba(186,26,26,0.12)] bg-[#FFF5F5] text-volt-terracotta hover:bg-volt-terracotta hover:text-white text-[11px] font-bold uppercase tracking-wide transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </button>
      </div>
    </div>
  );
}

/* ── Sub-component ── */
function ContactLine({
  icon,
  value,
  truncate = false,
}: {
  icon: React.ReactNode;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-volt-secondary flex-shrink-0">{icon}</span>
      <span className={`text-[12.5px] text-primary-text font-medium ${truncate ? 'truncate' : ''}`}>
        {value}
      </span>
    </div>
  );
}