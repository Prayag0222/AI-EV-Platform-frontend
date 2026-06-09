'use client';

import React, { useState } from 'react';
// 🔌 IMPORT CODE 1: Pull in our isolated real-time dropdown component from its folder
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
}

export default function CreateTicketPage() {
  // A. Master Switch States (Memory Containers)
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedProfileText, setSelectedProfileText] = useState<string>('');
  
  // B. Unified Data Form State Payload Object
  const [formData, setFormData] = useState<TicketFormData>({
    customerId: '', name: '', phone: '', vehicleModel: '',
    email: '', address: '', issueCategory: '', description: '', technicianNotes: ''
  });

  // C. Input Change Handler (Captures text for core ticket fields)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // D. Callback Handler 1: Triggered when an EXISTING customer is picked from Dropdown
  const handleSelectExistingCustomer = (customer: CustomerRecord) => {
    setIsNewCustomer(false);
    setSelectedProfileText(`${customer.name} (${customer.phone})`);
    
    // Automatically fill out the hidden customer parameters inside our unified object
    setFormData((prev) => ({
      ...prev,
      customerId: customer.id,
      name: customer.name,
      phone: customer.phone,
      vehicleModel: customer.vehicleModel
    }));
  };

  // E. Callback Handler 2: Triggered when worker clicks "+ Register Profile Inline"
  const handleTriggerNewCustomerMode = () => {
    setIsNewCustomer(true);
    setSelectedProfileText('');
    
    // Clear out any stale customer fields to ready a blank walk-in form slate
    setFormData((prev) => ({
      ...prev,
      customerId: '', // 🚨 Clear this so the backend knows it's Track B!
      name: '', phone: '', vehicleModel: '', email: '', address: ''
    }));
  };

  // F. Network Submit Handler: Dispatches the final package payload to Express port 5000
  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/api/owner/createTicket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Server rejected request.');

      alert(`Success! Entry logged. Ticket ID: ${result.ticket?.id}`);
      
      // Reset page variables state back to pristine empty conditions
      setFormData({
        customerId: '', name: '', phone: '', vehicleModel: '',
        email: '', address: '', issueCategory: '', description: '', technicianNotes: ''
      });
      setSelectedProfileText('');
      setIsNewCustomer(false);

    } catch (error) {
      alert(`Deployment Halted: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎨 THE VIEW LAYER MARKUP
  return (
    <main className="p-6 min-w-5xl to-left  mx-auto min-h-screen text-volt-text ">
      
      {/* 🏷️ TITLE PANEL */}
      <div className="mb-6 pb-4 border-b border-volt-container/20">
        <h1 className="text-3xl font-display font-bold font-hanken  tracking-tight text-volt-secondary mb-1">
      Create Repair Ticket 
        </h1>
        <p className="text-s text-volt-muted font-display mt-1 text-gray-500  font-medium">
          Log an new vehicle service requestand assign preliminary documentation.
        </p>
      </div>

      {/* 🔍 STEP 1 LAYER: DROPDOWN PORT CONTAINER */}
      <section className="mb-6 p-5 bg-volt-surface border border-volt-container rounded-volt shadow-sm">
        {/* Plugs into our child component wires smoothly */}
        <CustomerSearchDropdown 
          onSelectCustomer={handleSelectExistingCustomer}
          onTriggerNewCustomerMode={handleTriggerNewCustomerMode}
          selectedCustomerId={formData.customerId}
        />

        {/* Dynamic Connected Confirmation Green Bar Badge */}
        {selectedProfileText && !isNewCustomer && (
          <div className="mt-4 flex items-center gap-3 bg-volt-background border border-volt-container/40 p-3 rounded font-mono text-xxs animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-volt-secondary animate-pulse" />
            <p className="font-medium text-volt-muted">
              Linked Workspace Ledger Row: <span className="text-volt-secondary font-bold select-all">{selectedProfileText}</span>
            </p>
          </div>
        )}
      </section>

      {/* 🎫 MASTER SUBMISSION FORM CONTAINER BLOCK */}
      <form onSubmit={handleMasterSubmit} className="space-y-6">
        
        {/* 🆕 NESTED STEP: Injected dynamically only if isNewCustomer === TRUE */}
        {isNewCustomer && (
          <fieldset className="p-5 bg-volt-surface border border-volt-alert/20 rounded-volt space-y-4 animate-slide-down">
            <legend className="px-2 font-display text-xs font-bold uppercase tracking-wider text-volt-alert">
              Add New Customer
            </legend>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xxs font-medium flex  tracking-wide text-volt-muted gap-2 mb-1"><User className='size-5'/>Full Name </label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Customer name..." className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
              <div>
                <label className="block text-xxs font-medium flex  gap-2 tracking-wide text-volt-muted mb-1"><Phone className='size-5'/>Mobile Phone </label>
                <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 XXXXX XXXXX" className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
              <div>
                <label className="block text-xxs font-medium  flex  gap-2 tracking-wide text-volt-muted mb-1"><BikeIcon className='size-5'/>Vehicle Model </label>
                <input required type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="Vehicle Model" className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xxs font-medium flex  gap-2 tracking-wide text-volt-muted mb-1"><Mail className='size-5'/>Email Address (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@voltops.io" className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
              <div>
                <label className="block text-xxs font-medium  tracking-wide flex  gap-2 text-volt-muted mb-1"><Map className='size-5'/> Address (Optional)</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address..." className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text text-xs rounded focus:outline-none focus:border-volt-secondary" />
              </div>
            </div>
          </fieldset>
        )}

        {/* 🎫 CORE MANDATORY REPAIR FIELDS (Always Visible) */}
        <fieldset className="p-5 bg-volt-surface border border-volt-container rounded-volt space-y-7 w-vw shadow-sm">
          <legend className="px-2 flex gap-2 items-center font-display text-xs font-bold uppercase tracking-wider text-volt-secondary">
           <Wrench className='size-4 '/> Ticket Documentation
          </legend>

          <div>
            <label className="block font-sora text-xs font-medium  text-gray-700 tracking-wide  mb-1">Primary Issue  </label>
            <textarea required name="issueCategory" rows={1} value={formData.issueCategory} onChange={handleInputChange} placeholder="e.g. Battery thermal Warning" className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text placeholder:text-volt-muted text-xs rounded focus:outline-none focus:border-volt-secondary resize-none" />
          </div>

          <div>
            <label className="block font-sora text-xs font-medium  text-gray-700 tracking-wide text-volt-muted mb-1">Rigorous Issue Description</label>
            <textarea required name="description" rows={3} value={formData.description} onChange={handleInputChange} placeholder="Detail the exact diagnostic symptoms, scooter behavior patterns, and customer complaints..." className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text placeholder:text-volt-muted text-xs rounded focus:outline-none focus:border-volt-secondary resize-none" />
          </div>

          <div>
            <label className="block font-sora text-xs font-medium  text-gray-700 tracking-wide text-volt-muted mb-1">Technician Notes</label>
            <textarea name="technicianNotes" rows={3} value={formData.technicianNotes} onChange={handleInputChange} placeholder="Describe the symptoms , triggers,and any context provided by the customer...." className="w-full px-3 py-2 bg-volt-background border border-volt-container text-volt-text placeholder:text-volt-muted text-xs rounded focus:outline-none focus:border-volt-secondary resize-none" />
          </div>
        </fieldset>

        {/* 🚀 ACTION DISPATCH SUBMIT BUTTON */}
        <div className=' flex justify-end'>
        <div className="flex relative items-center p-1 justify-start">
            <BookCheck className='absolute pl-2 text-white'/>
          <button 
            type="submit"
            disabled={isSubmitting || (!formData.customerId && !isNewCustomer)}
            className={`w-full sm:w-auto px-8 py-3 bg-[#091426] opacity-100  text-volt-background font-display text-xs font-bold  tracking-wider rounded shadow-md hover:opacity-90 transition-all cursor-pointer ${
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