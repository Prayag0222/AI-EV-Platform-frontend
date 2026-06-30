'use client';

import { CheckCircle, Wrench } from 'lucide-react';
import OperationStats from './OperationStats';

interface OperationHeaderProps {
  activeJobs: number;
  deliveredJobs: number;
}

export default function OperationHeader({
  activeJobs,
  deliveredJobs,
}: OperationHeaderProps) {
  return (
    <header className="bg-white border-b border-[rgba(9,20,38,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Left */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-sec-text mb-2">
              <Wrench className="w-3.5 h-3.5 text-volt-secondary" />

              <span>Workshop</span>

              <span className="text-gray-300">/</span>

              <span className="text-volt-primary">
                Operations
              </span>
            </div>

            <h1 className="text-[26px] font-black tracking-tight text-volt-primary">
              Operations Deck
            </h1>

            <p className="text-sm text-sec-text mt-1">
              Live view of all vehicles currently inside the workshop.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-3">

            <OperationStats
              icon={<Wrench className="w-3.5 h-3.5" />}
              label="Active Jobs"
              value={activeJobs}
              accent
            />

            <OperationStats
              icon={<CheckCircle className="w-3.5 h-3.5" />}
              label="Delivered"
              value={deliveredJobs}
            />

          </div>

        </div>
      </div>
    </header>
  );
}