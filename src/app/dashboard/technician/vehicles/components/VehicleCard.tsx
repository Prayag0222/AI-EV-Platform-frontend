import React from "react";
import { RepairingVehicleTicket } from "../types";
import { Battery, Gauge, Thermometer, User, Wrench } from "lucide-react";

interface VehicleCardProps {
  ticket: RepairingVehicleTicket;
  onSelect: (ticket: RepairingVehicleTicket) => void;
}

export function VehicleCard({ ticket, onSelect }: VehicleCardProps) {
  const { vehicle, customer, bay, issueCategory } = ticket;

  // 🔋 Safe evaluation of dynamic State of Health color tags for Light Theme
  const getSohColor = (soh: string | number | null) => {
    if (!soh) return "text-slate-400";
    const numericSoh = typeof soh === "string" ? parseInt(soh, 10) : soh;
    
    if (isNaN(numericSoh)) return "text-slate-400";
    if (numericSoh < 80) return "text-amber-600 font-semibold";
    return "text-emerald-600 font-semibold";
  };

  // 🚗 Safe format handler for odometer metrics
  const formatOdometer = (odo: string | number | null) => {
    if (!odo) return "--";
    const numericOdo = typeof odo === "string" ? parseInt(odo, 10) : odo;
    return isNaN(numericOdo) ? "--" : `${numericOdo.toLocaleString()} km`;
  };

  return (
    <div
      onClick={() => onSelect(ticket)}
      className="group relative bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm"
    >
      <div>
        {/* Upper Identity Deck */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-slate-900 text-lg font-semibold tracking-tight group-hover:text-indigo-600 transition-colors">
              {vehicle?.vehicleModel || "Unknown EV Model"}
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5 tracking-wider">
              VIN: {vehicle?.vin ? vehicle.vin.toUpperCase() : "N/A"}
            </p>
          </div>
          
          {bay && (
            <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200 shadow-sm">
              Bay {bay}
            </span>
          )}
        </div>

        {/* Target Diagnostics Flags */}
        <div className="flex items-center gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
            <Wrench className="w-3 h-3 text-amber-600" />
            {issueCategory}
          </span>
        </div>

        {/* Isolated Telemetry Grid Space */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
          {/* Battery Health Metric */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1">
              <Battery className="w-3 h-3 text-slate-400" /> SOH
            </span>
            <span className={`text-sm mt-0.5 ${getSohColor(vehicle?.batterySoh)}`}>
              {vehicle?.batterySoh ? `${vehicle.batterySoh}%` : "--"}
            </span>
          </div>

          {/* Active Pack Temperature Metric */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-slate-400" /> Temp
            </span>
            <span className="text-slate-800 text-sm font-semibold mt-0.5">
              {vehicle?.batteryTemp ? `${vehicle.batteryTemp}°C` : "--"}
            </span>
          </div>

          {/* Current Mileage Metric */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" /> Odo
            </span>
            <span className="text-slate-800 text-sm font-mono font-semibold mt-0.5 truncate">
              {formatOdometer(vehicle?.odometer)}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Meta Row Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 truncate max-w-[65%]">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate text-slate-700 font-medium">{customer?.name || "Walk-in"}</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">{customer?.phone || "N/A"}</span>
      </div>
    </div>
  );
}