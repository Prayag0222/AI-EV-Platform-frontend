'use client';

import { motion } from 'framer-motion';
import { PackageOpen, Plus } from 'lucide-react';

interface Props {
  onAdd: () => void;
}

export default function EmptyState({
  onAdd,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">
        <PackageOpen
          size={36}
          className="text-blue-600"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-900">
        No inventory yet
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
        Start building your workshop inventory by
        adding your first spare part.
      </p>

      <button
        onClick={onAdd}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95"
      >
        <Plus size={18} />
        Add Inventory Item
      </button>
    </motion.div>
  );
}