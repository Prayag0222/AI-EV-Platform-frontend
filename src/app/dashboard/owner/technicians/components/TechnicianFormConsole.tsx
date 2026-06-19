'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Settings, X, Save, Hash } from 'lucide-react';

export interface TechnicianFormData {
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  experienceYears: string;
  address: string;
}

export interface TechnicianEditFormData {
  fullName: string;
  email: string;
  phone: string;
  employeeId: string;
  specialization: string;
  experienceYears: string;
  address: string;
}

interface TechnicianFormConsoleProps {
  editingId: string | null;
  formData: TechnicianFormData;
  editFormData: TechnicianEditFormData;
  formSuccessMessage: string | null;
  formErrorMessage: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEditInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onEditSave: (id: string) => void;
  onCancelEdit: () => void;
}

export default function TechnicianFormConsole({
  editingId,
  formData,
  editFormData,
  formSuccessMessage,
  formErrorMessage,
  onInputChange,
  onEditInputChange,
  onFormSubmit,
  onEditSave,
  onCancelEdit
}: TechnicianFormConsoleProps) {
  return (
    <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)] sticky top-24">
      {editingId ? (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-volt-container pb-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-volt-secondary animate-spin stroke-[1.5]" />
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">Edit Staff Profile</h2>
            </div>
            <button type="button" onClick={onCancelEdit} className="p-1 text-slate-400 hover:text-volt-primary rounded hover:bg-volt-background transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 text-sm font-sans">
            <div className="p-3 bg-volt-background rounded-volt border border-volt-container flex items-center justify-between font-mono text-[11px]">
              <span className="text-slate-400 font-display font-bold uppercase tracking-wide">Tracking Token:</span>
              <span className="text-volt-secondary font-bold select-all flex items-center gap-1">
                <Hash className="h-3 w-3" /> {editFormData.employeeId}
              </span>
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Full Name</label>
              <input type="text" name="fullName" value={editFormData.fullName} onChange={onEditInputChange} className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" />
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Specialization Track</label>
              <select name="specialization" value={editFormData.specialization} onChange={onEditInputChange} className="w-full rounded-volt border border-volt-container bg-white px-3 py-2 text-sm text-gray-800 outline-none h-[38px] focus:border-volt-secondary">
                <option value="GENERAL">General EV Systems</option>
                <option value="BATTERY">High-Voltage Battery Pack</option>
                <option value="BMS">Smart BMS Systems</option>
                <option value="CONTROLLER">Digital Controller Architectures</option>
                <option value="MOTOR">Powertrain Mechanical Motor</option>
              </select>
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Email Address</label>
              <input type="email" name="email" value={editFormData.email} onChange={onEditInputChange} className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" />
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Phone Contact</label>
              <input type="text" name="phone" value={editFormData.phone} onChange={onEditInputChange} className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" />
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Experience (Years)</label>
              <input type="number" name="experienceYears" value={editFormData.experienceYears} onChange={onEditInputChange} className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" />
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Address Location</label>
              <input type="text" name="address" value={editFormData.address} onChange={onEditInputChange} className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" />
            </div>

            <div className="pt-2 flex gap-3">
              <button type="button" onClick={() => onEditSave(editingId || '')} className="flex-1 flex items-center justify-center gap-1.5 bg-volt-secondary text-volt-background font-display text-xs font-bold uppercase tracking-wider py-2.5 rounded-volt hover:bg-volt-secondary/90 shadow transition-all cursor-pointer">
                <Save className="h-3.5 w-3.5" /> Save Changes
              </button>
              <button type="button" onClick={onCancelEdit} className="px-4 border border-volt-container text-slate-500 hover:text-volt-primary font-display text-xs font-bold uppercase tracking-wider py-2.5 rounded-volt hover:bg-volt-background transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="border-b border-volt-container pb-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Register New Team Member</h2>
          </div>

          {formSuccessMessage && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium rounded-volt text-xs leading-relaxed">{formSuccessMessage}</div>}
          {formErrorMessage && <div className="p-3 bg-volt-terracotta/10 border border-volt-terracotta/20 text-volt-terracotta font-medium rounded-volt text-xs leading-relaxed">{formErrorMessage}</div>}

          <form onSubmit={onFormSubmit} className="space-y-4 font-sans text-sm">
            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                <input type="text" name="fullName" value={formData.fullName} onChange={onInputChange} required className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" placeholder="e.g. Anand Kumar" />
              </div>
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Specialization *</label>
              <select name="specialization" value={formData.specialization} onChange={onInputChange} className="w-full rounded-volt border border-volt-container bg-white px-3 py-2.5 text-sm text-gray-800 outline-none h-[42px] focus:border-volt-secondary">
                <option value="GENERAL">General EV Systems</option>
                <option value="BATTERY">High-Voltage Battery Pack</option>
                <option value="BMS">Smart BMS Systems</option>
                <option value="CONTROLLER">Digital Controller Architectures</option>
                <option value="MOTOR">Powertrain Mechanical Motor</option>
              </select>
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                <input type="email" name="email" value={formData.email} onChange={onInputChange} required className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" placeholder="anand@voltops.io" />
              </div>
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                <input type="text" name="phone" value={formData.phone} onChange={onInputChange} required className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" placeholder="e.g. 9876543210" />
              </div>
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Years of Experience *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                <input type="number" name="experienceYears" value={formData.experienceYears} onChange={onInputChange} required className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" placeholder="e.g. 5" min="0" />
              </div>
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Shop Address (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                <input type="text" name="address" value={formData.address} onChange={onInputChange} className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" placeholder="Bays floor sector location code..." />
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full bg-volt-primary text-white font-display text-xs font-bold uppercase tracking-widest py-3.5 rounded shadow-md hover:opacity-90 transition-all cursor-pointer">
                Commit Register Clearances
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}