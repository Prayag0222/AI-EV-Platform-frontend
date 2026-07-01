"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button_temp";
import { logout } from "@/services/auth";
import { TechnicianSidebar } from "./components/TechnicianSidebar";

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">

      {/* ================= Desktop Sidebar ================= */}

      <motion.div
        animate={{
          width: collapsed ? 80 : 256,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
        className="hidden overflow-hidden lg:block"
      >
        <TechnicianSidebar
          collapsed={collapsed}
          pathname={pathname}
          onNavigate={(path) => router.push(path)}
          onClose={() => {}}
          onToggleCollapse={() =>
            setCollapsed((prev) => !prev)
          }
          onLogout={handleLogout}
        />
      </motion.div>

      {/* ================= Mobile Sidebar ================= */}

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 30,
              }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <TechnicianSidebar
                mobile
                collapsed={false}
                pathname={pathname}
                onNavigate={(path) => {
                  router.push(path);
                  setMobileOpen(false);
                }}
                onClose={() => setMobileOpen(false)}
                onToggleCollapse={() => {}}
                onLogout={handleLogout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ================= Main ================= */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}

        <motion.header
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl"
        >
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">

            <div className="flex flex-1 items-center gap-3">

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="relative hidden w-full max-w-md md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  placeholder="Search vehicles, tickets..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white"
                />
              </div>

            </div>

            <div className="flex items-center gap-3">

              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Bell className="h-5 w-5" />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </Button>

              <motion.div
                whileHover={{
                  scale: 1.08,
                }}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-900 font-semibold text-white"
              >
                TK
              </motion.div>

            </div>

          </div>
        </motion.header>

        {/* Route Transition */}

        <motion.main
          key={pathname}
          initial={{
            opacity: 0,
            y: 8,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.22,
          }}
          className="flex-1 overflow-y-auto"
        >
          {children}
        </motion.main>

      </div>
    </div>
  );
}