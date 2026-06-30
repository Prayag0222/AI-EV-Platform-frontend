"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Users,
  ShieldCheck,
  Layers3,
  Receipt,
  UserPlus,
  FileSpreadsheet,
  LogOut,
  ChevronRight,
  Zap,
  X,
  Menu,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL;

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  onAddCustomerClick?: () => void;
  user?: { name: string; role: string } | null;
}

const primaryNavigation: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/owner", icon: LayoutDashboard },
  { label: "Operations", href: "/dashboard/owner/operations", icon: Wrench },
  { label: "Customers", href: "/dashboard/owner/customers", icon: Users },
  { label: "Technicians", href: "/dashboard/owner/technicians", icon: ShieldCheck },
  { label: "Inventory", href: "/dashboard/owner/inventory", icon: Layers3 },
  { label: "Billing", href: "/dashboard/owner/billing", icon: Receipt },
];

const quickActions = [
  { label: "Add Customer", icon: UserPlus, action: "customer" as const },
  { label: "Create Ticket", icon: FileSpreadsheet, href: "/dashboard/owner/create-ticket" },
];

function SidebarContent({
  onAddCustomerClick,
  user,
  onClose,
}: SidebarProps & { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
    }
  };

  const initials = user?.name?.slice(0, 2).toUpperCase() ?? "VO";
  const displayName = user?.name ?? "Owner";

  return (
    <div className="flex h-full flex-col bg-volt-surface">

      {/* Header */}
      <div className="border-b border-volt-container px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-volt-primary text-white shadow-sm shrink-0">
              <Zap className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight text-volt-primary leading-tight">
                VoltOps
              </h2>
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Repair Intelligence
              </p>
            </div>
          </div>
          {/* Close button — mobile only */}
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-volt-background hover:text-slate-700 transition-colors md:hidden"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs font-medium text-emerald-700">Workspace Connected</span>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {primaryNavigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (pathname.startsWith(item.href + "/") && item.href !== "/dashboard/owner") ||
              (item.href === "/dashboard/owner" && pathname === "/dashboard/owner");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                  active
                    ? "bg-volt-secondary/10 text-volt-secondary"
                    : "text-slate-500 hover:bg-volt-background hover:text-volt-primary"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-volt-secondary" />
                )}
                <div className="flex items-center gap-3">
                  <Icon className={`h-[17px] w-[17px] shrink-0 ${active ? "text-volt-secondary" : "text-slate-400 group-hover:text-volt-primary"}`} />
                  <span className={`text-sm ${active ? "font-semibold" : "font-medium"}`}>
                    {item.label}
                  </span>
                </div>
                <ChevronRight className={`h-3.5 w-3.5 transition-opacity ${active ? "opacity-100 text-volt-secondary" : "opacity-0 group-hover:opacity-60 text-slate-400"}`} />
              </Link>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 border-t border-volt-container pt-6">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
            Tools
          </p>
          <div className="space-y-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              if (action.action === "customer") {
                return (
                  <button
                    key={action.label}
                    onClick={() => { onAddCustomerClick?.(); onClose?.(); }}
                    className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-slate-500 transition-colors hover:bg-volt-background hover:text-volt-primary"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-[17px] w-[17px] text-slate-400 group-hover:text-volt-primary shrink-0" />
                      <span className="text-sm font-medium">{action.label}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 text-slate-400 transition-opacity" />
                  </button>
                );
              }
              return (
                <Link
                  key={action.href}
                  href={action.href!}
                  onClick={onClose}
                  className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-slate-500 transition-colors hover:bg-volt-background hover:text-volt-primary"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-[17px] w-[17px] text-slate-400 group-hover:text-volt-primary shrink-0" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60 text-slate-400 transition-opacity" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* User + Logout */}
      <div className="border-t border-volt-container p-4">
        <div className="rounded-2xl border border-volt-container bg-volt-background p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-volt-primary text-sm font-bold text-white shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-volt-primary">{displayName}</p>
              <p className="text-xs text-slate-400">Workshop Owner</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
          >
            <div className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>{loggingOut ? "Logging out…" : "Logout"}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-slate-400">VoltOps v1.0</p>
      </div>

    </div>
  );
}

export default function Sidebar({ onAddCustomerClick, user }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change

  // Prevent body scroll when drawer open
  useEffect(() => {
  document.body.style.overflow = mobileOpen ? "hidden" : "";
  return () => { document.body.style.overflow = ""; };
}, [mobileOpen]);

  return (
    <>
      {/* ── Mobile Top Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-volt-container bg-volt-surface px-4 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt-primary text-white">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <span className="font-display text-base font-bold text-volt-primary">VoltOps</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-volt-container text-slate-500 hover:bg-volt-background transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* ── Mobile Drawer Backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          onAddCustomerClick={onAddCustomerClick}
          user={user}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Desktop Sidebar ── */}
      <div className="hidden md:flex h-full w-64 shrink-0 flex-col border-r border-volt-container">
        <SidebarContent
          onAddCustomerClick={onAddCustomerClick}
          user={user}
        />
      </div>
    </>
  );
}