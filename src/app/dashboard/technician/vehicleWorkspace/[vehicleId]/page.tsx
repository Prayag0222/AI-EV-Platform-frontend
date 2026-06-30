"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Car,
  Loader2,
} from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { AIRepairIntelligencePanel } from "./components/AIRepairIntelligencePanel";
import { BatteryInformationPanel } from "./components/BatteryInformationPanel";
import { CustomerInformationCard } from "./components/CustomerInformationCard";
import { MotorControllerPanel } from "./components/MotorControllerPanel";
import { ServiceHistoryPanel } from "./components/ServiceHistoryPanel";
import { VehicleDetailsPanel } from "./components/VehicleDetailsPanel";
import { VehicleHeader } from "./components/VehicleHeader";
import { VehicleHealthSummary } from "./components/VehicleHealthSummary";
import { VehicleStatisticsPanel } from "./components/VehicleStatisticsPanel";
import { VehicleTimelinePanel } from "./components/VehicleTimelinePanel";
import { useVehicleWorkspace } from "./hooks/useVehicleWorkspace";

export default function VehicleWorkspacePage() {
  const params = useParams();

  const vehicleId = Number(params.vehicleId);

  const {
    workspace,
    isLoading,
    notice,
    updateVehicleWorkspace,
  } = useVehicleWorkspace(vehicleId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading vehicle workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Vehicle Not Found
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Unable to load this vehicle workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">

        {/* Notice */}
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800"
          >
            {notice}
          </motion.div>
        )}

        {/* Header */}
        <VehicleHeader
          vehicle={workspace.vehicle}
          activeTicket={workspace.activeTicket}
          totalRepairs={workspace.statistics.totalRepairs}
        />

        {/* AI */}
        <AIRepairIntelligencePanel
          vehicle={workspace.vehicle}
          statistics={workspace.statistics}
        />

        {/* Stats */}
        <VehicleStatisticsPanel
          statistics={workspace.statistics}
        />

        {/* ================= DESKTOP ================= */}
        <div className="hidden xl:flex xl:flex-col xl:gap-6">

          <div className="grid gap-6 xl:grid-cols-3">

            <VehicleDetailsPanel
              vehicle={workspace.vehicle}
              onSave={updateVehicleWorkspace}
            />

            <BatteryInformationPanel
              vehicle={workspace.vehicle}
              onSave={updateVehicleWorkspace}
            />

            <MotorControllerPanel
              vehicle={workspace.vehicle}
              onSave={updateVehicleWorkspace}
            />

          </div>

          <div className="grid gap-6 xl:grid-cols-2">

            <VehicleHealthSummary
              healthSummary={workspace.healthSummary}
            />

            <CustomerInformationCard
              customer={workspace.vehicle.customer}
            />

          </div>

        </div>

        {/* ================= MOBILE ================= */}
        <div className="xl:hidden">

          <Accordion
            type="multiple"
            defaultValue={["vehicle", "battery"]}
            className="space-y-3"
          >
            <AccordionItem
              value="vehicle"
              className="overflow-hidden rounded-2xl border bg-white"
            >
              <AccordionTrigger className="px-5">
                Vehicle Details
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-5">
                <VehicleDetailsPanel
                  vehicle={workspace.vehicle}
                  onSave={updateVehicleWorkspace}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="battery"
              className="overflow-hidden rounded-2xl border bg-white"
            >
              <AccordionTrigger className="px-5">
                Battery Information
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-5">
                <BatteryInformationPanel
                  vehicle={workspace.vehicle}
                  onSave={updateVehicleWorkspace}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="motor"
              className="overflow-hidden rounded-2xl border bg-white"
            >
              <AccordionTrigger className="px-5">
                Motor & Controller
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-5">
                <MotorControllerPanel
                  vehicle={workspace.vehicle}
                  onSave={updateVehicleWorkspace}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="health"
              className="overflow-hidden rounded-2xl border bg-white"
            >
              <AccordionTrigger className="px-5">
                Vehicle Health
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-5">
                <VehicleHealthSummary
                  healthSummary={workspace.healthSummary}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="customer"
              className="overflow-hidden rounded-2xl border bg-white"
            >
              <AccordionTrigger className="px-5">
                Customer Information
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-5">
                <CustomerInformationCard
                  customer={workspace.vehicle.customer}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </div>

        {/* History */}
        <ServiceHistoryPanel
          tickets={workspace.vehicle.tickets}
        />

        {/* Timeline */}
        <VehicleTimelinePanel
          timeline={workspace.timeline}
        />

      </div>
    </div>
  );
}