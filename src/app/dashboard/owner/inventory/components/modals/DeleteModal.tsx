'use client';

import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { InventoryItem } from '../../types/inventory';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export default function DeleteModal({ item, onClose, onConfirm }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm(item!.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item.');
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Delete Part</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <Trash2 size={18} className="text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">{item.partName}</p>
              <p className="text-xs text-red-400 font-mono">{item.sku}</p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            This action cannot be undone. The part and all associated stock data will be permanently removed.
          </p>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {deleting ? 'Deleting…' : 'Delete Part'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
