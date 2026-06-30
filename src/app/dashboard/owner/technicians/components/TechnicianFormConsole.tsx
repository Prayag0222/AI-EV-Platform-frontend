'use client';

import React from 'react';
import {
  User, Mail, Phone, MapPin, Briefcase,
  X, Save, UserPlus, PencilLine,
} from 'lucide-react';
import { motion } from 'framer-motion';


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

const inputClass =
  'w-full rounded-lg border border-[rgba(9,20,38,0.12)] bg-volt-background px-3 py-2.5 text-sm font-medium text-volt-primary placeholder:text-[#C5C6CD] placeholder:font-normal focus:border-volt-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-volt-secondary/10 transition';

const inputWithIconClass =
  'w-full rounded-lg border border-[rgba(9,20,38,0.12)] bg-volt-background pl-9 pr-3 py-2.5 text-sm font-medium text-volt-primary placeholder:text-[#C5C6CD] placeholder:font-normal focus:border-volt-secondary focus:bg-white focus:outline-none focus:ring-2 focus:ring-volt-secondary/10 transition';

const selectClass =
  'w-full rounded-lg border border-[rgba(9,20,38,0.12)] bg-volt-background px-3 py-2.5 text-sm font-medium text-volt-primary focus:border-volt-secondary focus:outline-none focus:ring-2 focus:ring-volt-secondary/10 transition h-[42px]';

const labelClass =
  'block text-[11px] font-bold tracking-widest uppercase text-sec-text mb-1.5';

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sec-text pointer-events-none">
      {children}
    </span>
  );
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
  onCancelEdit,
}: TechnicianFormConsoleProps) {
  return (
    <motion.div  
    initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
    className="bg-white rounded-2xl border border-[rgba(9,20,38,0.08)] overflow-hidden sticky top-6">

      {/* ── Panel header ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(9,20,38,0.06)] bg-[#FAFAF8]">
        <div className="flex items-center gap-2">
          {editingId ? (
            <PencilLine className="w-4 h-4 text-volt-secondary" />
          ) : (
            <UserPlus className="w-4 h-4 text-volt-secondary" />
          )}
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-sec-text">
            {editingId ? 'Edit technician' : 'Register technician'}
          </h2>
        </div>
        {editingId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-volt-container text-sec-text hover:text-volt-primary transition"
            aria-label="Cancel edit"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">

        {/* ── Edit mode ── */}
        {editingId ? (
          <>
            {/* Employee ID pill */}
            <div className="flex items-center justify-between bg-volt-background border border-[rgba(9,20,38,0.08)] rounded-lg px-3 py-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-sec-text">Employee ID</span>
              <span className="font-mono text-[12px] font-bold text-volt-secondary tracking-wider">
                #{editFormData.employeeId}
              </span>
            </div>

            <FormField label="Full name">
              <input
                type="text"
                name="fullName"
                value={editFormData.fullName}
                onChange={onEditInputChange}
                className={inputClass}
                placeholder="Full name"
              />
            </FormField>

            <FormField label="Specialization">
              <select
                name="specialization"
                value={editFormData.specialization}
                onChange={onEditInputChange}
                className={selectClass}
              >
                <SpecOptions />
              </select>
            </FormField>

            <FormField label="Email address">
              <div className="relative">
                <IconWrap><Mail className="w-3.5 h-3.5" /></IconWrap>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={onEditInputChange}
                  className={inputWithIconClass}
                  placeholder="email@voltops.in"
                />
              </div>
            </FormField>

            <FormField label="Phone number">
              <div className="relative">
                <IconWrap><Phone className="w-3.5 h-3.5" /></IconWrap>
                <input
                  type="text"
                  name="phone"
                  value={editFormData.phone}
                  onChange={onEditInputChange}
                  className={inputWithIconClass}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </FormField>

            <FormField label="Years of experience">
              <div className="relative">
                <IconWrap><Briefcase className="w-3.5 h-3.5" /></IconWrap>
                <input
                  type="number"
                  name="experienceYears"
                  value={editFormData.experienceYears}
                  onChange={onEditInputChange}
                  className={inputWithIconClass}
                  placeholder="e.g. 5"
                  min="0"
                />
              </div>
            </FormField>

            <FormField label="Address (optional)">
              <div className="relative">
                <IconWrap><MapPin className="w-3.5 h-3.5" /></IconWrap>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={onEditInputChange}
                  className={inputWithIconClass}
                  placeholder="Street, area, city"
                />
              </div>
            </FormField>

            {/* Edit actions */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => onEditSave(editingId)}
                className="flex-1 flex items-center justify-center gap-2 bg-volt-primary text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl hover:bg-[#1a2d47] transition active:scale-[0.98]"
              >
                <Save className="w-3.5 h-3.5" />
                Save changes
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 border border-[rgba(9,20,38,0.12)] text-sec-text hover:text-volt-primary hover:bg-volt-background text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          /* ── Register mode ── */
          <>
            {/* Status messages */}
            {formSuccessMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-volt-secondary/20 bg-emerald-green px-3.5 py-2.5 text-xs font-semibold text-volt-secondary">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formSuccessMessage}
              </div>
            )}

            {formErrorMessage && (
              <div className="flex items-center gap-2 rounded-xl border border-volt-terracotta/20 bg-[#FFDAD6] px-3.5 py-2.5 text-xs font-semibold text-volt-terracotta">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {formErrorMessage}
              </div>
            )}

            <form onSubmit={onFormSubmit} className="space-y-4">
              <FormField label="Full name *">
                <div className="relative">
                  <IconWrap><User className="w-3.5 h-3.5" /></IconWrap>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={onInputChange}
                    required
                    className={inputWithIconClass}
                    placeholder="e.g. Anand Kumar"
                  />
                </div>
              </FormField>

              <FormField label="Specialization *">
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={onInputChange}
                  className={selectClass}
                >
                  <SpecOptions />
                </select>
              </FormField>

              <FormField label="Email address *">
                <div className="relative">
                  <IconWrap><Mail className="w-3.5 h-3.5" /></IconWrap>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    required
                    className={inputWithIconClass}
                    placeholder="anand@voltops.in"
                  />
                </div>
              </FormField>

              <FormField label="Phone number *">
                <div className="relative">
                  <IconWrap><Phone className="w-3.5 h-3.5" /></IconWrap>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={onInputChange}
                    required
                    className={inputWithIconClass}
                    placeholder="e.g. 9876543210"
                  />
                </div>
              </FormField>

              <FormField label="Years of experience *">
                <div className="relative">
                  <IconWrap><Briefcase className="w-3.5 h-3.5" /></IconWrap>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={onInputChange}
                    required
                    className={inputWithIconClass}
                    placeholder="e.g. 5"
                    min="0"
                  />
                </div>
              </FormField>

              <FormField label="Address (optional)">
                <div className="relative">
                  <IconWrap><MapPin className="w-3.5 h-3.5" /></IconWrap>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={onInputChange}
                    className={inputWithIconClass}
                    placeholder="Street, area, city"
                  />
                </div>
              </FormField>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-volt-primary text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#1a2d47] transition active:scale-[0.98]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register technician
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ── Shared sub-components ── */

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function SpecOptions() {
  return (
    <>
      <option value="GENERAL">General EV Systems</option>
      <option value="BATTERY">High-Voltage Battery Pack</option>
      <option value="BMS">Smart BMS Systems</option>
      <option value="CONTROLLER">Digital Controller Architecture</option>
      <option value="MOTOR">Powertrain Motor</option>
    </>
  );
}