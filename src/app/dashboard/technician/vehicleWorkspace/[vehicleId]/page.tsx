"use client";

import { useParams } from "next/navigation";

import { BatteryInformationPanel  } from "./components/BatteryInformationPanel";
import { CustomerInformationCard } from "./components/CustomerInformationCard";
import { MotorControllerPanel } from "./components/MotorControllerPanel";
import { ServiceHistoryPanel } from "./components/ServiceHistoryPanel";
import { VehicleHeader } from "./components/VehicleHeader";
import { VehicleHealthSummary } from "./components/VehicleHealthSummary";
import { VehicleStatisticsPanel } from "./components/VehicleStatisticsPanel";
import { VehicleTimelinePanel } from "./components/VehicleTimelinePanel";
import { VehicleDetailsPanel } from "./components/VehicleDetailsPanel";
import { AIRepairIntelligencePanel } from "./components/AIRepairIntelligencePanel";
import { useVehicleWorkspace } from "./hooks/useVehicleWorkspace";
import { Accordion,AccordionItem,AccordionContent,AccordionTrigger } from "@/components/ui/accordion";

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
      <div className="p-6">
        <div className="text-sm text-slate-500">
          Loading vehicle workspace...
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-6">
        <div className="text-sm text-red-500">
          Failed to load vehicle workspace.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 space-y-6">
      {notice && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          {notice}
        </div>
      )}

      <VehicleHeader
        vehicle={workspace.vehicle}
        activeTicket={workspace.activeTicket}
        totalRepairs={workspace.statistics.totalRepairs}
      />

      <AIRepairIntelligencePanel
  vehicle={workspace.vehicle}
  statistics={workspace.statistics}
/>

      <VehicleStatisticsPanel
        statistics={workspace.statistics}
      />

    {/* Desktop */}
<div className="hidden xl:block space-y-6">
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


      <div className="xl:hidden">
  <Accordion
    type="single"
    collapsible
    className="w-full space-y-3"
  >
    <AccordionItem
      value="vehicle-details"
      className="border rounded-xl bg-white px-4"
    >
      <AccordionTrigger>
        Vehicle Details
      </AccordionTrigger>

      <AccordionContent className="pt-4">
        <VehicleDetailsPanel
          vehicle={workspace.vehicle}
          onSave={updateVehicleWorkspace}
        />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem
      value="battery"
      className="border rounded-xl bg-white px-4"
    >
      <AccordionTrigger>
        Battery Information
      </AccordionTrigger>

      <AccordionContent className="pt-4">
        <BatteryInformationPanel
          vehicle={workspace.vehicle}
          onSave={updateVehicleWorkspace}
        />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem
      value="motor-controller"
      className="border rounded-xl bg-white px-4"
    >
      <AccordionTrigger>
        Motor & Controller
      </AccordionTrigger>

      <AccordionContent className="pt-4">
        <MotorControllerPanel
          vehicle={workspace.vehicle}
          onSave={updateVehicleWorkspace}
        />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem
      value="health"
      className="border rounded-xl bg-white px-4"
    >
      <AccordionTrigger>
        Vehicle Health
      </AccordionTrigger>

      <AccordionContent className="pt-4">
        <VehicleHealthSummary
          healthSummary={workspace.healthSummary}
        />
      </AccordionContent>
    </AccordionItem>

    <AccordionItem
      value="customer"
      className="border rounded-xl bg-white px-4"
    >
      <AccordionTrigger>
        Customer Information
      </AccordionTrigger>

      <AccordionContent className="pt-4">
        <CustomerInformationCard
          customer={workspace.vehicle.customer}
        />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>

      <ServiceHistoryPanel
        tickets={workspace.vehicle.tickets}
      />

      <VehicleTimelinePanel
        timeline={workspace.timeline}
      />
    </div>
  );
}