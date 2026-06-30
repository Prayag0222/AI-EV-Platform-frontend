'use client';

import { useState } from 'react';
import {
  Boxes,
  Package,
  IndianRupee,
  AlertTriangle,
} from 'lucide-react';

import BaseModal from '../ui/BaseModal';
import InventoryFormField from '../ui/InventoryFormField';

import type { AddInventoryPayload } from '../../types/inventory';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: AddInventoryPayload) => Promise<string>;
}

const INITIAL_STATE: AddInventoryPayload = {
  partName: '',
  category: '',
  stockLevel: 0,
  retailPrice: 0,
  lowStockAlert: 5,
};

export default function AddInventoryForm({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<AddInventoryPayload>(INITIAL_STATE);

  const [saving, setSaving] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  function patch<K extends keyof AddInventoryPayload>(
    key: K,
    value: AddInventoryPayload[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      await onSubmit(form);

      setForm(INITIAL_STATE);

      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to add inventory item.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      loading={saving}
      size="lg"
      title="Add Inventory Item"
      description="Create a new inventory part for your workshop."
      icon={<Boxes size={20} />}
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="
flex-1
rounded-xl
border
border-gray-200
py-3
font-medium
text-gray-700
transition
hover:bg-gray-100
disabled:opacity-50
"
          >
            Cancel
          </button>

          <button
            form="add-inventory-form"
            type="submit"
            disabled={saving}
            className="
flex-1
rounded-xl
bg-blue-600
py-3
font-semibold
text-white
transition
hover:bg-blue-700
disabled:opacity-60
"
          >
            {saving
              ? 'Adding...'
              : 'Add Part'}
          </button>
        </div>
      }
    >
      <form
        id="add-inventory-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {error && (
          <div
            className="
rounded-xl
border
border-red-200
bg-red-50
px-4
py-3
text-sm
font-medium
text-red-600
"
          >
            {error}
          </div>
        )}

        <InventoryFormField
          required
          label="Part Name"
          placeholder="Battery Connector"
          value={form.partName}
          onChange={(e) =>
            patch('partName', e.target.value)
          }
          icon={<Package size={18} />}
        />

        <InventoryFormField
          required
          label="Category"
          placeholder="Electrical"
          value={form.category}
          onChange={(e) =>
            patch('category', e.target.value)
          }
          hint="SKU will be generated automatically."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InventoryFormField
            required
            label="Initial Stock"
            type="number"
            min={0}
            value={form.stockLevel}
            onChange={(e) =>
              patch(
                'stockLevel',
                Number(e.target.value)
              )
            }
          />

          <InventoryFormField
            required
            label="Retail Price"
            type="number"
            min={0}
            step="0.01"
            value={form.retailPrice}
            icon={<IndianRupee size={18} />}
            onChange={(e) =>
              patch(
                'retailPrice',
                Number(e.target.value)
              )
            }
          />
        </div>

        <InventoryFormField
          required
          label="Low Stock Alert"
          type="number"
          min={0}
          value={form.lowStockAlert}
          icon={<AlertTriangle size={18} />}
          hint="You'll be notified when stock reaches this level."
          onChange={(e) =>
            patch(
              'lowStockAlert',
              Number(e.target.value)
            )
          }
        />
      </form>
    </BaseModal>
  );
}