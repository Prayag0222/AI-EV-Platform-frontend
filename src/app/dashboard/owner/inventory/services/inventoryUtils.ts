import type { InventoryItem, StockStatus, InventoryStats } from '../types/inventory';

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.stockLevel === 0) return 'out_of_stock';
  if (item.stockLevel <= item.lowStockAlert) return 'low_stock';
  return 'in_stock';
}

export function computeStats(items: InventoryItem[]): InventoryStats {
  return {
    totalParts: items.length,
    totalValue: items.reduce((sum, i) => sum + i.retailPrice * i.stockLevel, 0),
    lowStockCount: items.filter((i) => getStockStatus(i) === 'low_stock').length,
    outOfStockCount: items.filter((i) => getStockStatus(i) === 'out_of_stock').length,
  };
}

export function formatCurrency(value: number): string {
  return `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
