'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { InventoryItem, EditInventoryPayload } from '../../types/inventory';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (id: number, payload: EditInventoryPayload) => Promise<void>;
}

export default function EditInventoryModal({ item, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<EditInventoryPayload>({
    partName: '',
    category: '',
    retailPrice: 0,
    lowStockAlert: 5,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const syncedItemIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (item && syncedItemIdRef.current !== item.id) {
      syncedItemIdRef.current = item.id;
      setForm({
        partName: item.partName,
        category: item.category,
        retailPrice: item.retailPrice,
        lowStockAlert: item.lowStockAlert,
      });
      setError(null);
    }
  }, [item]);

  if (!item) return null;

  function patch<K extends keyof EditInventoryPayload>(key: K, value: EditInventoryPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(item!.id, form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Edit Part</h2>
            <p className="text-xs text-gray-400 mt-0.5">SKU: <span className="font-mono font-semibold text-gray-600">{item.sku}</span> (read-only)</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Part Name</label>
              <input
                required
                value={form.partName}
                onChange={(e) => patch('partName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <input
                required
                value={form.category}
                onChange={(e) => patch('category', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Retail Price (₹)</label>
              <input
                required
                type="number"
                step="0.01"
                min={0}
                value={form.retailPrice}
                onChange={(e) => patch('retailPrice', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Low Stock Threshold</label>
              <input
                required
                type="number"
                min={0}
                value={form.lowStockAlert}
                onChange={(e) => patch('lowStockAlert', Number(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
