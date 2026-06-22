"use client";

import React from "react";
import { useVehiclesEngine } from "./hooks/useVehiclesEngine";
import { VehicleCard } from "./components/VehicleCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function TechnicianVehiclesPage() {
  const {
    filteredTickets,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedTicket,
    setSelectedTicket,
    notice,
    setNotice,
  } = useVehiclesEngine();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* 🏁 Header Control Center */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Shop Floor Vehicle Telemetry
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor diagnostics, pack health profiles, and sync telemetry updates directly into local bays.
          </p>
        </div>

        {/* 🔍 Dynamic Search Bar Anchor */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search VIN, model, or customer..."
            className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 placeholder-slate-400 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* ⚠️ Interactive Sync / Notification Banner */}
      {notice && (
        <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-800 font-medium shadow-sm animate-fadeIn">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {notice}
          </span>
          <button 
            onClick={() => setNotice("")} 
            className="text-slate-400 hover:text-slate-600 transition-colors px-1 text-sm"
          >
            &times;
          </button>
        </div>
      )}

      {/* ⏳ Stage 1: Asynchronous Skeleton Loading Block */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((placeholder) => (
            <div 
              key={placeholder} 
              className="bg-white border border-slate-200 h-48 rounded-xl animate-pulse p-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-5 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
                <div className="h-10 bg-slate-100 rounded mt-4" />
              </div>
              <div className="h-4 bg-slate-200 rounded w-full pt-2" />
            </div>
          ))}
        </div>
      ) : filteredTickets.length === 0 ? (
        /* 📭 Stage 2: Clean Empty State Fallback */
        <div className="border border-dashed border-slate-300 bg-white rounded-2xl p-16 text-center max-w-xl mx-auto mt-12 shadow-sm">
          <SlidersHorizontal className="w-8 h-8 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-800 text-base font-semibold">No Active Repairing Vehicles</h3>
          <p className="text-slate-500 text-sm mt-1.5 px-4">
            {searchQuery 
              ? "No vehicle profiles matched your search parameters. Try verifying the target VIN configuration query syntax."
              : "Every vehicle under your technician profile has been processed, completed, or marked as ready for delivery."}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium border border-slate-200 transition-colors shadow-sm"
            >
              Reset Search Parameters
            </button>
          )}
        </div>
      ) : (
        /* 🚗 Stage 3: Reactive Grid Mapping */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <VehicleCard
              key={ticket.id}
              ticket={ticket}
              onSelect={(t) => {
                setSelectedTicket(t);
                setNotice(`Opened telemetry channel for ${t.vehicle.vehicleModel} (Ticket #${t.id})`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}