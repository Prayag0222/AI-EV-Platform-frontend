"use client";

import {
  AlertTriangle,
  BrainCircuit,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

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
  const batterySoh = Number(vehicle?.batterySoh ?? 0);
  const batteryTemp = Number(vehicle?.batteryTemp ?? 0);
  const totalRepairs = statistics.totalRepairs ?? 0;

  const risk =
    batterySoh >= 85
      ? {
          label: "Low",
          badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        }
      : batterySoh >= 70
      ? {
          label: "Medium",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
        }
      : {
          label: "High",
          badge: "bg-red-100 text-red-700 border-red-200",
        };

  const signals: string[] = [];

  if (batterySoh >= 85)
    signals.push("Battery health remains within optimal operating range.");

  if (batterySoh < 85)
    signals.push("Battery degradation trend detected.");

  if (batteryTemp >= 45)
    signals.push("Elevated battery temperature detected.");

  if (totalRepairs >= 3)
    signals.push("Recurring repair history identified.");

  if (signals.length === 0)
    signals.push("No abnormal repair signals detected.");

  const recommendations = [
    "Inspect controller connectors.",
    "Verify battery balancing cycle.",
    "Inspect charging connector & harness.",
  ];

  if (batteryTemp >= 45)
    recommendations.unshift("Check battery cooling and ventilation.");

  if (batterySoh < 70)
    recommendations.unshift("Perform complete battery health diagnosis.");

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 p-[1px]">
          <div className="bg-white">
            <CardContent className="p-0">

              <div className="border-b bg-gradient-to-r from-indigo-50 to-cyan-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-600" />

                      <h2 className="text-lg font-bold text-slate-900">
                        AI Repair Intelligence
                      </h2>

                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-bold tracking-wide text-indigo-700">
                        BETA
                      </span>
                    </div>

                    <p className="mt-2 max-w-xl text-sm text-slate-500">
                      Future AI-powered repair intelligence generated from
                      historical repair records, technician notes and battery
                      telemetry.
                    </p>
                  </div>

                  <div
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold ${risk.badge}`}
                  >
                    Risk Level • {risk.label}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="grid gap-8 p-5 lg:grid-cols-2">

                {/* Signals */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />

                    <h3 className="font-semibold text-slate-900">
                      Detected Signals
                    </h3>
                  </div>

                  <div className="space-y-3">

                    {signals.map((signal) => (
                      <div
                        key={signal}
                        className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                        <p className="text-sm text-slate-700">
                          {signal}
                        </p>
                      </div>
                    ))}

                  </div>
                </section>

                {/* Recommendations */}
                <section>
                  <div className="mb-4 flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4 text-indigo-600" />

                    <h3 className="font-semibold text-slate-900">
                      Suggested Checks
                    </h3>
                  </div>

                  <div className="space-y-3">

                    {recommendations.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3"
                      >
                        <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

                        <p className="text-sm text-slate-700">
                          {item}
                        </p>
                      </div>
                    ))}

                    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                      <p className="text-sm text-amber-800">
                        AI diagnosis, similar repair retrieval and predictive
                        recommendations will be available in a future release.
                      </p>
                    </div>

                  </div>
                </section>

              </div>

            </CardContent>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}