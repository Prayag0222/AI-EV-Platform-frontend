'use client';

import { CarFront, Trash2, UserRoundPen } from 'lucide-react';
import { Customer } from '@/app/dashboard/owner/types/customer';
import { getInitials } from '../utils/customer';

interface CustomerTableProps {
  customers: Customer[];
  totalCustomers: number;
  searchTerm: string;
  onClearSearch: () => void;
  onSelect: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}


export default function CustomerTable({
  customers,
  totalCustomers,
  searchTerm,
  onClearSearch,
  onSelect,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-volt-container bg-white">

      {/* Header */}

      <div className="grid grid-cols-[1fr_180px_140px_110px] border-b border-volt-container bg-slate-50 px-6 py-4">
        <span className="text-xs font-bold uppercase tracking-widest text-sec-text">
          Customer
        </span>

        <span className="text-xs font-bold uppercase tracking-widest text-sec-text">
          Phone
        </span>

        <span className="text-xs font-bold uppercase tracking-widest text-sec-text">
          Vehicles
        </span>

        <span className="text-center text-xs font-bold uppercase tracking-widest text-sec-text">
          Actions
        </span>
      </div>

      {/* Rows */}

      <div className="divide-y divide-volt-container">
        {customers.map((customer) => (
          <div
            key={customer.id}
            onClick={() => onSelect(customer)}
            className="grid w-full grid-cols-[1fr_180px_140px_110px] items-center px-6 py-4 text-left transition hover:bg-slate-50"
          >
            {/* Customer */}


            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-volt-primary text-sm font-bold text-white">
                {getInitials(customer.name)}
              </div>

              <div className="min-w-0">
                <p className="truncate font-semibold text-volt-primary">
                  {customer.name}
                </p>

                <p className="truncate text-sm text-sec-text">
                  {customer.email || 'No email'}
                </p>
              </div>
            </div>

            {/* Phone */}

            <p className="font-medium text-volt-primary">
              {customer.phone}
            </p>

            {/* Vehicles */}

            <div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  customer.vehicles.length
                    ? 'bg-emerald-green text-volt-secondary'
                    : 'bg-slate-100 text-sec-text'
                }`}
              >
                <CarFront className="h-3.5 w-3.5" />

                {customer.vehicles.length}{' '}
                {customer.vehicles.length === 1
                  ? 'Vehicle'
                  : 'Vehicles'}
              </span>
            </div>

            {/* Actions */}

            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2"
            >
              <button
                onClick={() => onEdit(customer)}
                className="rounded-xl p-2 text-sec-text transition hover:bg-slate-100 hover:text-volt-secondary"
              >
                <UserRoundPen className="h-4 w-4" />
              </button>

              <button
                onClick={() => onDelete(customer.id)}
                className="rounded-xl p-2 text-sec-text transition hover:bg-red-50 hover:text-volt-terracotta"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}

      <div className="flex items-center justify-between border-t border-volt-container bg-slate-50 px-6 py-4">
        <p className="text-sm text-sec-text">
          {searchTerm
            ? `${customers.length} of ${totalCustomers} customers`
            : `${totalCustomers} customers`}
        </p>

        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="text-sm font-semibold text-volt-secondary transition hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
}