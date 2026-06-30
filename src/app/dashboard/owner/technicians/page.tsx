'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, AlertTriangle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import TechnicianHeader from './components/TechnicianHeader';
import TechnicianStats from './components/TechnicianStats';
import TechnicianFilters from './components/TechnicianFilters';
import TechnicianCard from './components/TechnicianCard';
import TechnicianFormModal, {
  TechnicianFormData,
  TechnicianEditFormData,
} from './components/TechnicianFormModal';
import DeleteTechnicianModal from './components/DeleteTechnicianModal';

const API = process.env.NEXT_PUBLIC_API_URL;

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

const BLANK_FORM: TechnicianFormData = {
  fullName: '', email: '', phone: '',
  specialization: 'GENERAL', experienceYears: '', address: '',
};

const BLANK_EDIT: TechnicianEditFormData = {
  fullName: '', email: '', phone: '', employeeId: '',
  specialization: 'GENERAL', experienceYears: '', address: '',
};

export default function OwnerTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  // Form modal
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<TechnicianFormData>(BLANK_FORM);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<TechnicianEditFormData>(BLANK_EDIT);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<Technician | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState<'ALL' | Technician['specialization']>('ALL');

  // ── Fetch ──
  useEffect(() => {
    let mounted = true;
    fetch(`${API}/technician/getAllTechnicians`, { credentials: 'include' })
      .then((r) => { if (!r.ok) throw new Error('Failed to load technicians.'); return r.json(); })
      .then((data) => { if (mounted) { setTechnicians(data); setError(null); } })
      .catch((e) => { if (mounted) setError(e.message); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, [refresh]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    return technicians.filter((t) => {
      const matchSpec = specFilter === 'ALL' || t.specialization === specFilter;
      const q = search.toLowerCase();
      const matchSearch = !q ||
        t.fullName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.phone.includes(q);
      return matchSpec && matchSearch;
    });
  }, [technicians, search, specFilter]);

  // ── Handlers ──
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    try {
      const res = await fetch(`${API}/technician/createTechnician`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to register technician.');
      setFormSuccess('Technician registered successfully.');
      setFormData(BLANK_FORM);
      setRefresh((p) => p + 1);
      toast.success('Technician registered!');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong.';
      setFormError(msg);
      toast.error(msg);
    }
  };

  const handleEditSave = async (id: string) => {
    try {
      const res = await fetch(`${API}/technician/updateTechnician/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed.');
      setEditingId(null);
      setFormOpen(false);
      setRefresh((p) => p + 1);
      toast.success('Technician updated!');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Update failed.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API}/technician/deleteTechnician/${deleteTarget.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed.');
      setTechnicians((p) => p.filter((t) => t.id !== deleteTarget.id));
      if (editingId === deleteTarget.id) { setEditingId(null); setFormOpen(false); }
      setDeleteTarget(null);
      toast.success('Technician removed.');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Delete failed.');
    }
  };

  const startEditing = (tech: Technician) => {
    setEditingId(tech.id);
    setEditFormData({
      fullName: tech.fullName,
      email: tech.email,
      phone: tech.phone,
      employeeId: tech.employeeId,
      specialization: tech.specialization,
      experienceYears: tech.experienceYears,
      address: tech.address || '',
    });
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormSuccess(null);
    setFormError(null);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData(BLANK_FORM);
    setFormSuccess(null);
    setFormError(null);
    setFormOpen(true);
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-volt-background">
        <Loader2 className="h-7 w-7 animate-spin text-volt-secondary" />
        <p className="text-sm text-slate-400">Loading technicians…</p>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-volt-background">
        <div className="w-full max-w-sm rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-1">Failed to load</h3>
          <p className="text-sm text-slate-500">{error}</p>
          <button
            onClick={() => setRefresh((p) => p + 1)}
            className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-volt-background">

      <TechnicianHeader count={technicians.length} onAdd={handleAdd} />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-5">

        <TechnicianStats technicians={technicians} />

        <TechnicianFilters
          search={search}
          filter={specFilter}
          onSearch={setSearch}
          onFilter={setSpecFilter}
        />

        {/* Results label */}
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Workshop Engineers
          </p>
          <div className="flex-1 h-px bg-volt-container" />
          <span className="text-[10px] font-bold text-volt-secondary bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {filtered.length} shown
          </span>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-volt-container rounded-2xl bg-volt-surface">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="font-bold text-slate-700 text-sm">
              {search || specFilter !== 'ALL' ? 'No results found' : 'No technicians yet'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {search || specFilter !== 'ALL'
                ? 'Try a different search or filter'
                : 'Add your first engineer to get started'}
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
            }}
          >
            {filtered.map((tech) => (
              <motion.div
                key={tech.id}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <TechnicianCard
                  tech={tech}
                  isEditing={tech.id === editingId}
                  onStartEdit={startEditing}
                  onDelete={(id) => {
                    const t = technicians.find((x) => x.id === id);
                    if (t) setDeleteTarget(t);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Form Modal */}
      <TechnicianFormModal
        open={formOpen}
        editingId={editingId}
        formData={formData}
        editFormData={editFormData}
        formSuccessMessage={formSuccess}
        formErrorMessage={formError}
        onInputChange={handleInputChange}
        onEditInputChange={handleEditInputChange}
        onFormSubmit={handleFormSubmit}
        onEditSave={handleEditSave}
        onClose={handleCloseForm}
      />

      {/* Delete Modal */}
      <DeleteTechnicianModal
        open={!!deleteTarget}
        techName={deleteTarget?.fullName ?? ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}