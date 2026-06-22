'use client';

import React, { useState, useEffect } from 'react';
import { Users, Loader2, UserRoundPen, Trash2, Search, UserPlus } from 'lucide-react';
import DeleteCustomerModal from '@/components/DeleteCustomerModal';
import EditCustomerModal from '@/components/EditCustomerModal';
import CustomerDetailPanel from './components/CustomerDetailPanel';
import { API_BASE } from '@/config/api';
import { Customer } from '@/app/dashboard/owner/types/customer';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${API_BASE}/owner/getCustomer`);
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : data.customers || []);
      } catch (err) {
        console.error('Fetch failed', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const executeDelete = async () => {
    if (!customerToDelete) return;
    const res = await fetch(`${API_BASE}/owner/deleteCustomer/${customerToDelete}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete));
      if (selectedCustomer?.id === customerToDelete) setSelectedCustomer(null);
    }
    setCustomerToDelete(null);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-volt-background">

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-[rgba(9,20,38,0.08)] px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sec-text mb-2">
              <Users className="w-3.5 h-3.5 text-volt-secondary" />
              <span>Customers</span>
            </div>
            <h1 className="text-[26px] font-black text-volt-primary tracking-tight leading-tight">
              Customer Directory
            </h1>
            <p className="text-sm text-sec-text mt-1">
              {isLoading ? 'Loading…' : `${customers.length} customer${customers.length !== 1 ? 's' : ''} registered`}
            </p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 bg-volt-background border border-[rgba(9,20,38,0.12)] rounded-xl px-3.5 py-2.5 focus-within:border-volt-secondary focus-within:ring-2 focus-within:ring-volt-secondary/10 transition">
              <Search className="h-4 w-4 text-sec-text flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by name or phone…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-sm bg-transparent text-volt-primary placeholder:text-[#C5C6CD] w-52"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sec-text hover:text-volt-primary transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">

        {/* Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="animate-spin h-8 w-8 text-volt-secondary" />
            <p className="text-sm text-sec-text font-medium">Loading customers…</p>
          </div>

        ) : filteredCustomers.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-volt-container flex items-center justify-center">
              <Users className="w-7 h-7 text-sec-text" />
            </div>
            <div className="text-center">
              <p className="font-bold text-volt-primary text-base">
                {searchTerm ? 'No results found' : 'No customers yet'}
              </p>
              <p className="text-sm text-sec-text mt-1">
                {searchTerm
                  ? `No customers match "${searchTerm}"`
                  : 'Customers will appear here once added.'}
              </p>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm font-semibold text-volt-secondary hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

        ) : (
          /* ── Stats row ── */
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard
                label="Total customers"
                value={customers.length}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                }
              />
              <StatCard
                label="Total vehicles"
                value={customers.reduce((sum, c) => sum + c.vehicles.length, 0)}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                }
              />
              <StatCard
                label="Avg. vehicles"
                value={customers.length > 0
                  ? (customers.reduce((s, c) => s + c.vehicles.length, 0) / customers.length).toFixed(1)
                  : '0'}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                }
              />
              <StatCard
                label="Showing"
                value={filteredCustomers.length}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                  </svg>
                }
                muted={searchTerm.length > 0}
              />
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-[rgba(9,20,38,0.08)] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_160px_120px_100px] px-5 py-3 border-b border-[rgba(9,20,38,0.06)] bg-[#FAFAF8]">
                <span className="text-[11px] font-bold tracking-widest uppercase text-sec-text">Customer</span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-sec-text">Phone</span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-sec-text">Vehicles</span>
                <span className="text-[11px] font-bold tracking-widest uppercase text-sec-text text-center">Actions</span>
              </div>

              {/* Table rows */}
              <div className="divide-y divide-[rgba(9,20,38,0.05)]">
                {filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="grid grid-cols-[1fr_160px_120px_100px] px-5 py-4 items-center hover:bg-volt-background transition cursor-pointer group"
                  >
                    {/* Customer name + initials */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-volt-primary flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">
                        {getInitials(c.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-volt-primary truncate group-hover:text-volt-secondary transition">
                          {c.name}
                        </p>
                        <p className="text-[11px] text-sec-text truncate">{c.email || 'No email'}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <p className="text-sm text-primary-text font-medium">{c.phone}</p>

                    {/* Vehicles badge */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        c.vehicles.length > 0
                          ? 'bg-emerald-green text-volt-secondary'
                          : 'bg-volt-container text-sec-text'
                      }`}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        {c.vehicles.length} {c.vehicles.length === 1 ? 'vehicle' : 'vehicles'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setCustomerToEdit(c)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-volt-container text-sec-text hover:text-volt-secondary transition"
                        title="Edit customer"
                      >
                        <UserRoundPen className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setCustomerToDelete(c.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FFDAD6] text-sec-text hover:text-volt-terracotta transition"
                        title="Delete customer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer count */}
              <div className="px-5 py-3 border-t border-[rgba(9,20,38,0.06)] bg-[#FAFAF8] flex items-center justify-between">
                <p className="text-[11.5px] text-sec-text">
                  {searchTerm
                    ? `${filteredCustomers.length} of ${customers.length} customers`
                    : `${customers.length} customers total`}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-[11.5px] font-semibold text-volt-secondary hover:underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Slide-out Detail Panel ── */}
      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      <DeleteCustomerModal
        customerId={customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={executeDelete}
      />
      <EditCustomerModal
        customer={customerToEdit}
        onClose={() => setCustomerToEdit(null)}
        onUpdateSuccess={(updated) =>
          setCustomers((p) => p.map((c) => (c.id === updated.id ? updated : c)))
        }
      />
    </div>
  );
}

/* ── Stat card sub-component ── */
function StatCard({
  label,
  value,
  icon,
  muted = false,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-[rgba(9,20,38,0.08)] px-4 py-3.5 flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        muted ? 'bg-volt-container text-sec-text' : 'bg-emerald-green text-volt-secondary'
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold text-sec-text tracking-wide">{label}</p>
        <p className="text-lg font-black text-volt-primary leading-tight">{value}</p>
      </div>
    </div>
  );
}