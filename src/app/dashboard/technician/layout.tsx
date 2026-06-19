'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Grid2X2, 
  Wrench, 
  BatteryCharging, 
  PackageOpen, 
  History, 
  Command, 
  ChevronRight,
  Bell,
  Search,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Workspace", path: "/dashboard/technician", icon: Grid2X2 }, 
  { label: "Repairs", path: "/dashboard/technician/repairs", icon: Wrench }, 
  { label: "Vehicles", path: "/dashboard/technician/vehicles", icon: BatteryCharging }, 
  { label: "Parts", path: "#", icon: PackageOpen }, 
  { label: "History", path: "#", icon: History }
];

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [railOpen, setRailOpen] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname(); // ⚡ Tracks exactly which URL we are on

  return (
    <div className="min-h-screen bg-[#F9F6F1] text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)]">
        
        {/* 🚀 GLOBAL SIDE NAV RAIL (Now persistent across all technician routes!) */}
        <aside className={cn("sticky top-0 z-30 hidden h-screen border-r border-border/70 bg-[#FCFAF7] px-3 py-5 transition-[width] duration-300 lg:flex lg:flex-col", railOpen ? "w-56" : "w-[72px]")}>
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl text-gray-200 bg-black">
              <Command className="size-4" />
            </div>
            {railOpen && <span className="font-display text-lg font-semibold text-primary-text tracking-[-0.04em]">VoltOps</span>}
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              // ⚡ Active state is now powered by the actual URL, not a local useState!
              const isActive = pathname === item.path;

              return (
                <button 
                  key={item.label} 
                  onClick={() => router.push(item.path)} // ⚡ Actually changes the page URL
                  className={cn(
                    "h-11 w-full flex items-center gap-3 rounded-xl px-3 font-sans text-sm font-semibold transition-colors hover:bg-emerald-50 hover:text-[#0C5C3C]",
                    isActive ? "bg-emerald-50 text-[#0C5C3C] font-bold" : "text-muted-foreground",
                    !railOpen && "justify-center px-0"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {railOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto">
            <Button variant="ghost" size="icon" onClick={() => setRailOpen(!railOpen)}>
              <ChevronRight className={cn("transition-transform", railOpen && "rotate-180")} />
            </Button>
          </div>
        </aside>

        {/* 🎛️ MAIN VIEWPORT (Where the individual pages inject themselves) */}
        <main className="min-w-0 flex flex-col h-screen overflow-hidden">
          
          {/* GLOBAL TOP HEADER */}
          <header className="glass-surface sticky top-0 z-20 border-b border-border/60 shrink-0">
            <div className="mx-auto flex w-full bg-[#FEFDF9] items-center justify-between gap-3 px-5 py-3 md:px-8 lg:px-10">
              <div className="flex min-w-0 items-center gap-3 flex-1">
                <Button variant="ghost" size="icon" className="lg:hidden"><Menu /></Button>
                <div className="relative hidden max-w-sm flex-1 md:block">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input className="h-10 w-full rounded-xl border border-transparent bg-[#F9F6F1] pl-10 pr-4 text-sm outline-none transition focus:border-ring text-sec-text focus:bg-white" placeholder="Search across VoltOps..." />
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell />
                  <span className="absolute right-2 top-2 size-1.5 rounded-full bg-red-500" />
                </Button>
                <div className="ml-1 grid size-9 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                  TK
                </div>
              </div>
            </div>
          </header>

          {/* PAGE INJECTION ZONE (Scrolls independently of the sidebar/header) */}
          <div className="flex-1 overflow-y-auto">
             {children}
          </div>

        </main>
      </div>
    </div>
  );
}