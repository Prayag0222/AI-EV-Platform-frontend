import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-red-50 rounded-full p-5 mb-4">
        <AlertOctagon size={36} className="text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Failed to load inventory</h3>
      <p className="text-sm text-gray-400 mb-5 max-w-xs">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
      >
        <RefreshCw size={14} />
        Retry
      </button>
    </div>
  );
}
