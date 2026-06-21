'use client';

import React, { useState } from 'react';
import { Plus, Boxes } from 'lucide-react';

import { useInventory } from './hooks/useInventory';
import type { InventoryItem } from './types/inventory';

import StatsCards from './components/StatsCards';
import InventoryTable from './components/InventoryTable';
import { StatsCardsSkeleton, TableSkeleton } from './components/ui/Skeletons';
import ErrorState from './components/ui/ErrorState';

import AddInventoryModal from './components/modals/AddInventoryModal';
import EditInventoryModal from './components/modals/EditInventoryModal';
import DeleteModal from './components/modals/DeleteModal';
import AddStockModal from './components/modals/AddStockModal';

export default function InventoryPage() {
  const inv = useInventory();

  // Modal state
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<InventoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);
  const [stockTarget, setStockTarget] = useState<InventoryItem | null>(null);

  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-sm">
              <Boxes size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Inventory</h1>
              <p className="text-sm text-gray-400">Track parts, stock levels, and workshop supply</p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={16} />
            Add New Part
          </button>
        </div>

        {/* ── Stats Cards ─────────────────────────────────────────────── */}
        {inv.loading ? (
          <StatsCardsSkeleton />
        ) : (
          <StatsCards stats={inv.stats} />
        )}

        {/* ── Main Content ────────────────────────────────────────────── */}
        {inv.loading ? (
          <TableSkeleton />
        ) : inv.error ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <ErrorState message={inv.error} onRetry={inv.retry} />
          </div>
        ) : (
          <InventoryTable
            items={inv.items}
            allItemsCount={inv.allItemsCount}
            search={inv.search}
            onSearchChange={(v) => { inv.setSearch(v); inv.setPage(1); }}
            filter={inv.filter}
            onFilterChange={inv.setFilter}
            sortField={inv.sortField}
            sortOrder={inv.sortOrder}
            onSort={inv.handleSort}
            page={inv.page}
            totalPages={inv.totalPages}
            pageSize={inv.PAGE_SIZE}
            onPageChange={inv.setPage}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
            onAddStock={setStockTarget}
            onAddNew={() => setShowAdd(true)}
          />
        )}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────── */}
      <AddInventoryModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={inv.handleAdd}
      />
      <EditInventoryModal
        item={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={inv.handleEdit}
      />
      <DeleteModal
        item={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={inv.handleDelete}
      />
      <AddStockModal
        item={stockTarget}
        onClose={() => setStockTarget(null)}
        onSubmit={inv.handleAddStock}
      />
    </main>
  );
}
