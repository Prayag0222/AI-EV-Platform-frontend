"use client";

import React, { useState } from "react";
import { RepairingVehicleTicket, VehicleTelemetryData } from "../types";
import { Battery, Gauge, Save, Thermometer, X } from "lucide-react";

interface TelemetryDrawerProps {
  ticket: RepairingVehicleTicket | null;
  onClose: () => void;
  onSave: (ticketId: number, updates: Partial<VehicleTelemetryData>) => Promise<boolean>;
}

export function TelemetryDrawer({ ticket, onClose, onSave }: TelemetryDrawerProps) {
  const [isSubmitting, setIsLoading] = useState(false);
  
  // ⚡ The Safe-Guard: '|| ""' converts database null values into clean frontend string states instantly
  const [batterySoh, setBatterySoh] = useState(ticket?.vehicle?.batterySoh?.toString() || "");
  const [batteryTemp, setBatteryTemp] = useState(ticket?.vehicle?.batteryTemp || "");
  const [odometer, setOdometer] = useState(ticket?.vehicle?.odometer || "");
  const [batteryPackSerial, setBatteryPackSerial] = useState(ticket?.vehicle?.batteryPackSerial || "");

  if (!ticket) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Parse data safely for the backend POST/PATCH data streams
    const telemetryUpdates: Partial<VehicleTelemetryData> = {
      batterySoh: batterySoh.trim() ? parseInt(batterySoh, 10) : null,
      batteryTemp: batteryTemp.trim() ? batteryTemp : null,
      odometer: odometer.trim() ? odometer : null,
      batteryPackSerial: batteryPackSerial.trim() ? batteryPackSerial : null,
    };

    const success = await onSave(ticket.id, telemetryUpdates);
    setIsLoading(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between p-6 animate-slideLeft">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Configure Telemetry</h2>
              <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">
                Ticket #{ticket.id} — {ticket.vehicle?.vehicleModel}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content Stack */}
          <form id="telemetry-form" onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Field: Mileage */}
            <div>
              <label className=" text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-slate-400" /> Current Mileage (km)
              </label>
              <input
                type="number"
                value={odometer} // ✅ Bound to a clean string state, no null values allowed
                onChange={(e) => setOdometer(e.target.value)}
                placeholder="e.g. 14250"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>

            {/* Field: Battery Health */}
            <div>
              <label className=" text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5">
                <Battery className="w-3.5 h-3.5 text-slate-400" /> Battery State of Health (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={batterySoh} // ✅ Safe
                onChange={(e) => setBatterySoh(e.target.value)}
                placeholder="e.g. 92"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>

            {/* Field: Pack Temperature */}
            <div>
              <label className=" text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-slate-400" /> Pack Temperature (°C)
              </label>
              <input
                type="text"
                value={batteryTemp} // ✅ Safe
                onChange={(e) => setBatteryTemp(e.target.value)}
                placeholder="e.g. 38.5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>

            {/* Field: Hardware ID */}
            <div>
              <label className=" text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1.5">
                Hardware ID / Battery Serial
              </label>
              <input
                type="text"
                value={batteryPackSerial} // ✅ Safe
                onChange={(e) => setBatteryPackSerial(e.target.value)}
                placeholder="e.g. ATH-BMS-72V-XXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </form>
        </div>

        {/* Footer Action Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 border border-slate-200 rounded-lg text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="telemetry-form"
            disabled={isSubmitting}
            className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Commit Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}