'use client';

import { Users, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  showClear?: boolean;
  onClear?: () => void;
}

export default function EmptyState({
  title,
  description,
  showClear = false,
  onClear,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[55vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-volt-container bg-volt-surface px-6 py-10 text-center">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          {showClear ? (
            <SearchX className="h-8 w-8 text-sec-text" />
          ) : (
            <Users className="h-8 w-8 text-sec-text" />
          )}
        </div>

        <h2 className="text-xl font-bold text-volt-primary">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-sec-text">
          {description}
        </p>

        {showClear && onClear && (
          <button
            onClick={onClear}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
}