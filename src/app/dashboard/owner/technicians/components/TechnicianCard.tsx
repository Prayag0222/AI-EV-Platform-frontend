'use client';

import React from 'react';
import { Mail, Phone, MapPin, Edit3, Trash2, Hash } from 'lucide-react';

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

export default function TechnicianCard({ tech, isEditing, onStartEdit, onDelete }: TechnicianCardProps) {
  const getSpecialtyBadgeStyle = (spec: string) => {
    switch (spec) {
      case 'BATTERY': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
      case 'BMS': return 'bg-volt-secondary/10 border-volt-secondary/20 text-volt-secondary';
      case 'CONTROLLER': return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
      case 'MOTOR': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className={`bg-volt-surface border rounded-container p-5 shadow-[0_2px_4px_rgba(0,0,0,0.01)] hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group ${
      isEditing ? 'border-volt-secondary ring-2 ring-volt-secondary/10' : 'border-volt-container'
    }`}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-9 bg-volt-primary border border-volt-container text-white rounded-full flex items-center justify-center font-display font-bold uppercase text-sm select-none shadow-inner group-hover:bg-volt-secondary group-hover:text-volt-background transition-colors duration-150">
              {tech.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-volt-primary font-sans group-hover:text-volt-secondary transition-colors leading-tight">
                {tech.fullName}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 font-mono mt-0.5 tracking-wider uppercase inline-flex items-center gap-1">
                <Hash className="h-3 w-3 text-slate-400" /> {tech.employeeId}
              </p>
            </div>
          </div>
          {isEditing && <span className="animate-pulse h-2 w-2 rounded-full bg-volt-secondary" />}
        </div>

        <div className="mt-5 pt-3 border-t border-volt-container/60 space-y-2.5 font-sans text-xs text-slate-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Expertise Track:</span>
            <span className={`px-2 py-0.5 border rounded font-display text-[9px] font-bold tracking-wider uppercase ${getSpecialtyBadgeStyle(tech.specialization)}`}>
              {tech.specialization}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Experience Buffer:</span>
            <span className="text-volt-primary font-semibold">{tech.experienceYears} Years Status</span>
          </div>
          <div className="flex items-center gap-2 border-t border-volt-container/30 pt-2.5 mt-1 select-all">
            <Mail className="h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
            <span className="truncate">{tech.email}</span>
          </div>
          <div className="flex items-center gap-2 select-all">
            <Phone className="h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
            <span>{tech.phone}</span>
          </div>
          {tech.address && (
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400 stroke-[1.5] flex-shrink-0" />
              <span className="truncate">{tech.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-3 border-t border-volt-container/60 flex items-center justify-end gap-2.5">
        <button 
          type="button"
          onClick={() => onStartEdit(tech)} 
          disabled={isEditing}
          className="px-3 py-1.5 border border-volt-container rounded-volt font-display text-[10px] font-bold tracking-wide uppercase text-slate-500 hover:text-volt-primary hover:border-slate-400 hover:bg-volt-background transition-all disabled:opacity-30 flex items-center gap-1"
        >
          <Edit3 className="h-3 w-3" /> Edit Details
        </button>
        <button 
          type="button"
          onClick={() => onDelete(tech.id)} 
          className="px-3 py-1.5 bg-volt-terracotta/5 border border-volt-terracotta/10 text-volt-terracotta hover:bg-volt-terracotta hover:text-white rounded-volt font-display text-[10px] font-bold tracking-wide uppercase transition-all flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" /> Remove Staff
        </button>
      </div>
    </div>
  );
}