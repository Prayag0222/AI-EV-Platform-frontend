'use client';

import React from 'react';
import {
  Search, ChevronUp, ChevronDown, ChevronsUpDown,
  Pencil, Trash2, PackagePlus, History,
  Filter,
} from 'lucide-react';
import type { InventoryItem, SortField, SortOrder, FilterType } from '../types/inventory';
import { getStockStatus, formatCurrency } from '../services/inventoryUtils';
import StatusBadge from './ui/StatusBadge';
import EmptyState from './ui/EmptyState';
import Pagination from './ui/Pagination';

interface Props {
  items: InventoryItem[];
  allItemsCount: number;
  search: string;
  onSearchChange: (v: string) => void;
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
  onAddStock: (item: InventoryItem) => void;
  onAddNew: () => void;
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All Parts', value: 'all' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Out of Stock', value: 'out_of_stock' },
];

const SORT_COLS: { label: string; field: SortField }[] = [
  { label: 'Part Name', field: 'partName' },
  { label: 'Category', field: 'category' },
  { label: 'Stock', field: 'stockLevel' },
  { label: 'Price', field: 'retailPrice' },
];

function SortIcon({ field, sortField, sortOrder }: { field: SortField; sortField: SortField; sortOrder: SortOrder }) {
  if (field !== sortField) return <ChevronsUpDown size={13} className="text-gray-300" />;
  return sortOrder === 'asc'
    ? <ChevronUp size={13} className="text-blue-500" />
    : <ChevronDown size={13} className="text-blue-500" />;
}

export default function InventoryTable(props: Props) {
  const {
    items, allItemsCount, search, onSearchChange,
    filter, onFilterChange,
    sortField, sortOrder, onSort,
    page, totalPages, pageSize, onPageChange,
    onEdit, onDelete, onAddStock, onAddNew,
  } = props;

  const isEmpty = allItemsCount === 0 && !search && filter === 'all';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by part name, SKU, or category…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg shrink-0">
          <Filter size={13} className="text-gray-400 ml-1" />
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { onFilterChange(f.value); onPageChange(1); }}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === f.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {isEmpty ? (
        <EmptyState onAdd={onAddNew} />
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-sm text-gray-400">
          No parts match your search or filter.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {/* Sortable columns */}
                  {SORT_COLS.map(({ label, field }) => (
                    <th
                      key={field}
                      onClick={() => onSort(field)}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
                    >
                      <span className="inline-flex items-center gap-1 hover:text-gray-800 transition-colors">
                        {label}
                        <SortIcon field={field} sortField={sortField} sortOrder={sortOrder} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Alert</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{item.partName}</td>
                      <td className="px-4 py-3 text-gray-500">{item.category}</td>
                      <td className={`px-4 py-3 font-semibold ${status === 'in_stock' ? 'text-gray-700' : status === 'low_stock' ? 'text-amber-600' : 'text-red-600'}`}>
                        {item.stockLevel}
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-mono">{formatCurrency(item.retailPrice)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{item.sku}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{item.lowStockAlert}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={status} />
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <ActionBtn
                            icon={<PackagePlus size={14} />}
                            label="Add Stock"
                            color="text-emerald-600 hover:bg-emerald-50"
                            onClick={() => onAddStock(item)}
                          />
                          <ActionBtn
                            icon={<Pencil size={14} />}
                            label="Edit"
                            color="text-blue-600 hover:bg-blue-50"
                            onClick={() => onEdit(item)}
                          />
                          <ActionBtn
                            icon={<Trash2 size={14} />}
                            label="Delete"
                            color="text-red-500 hover:bg-red-50"
                            onClick={() => onDelete(item)}
                          />
                          {/* Placeholder for future */}
                          <ActionBtn
                            icon={<History size={14} />}
                            label="View History (coming soon)"
                            color="text-gray-300 cursor-not-allowed"
                            onClick={() => {}}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={allItemsCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}

function ActionBtn({
  icon, label, color, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${color}`}
    >
      {icon}
    </button>
  );
}
