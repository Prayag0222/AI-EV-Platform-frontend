'use client';

import React, { useState } from 'react';
import { X, User, Smartphone, Bike,MapPinHouse,Mail } from 'lucide-react';

// 📋 1. Simple definition of what a customer object looks like
interface Customer {
  id: string;
  name: string;
  phone: string;
  vehicleModel: string;
  email?: string;
  address?: string;
  createdAt: string;
}

// 🔌 2. The configuration properties passed from the parent page
interface EditCustomerModalProps {
  customer: Customer | null;
  onClose: () => void;
  onUpdateSuccess: (updatedCustomer: Customer) => void; // ⚡ Added: Sends modified data back up
}

export default function EditCustomerModal({ customer, onClose, onUpdateSuccess }: EditCustomerModalProps) {

    
const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // ✅ 1. ALL HOOKS GO AT THE ABSOLUTE TOP FIRST
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    vehicleModel: customer?.vehicleModel || '',
    email: customer?.email|| '',
    address: customer?.address|| '',
  });
  // Guardrail: If no customer row is clicked, render absolutely nothing
  if (!customer) return null;
  

  // 📝 4. Typing tracking function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Blocks full website reloads
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 🌐 Fire the payload directly to your custom backend proxy on port 3000
      const response = await fetch(`http://localhost:3000/api/owner/updateCustomer/${customer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Pull out the freshly updated database row from the server's envelope structure
        const updatedRecord = data.customer || data;
        
        // Push the real data back up to sync your screen table list
        onUpdateSuccess(updatedRecord); 
        onClose(); // Close modal on complete success!
      } else {
        // If the backend validation fails, display the error reason text label
        setErrorMessage(data.error || 'Failed to save customer modification edits.');
      }
    } catch (err) {
      console.error("💥 Network Update Error:", err);
      setErrorMessage('Could not establish connection link with local Express proxy server.');
    } finally {
      setIsSubmitting(false);
    }
    console.log(errorMessage);
    
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-volt-surface border border-volt-container rounded-container p-6 shadow-2xl relative">
        
        {/* Header Title Row */}
        <div className="flex items-center justify-between border-b border-volt-container pb-4 mb-4">
          <h2 className="font-display text-base font-bold text-volt-primary tracking-wide">
            Modify Customer Profile
          </h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-volt-primary transition-colors cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Fields Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-volt-background border border-volt-container rounded-volt py-2.5 pl-10 pr-4 text-sm text-volt-primary focus:border-volt-secondary focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">Contact Number</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-volt-background border border-volt-container rounded-volt py-2.5 pl-10 pr-4 text-sm text-volt-primary focus:border-volt-secondary focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">Vehicle Model</label>
            <div className="relative">
              <Bike className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input required type="text" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} className="w-full bg-volt-background border border-volt-container rounded-volt py-2.5 pl-10 pr-4 text-sm text-volt-primary focus:border-volt-secondary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input  type="text" name="email" value={formData.email} onChange={handleChange} className="w-full bg-volt-background border border-volt-container rounded-volt py-2.5 pl-10 pr-4 text-sm text-volt-primary focus:border-volt-secondary focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">Address</label>
            <div className="relative">
              <MapPinHouse className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <input  type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-volt-background border border-volt-container rounded-volt py-2.5 pl-10 pr-4 text-sm text-volt-primary focus:border-volt-secondary focus:outline-none" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-volt-container pt-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-volt font-display text-xs font-semibold text-slate-400 hover:bg-volt-background transition-colors cursor-pointer">Cancel</button>
            <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-4 py-2 rounded-volt bg-volt-secondary font-display text-xs font-semibold text-volt-background hover:opacity-90 transition-all shadow-md cursor-pointer disabled:opacity-40"
          >
            {isSubmitting ? 'Saving to Database...' : 'Commit Modifications'}
          </button>
          </div>
        </form>

      </div>
    </div>
  );
}