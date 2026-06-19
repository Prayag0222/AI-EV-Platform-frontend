'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, AlertTriangle, Cpu } from 'lucide-react';
import TechnicianCard from './components/TechnicianCard';
import TechnicianFormConsole, { TechnicianFormData, TechnicianEditFormData } from './components/TechnicianFormConsole';

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

  // Declarative synchronization state key. Updates to this increment trigger local rehydration loops cleanly.
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

  /* ==========================================================================
     📡 DECLARATIVE HOOK SYNCHRONIZATION BACKPLANE
     Defined purely inside the Effect hook body to make cascading state cycles impossible.
     ========================================================================== */
  useEffect(() => {
    let isMounted = true;

    async function loadTechnicians() {
      try {
        const response = await fetch('http://localhost:3000/api/technician/getAllTechnicians');
        if (!response.ok) throw new Error('Could not retrieve telemetry maps from the EV server.');
        const data = await response.json();
        
        if (isMounted) {
          setTechnicians(data);
          setErrorMessage(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const errorInstance = err instanceof Error ? err : new Error(String(err));
          setErrorMessage(errorInstance.message || 'An unknown database sync drop occurred.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTechnicians();
    return () => { isMounted = false; };
  }, [triggerRefresh]); // ✅ Runs cleanly whenever database mutators increment this key

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

      setFormSuccessMessage('Technician successfully registered into system records!');
      setTriggerRefresh((prev) => prev + 1); // Declare declarative refresh update

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        specialization: 'GENERAL',
        experienceYears: '',
        address: '',
      });
    } catch (err: unknown) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      setFormErrorMessage(errorInstance.message || 'Failed to submit staff registry parameters.');
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    const confirmDelete = confirm('Are you certain you want to remove this profile?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/technician/deleteTechnician/${id}`, {
        method: 'DELETE',
      });
      const responseData = await response.json();
      if (!response.ok) {
        alert(responseData.message || 'Revocation sequence failed.');
        return;
      }
      setTechnicians((prevList) => prevList.filter((tech) => tech.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err: unknown) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      alert(`Transmission crash: ${errorInstance.message}`);
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSaveSubmit = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/technician/updateTechnician/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        alert(responseData.message || 'Failed to commit updated parameter modifications.');
        return;
      }

      setEditingId(null);
      setTriggerRefresh((prev) => prev + 1); // Declare declarative refresh update
      alert('Changes safely committed!');
    } catch (err: unknown) {
      const errorInstance = err instanceof Error ? err : new Error(String(err));
      alert(`Network intercept exception: ${errorInstance.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-volt-secondary animate-spin stroke-[1.5]" />
        <p className="font-display text-sm font-medium text-slate-500 tracking-wide">Syncing Staff Ecosystem Configurations...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-volt-surface border border-volt-terracotta/20 rounded-container p-8 text-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-volt-terracotta mx-auto mb-4 stroke-[1.5]" />
          <h3 className="font-display text-base font-bold text-volt-primary mb-2">Ecosystem Link Defect</h3>
          <p className="font-sans text-xs text-slate-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-volt-background text-volt-primary antialiased space-y-10">
      
      <div className="pb-5 border-b border-volt-container">
        <h1 className="font-display text-3xl font-bold tracking-tight text-volt-primary">
          Technician Ecosystem Control
        </h1>
        <p className="mt-1.5 font-sans text-sm text-slate-500 font-medium">
          Monitor engineering staffing resource availability, update core diagnostic proficiencies, and expand your service network pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Render Form Console Side Column Panel layout */}
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

        {/* Directory Listings Cards System Area */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between border-b border-volt-container/60 pb-3">
            <h2 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Active Workshop Engineers Directory</h2>
            <span className="text-xs font-medium text-slate-500 font-sans">Active Profiles Linked: <strong className="text-volt-primary font-bold">{technicians.length}</strong></span>
          </div>

          {technicians.length === 0 ? (
            <div className="p-16 text-center border border-dashed border-volt-container rounded-container bg-volt-surface/40 animate-fade-in">
              <Cpu className="h-8 w-8 text-slate-300 mx-auto mb-3 stroke-[1.25]" />
              <p className="font-sans text-sm font-medium text-slate-400 leading-relaxed">No technicians are registered in the workshop data logs yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
}