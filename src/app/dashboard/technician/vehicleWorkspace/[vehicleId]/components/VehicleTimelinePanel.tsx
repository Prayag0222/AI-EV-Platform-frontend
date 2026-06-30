"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Truck,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface VehicleTimelinePanelProps {
  timeline: {
    id: number;
    status: string;
    ticketId: number;
    createdAt: string;
  }[];
}

export function VehicleTimelinePanel({
  timeline,
}: VehicleTimelinePanelProps) {
  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getTimelineMeta = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return {
          icon: Truck,
          iconColor: "text-emerald-600",
          iconBg: "bg-emerald-100",
          badge: "bg-emerald-50 text-emerald-700",
        };

      case "RESOLVED":
        return {
          icon: CheckCircle2,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-100",
          badge: "bg-blue-50 text-blue-700",
        };

      case "IN_SERVICE":
        return {
          icon: Wrench,
          iconColor: "text-amber-600",
          iconBg: "bg-amber-100",
          badge: "bg-amber-50 text-amber-700",
        };

      case "DIAGNOSING":
        return {
          icon: AlertCircle,
          iconColor: "text-violet-600",
          iconBg: "bg-violet-100",
          badge: "bg-violet-50 text-violet-700",
        };

      default:
        return {
          icon: Clock3,
          iconColor: "text-slate-600",
          iconBg: "bg-slate-100",
          badge: "bg-slate-100 text-slate-700",
        };
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/70">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock3 className="h-5 w-5 text-indigo-600" />
          Vehicle Timeline
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        {timeline.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
            <Clock3 className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-800">
              No Timeline Available
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Timeline events will appear here as the repair progresses.
            </p>
          </div>
        ) : (
          <div className="relative">
            {timeline.map((event, index) => {
              const meta = getTimelineMeta(event.status);
              const Icon = meta.icon;

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {/* Timeline Line */}

                  {index !== timeline.length - 1 && (
                    <div className="absolute left-5 top-12 h-full w-px bg-slate-200" />
                  )}

                  {/* Icon */}

                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${meta.iconBg}`}
                  >
                    <Icon
                      className={`h-5 w-5 ${meta.iconColor}`}
                    />
                  </div>

                  {/* Content */}

                  <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}
                        >
                          {event.status}
                        </span>

                        <p className="mt-3 text-sm font-semibold text-slate-900">
                          Ticket #{event.ticketId}
                        </p>
                      </div>

                      <span className="text-xs text-slate-500">
                        {formatDateTime(event.createdAt)}
                      </span>

                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}