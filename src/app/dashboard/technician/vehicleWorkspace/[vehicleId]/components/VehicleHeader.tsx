"use client";

import {
  Battery,
  Bike,
  Clock3,
  Phone,
  User,
  Wrench,
  History,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button_temp";
import { Card, CardContent } from "@/components/ui/card";

import { formatTimeAgo } from "../utils/formatTimeAgo";

interface VehicleHeaderProps {
  vehicle: any;
  activeTicket: any;
  totalRepairs: number;
}

export function VehicleHeader({
  vehicle,
  activeTicket,
  totalRepairs,
}: VehicleHeaderProps) {
  const soh = Number(vehicle?.batterySoh ?? 0);

  const sohConfig =
    soh >= 85
      ? {
          text: "Excellent",
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        }
      : soh >= 70
      ? {
          text: "Moderate",
          color: "text-amber-600",
          bg: "bg-amber-50",
        }
      : {
          text: "Critical",
          color: "text-red-600",
          bg: "bg-red-50",
        };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500" />

        <CardContent className="p-5 lg:p-7">
          <div className="flex flex-col gap-8 xl:flex-row">

            {/* Left */}
            <div className="flex-1">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100">
                  <Bike className="h-8 w-8 text-indigo-600" />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-3">

                    <h1 className="truncate text-2xl font-bold text-slate-900 lg:text-3xl">
                      {vehicle?.vehicleModel || "Unknown Vehicle"}
                    </h1>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {activeTicket?.status || "INACTIVE"}
                    </span>

                  </div>

                  <p className="mt-2 break-all font-mono text-xs text-slate-500">
                    VIN • {vehicle?.vin || "--"}
                  </p>

                </div>
              </div>

              {/* Customer */}

              <div className="mt-7 grid gap-5 md:grid-cols-2">

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <User className="mt-1 h-4 w-4 text-slate-400" />

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Customer
                    </p>

                    <p className="font-semibold text-slate-900">
                      {vehicle?.customer?.name || "--"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Phone className="mt-1 h-4 w-4 text-slate-400" />

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Contact
                    </p>

                    <p className="font-semibold text-slate-900">
                      {vehicle?.customer?.phone || "--"}
                    </p>
                  </div>
                </div>

              </div>

              {/* Actions */}

              {/* <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                <Button className="sm:flex-1">
                  <Wrench className="mr-2 h-4 w-4" />
                  Open Active Ticket
                </Button>

                <Button
                  variant="outline"
                  className="sm:flex-1"
                >
                  <History className="mr-2 h-4 w-4" />
                  Repair History
                </Button>

              </div> */}

            </div>

            {/* Right */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:w-[360px]">

              <div className={`rounded-2xl border p-5 ${sohConfig.bg}`}>
                <Battery
                  className={`mb-3 h-6 w-6 ${sohConfig.color}`}
                />

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Battery SOH
                </p>

                <p className={`mt-1 text-3xl font-bold ${sohConfig.color}`}>
                  {soh}%
                </p>

                <p className={`mt-1 text-xs font-semibold ${sohConfig.color}`}>
                  {sohConfig.text}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-5">
                <Clock3 className="mb-3 h-6 w-6 text-indigo-600" />

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Last Service
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {formatTimeAgo(vehicle?.lastServiceDate)}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-5">
                <Bike className="mb-3 h-6 w-6 text-violet-600" />

                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Total Repairs
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {totalRepairs}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs font-medium text-violet-600">
                  Service History
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>

            </div>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}