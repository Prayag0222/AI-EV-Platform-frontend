"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BrainCircuit,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function IntelligenceBrief() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl"
    >
      {/* Background Glow */}

      <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative p-5 sm:p-6">

        {/* Header */}

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <BrainCircuit className="h-5 w-5 text-cyan-300" />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <Sparkles className="h-3.5 w-3.5 text-amber-300" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                  AI Briefing
                </span>

              </div>

              <p className="mt-1 text-[11px] text-slate-400">
                Stage 2 Preview
              </p>

            </div>

          </div>

          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-300">
            92% Confidence
          </span>

        </div>

        {/* Heading */}

        <div className="mt-6">

          <h2 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl">
            Start with the Battery Pack.
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Historical repair intelligence indicates abnormal thermal
            behaviour after repeated fast-charging cycles. Begin diagnosis
            from battery health before replacing hardware.
          </p>

        </div>

        {/* Recommendations */}

        <div className="mt-6 space-y-3">

          {[
            "Verify thermal sensor resistance values",
            "Measure insulation leakage across module stack",
            "Inspect BMS balancing logs",
          ].map((item, index) => (
            <motion.div
              key={item}
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
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15">
                <Zap className="h-3.5 w-3.5 text-cyan-300" />
              </div>

              <div>

                <p className="text-xs font-semibold text-cyan-300">
                  Step {index + 1}
                </p>

                <p className="mt-1 text-sm text-slate-200">
                  {item}
                </p>

              </div>

            </motion.div>
          ))}

        </div>

        {/* Footer */}

        <Button
          variant="secondary"
          className="mt-6 h-11 w-full rounded-2xl border-0 bg-white text-slate-900 shadow-sm transition-all hover:bg-slate-100"
        >
          Review Full Diagnosis

          <ArrowUpRight className="ml-2 h-4 w-4" />

        </Button>

      </div>
    </motion.section>
  );
}