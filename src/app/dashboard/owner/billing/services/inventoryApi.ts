import { API_BASE } from '@/config/api';

export interface InventoryItem {
  id: number;
  partName: string;
  sku: string;
  category: string;
  stockLevel: number;
  retailPrice: number;
  lowStockAlert: number;
  createdAt: string;
  updatedAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`,{
    credentials:"include",
    ...init
    
  },);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Inventory request failed.');
  return body as T;
}

export async function searchInventory(query: string) {
  const data = await request<{ items: InventoryItem[] }>(`/inventory/search?q=${encodeURIComponent(query)}&limit=10`,{
    credentials:"include"
  });
  return data.items || [];
}

export async function getAllInventory() {
  const data = await request<{ items: InventoryItem[] }>('/inventory');
  return data.items || [];
}

export async function deductStockFromItems(items: Array<{ id: number; quantity: number }>) {
  return request<{ success: boolean }>('/inventory/deduct/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
}
