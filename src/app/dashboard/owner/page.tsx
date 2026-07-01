'use client';
import React, { useState, useEffect } from 'react';
import {
  Loader2,
  AlertTriangle,
  Bike,
  CheckCircle2,
  ShieldAlert,
  AlertOctagon,
  History,
  Sparkles,
  Bell,
  Settings,
  TrendingUp,
  UserPlus,
  FilePlus2,
} from 'lucide-react';
import PriorityActionCenter from '@/features/dashboard/components/PriorityActionCenter';
import AiBriefing from '@/features/dashboard/components/AiBriefing';
import OperationsOverview from '@/features/dashboard/components/OperationsOverview';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { OwnerDashboardPayload } from './types/ownerDashboard';
import { fetchOwnerDashboardMetrics } from './services/dashboard';



const Api = process.env.NEXT_PUBLIC_API_URL;

const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<OwnerDashboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<{ id: string; name: string } | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [revenueView, setRevenueView] = useState<'today' | 'week' | 'month' | 'lifetime'>('month');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const profileRes = await fetch(`${Api}/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!profileRes.ok) {
          setIsAuthError(true);
          return;
        }

        const { user } = await profileRes.json();

        if (user.role !== 'OWNER') {
          router.push('/dashboard/technician');
          return;
        }

        if (isMounted) setActiveUser(user);

        const payload = await fetchOwnerDashboardMetrics();
        if (isMounted) setData(payload);
      } catch (err) {
        toast.error('Failed to load dashboard');
        if (isMounted) setError(err instanceof Error ? err.message : 'Something went wrong.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, [reloadKey, router]);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-volt-background">
        <Loader2 className="h-7 w-7 animate-spin text-volt-secondary stroke-[1.5]" />
        <p className="text-sm text-slate-400">Loading dashboard…</p>
      </div>
    );
  }

  // ── Auth Error ──
  if (isAuthError) {
    return (
      <div className="min-h-screen bg-volt-background">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
                <ShieldAlert className="h-7 w-7 text-orange-500" />
              </div>
              <h2 className="mt-5 text-center text-xl font-bold text-slate-900">Session Expired</h2>
              <p className="mt-2 text-center text-sm text-slate-500">
                Please sign in again to continue.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="mt-6 w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white"
              >
                Go to Login
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── Error ──
  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-volt-background">
        <div className="w-full max-w-sm rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h3 className="font-bold text-slate-900 mb-1">Failed to load</h3>
          <p className="text-sm text-slate-500">{error || 'Could not load dashboard data.'}</p>
          <button
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    metrics,
    quickMetrics,
    actionCards,
    operationsColumns,
    technicianSummary,
    inventoryAlerts,
    recentActivity,
    aiBriefing,
  } = data;

  const safeActionCards = actionCards.map((card) => {
    let enforcedType: 'urgent' | 'parts' | 'capacity' | 'warning' = 'urgent';
    if (card.type === 'parts' || card.id === '2') enforcedType = 'parts';
    if (card.type === 'capacity' || card.id === '3') enforcedType = 'capacity';
    if (card.type === 'warning' || card.id === '4') enforcedType = 'warning';
    return { id: card.id, title: card.title, count: card.count, description: card.description, type: enforcedType };
  });

  const selectedRevenue =
    revenueView === 'today' ? metrics.todayRevenue :
    revenueView === 'week' ? metrics.weekRevenue :
    revenueView === 'month' ? metrics.monthRevenue :
    metrics.lifetimeRevenue;

  return (
    <div className="min-h-screen bg-volt-background font-sans text-volt-primary antialiased">
    
      {/* ── Desktop Header (hidden on mobile — sidebar handles mobile top bar) ── */}
      <header className="hidden md:flex sticky top-0 z-40 h-16 w-full items-center justify-between border-b border-volt-container bg-volt-surface px-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="font-display text-base font-bold text-volt-primary">Dashboard</h1>
          
          <p className="text-xs text-slate-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-volt-container text-slate-500 hover:bg-volt-background transition-colors">
            <Bell className="h-4 w-4" />
            {quickMetrics.criticalTickets > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-volt-container text-slate-500 hover:bg-volt-background transition-colors">
            <Settings className="h-4 w-4" />
          </button>
          <Link href="/dashboard/owner/profile">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-volt-primary text-xs font-bold text-white">
              {activeUser?.name?.slice(0, 2).toUpperCase() ?? 'VO'}
            </div>
          </Link>
        </div>
      </header>

      {/* ── Page Content ── */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10 space-y-6">

        {/* ── Hero greeting ── */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-volt-primary sm:text-3xl lg:text-4xl">
              Hello, {activeUser?.name ?? 'Owner'} 👋
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              <span className="font-semibold text-volt-primary">{quickMetrics.activeTickets} active tickets</span> on the floor today.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:items-center">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('voltops:add-customer'))}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-volt-container bg-white px-3 text-xs font-bold text-volt-primary shadow-sm transition hover:bg-volt-background sm:px-4"
            >
              <UserPlus className="h-4 w-4" />
              Add Customer
            </button>
            <Link
              href="/dashboard/owner/create-ticket"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-volt-primary px-3 text-xs font-bold text-white shadow-sm transition hover:bg-volt-primary/95 sm:px-4"
            >
              <FilePlus2 className="h-4 w-4" />
              Create Ticket
            </Link>
             
          </div>
        </section>

        {/* ── Revenue card (full width on mobile) + 3 metric cards ── */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">

          {/* Revenue — spans 2 cols on mobile */}
          <div className="col-span-2 lg:col-span-1 bg-volt-surface border border-volt-container rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Revenue</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-black tracking-tight text-volt-primary">
              {formatINR(selectedRevenue)}
            </p>
            <div className="mt-4 grid grid-cols-4 gap-1 rounded-xl bg-volt-background border border-volt-container p-1 text-[10px] font-semibold">
              {(['today', 'week', 'month', 'lifetime'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setRevenueView(v)}
                  className={`py-1.5 rounded-lg capitalize transition-all ${
                    revenueView === v
                      ? 'bg-white text-volt-primary shadow-sm border border-volt-container'
                      : 'text-slate-400 hover:text-volt-primary'
                  }`}
                >
                  {v === 'lifetime' ? 'All' : v}
                </button>
              ))}
            </div>
          </div>

          {/* Active Repairs */}
          <div className="bg-volt-surface border border-volt-container rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active</span>
              <Bike className="h-4 w-4 text-volt-secondary" />
            </div>
            <p className="text-3xl font-black text-volt-primary">{quickMetrics.activeTickets}</p>
            <p className="mt-1 text-xs text-slate-400">bikes under repair</p>
            <p className="mt-2 text-[10px] text-slate-400">{quickMetrics.todayRepairs} new today</p>
          </div>

          {/* Ready for Delivery */}
          <div className="bg-volt-surface border border-volt-container rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ready</span>
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-3xl font-black text-volt-primary">{quickMetrics.completedTickets}</p>
            <p className="mt-1 text-xs text-slate-400">for delivery</p>
          </div>

          {/* Critical */}
          <div className={`bg-volt-surface border rounded-2xl p-5 shadow-sm ${
            quickMetrics.criticalTickets > 0 ? 'border-red-200 bg-red-50/30' : 'border-volt-container'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Critical</span>
              <ShieldAlert className={`h-4 w-4 ${quickMetrics.criticalTickets > 0 ? 'text-red-500' : 'text-slate-300'}`} />
            </div>
            <p className={`text-3xl font-black ${quickMetrics.criticalTickets > 0 ? 'text-red-600' : 'text-volt-primary'}`}>
              {quickMetrics.criticalTickets}
            </p>
            <p className="mt-1 text-xs text-slate-400">urgent cases</p>
          </div>

        </section>

        {/* ── Operations Pipeline ── */}
        <section className="bg-volt-surface border border-volt-container rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Operations Pipeline</h3>
            <div className="flex gap-3 text-xs text-slate-400">
              <span>Customers: <strong className="text-volt-primary">{quickMetrics.totalCustomers}</strong></span>
              <span>Vehicles: <strong className="text-volt-primary">{quickMetrics.totalVehicles}</strong></span>
            </div>
          </div>
          <OperationsOverview columns={operationsColumns} />
        </section>

        {/* ── Priority Action Center ── */}
        <section className="bg-volt-surface border border-volt-container rounded-2xl p-5 sm:p-6 shadow-sm">
          <PriorityActionCenter cards={safeActionCards} />
        </section>

        {/* ── Technician + Inventory ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          {/* Technician Status */}
          <div className="bg-volt-surface border border-volt-container rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-volt-container/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Technician Status</h3>
              <span className="text-xs text-slate-400">{quickMetrics.totalTechnicians} on duty</span>
            </div>
            {technicianSummary.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">No technicians added yet.</p>
            ) : (
              <div className="divide-y divide-volt-container">
                {technicianSummary.map((tech) => (
                  <div key={tech.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-volt-primary truncate">{tech.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{tech.specialization.toLowerCase()}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-500">{tech.activeJobs} jobs</p>
                        <p className="text-[10px] text-emerald-500">{tech.completedToday} done today</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-lg border uppercase tracking-wide ${
                        tech.workload === 'BUSY' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                        tech.workload === 'ON_LEAVE' ? 'bg-red-50 border-red-200 text-red-600' :
                        'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {tech.workload}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inventory Alerts */}
          <div className="bg-volt-surface border border-volt-container rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-volt-container/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Alerts</h3>
              <span className="text-xs text-slate-400">{formatINR(quickMetrics.totalInventoryValue)}</span>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto max-h-60">
              {inventoryAlerts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">All stock levels are healthy.</p>
              ) : (
                inventoryAlerts.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border border-volt-container bg-volt-background/50 px-3 py-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AlertOctagon className={`h-4 w-4 shrink-0 ${
                        item.severity === 'OUT_OF_STOCK' || item.severity === 'CRITICAL'
                          ? 'text-red-500' : 'text-amber-500'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-volt-primary truncate">{item.partName}</p>
                        <p className="text-[10px] text-slate-400">Min: {item.threshold} units</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-lg border uppercase shrink-0 ml-2 ${
                      item.severity === 'OUT_OF_STOCK' ? 'bg-red-100 border-red-200 text-red-700' :
                      item.severity === 'CRITICAL' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                      'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {item.stock} left
                    </span>
                  </div>
                ))
              )}
            </div>
            <p className="mt-4 pt-3 border-t border-volt-container/50 text-[10px] text-slate-400">
              <strong className="text-volt-primary">{quickMetrics.inventoryCount}</strong> product lines tracked
            </p>
          </div>

        </div>

        {/* ── Recent Activity + AI Briefing ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-volt-surface border border-volt-container rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-volt-container/50">
              <History className="h-4 w-4 text-slate-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">No activity yet.</p>
              ) : (
                recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start justify-between gap-3 pb-3 border-b border-volt-container/30 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className={`mt-0.5 shrink-0 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                        log.type === 'TICKET' ? 'bg-volt-secondary/10 text-volt-secondary' :
                        log.type === 'INVOICE' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-purple-50 text-purple-700'
                      }`}>
                        {log.type}
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-relaxed">{log.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{log.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Briefing */}
          <div className="bg-volt-surface border border-volt-container rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-volt-container/50">
              <Sparkles className="h-4 w-4 text-volt-secondary" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Briefing</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <AiBriefing data={aiBriefing} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
