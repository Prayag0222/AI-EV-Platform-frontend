'use client';

import React, { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import type { InventoryItem } from '../../types/inventory';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (id: number, quantity: number) => Promise<void>;
}

export default function AddStockModal({ item, onClose, onSubmit }: Props) {
  const [quantity, setQuantity] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  const resultingStock = item.stockLevel + quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (quantity <= 0) {
      setError('Please enter a quantity greater than 0.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit(item!.id, quantity);
      setQuantity(0);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add stock.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <PackagePlus size={18} className="text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Add Stock</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700">{item.partName}</p>
            <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
          </div>

          {/* Stock preview */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between text-sm">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Current Stock</p>
              <p className="text-2xl font-bold text-gray-700">{item.stockLevel}</p>
            </div>
            <div className="text-gray-300 text-2xl font-light">+</div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Adding</p>
              <p className="text-2xl font-bold text-blue-600">{quantity || 0}</p>
            </div>
            <div className="text-gray-300 text-2xl font-light">=</div>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Result</p>
              <p className="text-2xl font-bold text-emerald-600">{resultingStock}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity to Add</label>
            <input
              required
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => { setQuantity(Number(e.target.value)); setError(null); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
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
              {saving ? 'Updating…' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
