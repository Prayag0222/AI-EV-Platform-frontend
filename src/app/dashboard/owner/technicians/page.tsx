'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, Users } from 'lucide-react';
import TechnicianCard from './components/TechnicianCard';
import TechnicianFormConsole, {
  TechnicianFormData,
  TechnicianEditFormData,
} from './components/TechnicianFormConsole';

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

export default function OwnerTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [triggerRefresh, setTriggerRefresh] = useState<number>(0);

  const [formData, setFormData] = useState<TechnicianFormData>({
    fullName: '',
    email: '',
    phone: '',
    specialization: 'GENERAL',
    experienceYears: '',
    address: '',
  });

  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<TechnicianEditFormData>({
    fullName: '',
    email: '',
    phone: '',
    employeeId: '',
    specialization: 'GENERAL',
    experienceYears: '',
    address: '',
  });

  useEffect(() => {
    let isMounted = true;

    async function loadTechnicians() {
      try {
        const response = await fetch('http://localhost:3000/api/technician/getAllTechnicians');
        if (!response.ok) throw new Error('Could not load technicians from the server.');
        const data = await response.json();
        if (isMounted) {
          setTechnicians(data);
          setErrorMessage(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const e = err instanceof Error ? err : new Error(String(err));
          setErrorMessage(e.message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadTechnicians();
    return () => { isMounted = false; };
  }, [triggerRefresh]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrorMessage(null);
    setFormSuccessMessage(null);

    try {
      const response = await fetch('http://localhost:3000/api/technician/createTechnician', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Failed to register technician.');

      setFormSuccessMessage('Technician registered successfully.');
      setTriggerRefresh((prev) => prev + 1);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        specialization: 'GENERAL',
        experienceYears: '',
        address: '',
      });
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      setFormErrorMessage(e.message);
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    if (!confirm('Remove this technician from the workshop?')) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/technician/deleteTechnician/${id}`,
        { method: 'DELETE' }
      );
      const responseData = await response.json();
      if (!response.ok) {
        alert(responseData.message || 'Delete failed.');
        return;
      }
      setTechnicians((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      alert(e.message);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSaveSubmit = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/technician/updateTechnician/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editFormData),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        alert(responseData.message || 'Update failed.');
        return;
      }
      setEditingId(null);
      setTriggerRefresh((prev) => prev + 1);
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error(String(err));
      alert(e.message);
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 text-volt-secondary animate-spin" />
        <p className="text-sm font-medium text-sec-text">Loading technicians…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (errorMessage) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white border border-[rgba(186,26,26,0.15)] rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#FFDAD6] flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-5 w-5 text-volt-terracotta" />
          </div>
          <h3 className="font-black text-base text-volt-primary mb-1.5">Failed to load</h3>
          <p className="text-sm text-sec-text leading-relaxed">{errorMessage}</p>
          <button
            onClick={() => setTriggerRefresh((p) => p + 1)}
            className="mt-5 px-5 py-2.5 bg-volt-primary text-white text-sm font-bold rounded-xl hover:bg-[#1a2d47] transition"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-volt-background">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[rgba(9,20,38,0.08)] px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text mb-2">
              <Users className="w-3.5 h-3.5 text-volt-secondary" />
              <span>Workshop</span>
              <span className="text-[#C5C6CD]">/</span>
              <span className="text-volt-primary">Technicians</span>
            </div>
            <h1 className="text-[26px] font-black text-volt-primary tracking-tight leading-tight">
              Technician Management
            </h1>
            <p className="text-sm text-sec-text mt-1">
              Manage your workshop engineers, specializations, and staff profiles.
            </p>
          </div>

          {/* Summary pill */}
          <div className="flex items-center gap-2 bg-volt-background border border-[rgba(9,20,38,0.08)] rounded-xl px-4 py-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-green flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-volt-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-sec-text">Active staff</p>
              <p className="text-base font-black text-volt-primary leading-none">{technicians.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left: Form panel */}
          <div className="lg:col-span-1">
            <TechnicianFormConsole
              editingId={editingId}
              formData={formData}
              editFormData={editFormData}
              formSuccessMessage={formSuccessMessage}
              formErrorMessage={formErrorMessage}
              onInputChange={handleInputChange}
              onEditInputChange={handleEditInputChange}
              onFormSubmit={handleFormSubmit}
              onEditSave={handleEditSaveSubmit}
              onCancelEdit={() => setEditingId(null)}
            />
          </div>

          {/* Right: Cards */}
          <div className="lg:col-span-2 space-y-5">

            {/* Section label */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text">
                <svg className="w-3.5 h-3.5 text-volt-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                Workshop engineers
              </div>
              <div className="flex-1 h-px bg-[rgba(9,20,38,0.07)]" />
              <span className="text-[11px] font-bold text-volt-secondary bg-emerald-green px-2.5 py-0.5 rounded-full">
                {technicians.length} active
              </span>
            </div>

            {technicians.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-[rgba(9,20,38,0.08)] rounded-2xl bg-white">
                <div className="w-12 h-12 rounded-xl bg-volt-container flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-sec-text" />
                </div>
                <p className="font-bold text-volt-primary text-sm">No technicians yet</p>
                <p className="text-xs text-sec-text mt-1">Register your first engineer using the form.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technicians.map((tech) => (
                  <TechnicianCard
                    key={tech.id}
                    tech={tech}
                    isEditing={tech.id === editingId}
                    onStartEdit={startEditing}
                    onDelete={handleDeleteTechnician}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}