'use client';

import { useState } from 'react';
import { Boxes, PackagePlus } from 'lucide-react';

import BaseModal from '../ui/BaseModal';
import InventoryFormField from '../ui/InventoryFormField';

import type { InventoryItem } from '../../types/inventory';

interface Props {
  item: InventoryItem | null;
  onClose: () => void;
  onSubmit: (id: number, quantity: number) => Promise<void>;
}

export default function AddStockForm({
  item,
  onClose,
  onSubmit,
}: Props) {
  const [quantity, setQuantity] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

function handleClose() {
  setQuantity(0);
  setError(null);
  onClose();
}

  if (!item) return null;

  const inventoryItem = item;
  const resultingStock = inventoryItem.stockLevel + quantity;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (quantity <= 0) {
      setError('Quantity must be greater than 0.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSubmit(inventoryItem.id, quantity);
      handleClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to update stock.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <BaseModal
      open={!!inventoryItem}
      onClose={handleClose}
      loading={saving}
      size="md"
      title="Add Stock"
      description="Increase available inventory."
      icon={<Boxes size={20} />}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="flex-1 rounded-xl border border-gray-200 py-3 font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="add-stock-form"
            disabled={saving}
            className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Updating...' : 'Add Stock'}
          </button>
        </div>
      }
    >
      <form
        id="add-stock-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3">
              <PackagePlus
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <h3 className="font-semibold text-gray-900">
                {inventoryItem.partName}
              </h3>

              <p className="font-mono text-xs text-gray-500">
                {inventoryItem.sku}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white p-4 border">
              <p className="text-xs text-gray-500">
                Current
              </p>

              <p className="mt-1 text-2xl font-bold">
                {inventoryItem.stockLevel}
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4 border border-blue-200">
              <p className="text-xs text-blue-600">
                Adding
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-600">
                {quantity}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200">
              <p className="text-xs text-emerald-600">
                New Stock
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {resultingStock}
              </p>
            </div>
          </div>
        </div>

        <InventoryFormField
          required
          type="number"
          min={1}
          label="Quantity"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
        />
      </form>
    </BaseModal>
  );
}