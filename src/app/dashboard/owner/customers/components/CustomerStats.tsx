'use client';

import {
  CarFront,
  ChartColumnIncreasing,
  Filter,
  Users,
} from 'lucide-react';

interface CustomerStatsProps {
  stats: {
    totalCustomers: number;
    totalVehicles: number;
    averageVehicles: string;
    showing: number;
  };
  searchActive: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  muted?: boolean;
}

function StatCard({
  title,
  value,
  icon,
  muted = false,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-volt-container bg-volt-surface p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            muted
              ? 'bg-slate-100 text-slate-500'
              : 'bg-emerald-green text-volt-secondary'
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sec-text">
            {title}
          </p>

          <h3 className="mt-1 text-2xl font-black text-volt-primary">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default function CustomerStats({
  stats,
  searchActive,
}: CustomerStatsProps) {
  return (
    <section className="mb-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Customers"
          value={stats.totalCustomers}
          icon={<Users className="h-5 w-5" />}
        />

        <StatCard
          title="Vehicles"
          value={stats.totalVehicles}
          icon={<CarFront className="h-5 w-5" />}
        />

        <StatCard
          title="Average Vehicles"
          value={stats.averageVehicles}
          icon={
            <ChartColumnIncreasing className="h-5 w-5" />
          }
        />

        <StatCard
          title="Showing"
          value={stats.showing}
          muted={searchActive}
          icon={<Filter className="h-5 w-5" />}
        />
      </div>
    </section>
  );
}