'use client';

import { Search, Users, X } from 'lucide-react';

interface CustomerHeaderProps {
  totalCustomers: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function CustomerHeader({
  totalCustomers,
  searchTerm,
  onSearchChange,
}: CustomerHeaderProps) {
  return (
    <header className="border-b border-volt-container bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8 md:py-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-green text-volt-secondary">
              <Users className="h-4 w-4" />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sec-text">
              Customers
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-volt-primary md:text-3xl">
            Customer Directory
          </h1>

          <p className="mt-1 text-sm text-sec-text">
            {totalCustomers}{' '}
            {totalCustomers === 1 ? 'customer' : 'customers'} registered
          </p>
        </div>

        <div className="w-full md:w-80">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-slate-900">
            <Search className="h-4 w-4 text-sec-text" />

            <input
              type="text"
              value={searchTerm}
              placeholder="Search customer..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex-1 bg-transparent text-sm text-volt-primary outline-none placeholder:text-slate-400"
            />

            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="rounded-md p-1 text-sec-text transition hover:bg-slate-100 hover:text-volt-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}