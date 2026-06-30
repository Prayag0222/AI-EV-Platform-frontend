"use client";

import {
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServiceHistoryPanelProps {
  tickets?: any[];
}

export function ServiceHistoryPanel({
  tickets = [],
}: ServiceHistoryPanelProps) {
  const formatDate = (date?: string) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "RESOLVED":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "IN_SERVICE":
        return "bg-amber-100 text-amber-700 border-amber-200";

      case "WAITING_FOR_PARTS":
        return "bg-orange-100 text-orange-700 border-orange-200";

      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b bg-slate-50/70">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ClipboardList className="h-5 w-5 text-indigo-600" />
          Repair History
        </CardTitle>
      </CardHeader>

      <CardContent className="p-5">
        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-slate-300" />

            <h3 className="mt-4 font-semibold text-slate-800">
              No Repair History
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              This vehicle hasn&apos;t been serviced yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-slate-500">
                    <th className="pb-4 font-semibold">Ticket</th>
                    <th className="pb-4 font-semibold">Issue</th>
                    <th className="pb-4 font-semibold">Technician</th>
                    <th className="pb-4 font-semibold">Cost</th>
                    <th className="pb-4 font-semibold">Priority</th>
                    <th className="pb-4 font-semibold">Status</th>
                    <th className="pb-4 font-semibold">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b last:border-0 transition hover:bg-slate-50"
                    >
                      <td className="py-4 font-semibold">
                        #{ticket.id}
                      </td>

                      <td className="py-4">
                        {ticket.issueCategory || "--"}
                      </td>

                      <td className="py-4">
                        {ticket.technician?.fullName ||
                          "Unassigned"}
                      </td>

                      <td className="py-4 font-medium">
                        ₹{ticket.finalCost ?? 0}
                      </td>

                      <td className="py-4">
                        {ticket.priority || "--"}
                      </td>

                      <td className="py-4">
                        <Badge
                          className={getStatusColor(
                            ticket.status
                          )}
                        >
                          {ticket.status}
                        </Badge>
                      </td>

                      <td className="py-4 text-sm text-slate-500">
                        {formatDate(ticket.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="space-y-4 lg:hidden">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        Ticket #{ticket.id}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {ticket.issueCategory || "--"}
                      </p>
                    </div>

                    <Badge
                      className={getStatusColor(
                        ticket.status
                      )}
                    >
                      {ticket.status}
                    </Badge>
                  </div>

                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />

                      <span className="text-slate-600">
                        {ticket.technician?.fullName ||
                          "Unassigned"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-slate-400" />

                      <span className="text-slate-600">
                        ₹{ticket.finalCost ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-slate-400" />

                      <span className="text-slate-600">
                        {ticket.priority || "--"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-400" />

                      <span className="text-slate-600">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}