'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  DollarSign,
  Package2,
  XCircle,
} from 'lucide-react';

import type { InventoryStats } from '../types/inventory';
import { formatCurrency } from '../services/inventoryUtils';

interface Props {
  stats: InventoryStats;
}

const cards = (stats: InventoryStats) => [
  {
    title: 'Total Parts',
    value: stats.totalParts.toLocaleString(),
    subtitle: 'Active inventory',
    icon: Package2,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Inventory Value',
    value: formatCurrency(stats.totalValue),
    subtitle: 'Current stock value',
    icon: DollarSign,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Low Stock',
    value: stats.lowStockCount.toLocaleString(),
    subtitle: 'Needs restocking',
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    title: 'Out of Stock',
    value: stats.outOfStockCount.toLocaleString(),
    subtitle: 'Unavailable items',
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
];

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards(stats).map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  {card.title}
                </p>

                <h3 className="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  {card.value}
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconBg}`}
              >
                <Icon
                  size={20}
                  className={card.iconColor}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}