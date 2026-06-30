"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Car,
  CircleAlert,
} from "lucide-react";

import { VehicleCard } from "./components/VehicleCard";
import { useVehiclesEngine } from "./hooks/useVehiclesEngine";

export default function TechnicianVehiclesPage() {
  const {
    filteredTickets,
    isLoading,
    searchQuery,
    setSearchQuery,
    setSelectedTicket,
    notice,
    setNotice,
  } = useVehiclesEngine();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col gap-5"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Car className="h-3.5 w-3.5" />
              Vehicle Workspace
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Shop Floor Vehicles
            </h1>

            <p className="max-w-2xl text-sm leading-6 text-slate-500">
              Monitor vehicle health, telemetry, repair progress and quickly
              jump into the technician workspace.
            </p>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search VIN, customer or vehicle..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <div className="text-xs text-slate-500">Visible Vehicles</div>

              <div className="mt-0.5 text-lg font-bold text-slate-900">
                {filteredTickets.length}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= NOTICE ================= */}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 h-4 w-4 text-amber-600" />

                <p className="text-sm font-medium text-amber-900">
                  {notice}
                </p>
              </div>

              <button
                onClick={() => setNotice("")}
                className="text-xl leading-none text-amber-700 transition hover:text-slate-900"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= LOADING ================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="animate-pulse space-y-5">
                  <div className="h-5 w-2/3 rounded bg-slate-200" />

                  <div className="h-3 w-1/3 rounded bg-slate-200" />

                  <div className="space-y-2">
                    <div className="h-3 rounded bg-slate-100" />
                    <div className="h-3 rounded bg-slate-100" />
                    <div className="h-3 w-3/4 rounded bg-slate-100" />
                  </div>

                  <div className="h-10 rounded-xl bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTickets.length === 0 ? (
          /* ================= EMPTY ================= */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto mt-10 max-w-lg rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-14 text-center shadow-sm"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <SlidersHorizontal className="h-7 w-7 text-slate-400" />
            </div>

            <h2 className="mt-6 text-lg font-semibold text-slate-900">
              No Vehicles Found
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {searchQuery
                ? "No vehicles matched your current search."
                : "There are no assigned repair vehicles available right now."}
            </p>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        ) : (
          /* ================= GRID ================= */
          <motion.div
            layout
            className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence>
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.vehicle.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                >
                  <Link
                    href={`/dashboard/technician/vehicleWorkspace/${ticket.vehicle.id}`}
                    className="block h-full"
                  >
                    <VehicleCard
                      ticket={ticket}
                      onSelect={(t) => {
                        setSelectedTicket(t);
                        setNotice(
                          `Opened telemetry channel for ${t.vehicle.vehicleModel} (Ticket #${t.id})`
                        );
                      }}
                    />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}