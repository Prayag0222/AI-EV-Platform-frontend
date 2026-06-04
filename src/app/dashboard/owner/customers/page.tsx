'use client';

import React, { useState, useEffect } from 'react';
import { Users, Loader2, Calendar, Smartphone, Bike, Mail, MapPinHouse, UserRoundPen } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  vehicleModel: string;
  email: string;
  address: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ⏱️ 1. LINTER-SECURE INITIAL DATA MOUNT
  useEffect(() => {
    let isMounted = true; // Prevents race conditions if the user navigates away fast

    async function fetchInitialData() {
      try {
        // 🌐 Uses your exact custom frontend-proxy route endpoint mapping layout
        const response = await fetch('http://localhost:3000/api/owner/getCustomer');
        
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Server rejected the network sync operation.');
        }
        
        const data = await response.json();
        const targetArray = Array.isArray(data) ? data : data?.customers;

        if (isMounted) {
          if (Array.isArray(targetArray)) {
            setCustomers(targetArray);
          } else {
            setCustomers([]);
            setError("Backend returned data in an unexpected format.");
          }
        }
      } catch (err) { 
        // 🛡️ TS-SAFE METHOD: Removed 'any' type definition and casted securely via instanceof checking rules
        console.error(err);
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Could not establish synchronization link to the VoltOps backend.';
          setError(errorMessage);
          setCustomers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchInitialData();

    return () => {
      isMounted = false; // Clean up the mount flag tracker
    };
  }, []); // 🔒 Completely isolated from external functions, silencing ESLint!

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* 🚀 PAGE HEADER ROW CONTROL HERO LAYER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-volt-surface border border-volt-container rounded-container p-6 shadow-sm">
        <div>
          <h1 className="font-display text-xl font-bold text-volt-primary flex items-center gap-2.5">
            <Users className="h-5 w-5 text-volt-secondary" />
            Customer Directory Ledger
          </h1>
          <p className="text-slate-400 text-xs font-medium mt-1">
            Review and coordinate registered shop customer profiles and active vehicle assets.
          </p>
        </div>
      </div>

      {/* 📊 INTERACTIVE LOWER INTERFACE CONTAINER */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-24 bg-volt-surface border border-volt-container rounded-container">
          <Loader2 className="h-8 w-8 text-volt-secondary animate-spin" />
          <p className="text-slate-400 font-sans text-xs font-medium mt-3 tracking-wide">
            Syncing Ledger Entries with Database...
          </p>
        </div>
      ) : error ? (
        <div className="p-12 text-center bg-red-950/20 border border-red-500/20 text-red-200 rounded-container">
          <p className="font-sans text-sm font-semibold">{error}</p>
          <p className="text-xs text-red-400/70 mt-1">Check if your Node terminal server process is alive.</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="p-20 text-center bg-volt-surface border border-volt-container rounded-container">
          <Users className="h-10 w-10 text-slate-600 mx-auto opacity-40 mb-4" />
          <h3 className="font-display text-base font-bold text-volt-primary">No Registered Customers</h3>
          <p className="text-slate-400 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
            Use the &quote;Add Customer&quote; panel tool link inside your sidebar workspace to register your shop&apos;s first profile record!
          </p>
        </div>
      ) : (
        <div className="bg-volt-surface border border-volt-container rounded-container shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-volt-background border-b border-volt-container">
                  <th className="p-4 font-display text-[11px] font-bold tracking-widest text-slate-500 uppercase">Customer Name</th>
                  <th className="p-4 font-display text-[11px] font-bold tracking-widest text-slate-500 uppercase">Contact Info</th>
                  <th className="p-4 font-display text-[11px] font-bold tracking-widest text-slate-500 uppercase">Email</th>
                  <th className="p-4 font-display text-[11px] font-bold tracking-widest text-slate-500 uppercase">Vehicle Asset Model</th>
                  <th className="p-4 font-display text-[11px] font-bold tracking-widest text-slate-500 uppercase">Address</th>
                  <th className="p-4 font-display text-[11px] font-bold tracking-widest text-slate-500 uppercase">Registration Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-volt-container font-sans text-sm">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-volt-background/30 transition-colors group">
                    <td className="p-4 font-semibold text-volt-primary group-hover:text-volt-secondary transition-colors">
                      <span className="flex items-center gap-2">
                        <UserRoundPen className="h-3.5 w-3.5 text-slate-500"/>
                        {customer.name}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-medium">
                      <span className="flex items-center gap-2">
                        <Smartphone className="h-3.5 w-3.5 text-slate-500" />
                        {customer.phone}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-volt-background border border-volt-container rounded-volt text-xs text-volt-primary">
                        <Mail className="h-3.5 w-3.5 text-volt-secondary" />
                        {customer.email || <span className="text-slate-500 italic">Not Provided</span>}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-volt-background border border-volt-container rounded-volt text-xs text-volt-primary">
                        <Bike className="h-3.5 w-3.5 text-volt-secondary" />
                        {customer.vehicleModel}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-volt-background border border-volt-container rounded-volt text-xs text-volt-primary">
                        <MapPinHouse className="h-3.5 w-3.5 text-volt-secondary" />
                        {customer.address || <span className="text-slate-500 italic">Not Provided</span>}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-medium text-xs">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {new Date(customer.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-volt-background border-t border-volt-container p-4 px-6 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Logged Assets Ledger Count:</span>
            <span className="text-volt-secondary font-bold text-sm bg-volt-secondary/10 px-2 py-0.5 rounded-volt">
              {customers.length} Entries
            </span>
          </div>
        </div>
      )}

    </div>
  );
}