'use client';
import {
  User, Mail, Phone, MapPin, Briefcase,
  X, Save, UserPlus, PencilLine,
  CheckCircle2, AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface Props {
  open: boolean;
  editingId: string | null;
  formData: TechnicianFormData;
  editFormData: TechnicianEditFormData;
  formSuccessMessage: string | null;
  formErrorMessage: string | null;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onEditInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onEditSave: (id: string) => void;
  onClose: () => void;
}

const input = 'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-volt-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent focus:bg-white transition';
const inputIcon = 'w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-3 text-sm text-volt-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent focus:bg-white transition';
const label = 'block text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1.5';

function Field({ l, children }: { l: string; children: React.ReactNode }) {
  return <div><label className={label}>{l}</label>{children}</div>;
}

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{children}</span>;
}

function SpecOptions() {
  return <>
    <option value="GENERAL">General EV Systems</option>
    <option value="BATTERY">Battery Pack</option>
    <option value="BMS">BMS Systems</option>
    <option value="CONTROLLER">Controller</option>
    <option value="MOTOR">Powertrain Motor</option>
  </>;
}

export default function TechnicianFormModal({
  open, editingId, formData, editFormData,
  formSuccessMessage, formErrorMessage,
  onInputChange, onEditInputChange,
  onFormSubmit, onEditSave, onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                  {editingId
                    ? <PencilLine className="w-4 h-4 text-white" />
                    : <UserPlus className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {editingId ? 'Edit Technician' : 'Add Technician'}
                  </p>
                  <h2 className="text-sm font-black text-slate-900 leading-tight">
                    {editingId ? 'Update profile' : 'Register new engineer'}
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              {/* Messages */}
              {formSuccessMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {formSuccessMessage}
                </div>
              )}
              {formErrorMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {formErrorMessage}
                </div>
              )}

              {editingId ? (
                /* ── Edit mode ── */
                <>
                  <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Employee ID</span>
                    <span className="font-mono text-sm font-bold text-volt-secondary">#{editFormData.employeeId}</span>
                  </div>

                  <Field l="Full Name">
                    <input name="fullName" value={editFormData.fullName} onChange={onEditInputChange} className={input} placeholder="Full name" />
                  </Field>

                  <Field l="Specialization">
                    <select name="specialization" value={editFormData.specialization} onChange={onEditInputChange} className={input}>
                      <SpecOptions />
                    </select>
                  </Field>

                  <Field l="Email">
                    <div className="relative">
                      <Icon><Mail className="w-4 h-4" /></Icon>
                      <input type="email" name="email" value={editFormData.email} onChange={onEditInputChange} className={inputIcon} placeholder="email@voltops.in" />
                    </div>
                  </Field>

                  <Field l="Phone">
                    <div className="relative">
                      <Icon><Phone className="w-4 h-4" /></Icon>
                      <input type="tel" name="phone" value={editFormData.phone} onChange={onEditInputChange} className={inputIcon} placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </Field>

                  <Field l="Experience (years)">
                    <div className="relative">
                      <Icon><Briefcase className="w-4 h-4" /></Icon>
                      <input type="number" name="experienceYears" value={editFormData.experienceYears} onChange={onEditInputChange} className={inputIcon} placeholder="e.g. 5" min="0" />
                    </div>
                  </Field>

                  <Field l="Address (optional)">
                    <div className="relative">
                      <Icon><MapPin className="w-4 h-4" /></Icon>
                      <input type="text" name="address" value={editFormData.address} onChange={onEditInputChange} className={inputIcon} placeholder="Street, area, city" />
                    </div>
                  </Field>
                </>
              ) : (
                /* ── Add mode ── */
                <form id="add-form" onSubmit={onFormSubmit} className="space-y-4">
                  <Field l="Full Name *">
                    <div className="relative">
                      <Icon><User className="w-4 h-4" /></Icon>
                      <input type="text" name="fullName" value={formData.fullName} onChange={onInputChange} required className={inputIcon} placeholder="e.g. Anand Kumar" />
                    </div>
                  </Field>

                  <Field l="Specialization *">
                    <select name="specialization" value={formData.specialization} onChange={onInputChange} className={input}>
                      <SpecOptions />
                    </select>
                  </Field>

                  <Field l="Email *">
                    <div className="relative">
                      <Icon><Mail className="w-4 h-4" /></Icon>
                      <input type="email" name="email" value={formData.email} onChange={onInputChange} required className={inputIcon} placeholder="anand@voltops.in" />
                    </div>
                  </Field>

                  <Field l="Phone *">
                    <div className="relative">
                      <Icon><Phone className="w-4 h-4" /></Icon>
                      <input type="tel" name="phone" value={formData.phone} onChange={onInputChange} required className={inputIcon} placeholder="e.g. 9876543210" />
                    </div>
                  </Field>

                  <Field l="Experience (years) *">
                    <div className="relative">
                      <Icon><Briefcase className="w-4 h-4" /></Icon>
                      <input type="number" name="experienceYears" value={formData.experienceYears} onChange={onInputChange} required className={inputIcon} placeholder="e.g. 5" min="0" />
                    </div>
                  </Field>

                  <Field l="Address (optional)">
                    <div className="relative">
                      <Icon><MapPin className="w-4 h-4" /></Icon>
                      <input type="text" name="address" value={formData.address} onChange={onInputChange} className={inputIcon} placeholder="Street, area, city" />
                    </div>
                  </Field>
                </form>
              )}
            </div>

            {/* Footer CTA */}
            <div className="shrink-0 border-t border-slate-100 px-6 py-4">
              {editingId ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => onEditSave(editingId)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-black transition-colors active:scale-[0.98]"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  form="add-form"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-black transition-colors active:scale-[0.98]"
                >
                  <UserPlus className="w-4 h-4" />
                  Register Technician
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}