"use client";

import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  BrainCircuit,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface AIRepairIntelligencePanelProps {
  vehicle: any;
  statistics: {
    totalRepairs: number;
  };
}

export function AIRepairIntelligencePanel({
  vehicle,
  statistics,
}: AIRepairIntelligencePanelProps) {
  const batterySoh = vehicle?.batterySoh ?? 0;
  const batteryTemp = Number(vehicle?.batteryTemp ?? 0);

  const riskLevel =
    batterySoh >= 85
      ? "Low"
      : batterySoh >= 70
      ? "Medium"
      : "High";

  const signals = [];

  if (batterySoh >= 85) {
    signals.push("Battery health remains within optimal operating range");
  }

  if (batterySoh < 85) {
    signals.push("Battery degradation trend detected");
  }

  if (batteryTemp > 45) {
    signals.push("Elevated battery temperature detected");
  }

  if (statistics.totalRepairs > 3) {
    signals.push("Recurring service history identified");
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <div className="bg-linear-to-r from-indigo-600 via-indigo-500 to-cyan-500 p-px">
        <div className="bg-white">
          <CardContent className="p-0">
            <div className="p-6 border-b bg-linear-to-r from-indigo-50 to-cyan-50">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />

                    <h2 className="text-lg font-bold">
                      AI Repair Intelligence
                    </h2>

                    <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                      BETA
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-2">
                    Future AI-powered diagnostics and repair recommendations.
                  </p>
                </div>

                <div
                  className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    riskLevel === "Low"
                      ? "bg-emerald-100 text-emerald-700"
                      : riskLevel === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Risk Level: {riskLevel}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 p-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-semibold">
                    Detected Signals
                  </h3>
                </div>

                <div className="space-y-3">
                  {signals.map((signal, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      <ChevronRight className="h-4 w-4 mt-0.5 text-indigo-500" />

                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="h-4 w-4 text-indigo-600" />
                  <h3 className="font-semibold">
                    Suggested Checks
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2 text-sm">
                    <Wrench className="h-4 w-4 mt-0.5 text-slate-500" />
                    Controller connector inspection
                  </div>

                  <div className="flex gap-2 text-sm">
                    <Wrench className="h-4 w-4 mt-0.5 text-slate-500" />
                    Battery balancing verification
                  </div>

                  <div className="flex gap-2 text-sm">
                    <Wrench className="h-4 w-4 mt-0.5 text-slate-500" />
                    Charging port inspection
                  </div>

                  <div className="flex gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-500" />
                    Future AI diagnosis will appear here
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}