import { motion } from "framer-motion";
import {
  Battery,
  Gauge,
  Thermometer,
  User,
  Wrench,
  ArrowRight,
  Activity,
} from "lucide-react";

import { RepairingVehicleTicket } from "../types";

interface VehicleCardProps {
  ticket: RepairingVehicleTicket;
  onSelect: (ticket: RepairingVehicleTicket) => void;
}

const getSohStyles = (soh: string | number | null) => {
  if (soh === null || soh === undefined)
    return {
      text: "--",
      color: "text-slate-500",
      badge: "bg-slate-100 text-slate-600 border-slate-200",
    };

  const value = typeof soh === "string" ? Number(soh) : soh;

  if (Number.isNaN(value))
    return {
      text: "--",
      color: "text-slate-500",
      badge: "bg-slate-100 text-slate-600 border-slate-200",
    };

  if (value >= 90)
    return {
      text: `${value}%`,
      color: "text-emerald-700",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };

  if (value >= 80)
    return {
      text: `${value}%`,
      color: "text-amber-700",
      badge: "bg-amber-50 text-amber-700 border-amber-200",
    };

  return {
    text: `${value}%`,
    color: "text-red-700",
    badge: "bg-red-50 text-red-700 border-red-200",
  };
};

const formatOdometer = (odo: string | number | null) => {
  if (odo === null || odo === undefined) return "--";

  const value = typeof odo === "string" ? Number(odo) : odo;

  if (Number.isNaN(value)) return "--";

  return `${value.toLocaleString()} km`;
};

export function VehicleCard({
  ticket,
  onSelect,
}: VehicleCardProps) {
  const { vehicle, customer, bay, issueCategory } = ticket;

  const soh = getSohStyles(vehicle?.batterySoh);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.18 }}
      onClick={() => onSelect(ticket)}
      className="group flex h-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-lg"
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 p-5">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
            {vehicle?.vehicleModel || "Unknown Vehicle"}
          </h3>

          <p className="mt-1 truncate font-mono text-[11px] uppercase tracking-wider text-slate-400">
            VIN • {vehicle?.vin?.toUpperCase() || "N/A"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {bay && (
            <span className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              Bay {bay}
            </span>
          )}

          <span
            className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${soh.badge}`}
          >
            {soh.text}
          </span>
        </div>
      </div>

      {/* Issue */}
      <div className="px-5 pt-4">
        <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
          <Wrench className="h-3.5 w-3.5" />
          {issueCategory || "General Repair"}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 p-5">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Battery className="h-3 w-3" />
            SOH
          </div>

          <div className={`text-sm font-bold ${soh.color}`}>
            {soh.text}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Thermometer className="h-3 w-3" />
            Temp
          </div>

          <div className="text-sm font-bold text-slate-800">
            {vehicle?.batteryTemp
              ? `${vehicle.batteryTemp}°C`
              : "--"}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Gauge className="h-3 w-3" />
            ODO
          </div>

          <div className="truncate text-sm font-bold text-slate-800">
            {formatOdometer(vehicle?.odometer)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-100 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 flex-shrink-0 text-slate-400" />

              <span className="truncate text-sm font-semibold text-slate-800">
                {customer?.name || "Walk-in Customer"}
              </span>
            </div>

            <p className="mt-1 pl-6 text-xs text-slate-500">
              {customer?.phone || "No phone available"}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
            <Activity className="h-4 w-4" />
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}