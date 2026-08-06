"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Wrench, CarFront } from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/dashboard/technician",
    icon: Home,
  },
  {
    label: "Repairs",
    href: "/dashboard/technician/repairs",
    icon: Wrench,
  },
  {
    label: "Vehicles",
    href: "/dashboard/technician/vehicles",
    icon: CarFront,
  },
];

export default function TechnicianBottomNav() {
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
        z-40
        w-[94%]
        max-w-sm
        rounded-2xl
        border
        border-slate-200
        bg-white/90
        backdrop-blur-2xl
        shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        px-2
        py-2
      "
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)",
      }}
    >
      <div className="flex items-center">
        {navItems.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/dashboard/technician"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              {active && (
                <motion.div
                  layoutId="technician-bottom-nav"
                  className="absolute inset-0 rounded-xl bg-indigo-600"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                    mass: 0.8,
                  }}
                />
              )}

              <Icon
                size={22}
                className={`relative z-10 transition-colors duration-300 ${
                  active ? "text-white" : "text-slate-500"
                }`}
              />

              <span
                className={`relative z-10 text-[11px] font-medium transition-colors duration-300 ${
                  active ? "text-white" : "text-slate-500"
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