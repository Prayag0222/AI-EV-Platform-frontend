import React from 'react';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-gray-50 rounded-full p-6 mb-4">
        <PackageOpen size={40} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">No inventory items yet</h3>
      <p className="text-sm text-gray-400 mb-5 max-w-xs">
        Add your first part to start tracking stock levels and values across your workshop.
      </p>
      <button
        onClick={onAdd}
        className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add your first inventory item
      </button>
    </div>
  );
}
