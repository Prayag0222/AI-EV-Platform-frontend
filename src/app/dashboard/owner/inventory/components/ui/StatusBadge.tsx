import React from 'react';
import type { StockStatus } from '../../types/inventory';

const CONFIG: Record<StockStatus, { label: string; className: string }> = {
  in_stock: {
    label: 'In Stock',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  low_stock: {
    label: 'Low Stock',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  out_of_stock: {
    label: 'Out of Stock',
    className: 'bg-red-50 text-red-700 border border-red-200',
  },
};

export default function StatusBadge({ status }: { status: StockStatus }) {
  const { label, className } = CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  );
}
