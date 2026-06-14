'use client'
import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

// 1. Importing the individual Lego bricks we built in our features/components folders
import PriorityActionCenter from '@/features/dashboard/components/PriorityActionCenter';
import AiBriefing from '@/features/dashboard/components/AiBriefing';
import OperationsOverview from '@/features/dashboard/components/OperationsOverview';

// 2. Importing our strict contract types to check our data shapes
import { 
  OperationalSummary, 
  PriorityActionCard, 
  AIBriefing, 
  StatusColumn 
} from '@/types/dashboard';

/* ==========================================================================
   💡 MOCK DATA ENGINE (API PLACEHOLDERS)
   These objects comply 100% with our types. When you're ready to integrate 
   your Port 5000 Express backend later, you will simply replace these constant 
   variables with an API fetch() request response.
   ========================================================================== */

const mockSummary: OperationalSummary = {
  active: 12,
  urgentBatteryCases: 3
};

const mockActionCards: PriorityActionCard[] = [
  { id: '1', title: 'Urgent Battery Cases', count: mockSummary.urgentBatteryCases, description: 'Thermal runaway risks identified in cell logs.', type: 'urgent' },
  { id: '2', title: 'Repairs Waiting For Parts', count: 5, description: 'Smart BMS controller units delayed in customs.', type: 'parts' },
  { id: '3', title: 'Technicians At Capacity', count: '98%', description: 'Shop floor schedule overload predicted today.', type: 'capacity' },
  { id: '4', title: 'Warranty Expiring Soon', count: 2, description: 'Customer service follow-ups required.', type: 'warning' },
];

const mockAiBriefing: AIBriefing = {
  insight: 'Controller-related component failures have spiked by',
  metricIncrease: '17% this week.',
  mostAffectedModel: 'VoltScoot Odyssey V2',
  recommendedAction: 'Inspect controller cooling pads on incoming diagnostics.'
};

const mockOperationsColumns: StatusColumn[] = [
  { label: 'NEW REPAIRS', count: 4 },
  { label: 'IN DIAGNOSIS', count: 7 },
  { label: 'IN REPAIR', count: 12 },
  { label: 'AWAITING PARTS', count: 5 },
  { label: 'COMPLETED', count: 8 },
];

export default function OwnerDashboardPage() {
  return (
    <div className="w-full min-h-screen bg-volt-background font-sans text-volt-primary antialiased">
      
      {/* 🏙️ MASTER TOP NAVIGATION LAYER */}
      <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-volt-container bg-volt-surface px-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
        {/* Left Side: System Title Segment */}
        <div>
          <h1 className="font-display text-lg font-bold tracking-tight text-volt-primary">
            VoltOps Executive Dashboard
          </h1>
        </div>
        
        {/* Right Side: Operations Tools & User Metrics */}
        <div className="flex items-center gap-6">
          {/* Architectural Search Bar component */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1-2 text-slate-400 stroke-[1.5]" />
            <input 
              type="text" 
              placeholder="Search assets, tickets, logs..." 
              className="w-full rounded-volt border border-volt-container bg-volt-background py-2 pl-10 pr-4 font-display text-sm tracking-wide text-volt-primary outline-none transition-all duration-150 focus:border-volt-secondary focus:ring-2 focus:ring-volt-secondary/10"
            />
          </div>
          
          {/* Quick Warning Bell Alert */}
          <button className="relative p-2 text-slate-500 hover:text-volt-primary transition-colors cursor-pointer">
            <Bell className="h-5 w-5 stroke-[1.5]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-volt-terracotta" />
          </button>
          
          {/* Settings Node */}
          <button className="p-2 text-slate-500 hover:text-volt-primary transition-colors cursor-pointer">
            <Settings className="h-5 w-5 stroke-[1.5]" />
          </button>
          
          {/* Minimalist Profile Anchor Badge */}
          <div className="h-9 w-9 rounded-full bg-volt-primary border border-volt-container overflow-hidden select-none flex items-center justify-center font-display text-xs font-semibold text-white">
            EX
          </div>
        </div>
      </header>

      {/* 📊 CORE OPERATIONAL LAYOUT SHEET */}
      <div className="mx-auto max-w-360 p-8 lg:p-12">
        
        {/* 📰 EDITORIAL HERO BANNER SECTION */}
        <section className="mb-12 max-w-3xl">
          <h2 className="font-display text-4xl font-bold tracking-tight text-volt-primary sm:text-5xl leading-none">
            Good Morning, Shop Leader.
          </h2>
          <p className="mt-4 font-sans text-base text-slate-600 leading-relaxed">
            Your repair operations environment currently logs <span className="font-semibold text-volt-primary">{mockSummary.active} active tickets</span> on the warehouse floor and{' '}
            <span className="font-semibold text-volt-terracotta">{mockSummary.urgentBatteryCases} critical battery issues</span> requiring immediate supervisor sign-off.
          </p>
        </section>

        {/* 🥊 THE COMMAND GRIDS MATRIX LAYOUT (SPLIT COLUMN LAYOUT) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-stretch">
          
          {/* LEFT WING: PRIORITY ACTION CENTER (Spans 2 out of 3 Columns on desktop layouts) */}
          <div className="lg:col-span-2 bg-volt-surface border border-volt-container rounded-container p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)]">
            <PriorityActionCenter cards={mockActionCards} />
          </div>

          {/* RIGHT WING: INTELLIGENT STREAM AI BRIEFING (Spans 1 out of 3 Columns) */}
          <div className="flex">
            <div className="w-full bg-volt-surface border border-volt-container rounded-container p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)] flex flex-col">
              <AiBriefing data={mockAiBriefing} />
            </div>
          </div>
        </div>

        {/* 🗺️ SOUTHERN ROW BLOCK: THE COMPREHENSIVE WORKFLOW TRACKER */}
        <section className="mt-12 bg-volt-surface border border-volt-container rounded-container p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)]">
          <OperationsOverview columns={mockOperationsColumns} />
        </section>

      </div>
    </div>
  );
}