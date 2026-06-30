'use client';

import React, { useEffect, useState } from 'react';
import CustomerSearchDropdown, { CustomerRecord } from './components/CustomerSearchDropdown';
import { 
  BikeIcon, 
  BookCheck, 
  Mail, 
  MapPin, 
  Phone, 
  User, 
  Wrench, 
  ShieldAlert, 
  PlusCircle, 
  Loader2, 
  FileText, 
  CheckCircle,
  Hash
} from 'lucide-react';

// 📜 THE TYPESCRIPT CONTRACT BLUEPRINT
interface TicketFormData {
  customerId: string;
  name: string;
  phone: string;
  vehicleModel: string;
  vin: string;
  email: string;
  address: string;
  issueCategory: string;
  description: string;
  priority: string;
  technicianId: string; 
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

interface CustomerWithRelations extends CustomerRecord {
  vehicles?: Array<{ id: number; vin: string; vehicleModel: string }>;
}

export default function CreateTicketPage() {
  // A. Structural Layout & Relationship Flags
  const [isNewCustomer, setIsNewCustomer] = useState<boolean>(false);
  const [isNewVehicleForCustomer, setIsNewVehicleForCustomer] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedProfileText, setSelectedProfileText] = useState<string>('');
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [existingCustomerVehicles, setExistingCustomerVehicles] = useState<Array<{ id: number; vin: string; vehicleModel: string }>>([]);

  // B. Unified Source Form State Payload Object
  const [formData, setFormData] = useState<TicketFormData>({
    customerId: '', 
    name: '', 
    phone: '', 
    vehicleModel: '',
    vin: '',
    email: '', 
    address: '', 
    issueCategory: '', 
    description: '', 
    priority: 'STANDARD', 
    technicianId: '' 
  });

  // 🛰️ Fetch Technicians on Mount
  useEffect(() => {
    const getStaff = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/technician/getAllTechnicians',{credentials:"include"});
        if (!res.ok) throw new Error('Failed to download employee list.');
        const data = await res.json();
        setTechnicians(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch technicians:', error);
      }
    };
    getStaff();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectExistingCustomer = (customer: CustomerRecord) => {
    const extendedCustomer = customer as CustomerWithRelations;
    setIsNewCustomer(false);
    setSelectedProfileText(`${extendedCustomer.name} (${extendedCustomer.phone})`);
    
    const vehicles = extendedCustomer.vehicles || [];
    setExistingCustomerVehicles(vehicles);

    if (vehicles.length > 0) {
      setIsNewVehicleForCustomer(false);
      setFormData((prev) => ({
        ...prev,
        customerId: extendedCustomer.id,
        name: extendedCustomer.name,
        phone: extendedCustomer.phone,
        vehicleModel: vehicles[0].vehicleModel,
        vin: vehicles[0].vin,
        email: extendedCustomer.email || '',
        address: extendedCustomer.address || ''
      }));
    } else {
      setIsNewVehicleForCustomer(true);
      setFormData((prev) => ({
        ...prev,
        customerId: extendedCustomer.id,
        name: extendedCustomer.name,
        phone: extendedCustomer.phone,
        vehicleModel: '',
        vin: '',
        email: extendedCustomer.email || '',
        address: extendedCustomer.address || ''
      }));
    }
  };

  const handleExistingVehicleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVin = e.target.value;
    const vehicle = existingCustomerVehicles.find(v => v.vin === selectedVin);
    if (vehicle) {
      setFormData((prev) => ({
        ...prev,
        vehicleModel: vehicle.vehicleModel,
        vin: vehicle.vin
      }));
    }
  };

  const handleTriggerNewCustomerMode = () => {
    setIsNewCustomer(true);
    setIsNewVehicleForCustomer(true);
    setSelectedProfileText('');
    setExistingCustomerVehicles([]);
    
    setFormData((prev) => ({
      ...prev,
      customerId: '', 
      name: '', phone: '', vehicleModel: '', vin: '', email: '', address: ''
    }));
  };

  const handleMasterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const finalPayload = {
        ...formData,
        priority: formData.priority.toUpperCase(),
        technicianId: formData.technicianId === '' ? null : formData.technicianId
      };

