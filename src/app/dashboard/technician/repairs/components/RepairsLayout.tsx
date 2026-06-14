'use client';

import React from 'react';

interface RepairsLayoutProps {
  toolbar: React.ReactNode;          // Holds search search logic inputs
  listGrid: React.ReactNode;         // Holds the left-side card row entries
  diagnosticConsole: React.ReactNode; // Holds the active progress logging text field
  aiCoPilot: React.ReactNode;         // Holds the pre-built Stage 2 AI panel module
}

export default function RepairsLayout({ 
  toolbar, 
  listGrid, 
  diagnosticConsole, 
  aiCoPilot 
}: RepairsLayoutProps) {
  return (
    <div className="w-full min-h-[calc(100vh-4.5rem)] bg-[#F9F6F1] px-4 py-6 md:px-8 lg:px-10 font-sans animate-fade-in">
      
      {/* 📋 1. TOP HEADER SUB-NAVIGATION BAR */}
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Bay Stations & Assets
        </p>
        <h1 className="font-display text-3xl font-bold tracking-[-0.04em] text-primary-text sm:text-4xl">
          Repairs Management Board
        </h1>
      </header>

      {/* 🎛️ 2. FILTERING AND SELECTION TOOLBAR CONTAINER */}
      <div className="mb-6 w-full">
        {toolbar}
      </div>

      {/* 🚀 3. CORE SPLIT-SCREEN INTUITIVE DATA GRID BRIDGE */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_420px] items-start">
        
        {/* LEFT COLUMN: Highly performant, scrollable repair queue listings */}
        <section className="min-w-0 flex flex-col gap-4 order-2 xl:order-1">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Active Operational Tickets Queue
            </h2>
          </div>
          {listGrid}
        </section>

        {/* RIGHT COLUMN: Sticky, technical workbench console & AI prediction space */}
        <aside className="flex flex-col gap-5 xl:sticky xl:top-[5.5rem] max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 scrollbar-thin order-1 xl:order-2">
          
          {/* Section Heading Label */}
          <div className="flex items-center gap-2 pb-2 border-b border-border/40 shrink-0">
            <span className="size-2 rounded-full bg-[#0C5C3C]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Active Diagnostics Workbench
            </h2>
          </div>

          {/* Workbench Technical Console Terminal Entry Block */}
          <div className="w-full bg-white rounded-2xl border border-border/70 p-5 shadow-sm transition-all duration-200">
            {diagnosticConsole}
          </div>

          {/* Pre-Built Future-Proofed AI Assistance Deck */}
          <div className="w-full bg-white rounded-2xl border border-border/70 p-5 shadow-sm transition-all duration-200">
            {aiCoPilot}
          </div>

        </aside>

      </div>
    </div>
  );
}