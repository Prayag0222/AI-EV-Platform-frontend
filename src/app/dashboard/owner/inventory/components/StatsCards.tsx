'use client';

import React from 'react';
import { Package, DollarSign, AlertTriangle, XCircle } from 'lucide-react';
import type { InventoryStats } from '../types/inventory';
import { formatCurrency } from '../services/inventoryUtils';

interface Props {
  stats: InventoryStats;
}

interface CardConfig {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent: string; // tailwind bg class for icon wrapper
  border: string; // tailwind border class
}

export default function StatsCards({ stats }: Props) {
  const cards: CardConfig[] = [
    {
      label: 'Total Parts',
      value: stats.totalParts.toLocaleString(),
      icon: <Package size={18} />,
      accent: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      label: 'Inventory Value',
      value: formatCurrency(stats.totalValue),
      icon: <DollarSign size={18} />,
      accent: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      label: 'Low Stock',
      value: stats.lowStockCount.toLocaleString(),
      icon: <AlertTriangle size={18} />,
      accent: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStockCount.toLocaleString(),
      icon: <XCircle size={18} />,
      accent: 'bg-red-50 text-red-600',
      border: 'border-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl border ${card.border} p-5 flex items-start gap-4 shadow-sm`}
        >
          <div className={`${card.accent} p-2 rounded-lg`}>{card.icon}</div>
          <div>
            <p className="text-xs text-gray-500 font-medium">{card.label}</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5 tracking-tight">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
