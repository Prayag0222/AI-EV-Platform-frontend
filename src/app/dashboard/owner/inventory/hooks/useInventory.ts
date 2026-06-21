'use client';

import { useState, useEffect, useMemo } from 'react';
import type { InventoryItem, SortField, SortOrder, FilterType } from '../types/inventory';
import {
  fetchInventory,
  addInventoryItem,
  editInventoryItem,
  deleteInventoryItem,
  addStock,
} from '../services/inventoryService';
import type { AddInventoryPayload, EditInventoryPayload } from '../types/inventory';
import { computeStats, getStockStatus } from '../services/inventoryUtils';

export function useInventory() {
  // ─── Core data state ──────────────────────────────────────────────────────
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Filter / sort / search state ─────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortField, setSortField] = useState<SortField>('partName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // ─── Pagination ───────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ─── Load on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchInventory();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not connect to backend.');
    } finally {
      setLoading(false);
    }
  }

  // ─── Derived: filtered + sorted + paginated ───────────────────────────────
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();

    return items
      .filter((item) => {
        const matchesSearch =
          !q ||
          item.partName.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);

        const status = getStockStatus(item);
        const matchesFilter =
          filter === 'all' ||
          (filter === 'low_stock' && status === 'low_stock') ||
          (filter === 'out_of_stock' && status === 'out_of_stock');

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const dir = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'partName' || sortField === 'category') {
          return a[sortField].localeCompare(b[sortField]) * dir;
        }
        return (a[sortField] - b[sortField]) * dir;
      });
  }, [items, search, filter, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const paginatedItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => computeStats(items), [items]);

  // ─── Sorting toggle ───────────────────────────────────────────────────────
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  }

  // ─── CRUD actions ─────────────────────────────────────────────────────────
  async function handleAdd(payload: AddInventoryPayload): Promise<string> {
    const newItem = await addInventoryItem(payload);
    setItems((prev) => [newItem, ...prev]);
    setPage(1);
    return newItem.sku;
  }

  async function handleEdit(id: number, payload: EditInventoryPayload): Promise<void> {
    const updated = await editInventoryItem(id, payload);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }

  async function handleDelete(id: number): Promise<void> {
    await deleteInventoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleAddStock(id: number, quantity: number): Promise<void> {
    const updated = await addStock(id, { quantity });
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
  }

  return {
    // data
    items: paginatedItems,
    allItemsCount: filteredItems.length,
    stats,
    loading,
    error,
    // search/filter/sort
    search, setSearch,
    filter, setFilter,
    sortField, sortOrder,
    handleSort,
    // pagination
    page, setPage, totalPages, PAGE_SIZE,
    // actions
    handleAdd,
    handleEdit,
    handleDelete,
    handleAddStock,
    retry: loadInventory,
  };
}
