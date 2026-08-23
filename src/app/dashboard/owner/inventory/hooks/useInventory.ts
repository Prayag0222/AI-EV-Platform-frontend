'use client';

import { useState, useEffect, useMemo } from 'react';

import type {
  InventoryItem,
  SortField,
  SortOrder,
  FilterType,
  AddInventoryPayload,
  EditInventoryPayload,
} from '../types/inventory';

import {
  fetchInventory,
  fetchArchivedInventory,
  addInventoryItem,
  editInventoryItem,
  archiveInventoryItem,
  restoreInventoryItem,
  addStock,
} from '../services/inventoryService';

import { computeStats, getStockStatus } from '../services/inventoryUtils';

export function useInventory() {
  // ─── Core data state ──────────────────────────────────────────────────────
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [archivedItems, setArchivedItems] = useState<InventoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showArchived, setShowArchived] = useState(false);

  // ─── Filter / sort / search state ─────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortField, setSortField] =
    useState<SortField>('partName');
  const [sortOrder, setSortOrder] =
    useState<SortOrder>('asc');

  // ─── Pagination ───────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // ─── Load inventory ───────────────────────────────────────────────────────
  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      setError(null);

      const [activeData, archivedData] = await Promise.all([
        fetchInventory(),
        fetchArchivedInventory(),
      ]);

      setItems(activeData);
      setArchivedItems(archivedData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not connect to backend.'
      );
    } finally {
      setLoading(false);
    }
  }

  // ─── Current dataset ──────────────────────────────────────────────────────
  const currentItems = showArchived
    ? archivedItems
    : items;

  // ─── Derived: filtered + sorted + paginated ───────────────────────────────
  const filteredItems = useMemo(() => {
    const q = search.toLowerCase();

    return currentItems
      .filter((item) => {
        const matchesSearch =
          !q ||
          item.partName.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);

        if (showArchived) {
          return matchesSearch;
        }

        const status = getStockStatus(item);

        const matchesFilter =
          filter === 'all' ||
          (filter === 'low_stock' &&
            status === 'low_stock') ||
          (filter === 'out_of_stock' &&
            status === 'out_of_stock');

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const dir =
          sortOrder === 'asc' ? 1 : -1;

        if (
          sortField === 'partName' ||
          sortField === 'category'
        ) {
          return (
            a[sortField].localeCompare(
              b[sortField]
            ) * dir
          );
        }

        return (
          (a[sortField] - b[sortField]) *
          dir
        );
      });
  }, [
    currentItems,
    search,
    filter,
    sortField,
    sortOrder,
    showArchived,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredItems.length / PAGE_SIZE
    )
  );

  const paginatedItems =
    filteredItems.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );

  const stats = useMemo(
    () => computeStats(items),
    [items]
  );

  // ─── View switching ───────────────────────────────────────────────────────
  function handleViewChange(archived: boolean) {
    setShowArchived(archived);
    setSearch('');
    setFilter('all');
    setPage(1);
  }

  // ─── Sorting toggle ───────────────────────────────────────────────────────
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder((o) =>
        o === 'asc' ? 'desc' : 'asc'
      );
    } else {
      setSortField(field);
      setSortOrder('asc');
    }

    setPage(1);
  }

  // ─── CRUD actions ─────────────────────────────────────────────────────────
  async function handleAdd(
    payload: AddInventoryPayload
  ): Promise<string> {
    const newItem =
      await addInventoryItem(payload);

    setItems((prev) => [
      newItem,
      ...prev,
    ]);

    setPage(1);

    return newItem.sku;
  }

  async function handleEdit(
    id: number,
    payload: EditInventoryPayload
  ): Promise<void> {
    const updated =
      await editInventoryItem(
        id,
        payload
      );

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? updated
          : item
      )
    );
  }

  async function handleArchive(
    id: number
  ): Promise<void> {
    const archived =
      await archiveInventoryItem(id);

    setItems((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    setArchivedItems((prev) => [
      archived,
      ...prev,
    ]);

    setPage(1);
  }

  async function handleRestore(
    id: number
  ): Promise<void> {
    const restored =
      await restoreInventoryItem(id);

    setArchivedItems((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    setItems((prev) => [
      restored,
      ...prev,
    ]);

    setPage(1);
  }

  async function handleAddStock(
    id: number,
    quantity: number
  ): Promise<void> {
    const updated =
      await addStock(id, {
        quantity,
      });

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? updated
          : item
      )
    );
  }

  return {
    // data
    items: paginatedItems,
    allItemsCount:
      filteredItems.length,
    stats,
    archivedItemsCount:
      archivedItems.length,

    loading,
    error,

    // archive view
    showArchived,
    handleViewChange,

    // search/filter/sort
    search,
    setSearch,

    filter,
    setFilter,

    sortField,
    sortOrder,
    handleSort,

    // pagination
    page,
    setPage,
    totalPages,
    PAGE_SIZE,

    // actions
    handleAdd,
    handleEdit,
    handleArchive,
    handleRestore,
    handleAddStock,

    retry: loadInventory,
  };
}