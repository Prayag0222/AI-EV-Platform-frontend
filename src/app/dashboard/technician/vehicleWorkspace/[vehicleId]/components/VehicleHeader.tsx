"use client";

import {
  Battery,
  Bike,
  Clock3,
  Phone,
  User,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const soh = vehicle.batterySoh ?? 0;

  const sohColor =
    soh >= 85
      ? "text-emerald-600"
      : soh >= 70
      ? "text-amber-600"
      : "text-red-600";

  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <div className="h-1 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500" />

      <CardContent className="p-0">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left Side */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">
                  <Bike className="h-7 w-7 text-indigo-600" />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {vehicle.vehicleModel}
                  </h1>

                  <p className="text-sm text-slate-500 font-mono">
                    {vehicle.vin}
                  </p>
                </div>

                <div className="ml-auto">
                  <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold text-blue-700">
                    {activeTicket?.status || "INACTIVE"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Customer
                    </p>

                    <p className="font-semibold">
                      {vehicle.customer?.name || "--"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-slate-400" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Contact
                    </p>

                    <p className="font-semibold">
                      {vehicle.customer?.phone || "--"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="sm">
                  Open Active Ticket
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                >
                  Repair History
                </Button>
              </div>
            </div>

            {/* Right Side KPI Area */}
            <div className="grid grid-cols-3 gap-3 xl:w-[420px]">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <Battery
                  className={`h-5 w-5 mb-2 ${sohColor}`}
                />

                <p className="text-xs text-slate-500">
                  Battery SOH
                </p>

                <p
                  className={`text-2xl font-bold ${sohColor}`}
                >
                  {soh}%
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-4">
                <Clock3 className="h-5 w-5 mb-2 text-indigo-600" />

                <p className="text-xs text-slate-500">
                  Last Service
                </p>

                <p className="text-sm font-semibold">
                  {formatTimeAgo(
                    vehicle.lastServiceDate
                  )}
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-4">
                <Bike className="h-5 w-5 mb-2 text-violet-600" />

                <p className="text-xs text-slate-500">
                  Repairs
                </p>

                <p className="text-2xl font-bold">
                  {totalRepairs}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}