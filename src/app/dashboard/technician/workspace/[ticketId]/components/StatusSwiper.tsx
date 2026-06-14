'use client';
import React, { useState } from 'react';

interface StatusSwiperProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

export default function StatusSwiper({ currentStatus, onStatusChange }: StatusSwiperProps) {
  // A simple list of statuses for the mechanic to swipe through
  const statuses = ['PENDING', 'DIAGNOSING', 'IN_SERVICE', 'RESOLVED'];

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest">
        Update Status
      </p>
      <div className="flex gap-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`flex-1 py-3 text-[10px] font-bold rounded-xl transition ${
              currentStatus === status 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}