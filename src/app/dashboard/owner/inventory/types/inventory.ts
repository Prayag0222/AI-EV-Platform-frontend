// ─── Inventory Domain Types ────────────────────────────────────────────────

export interface InventoryItem {
  id: number;
  partName: string;
  sku: string;
  category: string;
  stockLevel: number;
  retailPrice: number;
  lowStockAlert: number;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type SortField = 'partName' | 'stockLevel' | 'retailPrice' | 'category';
export type SortOrder = 'asc' | 'desc';
export type FilterType = 'all' | 'low_stock' | 'out_of_stock';

export interface InventoryStats {
  totalParts: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

// ─── API Payloads ───────────────────────────────────────────────────────────

export interface AddInventoryPayload {
  partName: string;
  category: string;
  stockLevel: number;
  retailPrice: number;
  lowStockAlert: number;
}

export interface EditInventoryPayload {
  partName: string;
  category: string;
  retailPrice: number;
  lowStockAlert: number;
}

export interface AddStockPayload {
  quantity: number;
}
