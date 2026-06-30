import type {
  InventoryItem,
  AddInventoryPayload,
  EditInventoryPayload,
  AddStockPayload,
} from '../types/inventory';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data as T;
}

// ─── Existing endpoints (unchanged) ────────────────────────────────────────

export async function fetchInventory(): Promise<InventoryItem[]> {
  const res = await fetch(`${BASE_URL}/inventory`,{
    credentials:"include"
  });
  const data = await handleResponse<{ items: InventoryItem[] }>(res);
  return data.items ?? [];
}

export async function addInventoryItem(payload: AddInventoryPayload): Promise<InventoryItem> {
  const res = await fetch(`${BASE_URL}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials:"include"
  });
  const data = await handleResponse<{ item: InventoryItem }>(res);
  return data.item;
}

// ─── New endpoints (added as needed per Step 15) ───────────────────────────

export async function editInventoryItem(
  id: number,
  payload: EditInventoryPayload
): Promise<InventoryItem> {
  const res = await fetch(`${BASE_URL}/inventory/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials:"include"
  });
  const data = await handleResponse<{ item: InventoryItem }>(res);
  return data.item;
}

export async function deleteInventoryItem(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/inventory/${id}`, { method: 'DELETE',
    credentials:"include"
   });
  await handleResponse<unknown>(res);
}

export async function addStock(id: number, payload: AddStockPayload): Promise<InventoryItem> {
  const res = await fetch(`${BASE_URL}/inventory/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    credentials:"include"
  });
  const data = await handleResponse<{ item: InventoryItem }>(res);
  return data.item;
}