      const response = await fetch('http://localhost:3000/api/owner/createTicket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials:"include",
        body: JSON.stringify(finalPayload)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Server rejected intake packet.');

      alert(`🎉 Success! Ticket verified and opened. Ticket ID: #TK-${result.ticket?.id}`);
      
      setFormData({
        customerId: '', name: '', phone: '', vehicleModel: '', vin: '',
        email: '', address: '', issueCategory: '', description: '', 
        priority: 'STANDARD',
        technicianId: '',
      });
      setSelectedProfileText('');
      setIsNewCustomer(false);
      setIsNewVehicleForCustomer(false);
      setExistingCustomerVehicles([]);

    } catch (error: unknown) {
      const errorInstance = error instanceof Error ? error : new Error(String(error));
      alert(`Intake Process Halted: ${errorInstance.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-8 max-w-7xl mx-auto min-h-screen bg-volt-background font-sans text-volt-primary antialiased space-y-8">
      
      {/* 🏙️ MASTER TOP TITLE SEGMENT */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-volt-container gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-volt-primary">
            Intake Workspace: Create Repair Ticket
          </h1>
          <p className="mt-1.5 font-sans text-sm text-slate-500 font-medium">
            Open a dynamic workshop thread, link customer accounts, and allocate warehouse diagnostic bays.
          </p>
        </div>
      </div>

      {/* 🔍 FLOATING SEARCH HUB CARD */}
      <section className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)] transition-all">
        <div className="max-w-2xl">
          <label className="block font-display text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
            Account Lookup Pipeline
          </label>
          <CustomerSearchDropdown 
            onSelectCustomer={handleSelectExistingCustomer}
            onTriggerNewCustomerMode={handleTriggerNewCustomerMode}
            selectedCustomerId={formData.customerId}
          />
        </div>

        {selectedProfileText && !isNewCustomer && (
          <div className="mt-4 flex items-center gap-2.5 bg-volt-background border border-volt-container/60 p-3 rounded-volt font-display text-xs text-slate-600 animate-fade-in w-fit">
            <CheckCircle className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
            <span>Active Account Context: <strong className="text-volt-primary font-bold select-all">{selectedProfileText}</strong></span>
          </div>
        )}
      </section>

      {/* 📦 ASYMMETRIC THREE-COLUMN CONTROL MATRIX */}
      <form onSubmit={handleMasterSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LEFT COLUMN WING: SPANS 2 OUT OF 3 COLS FOR ACCOUNT & VEHICLE REGISTRIES */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* ZONE A: NEW WALK-IN CUSTOMER PROFILE CARD */}
          {isNewCustomer && (
            <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-sm space-y-5 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex items-center gap-2 border-b border-volt-container/60 pb-3">
                <User className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Account Configuration</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative">
                  <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Rahul Sharma" className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary focus:ring-2 focus:ring-volt-secondary/5 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Mobile Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                    <input required type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g. +91 98765 43210" className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary focus:ring-2 focus:ring-volt-secondary/5 transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@voltops.io" className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary focus:ring-2 focus:ring-volt-secondary/5 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Residential Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Workshop location details..." className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary focus:ring-2 focus:ring-volt-secondary/5 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ZONE B: EXISTING ACCOUNT VEHICLE ASSET ASSIGNMENT ROUTER */}
          {!isNewCustomer && formData.customerId && (
            <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-sm space-y-5 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-volt-container/60 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  <BikeIcon className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Asset Assignment Mode</span>
                </div>
                
                {/* Visual Tab Pill Switches */}
                <div className="flex gap-1.5 bg-volt-background p-1 rounded border border-volt-container w-fit text-[11px] font-display font-semibold text-slate-500">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewVehicleForCustomer(false);
                      if (existingCustomerVehicles.length > 0) {
                        setFormData((prev) => ({ ...prev, vehicleModel: existingCustomerVehicles[0].vehicleModel, vin: existingCustomerVehicles[0].vin }));
                      }
                    }}
                    disabled={existingCustomerVehicles.length === 0}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                      !isNewVehicleForCustomer ? 'bg-volt-surface border border-volt-container text-volt-primary font-bold shadow-sm' : 'hover:text-volt-primary disabled:opacity-30'
                    }`}
                  >
                    Saved Fleet ({existingCustomerVehicles.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewVehicleForCustomer(true);
                      setFormData((prev) => ({ ...prev, vehicleModel: '', vin: '' }));
                    }}
                    className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 ${
                      isNewVehicleForCustomer ? 'bg-volt-surface border border-volt-container text-volt-primary font-bold shadow-sm' : 'hover:text-volt-primary'
                    }`}
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> New Intake
                  </button>
                </div>
              </div>

              {!isNewVehicleForCustomer ? (
                <div>
                  <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Choose Registered Garage Vehicle</label>
                  <select
                    value={formData.vin}
                    onChange={handleExistingVehicleChange}
                    className="w-full rounded-volt border border-volt-container bg-white px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary h-[44px]"
                  >
                    {existingCustomerVehicles.map((veh) => (
                      <option key={veh.vin} value={veh.vin}>
                        {veh.vehicleModel} — [VIN: {veh.vin}]
                    </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-volt bg-volt-background border border-volt-container/60 animate-in fade-in duration-200">
                  <div>
                    <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Vehicle Model Name *</label>
                    <div className="relative">
                      <BikeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                      <input required type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="e.g. Ather 450X Apex" className="w-full rounded-volt border border-volt-container bg-volt-surface pl-9 pr-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">VIN / Chassis Identifier</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                      <input type="text" name="vin" value={formData.vin} onChange={handleInputChange} placeholder="Empty auto-generates ledger code" className="w-full rounded-volt border border-volt-container bg-volt-surface pl-9 pr-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all uppercase" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ZONE C: BRAND NEW CUSTOMER VEHICLE METRIC BLOCK */}
          {isNewCustomer && (
            <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-volt-container/60 pb-3">
                <BikeIcon className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Vehicle Definition</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Vehicle Model Name *</label>
                  <div className="relative">
                    <BikeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                    <input required type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} placeholder="e.g. VoltScoot Odyssey V2" className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">VIN / Chassis Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 stroke-[1.5]" />
                    <input type="text" name="vin" value={formData.vin} onChange={handleInputChange} placeholder="Empty auto-generates ledger code" className="w-full rounded-volt border border-volt-container bg-volt-background pl-9 pr-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all uppercase" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ZONE D: PROBLEM STATEMENT LOG TEXT FIELDS */}
          <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-volt-container/60 pb-3">
              <FileText className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
              <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Diagnostic Core Details</span>
            </div>
            
            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Primary Issue Category *</label>
              <input required type="text" name="issueCategory" value={formData.issueCategory} onChange={handleInputChange} placeholder="e.g. Battery cell thermal Redline, BMS Controller communication mismatch" className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary focus:ring-2 focus:ring-volt-secondary/5 transition-all" />
            </div>

            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Detailed Operational Symptoms Summary *</label>
              <textarea required name="description" rows={5} value={formData.description} onChange={handleInputChange} placeholder="Please detail explicit floor observation data points, error telemetry codes, and driver context logs clearly..." className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary focus:ring-2 focus:ring-volt-secondary/5 transition-all resize-none leading-relaxed" />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN WING: WORKFLOW CONTROLS, PRIORITIES & STAFFING ASSIGNMENT */}
        <div className="space-y-8">
          
          <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-volt-container/60 pb-3">
              <Wrench className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
              <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Pipeline Controls</span>
            </div>

            {/* Urgency Tracker Track Option Dropdown */}
            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-volt-terracotta" /> Threat Urgency Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full rounded-volt border border-volt-container bg-white px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary h-[44px]"
              >
                <option value="LOW">Low (Routine Checkup)</option>
                <option value="STANDARD">Standard (First Come)</option>
                <option value="HIGH">High (Express Track Override)</option>
                <option value="URGENT">Urgent (Thermal redline)</option>
              </select>
            </div>

            {/* Staff Allocation drop check menu */}
            <div>
              <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                Assign Specialist Mechanic
              </label>
              <select 
                name="technicianId" 
                value={formData.technicianId} 
                onChange={handleInputChange}    
                className="w-full rounded-volt border border-volt-container bg-white px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary h-[44px]"
              >
                <option value="">-- Leave Unassigned (Queue Pool) --</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.fullName} — [{tech.specialization}]
                  </option>
                ))}
              </select>
            </div>

            {/* ACTION DISPATCH BUTTON LAYER */}
            <div className="pt-4 border-t border-volt-container">
              <button 
                type="submit"
                disabled={isSubmitting || (!formData.customerId && !isNewCustomer)}
                className={`w-full py-3.5 bg-volt-primary text-white font-display text-xs font-bold tracking-widest uppercase rounded shadow-md hover:bg-volt-primary/95 transition-all cursor-pointer flex items-center justify-center gap-2.5 ${
                  (isSubmitting || (!formData.customerId && !isNewCustomer)) && 'opacity-40 cursor-not-allowed bg-volt-primary'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Synchronizing Ledger...</span>
                  </>
                ) : (
                  <>
                    <BookCheck className="h-4 w-4 text-white stroke-[1.5]" />
                    <span>Generate Repair Ticket</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </form>
    </main>
  );
}