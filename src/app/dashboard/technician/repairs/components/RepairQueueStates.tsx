"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Wrench } from "lucide-react";

interface RepairQueueErrorProps {
  message: string;
  onRetry: () => void;
  sessionExpired: boolean;
}

export function RepairQueueSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-4.5rem)] bg-slate-50 px-4 py-6 md:px-8 lg:px-10"
    >
      <div
        role="status"
        aria-live="polite"
        className="mx-auto w-full animate-pulse"
      >
        {/* Header */}

        <div className="h-4 w-40 rounded-full bg-slate-200" />

        <div className="mt-4 h-11 w-full max-w-md rounded-xl bg-slate-200" />

        {/* Toolbar */}

        <div className="mt-8 h-20 rounded-3xl border border-slate-200 bg-white" />

        {/* Layout */}

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_420px]">

          {/* Repair Cards */}

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start justify-between">

                  <div className="space-y-3">
                    <div className="h-5 w-28 rounded-full bg-slate-200" />
                    <div className="h-4 w-56 rounded-full bg-slate-200" />
                  </div>

                  <div className="h-8 w-20 rounded-full bg-slate-200" />

                </div>

                <div className="mt-6 rounded-2xl bg-slate-100 p-4">
                  <div className="h-3 w-36 rounded-full bg-slate-200" />

                  <div className="mt-4 h-3 w-full rounded-full bg-slate-200" />

                  <div className="mt-2 h-3 w-4/5 rounded-full bg-slate-200" />

                  <div className="mt-2 h-3 w-3/5 rounded-full bg-slate-200" />
                </div>

                <div className="mt-5 flex items-center justify-between">

                  <div className="h-4 w-32 rounded-full bg-slate-200" />

                  <div className="h-9 w-24 rounded-xl bg-slate-200" />

                </div>
              </div>
            ))}
          </div>

          {/* Right Panel */}

          <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white xl:block">
            <div className="border-b border-slate-100 p-6">
              <div className="h-5 w-44 rounded-full bg-slate-200" />
            </div>

            <div className="space-y-5 p-6">
              <div className="h-24 rounded-2xl bg-slate-100" />
              <div className="h-36 rounded-2xl bg-slate-100" />
              <div className="h-44 rounded-2xl bg-slate-100" />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

export function RepairQueueError({
  message,
  onRetry,
  sessionExpired,
}: RepairQueueErrorProps) {
  return (
    <motion.div
      role="alert"
      initial={{
        opacity: 0,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.25,
      }}
      className="grid min-h-[calc(100vh-4.5rem)] place-items-center bg-slate-50 p-6"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-b from-white to-red-50/30 shadow-xl">

        <div className="border-b border-red-100 p-8 text-center">

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100"
          >
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </motion.div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {sessionExpired
              ? "Session Expired"
              : "Unable to Load Repair Queue"}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {message}
          </p>

        </div>

        <div className="space-y-4 p-6">

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">

              <Wrench className="mt-0.5 h-5 w-5 text-amber-600" />

              <div>

                <p className="text-sm font-semibold text-amber-800">
                  Technician Workspace
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700">
                  {sessionExpired
                    ? "Your authentication session has expired. Retry to continue working."
                    : "The repair queue couldn't be retrieved. Check your connection and try again."}
                </p>

              </div>

            </div>
          </div>

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={onRetry}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0C5C3C] text-sm font-semibold text-white transition-colors hover:bg-[#094b32]"
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "linear",
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </motion.div>

            {sessionExpired
              ? "Reconnect Session"
              : "Retry Connection"}
          </motion.button>

        </div>

      </div>
    </motion.div>
  );
}