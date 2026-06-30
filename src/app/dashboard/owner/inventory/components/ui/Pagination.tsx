'use client';

import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {start}-{end}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {totalItems}
        </span>{" "}
        parts
      </p>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700">
          {page} / {totalPages}
        </div>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}