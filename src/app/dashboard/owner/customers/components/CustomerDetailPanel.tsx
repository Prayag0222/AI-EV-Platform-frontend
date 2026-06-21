'use client';

import React, { useEffect } from 'react';
import { X, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Customer } from '@/app/dashboard/owner/types/customer';

interface CustomerDetailPanelProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerDetailPanel({ customer, onClose }: CustomerDetailPanelProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[rgba(9,20,38,0.4)]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl">

        {/* ── Panel Header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(9,20,38,0.08)] bg-[#FAFAF8] flex-shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-sec-text">
            <svg className="w-3.5 h-3.5 text-volt-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Customer profile
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-volt-container text-sec-text hover:text-volt-primary transition"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Identity block */}
          <div className="px-6 py-6 border-b border-[rgba(9,20,38,0.06)]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-volt-primary flex items-center justify-center text-white text-lg font-black flex-shrink-0 select-none">
                {getInitials(customer.name)}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-black text-volt-primary tracking-tight truncate">
                  {customer.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1 text-[11.5px] text-sec-text">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span>
                    Customer since {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="mt-5 space-y-3">
              <ContactRow icon={<Phone className="h-3.5 w-3.5" />} value={customer.phone} />
              <ContactRow
                icon={<Mail className="h-3.5 w-3.5" />}
                value={customer.email || 'No email provided'}
                muted={!customer.email}
              />
              <ContactRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                value={customer.address || 'No address registered'}
                muted={!customer.address}
              />
            </div>
          </div>

          {/* ── Vehicles Section ── */}
          <div className="px-6 py-6">
            <SectionLabel label="Registered fleet" count={customer.vehicles.length} />

            {customer.vehicles.length > 0 ? (
              <div className="space-y-3 mt-4">
                {customer.vehicles.map((v) => (
                  <div
                    key={v.id}
                    className="bg-volt-background border border-[rgba(9,20,38,0.08)] rounded-xl p-4"
                  >
                    {/* Vehicle name */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-volt-primary flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                      </div>
                      <p className="font-bold text-sm text-volt-primary">{v.vehicleModel}</p>
                    </div>

                    {/* Meta grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <MetaCell label="Make" value={v.manufacturer} />
                      <MetaCell label="Year" value={String(v.modelYear)} />
                    </div>

                    {/* VIN */}
                    <div className="flex items-center gap-2 bg-white border border-[rgba(9,20,38,0.08)] rounded-lg px-3 py-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-sec-text flex-shrink-0">VIN</span>
                      <span className="font-mono text-[11px] text-volt-primary tracking-wider truncate">{v.vin}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center justify-center py-12 border-2 border-dashed border-[rgba(9,20,38,0.08)] rounded-xl bg-volt-background">
                <div className="w-10 h-10 rounded-xl bg-volt-container flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-sec-text" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-volt-primary">No vehicles registered</p>
                <p className="text-xs text-sec-text mt-1">Vehicles will appear here when added.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Panel Footer ── */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-[rgba(9,20,38,0.08)] bg-[#FAFAF8]">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[rgba(9,20,38,0.12)] bg-white px-4 py-2.5 text-sm font-bold text-volt-primary hover:bg-volt-container transition active:scale-[0.98]"
          >
            <X className="w-4 h-4" />
            Close profile
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Small sub-components ── */

function ContactRow({
  icon,
  value,
  muted = false,
}: {
  icon: React.ReactNode;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-volt-container flex items-center justify-center text-volt-secondary flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <p className={`text-sm leading-relaxed pt-1 ${muted ? 'text-sec-text italic' : 'text-primary-text font-medium'}`}>
        {value}
      </p>
    </div>
  );
}

function SectionLabel({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text">
        <svg className="w-3.5 h-3.5 text-volt-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
        {label}
      </div>
      <div className="flex-1 h-px bg-[rgba(9,20,38,0.07)]" />
      <span className="text-[11px] font-bold text-volt-secondary bg-emerald-green px-2 py-0.5 rounded-full">
        {count}
      </span>
    </div>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-[rgba(9,20,38,0.08)] rounded-lg px-3 py-2">
      <p className="text-[10px] font-bold tracking-widest uppercase text-sec-text mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-volt-primary">{value}</p>
    </div>
  );
}