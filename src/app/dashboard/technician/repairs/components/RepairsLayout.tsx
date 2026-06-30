"use client";

import { motion } from "framer-motion";
import { ClipboardList, Cpu, Wrench } from "lucide-react";
import React, { useState } from "react";

interface RepairsLayoutProps {
  toolbar: React.ReactNode;
  listGrid: React.ReactNode;
  diagnosticConsole: React.ReactNode;
  aiCoPilot: React.ReactNode;
}

export default function RepairsLayout({
  toolbar,
  listGrid,
  diagnosticConsole,
  aiCoPilot,
}: RepairsLayoutProps) {
  const [activeMobileTab, setActiveMobileTab] = useState<
    "diagnostics" | "ai"
  >("diagnostics");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="min-h-[calc(100vh-4.5rem)] bg-slate-50"
    >
      <div className="mx-auto max-w-[1800px] px-3 py-4 sm:px-5 lg:px-8 xl:px-10">

        {/* Header */}

        <motion.header
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-5"
        >
          <div className="flex flex-col gap-2">

            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              <Wrench className="h-3 w-3" />
              Technician Workspace
            </span>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl xl:text-4xl">
              Repairs Management Board
            </h1>

            <p className="max-w-3xl text-xs leading-6 text-slate-500 sm:text-sm">
              Manage assigned repairs, update technician notes and monitor repair progress.
            </p>

          </div>
        </motion.header>

        {/* Toolbar */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          {toolbar}
        </motion.div>

        {/* Desktop */}

        <div className="hidden xl:grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">

          {/* Left */}

          <motion.section
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <ClipboardList className="h-5 w-5 text-indigo-600" />
              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-900">
                  Active Repair Queue
                </h2>

                <p className="text-xs text-slate-500">
                  Assigned technician jobs
                </p>

              </div>

            </div>

            {listGrid}

          </motion.section>

          {/* Right */}

          <motion.aside
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col gap-5 overflow-y-auto"
          >

            {/* Diagnostic */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <Wrench className="h-5 w-5 text-emerald-700" />
                </div>

                <div>

                  <h3 className="text-sm font-bold">
                    Diagnostic Console
                  </h3>

                  <p className="text-xs text-slate-500">
                    Technician workspace
                  </p>

                </div>

              </div>

              <div className="p-5">
                {diagnosticConsole}
              </div>

            </div>

            {/* AI */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                  <Cpu className="h-5 w-5 text-violet-700" />
                </div>

                <div>

                  <h3 className="text-sm font-bold">
                    AI Co-Pilot
                  </h3>

                  <p className="text-xs text-slate-500">
                    Repair Intelligence
                  </p>

                </div>

              </div>

              <div className="p-5">
                {aiCoPilot}
              </div>

            </div>

          </motion.aside>

        </div>

        {/* Mobile */}

        <div className="xl:hidden space-y-5">

          {/* Repair Queue FIRST */}

          <section>

            <div className="mb-3 flex items-center gap-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100">
                <ClipboardList className="h-4 w-4 text-indigo-600" />
              </div>

              <div>

                <h2 className="text-sm font-bold text-slate-900">
                  Active Repairs
                </h2>

                <p className="text-[11px] text-slate-500">
                  Assigned tickets
                </p>

              </div>

            </div>

            {listGrid}

          </section>

          {/* Bottom Workbench */}

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            {/* Mobile Tabs */}

            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">

              <button
                onClick={() =>
                  setActiveMobileTab("diagnostics")
                }
                className={`h-12 text-sm font-semibold transition ${
                  activeMobileTab === "diagnostics"
                    ? "bg-white text-emerald-700"
                    : "text-slate-500"
                }`}
              >
                Diagnostics
              </button>

              <button
                onClick={() =>
                  setActiveMobileTab("ai")
                }
                className={`h-12 text-sm font-semibold transition ${
                  activeMobileTab === "ai"
                    ? "bg-white text-violet-700"
                    : "text-slate-500"
                }`}
              >
                AI Co-Pilot
              </button>

            </div>

            <motion.div
              key={activeMobileTab}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="p-4"
            >
              {activeMobileTab ===
              "diagnostics"
                ? diagnosticConsole
                : aiCoPilot}
            </motion.div>

          </section>

        </div>

      </div>
    </motion.div>
  );
}