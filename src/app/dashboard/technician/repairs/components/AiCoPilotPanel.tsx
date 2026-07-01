"use client";

import { motion } from "framer-motion";
import {
  Bot,
  BrainCircuit,
  Cpu,
  Database,
  Lock,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button_temp";

import { RepairTicket } from "../types";

interface AiCoPilotPanelProps {
  ticket: RepairTicket | null;
}

const FEATURES = [
  {
    title: "Semantic Repair Search",
    description: "Search historical repair knowledge instantly.",
    icon: Database,
  },
  {
    title: "AI Failure Prediction",
    description: "Predict likely component failures before repair.",
    icon: Bot,
  },
  {
    title: "Battery Intelligence",
    description: "Analyze degradation, SOH trends and charging patterns.",
    icon: ShieldCheck,
  },
  {
    title: "Repair Workflow Generator",
    description: "Generate technician-specific repair procedures.",
    icon: Cpu,
  },
];

export default function AiCoPilotPanel({
  ticket,
}: AiCoPilotPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white"
    >
      {/* Decorative Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50" />

      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-100/40 blur-3xl" />

      {/* Locked Overlay */}

      <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/75 backdrop-blur-sm">

        <motion.div
          animate={{
            scale: [1, 1.04, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
          }}
          className="flex items-center gap-3 rounded-2xl border border-amber-300 bg-amber-100 px-5 py-3 shadow-lg"
        >
          <Lock className="h-5 w-5 text-amber-700" />

          <div>

            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Stage 2 Locked
            </p>

            <p className="text-[11px] text-amber-700">
              AI Intelligence Coming Soon
            </p>

          </div>

        </motion.div>

      </div>

      <div className="relative p-6">

        {/* Header */}

        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-lg">
              <BrainCircuit className="h-7 w-7" />
            </div>

            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h2 className="text-xl font-bold text-slate-900">
                  VoltOps AI Co-Pilot
                </h2>

                <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  Preview
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                AI-native diagnostics & repair intelligence
              </p>

            </div>

          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">

            <div className="flex items-center gap-2">

              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />

              <span className="text-xs font-semibold text-amber-700">
                Offline
              </span>

            </div>

          </div>

        </div>

        {/* Description */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">

          <div className="flex items-center gap-2">

            <Sparkles className="h-4 w-4 text-indigo-600" />

            <h3 className="text-sm font-semibold text-slate-900">
              Future Intelligence Engine
            </h3>

          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Stage 2 introduces Retrieval-Augmented Generation (RAG),
            historical repair retrieval, battery diagnostics,
            failure prediction, repair workflow generation and
            AI-assisted troubleshooting trained on your workshop&apos;s
            repair history.
          </p>

        </div>

        {/* Context */}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div className="mb-4 flex items-center gap-2">

            <Database className="h-4 w-4 text-indigo-600" />

            <h3 className="text-sm font-semibold text-slate-900">
              Active Context
            </h3>

          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Repair Ticket
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {ticket ? `#${ticket.id}` : "--"}
              </p>

            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-slate-500">
                Vehicle
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {ticket?.vehicleModel ??
                  "Awaiting Selection"}
              </p>

            </div>

          </div>

        </div>

        {/* Feature Cards */}

        <div className="mt-6 space-y-3">

          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  x: 12,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: index * 0.08,
                }}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
                  <Icon className="h-5 w-5 text-indigo-700" />
                </div>

                <div>

                  <h4 className="font-semibold text-slate-900">
                    {feature.title}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {feature.description}
                  </p>

                </div>

              </motion.div>
            );
          })}

        </div>

        {/* Actions */}

        <div className="mt-6 grid grid-cols-2 gap-3">

          <Button
            disabled
            variant="outline"
            className="h-11 rounded-xl"
          >
            <BrainCircuit className="mr-2 h-4 w-4" />
            Retrieve
          </Button>

          <Button
            disabled
            className="h-11 rounded-xl"
          >
            <WandSparkles className="mr-2 h-4 w-4" />
            Diagnose
          </Button>

        </div>

      </div>
    </motion.div>
  );
}