'use client';
import React, { useState } from "react";
import { X, Loader2, CheckCircle2, AlertTriangle, User, Bike } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  // 📋 Form Text Buckets
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [vin, setVin] = useState<string>('');
  const [manufacturer, setManufacturer] = useState<string>('');
  const [modelYear, setModelYear] = useState<string>(''); // Kept as string for smooth typing inputs

  // ⚡ Interactive UI Layout States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setToast(null);        

    try {
      // FIXED: Pointing directly to your Port 5000 Express backend engine layer
      const response = await fetch('http://localhost:3000/api/owner/createCustomer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          phone, 
          email: email || null,
          address: address || null,
          vehicleModel,
          vin,
          manufacturer,
          modelYear: modelYear ? parseInt(modelYear, 10) : null // Force standard numeric format for Prisma compatibility
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({
          message: '🎉 Customer and vehicle profiles successfully synchronized!',
          type: 'success'
        });

        // Clear entry forms completely
        setName('');
        setPhone('');
        setEmail('');
        setAddress('');
        setVehicleModel('');
        setVin('');
        setManufacturer('');
        setModelYear('');

        // Hold frame visibility for 2 seconds so Prayag sees the animation
        setTimeout(() => {
          setToast(null);
          onClose();
        }, 2000);

      } else {
        /* ==========================================================================
           🛡️ DEFENSIVE OBJECT SAFETY TYPE-GUARD
           Extracts string error fields dynamically even if the server passes an object payload
           ========================================================================== */
        let finalErrorMessage = 'Failed to save customer profiles.';
        
        if (data.error) {
          if (typeof data.error === 'string') {
            finalErrorMessage = data.error;
          } else if (typeof data.error === 'object') {
            finalErrorMessage = data.error.message || JSON.stringify(data.error);
          }
        }

        setToast({
          message: finalErrorMessage,
          type: 'error'
        });
      }
    } catch (error) {
      console.error("Submission network crash:", error);
      setToast({
        message: '💥 Transmission drop. Verify Express is actively running locally on Port 5000!',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in">
      
      {/* 🔔 FLOATING TIMELINE FEED NOTIFICATION TOAST */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-volt border p-4 shadow-2xl transition-all duration-300 max-w-sm ${
          toast.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200' 
            : 'bg-red-950/90 border-red-500/30 text-red-200'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
          )}
          <p className="font-sans text-xs font-semibold tracking-wide leading-relaxed">
            {toast.message}
          </p>
        </div>
      )}

      {/* THE INNER POPUP COMPONENT CARD FRAME */}
      <div className="w-full max-w-2xl bg-volt-surface border border-volt-container rounded-container shadow-2xl relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER LAYER BLOCK */}
        <div className="flex items-center justify-between border-b border-volt-container p-6">
          <div>
            <h3 className="font-display text-lg font-bold text-volt-primary tracking-tight">
              Register New Customer & Garage Profile
            </h3>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Create a user identity database entry while simultaneously configuring their active EV vehicle asset fields.
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-volt-primary rounded-volt hover:bg-volt-background transition-colors cursor-pointer disabled:opacity-30"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* SCROLLABLE GRID ZONE */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* COLUMN LEFT: CUSTOMER FIELDS GROUP */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-volt-container/60 pb-2 mb-2">
                <User className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Customer Details</span>
              </div>

              <div>
                <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                  Full Name <span className="text-volt-terracotta">*</span>
                </label>
                <input 
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                  Phone Number <span className="text-volt-terracotta">*</span>
                </label>
                <input 
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                  Email Address
                </label>
                <input 
                  type="email"
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. johndoe@gmail.com"
                  className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                  Residential Address
                </label>
                <textarea 
                  disabled={isSubmitting}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street details, workshop location, or city lines..."
                  rows={2}
                  className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50 resize-none"
                />
              </div>
            </div>

            {/* COLUMN RIGHT: VEHICLE PROFILE FIELDS GROUP */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-volt-container/60 pb-2 mb-2">
                <Bike className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
                <span className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Vehicle Specs</span>
              </div>

              <div>
                <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                  Vehicle Model Name <span className="text-volt-terracotta">*</span>
                </label>
                <input 
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Ather 450X Apex"
                  className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                  Chassis VIN Code <span className="text-volt-terracotta">*</span>
                </label>
                <input 
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="e.g. 17-digit numeric code"
                  className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                  Manufacturer <span className="text-volt-terracotta">*</span>
                </label>
                <input 
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Ather Energy"
                  className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                  Model Release Year <span className="text-volt-terracotta">*</span>
                </label>
                <input 
                  type="number"
                  required
                  disabled={isSubmitting}
                  value={modelYear}
                  onChange={(e) => setModelYear(e.target.value)}
                  placeholder="e.g. 2026"
                  min="2010"
                  max={new Date().getFullYear() + 1}
                  className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
                />
              </div>
            </div>

          </div>

          {/* LOWER ACTIONS STRIP AREA */}
          <div className="pt-4 border-t border-volt-container flex items-center justify-end gap-3 sticky bottom-0 bg-volt-surface z-10">
            <button 
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-volt font-display text-sm font-medium text-slate-400 hover:bg-volt-background transition-colors cursor-pointer disabled:opacity-30"
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-volt bg-volt-primary font-display text-sm font-semibold text-white hover:bg-volt-primary/90 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 min-w-[140px] disabled:bg-volt-primary/60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Syncing Engine...</span>
                </>
              ) : (
                <span>Save Registry</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}