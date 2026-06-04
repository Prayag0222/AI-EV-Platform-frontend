'use client'
import React, { useState } from "react";
import { X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  // Form Text Buckets
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');

  // ⚡ NEW ADVANCED STATES: Tracking loaders and cool custom notifications
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Turn on the loading wheel animation immediately
    setToast(null);        // Clear out any old notifications

    try {
      const response = await fetch('http://localhost:3000/api/owner/createCustomer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, vehicleModel,email,address }),
      });

      const data = await response.json();

      if (response.ok) {
        // Trigger our beautiful custom success notification!
        setToast({
          message: '🎉 Customer registered into database successfully!',
          type: 'success'
        });

        // Clear the entry forms
        setName('');
        setPhone('');
        setVehicleModel('');
        setEmail('');
        setAddress('');

        // Wait exactly 2 seconds so the user can enjoy the success animation, then close down
        setTimeout(() => {
          setToast(null);
          onClose();
        }, 2000);

      } else {
        setToast({
          message: data.error || 'Failed to save customer profiles.',
          type: 'error'
        });
      }
    } catch (error) {
      setToast({
        message: '💥 Cannot reach server. Verify Express is running on Port 5000!',
        type: 'error'
      });
      console.log("error",error)
    } finally {
      setIsSubmitting(false); // Turn off the loading wheel animation
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center transition-all duration-1000 ease-in-out justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      
      {/* 🔔 FLOATING TOAST APP PANEL BANNER */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-volt border p-4 shadow-2xl animate-in slide-in-from-top-6 duration-300 max-w-sm ${
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

      {/* THE INNER POPUP SHEET CONTROLLER */}
      <div className="w-full max-w-md bg-volt-surface border border-volt-container rounded-container p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        
        {/* UPPER TITLE ROW + CLOSE TARGET BUTTON */}
        <div className="flex items-center justify-between border-b border-volt-container pb-4">
          <div>
            <h3 className="font-sora text-lg font-bold text-volt-primary">
              Register New Customer
            </h3>
         
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-volt-primary rounded-volt hover:bg-volt-background transition-colors cursor-pointer disabled:opacity-30"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>

        {/* 📋 CORE TEXT ENTRY INPUT FORMS */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* Box 1: Customer Name */}
          <div>
            <label className="block font-display text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
              Full Name
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

          {/* Box 2: Phone Number */}
          <div>
            <label className="block font-display text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
              Phone Number
            </label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +1234567890"
              className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block font-display text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
                Email
            </label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eg.Example@gmial.com (optional)"
              className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
            />
          </div>

                  <div>
            <label className="block font-display text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
              Address
            </label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="(optional field)"
              className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
            />
          </div>

          {/* Box 3: EV Vehicle Model Name */}
          <div>
            <label className="block font-display text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">
              Vehicle Model
            </label>
            <input 
              type="text"
              required
              disabled={isSubmitting}
              value={vehicleModel}
              onChange={(e) => setVehicleModel(e.target.value)}
              placeholder="e.g. VoltScoot Odyssey V2"
              className="w-full rounded-volt border border-volt-container bg-volt-background px-3 py-2.5 font-sans text-sm text-volt-primary outline-none focus:border-volt-secondary transition-all disabled:opacity-50"
            />
          </div>

          {/* LOWER ACTIONS STRIP BUTTON BUTTONS */}
          <div className="pt-4 border-t border-volt-container flex items-center justify-end gap-3 mt-6">
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
              className="px-5 py-2.5 rounded-volt bg-volt-primary font-display text-sm font-semibold text-white hover:bg-volt-primary/90 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 min-w-[130px] disabled:bg-volt-primary/60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Customer</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}