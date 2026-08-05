"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Wrench,
  Package,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/dashboard/owner",
    icon: LayoutDashboard,
  },
  {
    label: "Customers",
    href: "/dashboard/owner/customers",
    icon: Users,
  },
  {
    label: "Operations",
    href: "/dashboard/owner/operations",
    icon: Wrench,
  },
  {
    label: "Inventory",
    href: "/dashboard/owner/inventory",
    icon: Package,
  },
];

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      className="
        md:hidden
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        z-50
        w-[95%]
        max-w-md
        rounded-2xl
        border
        border-volt-container
        bg-volt-surface/90
        backdrop-blur-xl
        shadow-2xl
        px-2
        py-2
      "
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
      }}
    >
      <div className="flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
  item.href === "/dashboard/owner"
    ? pathname === "/dashboard/owner"
    : pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              {active && (
                <motion.div
                  layoutId="active-nav-pill"
                  className="absolute inset-1 rounded-xl bg-volt-primary"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.8,
                  }}
                />
              )}

              <Icon
                size={20}
                className={`relative z-10 transition-colors duration-300 ${
                  active
                    ? "text-white"
                    : "text-volt-muted"
                }`}
              />

              <span
                className={`relative z-10 text-[11px] font-medium transition-colors duration-300 ${
                  active
                    ? "text-white"
                    : "text-volt-muted"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}