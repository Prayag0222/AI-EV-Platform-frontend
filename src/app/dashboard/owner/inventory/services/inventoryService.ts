import type {
  InventoryItem,
  AddInventoryPayload,
  EditInventoryPayload,
  AddStockPayload,
} from '../types/inventory';

import { API_BASE } from '@/config/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data as T;
}

// ─── Fetch active inventory ────────────────────────────────────────────────

export async function fetchInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory`, {
    credentials: 'include',
  });

  const data = await handleResponse<{ items: InventoryItem[] }>(res);

  return data.items ?? [];
}

// ─── Fetch archived inventory ──────────────────────────────────────────────

export async function fetchArchivedInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${API_BASE}/inventory?archived=true`, {
    credentials: 'include',
  });

  const data = await handleResponse<{ items: InventoryItem[] }>(res);

  return data.items ?? [];
}

// ─── Add inventory item ────────────────────────────────────────────────────

export async function addInventoryItem(
  payload: AddInventoryPayload
): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const data = await handleResponse<{ item: InventoryItem }>(res);

  return data.item;
}

// ─── Edit inventory item ───────────────────────────────────────────────────

export async function editInventoryItem(
  id: number,
  payload: EditInventoryPayload
): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE}/inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  const data = await handleResponse<{ item: InventoryItem }>(res);

  return data.item;
}

// ─── Archive inventory item ────────────────────────────────────────────────

export async function archiveInventoryItem(
  id: number
): Promise<InventoryItem> {
  const res = await fetch(
    `${API_BASE}/inventory/${id}/archive`,
    {
      method: 'PATCH',
      credentials: 'include',
    }
  );

  const data = await handleResponse<{ item: InventoryItem }>(res);

  return data.item;
}

// ─── Restore inventory item ────────────────────────────────────────────────

export async function restoreInventoryItem(
  id: number
): Promise<InventoryItem> {
  const res = await fetch(
    `${API_BASE}/inventory/${id}/restore`,
    {
      method: 'PATCH',
      credentials: 'include',
    }
  );

  const data = await handleResponse<{ item: InventoryItem }>(res);

  return data.item;
}

// ─── Add stock ─────────────────────────────────────────────────────────────

export async function addStock(
  id: number,
  payload: AddStockPayload
): Promise<InventoryItem> {
  const res = await fetch(
    `${API_BASE}/inventory/${id}/stock`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      credentials: 'include',
    }
  );

  const data = await handleResponse<{ item: InventoryItem }>(res);

  return data.item;
}