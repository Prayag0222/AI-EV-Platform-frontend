'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  Loader2, 
  AlertTriangle, 
  DollarSign, 
  Bike, 
  CheckCircle2, 
  ShieldAlert,
  Plus, 
  UserCheck, 
  FileText, 
  Wrench, 
  AlertOctagon, 
  History, 
  Sparkles
} from 'lucide-react';

// 1. Core structural feature layouts
import PriorityActionCenter from '@/features/dashboard/components/PriorityActionCenter';
import AiBriefing from '@/features/dashboard/components/AiBriefing';
import OperationsOverview from '@/features/dashboard/components/OperationsOverview';

// 2. Import types and backend connection service
import { OwnerDashboardPayload } from './types/ownerDashboard';
import { fetchOwnerDashboardMetrics } from './services/dashboard';
import Link from 'next/link';

export default function OwnerDashboardPage() {
  const [data, setData] = useState<OwnerDashboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Toggle view control for financial summary widgets
  const [revenueView, setRevenueView] = useState<'today' | 'week' | 'month' | 'lifetime'>('month');

  // Synchronous Database Operations Sync Track
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardMetrics() {
      try {
        setIsLoading(true);
        setError(null);

        const livePayload = await fetchOwnerDashboardMetrics();

        
        
        if (isMounted) {
          setData(livePayload);
        }
      } catch (err) {
        console.error('Owner dashboard stream drop:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not synchronize data stream.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardMetrics();
    return () => { isMounted = false; };
  }, []);

  /* ==========================================================================
     🛡️ INTERFACE SECURITY GUARDRAILS
     Prevents layout parsing loops from rendering against empty data objects
     ========================================================================== */
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-volt-secondary animate-spin stroke-[1.5]" />
        <p className="font-display text-sm font-medium text-slate-500 tracking-wide">
          Syncing Operational Intelligence Platform Streams...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-screen bg-volt-background flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-volt-surface border border-volt-terracotta/20 rounded-container p-8 text-center shadow-sm">
          <AlertTriangle className="h-10 w-10 text-volt-terracotta mx-auto mb-4 stroke-[1.5]" />
          <h3 className="font-display text-base font-bold text-volt-primary mb-2">
            Downlink Synchronization Failure
          </h3>
          <p className="font-sans text-xs text-slate-500 mb-6">
            {error || 'The system received an unpredictable or missing data structure payload.'}
          </p>
          <div className="p-3.5 rounded-volt bg-red-50/50 border border-volt-container text-[11px] font-mono text-slate-400">
            Verify if your Node process is actively running locally on port 5000.
          </div>
        </div>
      </div>
    );
  }

  // Extract variables with strict clean destructuring layouts
  const { metrics, quickMetrics, actionCards, operationsColumns, technicianSummary, inventoryAlerts, recentActivity, aiBriefing } = data;

  /* ==========================================================================
     🔄 RUNTIME TYPE-SAFE GUARDRAIL TRANSLATOR (FIXES RUNTIME EXCEPTION)
     Ensures card.type maps strictly to internal iconMap keys to prevent crashes
     ========================================================================== */
  const safeActionCards = actionCards.map((card) => {
    let enforcedType: 'urgent' | 'parts' | 'capacity' | 'warning' = 'urgent';
    
    // Explicit conditional matching to align layout cards safely
    if (card.type === 'parts' || card.id === '2') enforcedType = 'parts';
    if (card.type === 'capacity' || card.id === '3') enforcedType = 'capacity';
    if (card.type === 'warning' || card.id === '4') enforcedType = 'warning';

    return {
      id: card.id,
      title: card.title,
      count: card.count,
      description: card.description,
      type: enforcedType
    };
  });

  // Client-side currency localization renderer
  const formatINR = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  const selectedRevenue = 
    revenueView === 'today' ? metrics.todayRevenue :
    revenueView === 'week' ? metrics.weekRevenue :
    revenueView === 'month' ? metrics.monthRevenue : metrics.lifetimeRevenue;

  return (
    <div className="w-full min-h-screen bg-volt-background font-sans text-volt-primary antialiased">
      
      {/* 🏙️ MASTER TOP NAVIGATION LAYER */}
      <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-volt-container bg-volt-surface px-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        <div>
          <h1 className="font-display text-lg font-bold tracking-tight text-volt-primary">
            VoltOps Executive Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 stroke-[1.5]" />
            <input 
              type="text" 
              placeholder="Search components, invoices, records..." 
              className="w-full rounded-volt border border-volt-container bg-volt-background py-2 pl-10 pr-4 font-display text-sm tracking-wide text-volt-primary outline-none transition-all duration-150 focus:border-volt-secondary focus:ring-2 focus:ring-volt-secondary/10"
            />
          </div>
          
          <button className="relative p-2 text-slate-500 hover:text-volt-primary transition-colors cursor-pointer">
            <Bell className="h-5 w-5 stroke-[1.5]" />
            {quickMetrics.criticalTickets > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-volt-terracotta animate-pulse" />
            )}
          </button>
          
          <button className="p-2 text-slate-500 hover:text-volt-primary transition-colors cursor-pointer">
            <Settings className="h-5 w-5 stroke-[1.5]" />
          </button>
          
         <Link
         href={'owner/profile'}
         >
          <div className="h-9 w-9 rounded-full bg-volt-primary border border-volt-container overflow-hidden select-none flex items-center justify-center font-display text-xs font-semibold text-white">
            PR
          </div>
         </Link>
        </div>
      </header>

      {/* 📊 CORE OPERATIONAL LAYOUT SHEET */}
      <div className="mx-auto max-w-360 p-8 lg:p-12 space-y-10">
        
        {/* 📰 EDITORIAL HERO SECTION */}
        <section className="max-w-3xl">
          <h2 className="font-display text-4xl font-bold tracking-tight text-volt-primary sm:text-5xl leading-none">
            Hello, Prayag.
          </h2>
          <p className="mt-3 font-sans text-sm text-slate-500 leading-relaxed">
            Your operations deck has successfully synchronized. You have <span className="font-semibold text-volt-primary">{quickMetrics.activeTickets} active tickets</span> currently handling diagnostics.
          </p>
        </section>

        {/* 💳 CORE BUSINESS METRICS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Revenue Toggle Dashboard Box */}
          <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-display font-bold text-slate-400 tracking-wider uppercase">REVENUE BALANCE</span>
                <DollarSign className="h-4 w-4 text-emerald-500 stroke-[1.5]" />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight text-volt-primary transition-all duration-150">
                {formatINR(selectedRevenue)}
              </p>
            </div>
            <div className="mt-4 flex gap-1 bg-volt-background p-1 rounded border border-volt-container text-[10px] font-display font-medium text-slate-500">
              {(['today', 'week', 'month', 'lifetime'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setRevenueView(v)}
                  className={`flex-1 py-1 text-center rounded capitalize transition-all cursor-pointer ${
                    revenueView === v ? 'bg-volt-surface border border-volt-container text-volt-primary font-semibold shadow-sm' : 'hover:text-volt-primary'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Active Workload 주문 Tracker */}
          <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-display font-bold text-slate-400 tracking-wider uppercase">BIKES UNDER REPAIR</span>
                <Bike className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight text-volt-primary">{quickMetrics.activeTickets} Units</p>
            </div>
            <p className="text-[11px] font-sans text-slate-500 mt-2">
              {quickMetrics.todayRepairs} tickets registered across floor today.
            </p>
          </div>

          {/* Finished and Solved Pipeline Units */}
          <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-display font-bold text-slate-400 tracking-wider uppercase">READY FOR DELIVERY</span>
                <CheckCircle2 className="h-4 w-4 text-blue-500 stroke-[1.5]" />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight text-volt-primary">{quickMetrics.completedTickets} Bikes</p>
            </div>
            <p className="text-[11px] font-sans text-slate-500 mt-2">
              Resolved repair logs awaiting manager handover verification.
            </p>
          </div>

          {/* High Priority Critical Threat Lines */}
          <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-display font-bold text-slate-400 tracking-wider uppercase">CRITICAL ALERTS</span>
                <ShieldAlert className="h-4 w-4 text-volt-terracotta stroke-[1.5]" />
              </div>
              <p className="font-display text-2xl font-bold tracking-tight text-volt-terracotta">{quickMetrics.criticalTickets} Cases</p>
            </div>
            <p className="text-[11px] font-sans text-volt-terracotta font-medium mt-2 bg-volt-terracotta/5 px-2 py-0.5 rounded border border-volt-terracotta/10 inline-block w-fit">
              Requires immediate technician sign-off
            </p>
          </div>
        </section>

        {/* ⚡ QUICK ACTIONS ACTION LINKS */}
        <section className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
          <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center gap-2 rounded-volt bg-volt-primary px-4 py-3 text-sm font-display font-medium text-white hover:bg-volt-primary/90 transition-colors cursor-pointer">
              <Plus className="h-4 w-4" /> Create New Ticket
            </button>
            <button className="flex items-center justify-center gap-2 rounded-volt border border-volt-container bg-volt-background px-4 py-3 text-sm font-display font-medium text-volt-primary hover:bg-volt-surface transition-all cursor-pointer">
              <UserCheck className="h-4 w-4 text-slate-500" /> Add New Customer
            </button>
            <button className="flex items-center justify-center gap-2 rounded-volt border border-volt-container bg-volt-background px-4 py-3 text-sm font-display font-medium text-volt-primary hover:bg-volt-surface transition-all cursor-pointer">
              <FileText className="h-4 w-4 text-slate-500" /> Generate Invoice
            </button>
            <button className="flex items-center justify-center gap-2 rounded-volt border border-volt-container bg-volt-background px-4 py-3 text-sm font-display font-medium text-volt-primary hover:bg-volt-surface transition-all cursor-pointer">
              <Wrench className="h-4 w-4 text-slate-500" /> Allocate Staff Slots
            </button>
          </div>
        </section>

        {/* 🎯 PRIORITY CENTER BLOCK */}
        <section className="bg-volt-surface border border-volt-container rounded-container p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)]">
          <PriorityActionCenter cards={safeActionCards} />
        </section>

        {/* 🗺️ OPERATIONS PIPELINE TRACKER ROW */}
        <section className="bg-volt-surface border border-volt-container rounded-container p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Operations Pipeline</h3>
            <div className="flex gap-4 text-slate-400 text-xs font-medium font-display">
              <span>Customers: <strong className="text-volt-primary">{quickMetrics.totalCustomers}</strong></span>
              <span>Vehicles: <strong className="text-volt-primary">{quickMetrics.totalVehicles}</strong></span>
            </div>
          </div>
          <OperationsOverview columns={operationsColumns} />
        </section>

        {/* 👥 TECHNICIAN STATUS & 📦 INVENTORY ALERTS PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Staff Efficiency Panel */}
          <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <div className="flex items-center justify-between mb-4 border-b border-volt-container/40 pb-3">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Technician Status</h3>
              <span className="text-[11px] font-sans text-slate-400">Active Duty: {quickMetrics.totalTechnicians}</span>
            </div>
            <div className="divide-y divide-volt-container font-sans">
              {technicianSummary.map((tech) => (
                <div key={tech.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div>
                    <h4 className="text-sm font-semibold text-volt-primary">{tech.name}</h4>
                    <p className="text-xs text-slate-400 font-medium capitalize">{tech.specialization.toLowerCase()} specialist</p>
                  </div>
                  <div className="flex items-center gap-5 text-xs">
                    <div className="text-right font-medium text-slate-500">
                      <div>{tech.activeJobs} ongoing jobs</div>
                      <div className="text-[10px] text-emerald-500">{tech.completedToday} resolved today</div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-display font-bold border tracking-wide uppercase ${
                      tech.workload === 'BUSY' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                      tech.workload === 'ON_LEAVE' ? 'bg-red-50 border-red-150 text-red-600' :
                      'bg-emerald-50 border-emerald-150 text-emerald-700'
                    }`}>
                      {tech.workload}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warehouse Low Stock Panel */}
          <div className="bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-volt-container/40 pb-3">
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Alerts</h3>
                <span className="text-[11px] font-sans text-slate-400">Asset Value: {formatINR(quickMetrics.totalInventoryValue)}</span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-65 pr-1">
                {inventoryAlerts.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 font-medium">
                    All core components are sitting comfortably within safe shelf safety margins.
                  </div>
                ) : (
                  inventoryAlerts.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3.5 rounded-volt border border-volt-container bg-volt-background/40">
                      <div className="flex items-center gap-3">
                        <AlertOctagon className={`h-4 w-4 stroke-[1.5] ${
                          item.severity === 'OUT_OF_STOCK' || item.severity === 'CRITICAL' ? 'text-volt-terracotta' : 'text-amber-500'
                        }`} />
                        <div>
                          <span className="text-xs font-semibold text-volt-primary block">{item.partName}</span>
                          <span className="text-[10px] text-slate-400">Minimum line target: {item.threshold} units</span>
                        </div>
                      </div>
                      <span className={`font-display text-[10px] font-bold px-2 py-0.5 border rounded uppercase ${
                        item.severity === 'OUT_OF_STOCK' ? 'bg-red-100 border-red-200 text-red-700' :
                        item.severity === 'CRITICAL' ? 'bg-volt-terracotta/10 border-volt-terracotta/20 text-volt-terracotta' :
                        'bg-amber-50 border-amber-200 text-amber-700'
                      }`}>
                        {item.stock} LEFT — {item.severity.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-volt-container/40 text-[11px] font-sans text-slate-400">
              Tracking a catalog of <strong className="text-volt-primary">{quickMetrics.inventoryCount} discrete product lines</strong> in stock.
            </div>
          </div>
        </div>

        {/* 🕒 RECENT ACTIVITY LOG TIMELINE FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Radial Feed Tracker Logs */}
          <div className="lg:col-span-2 bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_2px_4px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2 mb-5 border-b border-volt-container/40 pb-3">
              <History className="h-4 w-4 text-slate-400 stroke-[1.5]" />
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Recent Activity</h3>
            </div>
            <div className="space-y-4 font-sans text-xs">
              {recentActivity.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No operational log footprints detected across tables today.</p>
              ) : (
                recentActivity.map((log) => (
                  <div key={log.id} className="flex justify-between items-center text-slate-600 border-b border-volt-container/30 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block px-1.5 py-0.5 rounded-[4px] text-[9px] font-display font-bold tracking-wider ${
                        log.type === 'TICKET' ? 'bg-volt-secondary/10 border border-volt-secondary/20 text-volt-secondary' :
                        log.type === 'INVOICE' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                        'bg-purple-50 border border-purple-200 text-purple-700'
                      }`}>
                        {log.type}
                      </span>
                      <p className="leading-relaxed pr-4 text-slate-700 font-medium">{log.description}</p>
                    </div>
                    <span className="text-slate-400 whitespace-nowrap font-medium">{log.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Intelligence Stream Briefing Box */}
          <div className="flex">
            <div className="w-full bg-volt-surface border border-volt-container rounded-container p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)] flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-volt-secondary stroke-[1.5]" />
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">AI Briefing</h3>
              </div>
              <div className="grow flex flex-col justify-center">
                <AiBriefing data={aiBriefing} />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}