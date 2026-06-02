"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  ShieldAlert, 
  Layers, 
  Plus, 
  UserPlus, 
  FileSpreadsheet, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface SidebarProps {
  onAddCustomerClick?: () => void; // 📞 Adds an optional button click receiver pipe
}

// 🔌 STEP 1: Pass the props object into your function component argument slot
export default function Sidebar({ onAddCustomerClick }: SidebarProps) {
  const pathname = usePathname();

  // Main System Navigation Links mapped from screen.jpg
  const primaryNavigation: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/owner' },
    { label: 'Operations', icon: Wrench, href: '/dashboard/owner/operations' },
    { label: 'Customers', icon: Users, href: '/dashboard/owner/customers' },
    { label: 'Technicians', icon: ShieldAlert, href: '/dashboard/owner/technicians' },
    { label: 'Inventory', icon: Layers, href: '/dashboard/owner/inventory' },
  ];

  // System Utility/Quick Actions mapped from screen.jpg
  const quickActions: NavItem[] = [
    { label: 'Add Customer', icon: UserPlus, href: '#' }, // We set the href to # since it triggers an action!
    { label: 'Create Ticket', icon: FileSpreadsheet, href: '/dashboard/owner/create-ticket' },
    { label: 'Support', icon: HelpCircle, href: '/dashboard/owner/support' },
    { label: 'Log Out', icon: LogOut, href: '/login' },
  ];

  return (
    <div className="flex h-full flex-col bg-volt-surface border-r border-volt-container px-4 py-6 select-none">
      
      {/* 🚀 BRAND LOGO HEADER BLOCK */}
      <div className="mb-8 px-2">
        <h2 className="font-display text-2xl font-bold tracking-tight text-volt-primary">
          VoltOps
        </h2>
        <p className="font-sans text-xs font-medium tracking-wider text-slate-400 uppercase mt-0.5">
          EV Repair Systems
        </p>
      </div>

      {/* ➕ PRIMARY CALL TO ACTION BUTTON */}
      <button className="mb-6 flex w-full items-center justify-center gap-2 rounded-volt bg-volt-primary py-3 font-display text-sm font-semibold text-white shadow-sm hover:bg-volt-primary/90 transition-all duration-150 active:scale-[0.98]">
        <Plus className="h-4 w-4 stroke-[2.5]" />
        <span>New Service Order</span>
      </button>

      {/* 🗂️ CORE ROUTE INTERFACE MODULE */}
      <nav className="flex-1 space-y-1">
        {primaryNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === '/dashboard/owner' && pathname === '/dashboard/owner');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center gap-3.5 px-3 py-2.5 rounded-volt font-display text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-volt-secondary/15 text-volt-secondary font-semibold'
                  : 'text-slate-500 hover:bg-volt-background hover:text-volt-primary'
              }`}
            >
              <Icon className={`h-5 w-5 stroke-[1.75] ${isActive ? 'text-volt-secondary' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 🛠️ QUICK ACTIONS ZONE */}
      <div className="pt-6 border-t border-volt-container space-y-1">
        <span className="block px-3 mb-3 font-display text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Quick Actions
        </span>
        
        {quickActions.map((action) => {
          const Icon = action.icon;

          // ⚡ STEP 2: INTERCEPT: If this item is 'Add Customer', return a button with an onClick handler instead of a page Link!
          if (action.label === 'Add Customer') {
            return (
              <button
                key={action.label}
                onClick={onAddCustomerClick}
                className="flex w-full items-center gap-3.5 px-3 py-2.5 rounded-volt font-sans text-sm font-medium transition-all duration-200 text-slate-500 hover:bg-volt-background hover:text-volt-primary text-left cursor-pointer"
              >
                <Icon className="h-5 w-5 text-slate-400 stroke-[1.75]" />
                <span>{action.label}</span>
              </button>
            );
          }

          // 🌐 OTHERWISE: Render your standard Next.js navigation Link rows
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`flex w-full items-center gap-3.5 px-3 py-2.5 rounded-volt font-sans text-sm font-medium transition-all duration-200 text-slate-500 hover:bg-volt-background hover:text-volt-primary ${
                action.label === 'Log Out' ? 'hover:text-volt-terracotta hover:bg-red-50/50' : ''
              }`}
            >
              <Icon className="h-5 w-5 text-slate-400 stroke-[1.75]" />
              <span>{action.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}