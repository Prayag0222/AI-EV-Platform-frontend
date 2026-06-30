import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import type { StockStatus } from '../../types/inventory';

const CONFIG = {
  in_stock: {
    label: 'In Stock',
    icon: CheckCircle2,
    className:
      'bg-emerald-50 text-emerald-700 border border-emerald-200',
  },
  low_stock: {
    label: 'Low Stock',
    icon: AlertTriangle,
    className:
      'bg-amber-50 text-amber-700 border border-amber-200',
  },
  out_of_stock: {
    label: 'Out of Stock',
    icon: XCircle,
    className:
      'bg-red-50 text-red-700 border border-red-200',
  },
} satisfies Record<
  StockStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
>;

interface Props {
  status: StockStatus;
}

export default function StatusBadge({
  status,
}: Props) {
  const item = CONFIG[status];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${item.className}`}
    >
      <Icon size={12} />
      {item.label}
    </span>
  );
}