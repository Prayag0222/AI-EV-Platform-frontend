import React from 'react';
import { StatusColumn } from '@/types/dashboard';

// 1. Defining the contract for the incoming props pipeline
interface OperationsOverviewProps {
  columns: StatusColumn[];
}

export default function OperationsOverview({ columns }: OperationsOverviewProps) {
  return (
    <div className="w-full mt-12">
      {/* 🏷️ BLOCK HEADER SECTION */}
      <h3 className="font-display text-lg font-semibold tracking-wide text-volt-primary mb-6">
        Operations Overview
      </h3>
      
      {/* 📊 FIVE-COLUMN FLUID DATA GRID LAYOUT */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {columns.map((col, index) => (
          <div 
            key={index}
            className="p-6 bg-volt-surface border border-volt-container rounded-container flex flex-col gap-2 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_20px_-4px_rgba(30,41,59,0.04)] select-none"
          >
            {/* Upper Track: Minimal Category Label in Inter font */}
            <span className="font-sans text-xs font-semibold tracking-wider text-slate-400 uppercase">
              {col.label}
            </span>
            
            {/* Lower Track: Bold Quantity Count in Geist Technical display font */}
            <span className="font-display text-3xl font-bold tracking-tight text-volt-primary">
              {col.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}