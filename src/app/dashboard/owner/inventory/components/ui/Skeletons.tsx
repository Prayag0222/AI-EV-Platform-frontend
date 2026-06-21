import React from 'react';

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className ?? ''}`} />;
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 shadow-sm">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex gap-3">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="p-3 text-left">
                <Skeleton className="h-3 w-16" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, row) => (
            <tr key={row} className="border-b border-gray-50">
              {Array.from({ length: 8 }).map((_, col) => (
                <td key={col} className="p-3">
                  <Skeleton className={`h-4 ${col === 0 ? 'w-32' : col === 6 ? 'w-20' : 'w-16'}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
