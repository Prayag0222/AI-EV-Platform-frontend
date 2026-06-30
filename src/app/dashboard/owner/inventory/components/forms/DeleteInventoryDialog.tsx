'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Boxes,
  Trash2,
} from 'lucide-react';

import BaseModal from '../ui/BaseModal';

import type { InventoryItem } from '../../types/inventory';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
  onConfirm: (id: number) => Promise<void>;
}

export default function DeleteInventoryDialog({
  item,
  onClose,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  const inventoryItem = item;

  function handleClose() {
    setError(null);
    onClose();
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);

    try {
      await onConfirm(inventoryItem.id);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to delete inventory item.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseModal
      open={!!inventoryItem}
      onClose={handleClose}
      loading={loading}
      size="sm"
      title="Delete Inventory Item"
      description="This action cannot be undone."
      icon={<Trash2 size={20} />}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-red-100 p-3">
              <Boxes
                size={20}
                className="text-red-600"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {inventoryItem.partName}
              </h3>

              <p className="mt-1 font-mono text-xs text-gray-500">
                {inventoryItem.sku}
              </p>

              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2">
                <AlertTriangle
                  size={16}
                  className="text-red-500"
                />

                <p className="text-xs text-gray-600">
                  All stock history for this item
                  will be permanently removed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}