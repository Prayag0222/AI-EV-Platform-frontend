"use client";

import { motion } from "framer-motion";
import {
  BatteryCharging,
  ChevronLeft,
  Command,
  History,
  LogOut,
  PackageOpen,
  Grid2X2,
  Wrench,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button_temp";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Workspace",
    path: "/dashboard/technician",
    icon: Grid2X2,
  },
  {
    label: "Repairs",
    path: "/dashboard/technician/repairs",
    icon: Wrench,
  },
  {
    label: "Vehicles",
    path: "/dashboard/technician/vehicles",
    icon: BatteryCharging,
  }
];

interface TechnicianSidebarProps {
  collapsed: boolean;
  mobile?: boolean;
  pathname: string;
  onNavigate: (path: string) => void;
  onClose: () => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export function TechnicianSidebar({
  collapsed,
  mobile = false,
  pathname,
  onNavigate,
  onClose,
  onToggleCollapse,
  onLogout,
}: TechnicianSidebarProps) {
  const isActive = (path: string) => {
    if (path === "#") return false;

    if (path === "/dashboard/technician") {
      return pathname === path;
    }

    return pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white",
        mobile ? "w-72" : collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}

      <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
        <div className="flex items-center gap-3 overflow-hidden">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.05 }}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white"
          >
            <Command className="h-5 w-5" />
          </motion.div>

          {(!collapsed || mobile) && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-bold tracking-tight text-slate-900">
                VoltOps
              </h2>

              <p className="text-xs text-slate-500">
                Technician
              </p>
            </motion.div>
          )}
        </div>

        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <motion.button
              key={item.label}
              whileHover={{
                x: 4,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => {
                if (item.path !== "#") {
                  onNavigate(item.path);
                }
              }}
              className={cn(
                "relative flex h-12 w-full items-center overflow-hidden rounded-xl px-3 text-sm font-medium transition-colors",

                active
                  ? "text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100",

                collapsed &&
                  !mobile &&
                  "justify-center px-0"
              )}
            >
              {active && (
                <motion.div
                  layoutId="technician-sidebar-active"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 35,
                  }}
                  className="absolute inset-0 rounded-xl bg-indigo-50"
                />
              )}

              <Icon className="relative z-10 h-5 w-5 shrink-0" />

              {(!collapsed || mobile) && (
                <span className="relative z-10 ml-3">
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4 space-y-3">
        <button
          onClick={onLogout}
          className={cn(
            "flex w-full items-center rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
            collapsed && !mobile ? "justify-center" : "justify-between",
            "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
          )}
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            {(!collapsed || mobile) && <span>Logout</span>}
          </div>
          {(!collapsed || mobile) && <ChevronLeft className="h-4 w-4 rotate-180 text-red-600" />}
        </button>

        {!mobile && (
          <div>
            <Button
              variant="outline"
              className="w-full"
              onClick={onToggleCollapse}
            >
              <motion.div
                animate={{
                  rotate: collapsed ? 180 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.div>

              {!collapsed && (
                <span className="ml-2">Collapse</span>
              )}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}