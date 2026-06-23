"use client";

import {
  CheckCircle2,
  Clock3,
  Wrench,
  Truck,
  AlertCircle,
} from "lucide-react";

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
  const formatDateTime = (
    date: string
  ) => {
    return new Date(date).toLocaleString();
  };

  const getTimelineMeta = (
    status: string
  ) => {
    const normalized =
      status.toUpperCase();

    switch (normalized) {
      case "DELIVERED":
        return {
          icon: Truck,
          iconColor:
            "text-emerald-600",
          bgColor:
            "bg-emerald-100",
        };

      case "RESOLVED":
        return {
          icon: CheckCircle2,
          iconColor:
            "text-blue-600",
          bgColor:
            "bg-blue-100",
        };

      case "IN_SERVICE":
        return {
          icon: Wrench,
          iconColor:
            "text-amber-600",
          bgColor:
            "bg-amber-100",
        };

      case "DIAGNOSING":
        return {
          icon: AlertCircle,
          iconColor:
            "text-violet-600",
          bgColor:
            "bg-violet-100",
        };

      default:
        return {
          icon: Clock3,
          iconColor:
            "text-slate-600",
          bgColor:
            "bg-slate-100",
        };
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          Vehicle Timeline
        </CardTitle>
      </CardHeader>

      <CardContent>
        {timeline.length === 0 ? (
          <div className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">
            No timeline events found.
          </div>
        ) : (
          <div className="relative">
            {timeline.map(
              (event, index) => {
                const meta =
                  getTimelineMeta(
                    event.status
                  );

                const Icon =
                  meta.icon;

                return (
                  <div
                    key={event.id}
                    className="relative flex gap-4 pb-8 last:pb-0"
                  >
                    {index !==
                      timeline.length -
                        1 && (
                      <div className="absolute left-4.75 top-10 h-full w-px bg-slate-200" />
                    )}

                    <div
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${meta.bgColor}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${meta.iconColor}`}
                      />
                    </div>

                    <div className="flex-1 rounded-xl border bg-white p-4 shadow-sm">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {event.status}
                          </h4>

                          <p className="text-sm text-slate-500">
                            Ticket #
                            {event.ticketId}
                          </p>
                        </div>

                        <span className="text-xs text-slate-500">
                          {formatDateTime(
                            event.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}