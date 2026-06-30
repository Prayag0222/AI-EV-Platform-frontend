'use client';

import { CarFront, Mail, Phone, Trash2, UserRoundPen } from 'lucide-react';
import { Customer } from '@/app/dashboard/owner/types/customer';

interface CustomerMobileCardProps {
  customer: Customer;
  onSelect: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

function getInitials(name: string) {
  const words = name.trim().split(' ').filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}

export default function CustomerMobileCard({
  customer,
  onSelect,
  onEdit,
  onDelete,
}: CustomerMobileCardProps) {
  return (
    <div
      onClick={() => onSelect(customer)}
      className="rounded-2xl border border-volt-container bg-volt-surface p-4 transition active:scale-[0.99]"
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-volt-primary text-sm font-bold text-white">
            {getInitials(customer.name)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-volt-primary">
              {customer.name}
            </h3>

            <p className="mt-1 flex items-center gap-2 truncate text-sm text-sec-text">
              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
              {customer.phone}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            customer.vehicles.length
              ? 'bg-emerald-green text-volt-secondary'
              : 'bg-slate-100 text-sec-text'
          }`}
        >
          <CarFront className="h-3.5 w-3.5" />

          {customer.vehicles.length}
        </span>
      </div>

      {/* Email */}

      <div className="mt-4 flex items-center gap-2 text-sm text-sec-text">
        <Mail className="h-4 w-4 flex-shrink-0" />

        <span className="truncate">
          {customer.email || 'No email'}
        </span>
      </div>

      {/* Footer */}

      <div className="mt-5 flex items-center justify-between border-t border-volt-container pt-4">
        <div className="text-xs text-sec-text">
          {customer.vehicles.length}{' '}
          {customer.vehicles.length === 1
            ? 'Vehicle'
            : 'Vehicles'}
        </div>

        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(customer)}
            className="rounded-xl p-2 text-sec-text transition hover:bg-slate-100 hover:text-volt-secondary"
            aria-label="Edit customer"
          >
            <UserRoundPen className="h-4 w-4" />
          </button>

          <button
            onClick={() => onDelete(customer.id)}
            className="rounded-xl p-2 text-sec-text transition hover:bg-red-50 hover:text-volt-terracotta"
            aria-label="Delete customer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}