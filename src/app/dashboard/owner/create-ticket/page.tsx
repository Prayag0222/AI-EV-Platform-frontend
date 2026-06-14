'use client';

import React, { useEffect, useState } from 'react';
// 🔌 PULL IN isolated real-time auto-complete dropdown component
import CustomerSearchDropdown, { CustomerRecord } from './components/CustomerSearchDropdown';
import { BikeIcon, BookCheck, Mail, Map, Phone, User, Wrench } from 'lucide-react';

// 📜 THE TYPESCRIPT CONTRACT BLUEPRINT
interface TicketFormData {
  customerId: string;
  name: string;
  phone: string;
  vehicleModel: string;
  email: string;
  address: string;
  issueCategory: string;
  description: string;
  technicianNotes: string;
  technicianId: string; // Changed to string to handle fallback dropdown characters smoothly
}

interface Technician {
  id: string;
  fullName: string;
  email: string;          
  phone: string;
  employeeId: string;          
  specialization: string;
  status: string;      
  experienceYears: string;
  address: string | null;
}

export default function CreateTicketPage() {
  // A. Master Structural Flag Layout States
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedProfileText, setSelectedProfileText] = useState<string>('');
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  
  // B. Unified Source Form State Payload Object (selectedTechId completely removed!)
  const [formData, setFormData] = useState<TicketFormData>({
    customerId: '', 
    name: '', 
    phone: '', 
    vehicleModel: '',
    email: '', 
    address: '', 
    issueCategory: '', 
    description: '', 
    technicianNotes: '',
    technicianId: '' // Default blank value tracks the unassigned queue pool status natively
  });

  // 🛰️ Isolated Network Synchronization Engine
  useEffect(() => {
    const getStaff = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/technician/getAllTechnicians');
        if (!res.ok) throw new Error('Failed to download employee list.');
        const data = await res.json();
        // Defensive mapping enforces array type casting to keep linter safe
        setTechnicians(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch technicians:', error);
      }
    };
    getStaff();
  }, []);

  // C. Unified Input Change Handler (Handles inputs, textareas, and select tags instantly!)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // D. Callback Handler: Triggered when an EXISTING customer is picked from Dropdown
  const handleSelectExistingCustomer = (customer: CustomerRecord) => {
    setIsNewCustomer(false);
    setSelectedProfileText(`${customer.name} (${customer.phone})`);
    
    setFormData((prev) => ({
      ...prev,
      customerId: customer.id,
      name: customer.name,
      phone: customer.phone,
      vehicleModel: customer.vehicleModel, 
    }));
  };

  // E. Callback Handler: Triggered when worker clicks "+ Register Profile Inline"
  const handleTriggerNewCustomerMode = () => {
    setIsNewCustomer(true);
    setSelectedProfileText('');
    
    setFormData((prev) => ({
      ...prev,
      customerId: '', // Clear this tracking string so the backend processes Track B
      name: '', phone: '', vehicleModel: '', email: '', address: ''
    }));
  };

  // F. Network Submit Handler: Transmits the unified form parameters downstream
  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Clean data payload structure conversion
      const finalPayload = {
        ...formData,
        // If technicianId is an empty text string, transform it into null for PostgreSQL mapping compliance
        technicianId: formData.technicianId === '' ? null : formData.technicianId
      };

      const response = await fetch('http://localhost:3000/api/owner/createTicket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Server rejected intake packet.');

      alert(`Success! Entry logged. Ticket ID: ${result.ticket?.id}`);
      
      // Reset variables smoothly to clean baseline defaults
      setFormData({
        customerId: '', name: '', phone: '', vehicleModel: '',
        email: '', address: '', issueCategory: '', description: '', technicianNotes: '',
        technicianId: '',
      });
      setSelectedProfileText('');
      setIsNewCustomer(false);
      console.log('Server deployment log signature verified:', result);

    } catch (error: unknown) {
      const errorInstance = error instanceof Error ? error : new Error(String(error));
      alert(`Deployment Halted: ${errorInstance.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-6 min-w-5xl to-left mx-auto min-h-screen text-volt-text">
      
      {/* TITLE PANEL */}
      <div className="mb-6 pb-4 border-b border-volt-container/20">
        <h1 className="text-3xl font-display font-bold font-hanken tracking-tight text-volt-secondary mb-1">
          Create Repair Ticket 
        </h1>
        <p className="text-s text-volt-muted font-display mt-1 text-gray-500 font-medium">
          Log a new vehicle service request and assign preliminary documentation.
        </p>
      </div>

      {/* DROPDOWN PORT CONTAINER */}
      <section className="mb-6 p-5 bg-volt-surface border border-volt-container rounded-volt shadow-sm">
        <CustomerSearchDropdown 
          onSelectCustomer={handleSelectExistingCustomer}
          onTriggerNewCustomerMode={handleTriggerNewCustomerMode}
          selectedCustomerId={formData.customerId}
        />

        {selectedProfileText && !isNewCustomer && (
          <div className="mt-4 flex items-center gap-3 bg-volt-background border border-volt-container/40 p-3 rounded font-mono text-xxs animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-volt-secondary animate-pulse" />
            <p className="font-medium text-volt-muted">
              Linked Workspace Ledger Row: <span className="text-volt-secondary font-bold select-all">{selectedProfileText}</span>
            </p>
          </div>
        )}
      </section>

      {/* MASTER SUBMISSION FORM CONTAINER BLOCK */}
      <form onSubmit={handleMasterSubmit} className="space-y-6">
        
        {/* INLINE WALK-IN REGISTRATION ROW */}
        {isNewCustomer && (
          <fieldset className="p-5 bg-volt-surface border border-volt-alert/20 rounded-volt space-y-4 animate-slide-down">
            <legend className="px-2 font-display text-xs font-bold uppercase tracking-wider text-volt-alert">
              Add New Customer
            </legend>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className=" text-xxs font-medium flex tracking-wide text-volt-muted gap-2 mb-1"><User className='size-5'/>Full Name </label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Customer name..." className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
              <div>
                <label className=" text-xxs font-medium flex gap-2 tracking-wide text-volt-muted mb-1"><Phone className='size-5'/>Mobile Phone </label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
              <div>
                <label className=" text-xxs font-medium flex gap-2 tracking-wide text-volt-muted mb-1"><BikeIcon className='size-5'/>Vehicle Model </label>
                <input required type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="Vehicle Model" className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className=" text-xxs font-medium flex gap-2 tracking-wide text-volt-muted mb-1"><Mail className='size-5'/>Email Address (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@voltops.io" className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
              <div>
                <label className=" text-xxs font-medium tracking-wide flex gap-2 text-volt-muted mb-1"><Map className='size-5'/> Address (Optional)</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address..." className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
            </div>
          </fieldset>
        )}

        {/* CORE TICKET MAPPING FIELDS */}
        <fieldset className="p-5 bg-volt-surface border border-volt-container rounded-volt space-y-7 w-vw shadow-sm">
          <legend className="px-2 flex gap-2 items-center font-display text-xs font-bold uppercase tracking-wider text-volt-secondary">
            <Wrench className='size-4 '/> Ticket Documentation
          </legend>

          <div>
            <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Primary Issue</label>
            <textarea required name="issueCategory" rows={1} value={formData.issueCategory} onChange={handleInputChange} placeholder="e.g. Battery thermal Warning" className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text placeholder:text-volt-muted text-xs rounded focus:outline-none focus:border-volt-secondary resize-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Rigorous Issue Description</label>
            <textarea required name="description" rows={3} value={formData.description} onChange={handleInputChange} placeholder="Detail the exact diagnostic symptoms..." className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text placeholder:text-volt-muted text-xs rounded focus:outline-none focus:border-volt-secondary resize-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 tracking-wide mb-1">Technician Notes</label>
            <textarea name="technicianNotes" rows={3} value={formData.technicianNotes} onChange={handleInputChange} placeholder="Describe the symptoms, triggers, and context..." className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text placeholder:text-volt-muted text-xs rounded focus:outline-none focus:border-volt-secondary resize-none" />
          </div>

          {/* 🔧 THE TECHNICIAN DROPDOWN: Clean, unified, single source of truth mapping! */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Assign Workshop Technician</label>
            <select 
              name="technicianId" 
              required
              value={formData.technicianId} // ✅ Tied straight to the core form tracking state container!
              onChange={handleInputChange}    // ✅ Feeds instantly through your global input change engine!
              className="w-full border p-2 rounded text-sm bg-white text-gray-800"
            >
              <option value="">-- Leave Unassigned (Queue Pool) --</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id}>
                  {tech.fullName} ({tech.specialization})
                </option>

                
              ))}
            </select>
          </div>
        </fieldset>

        {/* SUBMIT BUTTON SECTION */}
        <div className='flex justify-end'>
          <div className="flex relative items-center p-1 justify-start">
            <BookCheck className='absolute pl-2 text-white pointer-events-none'/>
            <button 
              type="submit"
              disabled={isSubmitting || (!formData.customerId && !isNewCustomer)}
              className={`w-full sm:w-auto px-8 py-3 bg-[#091426] opacity-100 text-volt-background font-display text-xs font-bold tracking-wider rounded shadow-md hover:opacity-90 transition-all cursor-pointer ${
                (isSubmitting || (!formData.customerId && !isNewCustomer)) && 'opacity-40 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Processing Transaction...' : 'Create Repair Ticket'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}